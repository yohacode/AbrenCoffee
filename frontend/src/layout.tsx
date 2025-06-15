// src/Layout.tsx
import React from 'react';
import Nav from './component/nav';
import Footer from './component/footer';
import Cart from './pages/shop/cart';
import { useNavVisibility } from './context/NavVisibilityContext';

interface Props {
  children: React.ReactNode;
  isCartOpen: boolean;
  openCart: () => void;
  closeCart: () => void;
  isLoggedIn: boolean;
}

const Layout: React.FC<Props> = ({ children, isCartOpen, openCart, closeCart, isLoggedIn }) => {
  const { showNav, showFooter } = useNavVisibility();

  return (
    <>
      {showNav && <Nav isLoggedIn={isLoggedIn} onCartClick={openCart} />}
      <Cart isOpen={isCartOpen} onClose={closeCart} />
      {children}
      {showFooter && <Footer />}
    </>
  );
};

export default Layout;
