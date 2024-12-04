import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import { Facebook, Twitter, Instagram, Youtube, Mail, Phone, MapPin, ChevronRight, Check, X, MessageCircle } from 'lucide-react';
import ChatLayout from './ChatLayout';

const Footer = () => {
  const currentYear = new Date().getFullYear();
  const [email, setEmail] = useState('');
  const [showToast, setShowToast] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [toastType, setToastType] = useState('success');
  const [showChat, setShowChat] = useState(false);

  const validateEmail = (email) => {
    return email.match(/^[^\s@]+@[^\s@]+\.[^\s@]+$/);
  };

  const handleSubscribe = async (e) => {
    e.preventDefault();
    
    if (!validateEmail(email)) {
      setToastType('error');
      setShowToast(true);
      setTimeout(() => setShowToast(false), 3000);
      return;
    }

    setIsLoading(true);

    // Simulate API call
    setTimeout(() => {
      setIsLoading(false);
      setToastType('success');
      setShowToast(true);
      setEmail('');
      setTimeout(() => setShowToast(false), 3000);
    }, 1000);
  };

  const handleChatToggle = () => {
    setShowChat(!showChat);
  };

  // Custom Toast Component
  const Toast = ({ type, message }) => (
    <div className={`fixed bottom-4 right-4 z-50 animate-fade-in-up
      ${type === 'success' ? 'bg-green-500' : 'bg-red-500'}
      text-white px-6 py-4 rounded-lg shadow-2xl flex items-center gap-3
      transition-all duration-500 transform`}
    >
      {type === 'success' ? (
        <Check className="h-5 w-5" />
      ) : (
        <X className="h-5 w-5" />
      )}
      <div>
        <h4 className="font-semibold text-sm">
          {type === 'success' ? 'Success!' : 'Error!'}
        </h4>
        <p className="text-sm opacity-90">{message}</p>
      </div>
    </div>
  );

  return (
    <footer className="bg-gray-900 text-gray-300 mt-16">
      {/* Newsletter Section */}
      <div className="border-b border-gray-800">
        <div className="container mx-auto px-4 py-8">
          <div className="flex flex-col md:flex-row items-center justify-between gap-4">
            <div className="transform transition-all hover:scale-105">
              <h3 className="text-2xl font-bold text-white">Subscribe to Our Newsletter</h3>
              <p className="mt-2 text-gray-400">Get the latest updates on new products and upcoming sales</p>
            </div>
            <div className="w-full md:w-auto">
              <form onSubmit={handleSubscribe} className="flex gap-2">
                <input
                  type="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="Enter your email"
                  className="px-4 py-2 bg-gray-800 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 flex-grow 
                    transition-all duration-300 hover:bg-gray-700"
                />
                <button 
                  type="submit"
                  disabled={isLoading}
                  className={`px-6 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 
                    transition-all duration-300 transform hover:scale-105 focus:outline-none focus:ring-2 
                    focus:ring-blue-500 focus:ring-offset-2 focus:ring-offset-gray-900
                    ${isLoading ? 'opacity-75 cursor-not-allowed' : ''}`}
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                      <span>Subscribing...</span>
                    </div>
                  ) : (
                    'Subscribe'
                  )}
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
          {/* Company Info */}
          <div className="transform transition-all hover:translate-y-[-5px]">
            <h4 className="text-lg font-bold text-white mb-4">About Us</h4>
            <p className="text-gray-400 mb-4">
              We're dedicated to providing the best high-tech products and exceptional customer service to our valued customers.
            </p>
            <div className="flex space-x-4">
              {[
                { icon: Facebook, color: 'hover:text-blue-500' },
                { icon: Twitter, color: 'hover:text-blue-400' },
                { icon: Instagram, color: 'hover:text-pink-500' },
                { icon: Youtube, color: 'hover:text-red-500' }
              ].map((social, index) => (
                <a
                  key={index}
                  href="#"
                  className={`${social.color} transition-all duration-300 transform hover:scale-125`}
                >
                  <social.icon size={20} />
                </a>
              ))}
            </div>
          </div>

          {/* Quick Links */}
          <div className="transform transition-all hover:translate-y-[-5px]">
            <h4 className="text-lg font-bold text-white mb-4">Quick Links</h4>
            <ul className="space-y-2">
              {[
                { to: "/", text: "Home" },
                { to: "/cart", text: "Cart" },
                { to: "/profile", text: "Profile" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="flex items-center group hover:text-blue-500 transition-colors"
                  >
                    <ChevronRight size={16} className="transform transition-transform group-hover:translate-x-2" />
                    <span>{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Customer Service */}
          <div className="transform transition-all hover:translate-y-[-5px]">
            <h4 className="text-lg font-bold text-white mb-4">Customer Service</h4>
            <ul className="space-y-2">
              <li>
                <button
                  onClick={handleChatToggle}
                  className="flex items-center group hover:text-blue-500 transition-colors w-full text-left"
                >
                  <MessageCircle size={16} className="transform transition-transform group-hover:scale-110 mr-2" />
                  <span>Chat Support</span>
                </button>
              </li>
              {[
               
                { to: "/faq", text: "FAQ" },
                { to: "/order", text: "Track Your Order" }
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    to={link.to}
                    className="flex items-center group hover:text-blue-500 transition-colors"
                  >
                    <ChevronRight size={16} className="transform transition-transform group-hover:translate-x-2" />
                    <span>{link.text}</span>
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* Contact Info */}
          <div className="transform transition-all hover:translate-y-[-5px]">
            <h4 className="text-lg font-bold text-white mb-4">Contact Us</h4>
            <ul className="space-y-4">
              {[
                { icon: MapPin, text: "USA,New York" },
                { icon: Phone, text: "+1 3589416690" },
                { icon: Mail, text: "support@royomart.com" }
              ].map((contact, index) => (
                <li key={index} className="flex items-center gap-3 group">
                  <contact.icon size={20} className="text-blue-500 transform transition-transform group-hover:scale-125" />
                  <span className="group-hover:text-blue-500 transition-colors">{contact.text}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Bottom Bar */}
      <div className="border-t border-gray-800">
        <div className="container mx-auto px-4 py-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p>&copy; {currentYear} RoyoMart. All rights reserved.</p>
            <div className="flex gap-6">
              {["Privacy Policy", "Terms of Service", "Cookie Policy"].map((text, index) => (
                <Link
                  key={index}
                  to="#"
                  className="hover:text-blue-500 transition-colors transform hover:scale-105"
                >
                  {text}
                </Link>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Toast Notifications */}
      {showToast && (
        <Toast
          type={toastType}
          message={
            toastType === 'success'
              ? 'Successfully subscribed to our newsletter!'
              : 'Please enter a valid email address'
          }
        />
      )}

      {/* Chat Layout */}
      {showChat && <ChatLayout onClose={handleChatToggle} />}

      {/* Add custom animation keyframes */}
      <style jsx>{`
        @keyframes fade-in-up {
          0% {
            opacity: 0;
            transform: translateY(1rem);
          }
          100% {
            opacity: 1;
            transform: translateY(0);
          }
        }
        .animate-fade-in-up {
          animation: fade-in-up 0.3s ease-out;
        }
      `}</style>
    </footer>
  );
};

export default Footer;
