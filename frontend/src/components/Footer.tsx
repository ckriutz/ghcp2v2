import React, { useState } from 'react';

const Footer: React.FC = () => {
  const [email, setEmail] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    // Handle email subscription
    console.log('Subscribing email:', email);
    setEmail('');
  };
  
  return (
    <footer className="bg-gray-900 text-gray-300">
      {/* Newsletter Section */}
      <div className="bg-gray-800 py-8">
        <div className="container mx-auto px-4 flex flex-col md:flex-row items-center justify-between">
          <div className="flex items-center mb-4 md:mb-0">
            <div className="mr-4">
              <svg className="w-12 h-12 text-green-500" fill="currentColor" viewBox="0 0 24 24">
                <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
              </svg>
            </div>
            <h2 className="text-white text-xl font-semibold">
              Sign Up To Get Updates & News About Us..
            </h2>
          </div>
          <form onSubmit={handleSubscribe} className="flex w-full md:w-auto">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Enter Your Email"
              className="px-4 py-3 rounded-l-lg bg-gray-700 text-white placeholder-gray-400 border border-gray-600 focus:outline-none focus:border-green-500 flex-1 md:w-80"
              required
            />
            <button
              type="submit"
              className="px-6 py-3 bg-green-500 text-white rounded-r-lg hover:bg-green-600 transition-colors duration-300 font-semibold"
            >
              Subscribe
            </button>
          </form>
        </div>
      </div>

      {/* Main Footer Content */}
      <div className="py-12">
        <div className="container mx-auto px-4">
          <div className="grid grid-cols-1 md:grid-cols-5 gap-8">
            {/* Solar Supplier Section */}
            <div>
              <div className="flex items-center mb-4">
                <div className="w-8 h-8 mr-2">
                  <svg className="w-full h-full text-green-500" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M12 2L2 7v10c0 5.55 3.84 9.739 9 11 5.16-1.261 9-5.45 9-11V7l-10-5z"/>
                  </svg>
                </div>
                <h3 className="text-white font-semibold text-lg">Solar Supplier</h3>
              </div>
              <p className="text-gray-400 text-sm mb-4">
                In publishing and graphic design, lorem ipsum is placeholder text is from commonly used to demonstrate.
              </p>
              <div className="space-y-2">
                <h4 className="text-white font-semibold">Contact Us</h4>
                <p className="text-gray-400 text-sm flex items-center">
                  <span className="mr-2">📞</span> +91 99876 54321
                </p>
                <p className="text-gray-400 text-sm flex items-center">
                  <span className="mr-2">✉️</span> yourmailid.com
                </p>
              </div>
            </div>

            {/* About Section */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">
                About
                <div className="w-12 h-1 bg-green-500 mt-1"></div>
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-500 transition-colors">Our Story</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Trade Shows</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Latest Blog</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">More Search</a></li>
              </ul>
            </div>

            {/* Account Section */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">
                Account
                <div className="w-12 h-1 bg-green-500 mt-1"></div>
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-500 transition-colors">My Cart</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Checkout</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Shopping Details</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Order</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Help Center</a></li>
              </ul>
            </div>

            {/* Helpful Links Section */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">
                Helpful Links
                <div className="w-12 h-1 bg-green-500 mt-1"></div>
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-500 transition-colors">Services</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Supports</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Feedback</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Terms & Conditions</a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors">Privacy Policy</a></li>
              </ul>
            </div>

            {/* Social Media Section */}
            <div>
              <h3 className="text-white font-semibold text-lg mb-4">
                Social Media
                <div className="w-12 h-1 bg-green-500 mt-1"></div>
              </h3>
              <ul className="space-y-3 text-gray-400 text-sm">
                <li><a href="#" className="hover:text-green-500 transition-colors flex items-center">
                  <span className="mr-2">🐦</span> Twitter
                </a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors flex items-center">
                  <span className="mr-2">📘</span> Facebook
                </a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors flex items-center">
                  <span className="mr-2">📺</span> Youtube
                </a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors flex items-center">
                  <span className="mr-2">💼</span> Linkedin
                </a></li>
                <li><a href="#" className="hover:text-green-500 transition-colors flex items-center">
                  <span className="mr-2">📷</span> Instagram
                </a></li>
              </ul>
            </div>
          </div>
        </div>
      </div>

      {/* Copyright Section */}
      <div className="border-t border-gray-700 py-6">
        <div className="container mx-auto px-4 text-center">
          <p className="text-gray-400 text-sm">
            Copyright © 2024 Solar Supplier. All Rights Reserved
          </p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;