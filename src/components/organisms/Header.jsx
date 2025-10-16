import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import ApperIcon from "@/components/ApperIcon";
import SearchBar from "@/components/molecules/SearchBar";

const Header = ({ cartItemCount = 0 }) => {
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);

  const categories = [
    "Electronics", 
    "Clothing", 
    "Books", 
    "Home & Garden", 
    "Sports", 
    "Beauty", 
    "Automotive", 
    "Toys"
  ];

  const handleSearch = (query) => {
    if (query.trim()) {
      navigate(`/?search=${encodeURIComponent(query.trim())}`);
    } else {
      navigate("/");
    }
  };

  const handleCategoryClick = (category) => {
    navigate(`/?category=${encodeURIComponent(category)}`);
    setIsMobileMenuOpen(false);
  };

  return (
    <header className="bg-secondary text-white sticky top-0 z-50 shadow-lg">
      <div className="max-w-7xl mx-auto px-4">
        {/* Main Header */}
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div 
            className="flex items-center space-x-2 cursor-pointer"
            onClick={() => navigate("/")}
          >
            <div className="w-8 h-8 bg-gradient-to-br from-primary to-accent rounded-lg flex items-center justify-center">
              <ApperIcon name="ShoppingBag" size={20} className="text-white" />
            </div>
            <h1 className="text-xl font-bold">ShopHub</h1>
          </div>

          {/* Desktop Search Bar */}
          <div className="hidden md:block flex-1 max-w-2xl mx-8">
            <SearchBar onSearch={handleSearch} />
          </div>

          {/* Right Actions */}
          <div className="flex items-center space-x-4">
            {/* Cart */}
            <button
              onClick={() => navigate("/cart")}
              className="relative p-2 hover:bg-white/10 rounded-lg transition-colors"
            >
              <ApperIcon name="ShoppingCart" size={24} />
              {cartItemCount > 0 && (
                <span className="absolute -top-1 -right-1 bg-primary text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center animate-pulse">
                  {cartItemCount > 99 ? "99+" : cartItemCount}
                </span>
              )}
            </button>

            {/* Mobile Menu Toggle */}
            <button
              className="md:hidden p-2 hover:bg-white/10 rounded-lg transition-colors"
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
            >
              <ApperIcon name={isMobileMenuOpen ? "X" : "Menu"} size={24} />
            </button>
          </div>
        </div>

        {/* Desktop Categories */}
        <div className="hidden md:flex items-center space-x-6 py-3 border-t border-white/20">
<button
            onClick={() => navigate("/")}
            className="text-sm hover:text-primary transition-colors font-medium"
          >
            All Categories
          </button>
          <button
            onClick={() => navigate("/orders")}
            className="text-sm hover:text-primary transition-colors font-medium"
          >
            Order History
          </button>
          {categories.slice(0, 6).map((category) => (
            <button
              key={category}
              onClick={() => handleCategoryClick(category)}
              className="text-sm hover:text-primary transition-colors whitespace-nowrap"
            >
              {category}
            </button>
          ))}
        </div>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-secondary border-t border-white/20">
          {/* Mobile Search */}
          <div className="p-4 border-b border-white/20">
            <SearchBar onSearch={handleSearch} />
          </div>
          
          {/* Mobile Categories */}
          <div className="py-2">
<button
              onClick={() => {
                navigate("/");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors font-medium"
            >
              All Categories
            </button>
            <button
              onClick={() => {
                navigate("/orders");
                setIsMobileMenuOpen(false);
              }}
              className="block w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors font-medium"
            >
              Order History
            </button>
            {categories.map((category) => (
              <button
                key={category}
                onClick={() => handleCategoryClick(category)}
                className="block w-full text-left px-4 py-3 text-sm hover:bg-white/10 transition-colors"
              >
                {category}
              </button>
            ))}
          </div>
        </div>
      )}
    </header>
  );
};

export default Header;