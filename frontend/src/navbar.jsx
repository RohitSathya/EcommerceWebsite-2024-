import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';
import { Menu, Search, ShoppingCart, User, MessageCircle, LogOut, MapPin, X } from 'lucide-react';
import link from './link';
import ChatLayout from './ChatLayout';
import royologo from '../images/royologo.png';

const Navbar = ({ count, func, selectedCategory, onCategoryChange }) => {
  const navigate = useNavigate();
  const [cartCount, setCartCount] = useState(count);
  const [currentUsername, setCurrentUsername] = useState('Guest');
  const [showChat, setShowChat] = useState(false);
  const [isSearchFocused, setIsSearchFocused] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [showMobileCategories, setShowMobileCategories] = useState(false);
  const mobileMenuRef = useRef(null);

  const counter = useSelector((state) => state.total.count);
  const fakecounter = useSelector((state) => state.total.fakecount);
  const fastcount = useSelector((state) => state.total.fastcounte);

  useEffect(() => {
    async function fetchCart() {
      const userdetail = localStorage.getItem('userdetail');
      if (userdetail) {
        const parsedUserDetail = JSON.parse(userdetail);
        const userId = parsedUserDetail.uid || parsedUserDetail._id;
        const username = parsedUserDetail.displayName || parsedUserDetail.name;

        setCurrentUsername(username || 'Guest');

        try {
          const response = await axios.get(`${link}/product/getcart/${userId}`);
          setCartCount(response.data.message === 'f' ? 0 : response.data.length);
        } catch (error) {
          console.error('Error fetching cart:', error);
        }
      }
    }
    fetchCart();
  }, [count, counter, fakecounter, fastcount]);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)) {
        setIsMobileMenuOpen(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('userdetail');
    setCurrentUsername('Guest');
    navigate('/login');
  };

  const handleOrdersClick = () => {
    if (currentUsername === 'Guest') {
      alert('Please log in to view your orders');
    } else {
      navigate('/order');
    }
  };

  const handleCartClick = () => {
    if (currentUsername === 'Guest') {
      alert('Please log in to view your cart');
    } else {
      navigate('/cart');
    }
  };

  const handleChatToggle = () => setShowChat(!showChat);

  const categories = [
    'All', 'Mobile', 'Camera', 'Perfumes', 'Shoes', 'Laptops',
    'Headphones', 'Watches', 'Clothing', 'Books', 'Sports Equipment'
  ];

  const NavItems = ({ isMobile }) => (
    <div className={`flex ${isMobile ? 'flex-col space-y-4' : 'items-center gap-4'}`}>
      <span className="text-sm font-medium flex items-center gap-2">
        <User className="h-4 w-4" />
        Hello, {currentUsername}
      </span>
      <button 
        onClick={handleOrdersClick}
        className="text-sm font-medium hover:text-indigo-400 transition-colors flex items-center gap-2"
      >
        <ShoppingCart className="h-4 w-4" />
        Your Orders
      </button>
      <button 
        onClick={handleCartClick}
        className="relative flex items-center gap-2"
      >
        <ShoppingCart className="h-4 w-4" />
        Cart
        {currentUsername !== 'Guest' && cartCount > 0 && (
          <span className="absolute -top-2 -right-2 bg-indigo-600 text-white text-xs font-bold rounded-full w-4 h-4 flex items-center justify-center">
            {cartCount}
          </span>
        )}
      </button>
      {currentUsername !== 'Guest' ? (
        <>
          <button 
            onClick={() => navigate('/profile')}
            className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
          >
            <User className="h-4 w-4" />
            Profile
          </button>
          <button 
            onClick={handleChatToggle}
            className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
          >
            <MessageCircle className="h-4 w-4" />
            Chat
          </button>
          <button 
            onClick={handleLogout}
            className="flex items-center gap-2 hover:text-indigo-400 transition-colors"
          >
            <LogOut className="h-4 w-4" />
            Logout
          </button>
        </>
      ) : (
        <button 
          onClick={() => navigate('/login')}
          className="text-sm font-medium bg-indigo-600 hover:bg-indigo-700 px-4 py-2 rounded-full transition-colors"
        >
          Login
        </button>
      )}
    </div>
  );

  return (
    <nav className="fixed top-0 w-full bg-gradient-to-r from-gray-900 to-black text-white shadow-lg z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6">
        <div className="flex items-center justify-between h-16">
          {/* Logo and Location */}
          <div className="flex-shrink-0 flex items-center gap-4">
            <img
              src={royologo}
              alt="Logo"
              className="h-8 w-auto cursor-pointer"
              onClick={() => navigate('/')}
            />
            <div className="hidden lg:flex items-center gap-2">
              <MapPin className="h-4 w-4 text-indigo-400" />
              <span className="text-sm font-medium">USA Since 2023</span>
            </div>
          </div>

          {/* Search Bar */}
          <div className="flex-1 max-w-2xl mx-4">
            <div className="relative">
              <div className="flex">
                {/* Categories dropdown - visible only on desktop */}
                <div className="hidden md:block">
                  <select
                    className="appearance-none bg-gray-800 text-white font-medium py-2 px-4 rounded-l-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm border border-gray-700"
                    value={selectedCategory}
                    onChange={(e) => onCategoryChange(e.target.value)}
                  >
                    {categories.map((category) => (
                      <option key={category} value={category}>{category}</option>
                    ))}
                  </select>
                </div>
                <div className="relative flex-1">
                  <input
                    type="text"
                    placeholder={`Search ${selectedCategory !== 'All' ? selectedCategory : ''}`.trim()}
                    className={`w-full pl-4 pr-10 py-2 bg-gray-800 text-white border border-gray-700 focus:ring-2 focus:ring-indigo-400 text-sm placeholder-gray-400 ${
                      showMobileCategories ? 'rounded-full' : 'md:rounded-r-full rounded-full'
                    }`}
                    onChange={(e) => func(e.target.value)}
                    onFocus={() => setIsSearchFocused(true)}
                    onBlur={() => setIsSearchFocused(false)}
                  />
                  <Search 
                    className={`absolute right-3 top-1/2 transform -translate-y-1/2 h-4 w-4 transition-colors ${
                      isSearchFocused ? 'text-indigo-400' : 'text-gray-400'
                    }`}
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Desktop Navigation */}
          <div className="hidden lg:flex items-center">
            <NavItems />
          </div>

          {/* Mobile Menu Button */}
          <button
            className="lg:hidden p-2 rounded-md hover:bg-gray-700 focus:outline-none"
            onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          >
            {isMobileMenuOpen ? (
              <X className="h-6 w-6 text-indigo-400" />
            ) : (
              <Menu className="h-6 w-6 text-indigo-400" />
            )}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        ref={mobileMenuRef}
        className={`lg:hidden fixed right-0 top-16 w-64 bg-gray-900 shadow-xl transform transition-transform duration-300 ease-in-out ${
          isMobileMenuOpen ? 'translate-x-0' : 'translate-x-full'
        }`}
      >
        <div className="p-4">
          {/* Mobile Categories */}
          <select
            className="w-full mb-4 appearance-none bg-gray-800 text-white font-medium py-2 px-4 rounded-full focus:outline-none focus:ring-2 focus:ring-indigo-400 text-sm border border-gray-700"
            value={selectedCategory}
            onChange={(e) => onCategoryChange(e.target.value)}
          >
            {categories.map((category) => (
              <option key={category} value={category}>{category}</option>
            ))}
          </select>
          <NavItems isMobile />
        </div>
      </div>

      {/* Chat Layout */}
      {showChat && <ChatLayout currentUsername={currentUsername} onClose={handleChatToggle} />}
    </nav>
  );
};

export default Navbar;
