import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const ScrollToTop = () => {
  const { pathname } = useLocation();

  useEffect(() => {
    // Immediate scroll to top on path change
    window.scrollTo({
      top: 0,
      left: 0,
      behavior: 'instant' as any // Use instant to avoid smooth scroll animation jumping
    });
  }, [pathname]);

  return null;
};

export default ScrollToTop;
