require('dotenv').config();
const express = require('express');
const bodyParser = require('body-parser');
const cors = require('cors');
const sqlite3 = require('sqlite3').verbose();
const Razorpay = require('razorpay');
const crypto = require('crypto');

const app = express();
const port = process.env.PORT || 5000;

// 🧊 Database Setup (SQLite)
const db = new sqlite3.Database('./database.sqlite', (err) => {
  if (err) console.error('DB Error:', err.message);
  console.log('Connected to Lead Database.');
});

// Create tables for leads and payments
db.serialize(() => {
  db.run(`CREATE TABLE IF NOT EXISTS leads (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT,
    email TEXT,
    mobile TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP
  )`);

  db.run(`CREATE TABLE IF NOT EXISTS payments (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    razorpay_payment_id TEXT UNIQUE,
    lead_id INTEGER,
    amount INTEGER,
    status TEXT,
    created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
    FOREIGN KEY(lead_id) REFERENCES leads(id)
  )`);
});

const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID || 'rzp_live_SSdoLbpNzB9Dzi',
  key_secret: process.env.RAZORPAY_KEY_SECRET || 'ftXpTrm4dEsKlSklbBnr8jt9',
});

app.use(cors());
app.use(bodyParser.json());

// 1. 📇 Capture Lead Pre-Checkout
app.post('/api/leads', (req, res) => {
  const { name, email, mobile } = req.body;
  
  if (!name || !email || !mobile) {
    return res.status(400).json({ error: 'Missing lead information' });
  }

  const sql = `INSERT INTO leads (name, email, mobile) VALUES (?, ?, ?)`;
  db.run(sql, [name, email, mobile], function(err) {
    if (err) return res.status(500).json({ error: err.message });
    res.json({ lead_id: this.lastID, message: 'Lead captured successfully' });
  });
});

// 2. 💳 Secure Razorpay Webhook (Confirmation)
// To use this, you need to point your Razorpay Webhook to: https://your-server.com/api/webhook
app.post('/api/webhook', (req, res) => {
  const secret = process.env.RAZORPAY_WEBHOOK_SECRET || 'your_secret_here';

  const signature = req.headers['x-razorpay-signature'];
  const expectedSignature = crypto
    .createHmac('sha256', secret)
    .update(JSON.stringify(req.body))
    .digest('hex');

  if (signature === expectedSignature) {
    console.log('Payment Verified via Webhook');
    const payment = req.body.payload.payment.entity;
    
    // Log the successful payment to DB
    const sql = `INSERT INTO payments (razorpay_payment_id, amount, status) VALUES (?, ?, ?)`;
    db.run(sql, [payment.id, payment.amount, payment.status], (err) => {
      if (err) console.error('Payment Log Error:', err.message);
    });

    res.status(200).send('OK');
  } else {
    res.status(400).send('Invalid signature');
  }
});

// 3. 📊 Get All Leads (Admin only - you can add auth)
app.get('/api/leads', (req, res) => {
  db.all("SELECT * FROM leads ORDER BY created_at DESC", [], (err, rows) => {
    if (err) return res.status(500).json({ error: err.message });
    res.json(rows);
  });
});

app.listen(port, () => {
  console.log(`🚀 Backend Server running on http://localhost:${port}`);
});
