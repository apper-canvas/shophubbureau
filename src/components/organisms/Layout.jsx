import React, { useState, useEffect } from "react";
import { Outlet } from "react-router-dom";
import Header from "@/components/organisms/Header";
import CartDrawer from "@/components/organisms/CartDrawer";
import { getCartItems, updateCartItem, removeFromCart } from "@/services/api/cartService";

const Layout = () => {
  const [cartItems, setCartItems] = useState([]);
  const [isCartOpen, setIsCartOpen] = useState(false);

  useEffect(() => {
    loadCartItems();
  }, []);

  const loadCartItems = async () => {
    try {
      const items = await getCartItems();
      setCartItems(items);
    } catch (error) {
      console.error("Failed to load cart items:", error);
    }
  };

  const handleUpdateQuantity = async (productId, newQuantity) => {
    if (newQuantity === 0) {
      await handleRemoveItem(productId);
      return;
    }

    try {
      await updateCartItem(productId, { quantity: newQuantity });
      setCartItems(prevItems =>
        prevItems.map(item =>
          item.Id === productId ? { ...item, quantity: newQuantity } : item
        )
      );
    } catch (error) {
      console.error("Failed to update cart item:", error);
    }
  };

  const handleRemoveItem = async (productId) => {
    try {
      await removeFromCart(productId);
      setCartItems(prevItems => prevItems.filter(item => item.Id !== productId));
    } catch (error) {
      console.error("Failed to remove cart item:", error);
    }
  };

  const handleAddToCart = async (product) => {
    try {
      const existingItem = cartItems.find(item => item.Id === product.Id);
      if (existingItem) {
        await handleUpdateQuantity(product.Id, existingItem.quantity + 1);
      } else {
        const newItem = { ...product, quantity: 1 };
        await updateCartItem(product.Id, newItem);
        setCartItems(prevItems => [...prevItems, newItem]);
      }
    } catch (error) {
      console.error("Failed to add to cart:", error);
    }
  };

  const cartItemCount = cartItems.reduce((sum, item) => sum + item.quantity, 0);

  return (
    <div className="min-h-screen bg-background">
      <Header cartItemCount={cartItemCount} />
      <main>
        <Outlet context={{ 
          cartItems, 
          onAddToCart: handleAddToCart,
          onUpdateQuantity: handleUpdateQuantity,
          onRemoveItem: handleRemoveItem,
          onOpenCart: () => setIsCartOpen(true)
        }} />
      </main>
      <CartDrawer
        isOpen={isCartOpen}
        onClose={() => setIsCartOpen(false)}
        cartItems={cartItems}
        onUpdateQuantity={handleUpdateQuantity}
        onRemoveItem={handleRemoveItem}
      />
    </div>
  );
};

export default Layout;