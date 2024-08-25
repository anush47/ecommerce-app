import { useEffect } from 'react';

function useSessionLikeLocalStorage() {
  useEffect(() => {
    const clearCartData = () => {
      localStorage.removeItem('cart');
    };
    window.addEventListener('beforeunload', clearCartData);
    return () => {
      window.removeEventListener('beforeunload', clearCartData);
    };
  }, []);
}

export default useSessionLikeLocalStorage;
