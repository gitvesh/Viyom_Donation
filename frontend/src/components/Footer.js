import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="bg-gradient-to-br from-gray-50 to-gray-100 border-t border-gray-200 mt-auto">
      <div className="max-w-7xl mx-auto px-6 lg:px-8 py-12">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-5 gap-8 mb-8">
          {/* Brand Section */}
          <div className="lg:col-span-1 space-y-4 animate-slideUp">
            <Link to="/" className="flex items-center gap-3 group w-fit">
              <div className="w-10 h-10 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center rounded-xl font-bold text-lg shadow-lg shadow-blue-600/30 group-hover:shadow-blue-600/50 transition-all duration-300 group-hover:scale-105">
                V
              </div>
              <span className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-blue-800 bg-clip-text text-transparent">Viyom</span>
            </Link>
            <p className="text-gray-600 text-sm leading-relaxed">
              Empowering transparent and secure donations through blockchain technology.
            </p>
          </div>

          {/* Quick Links */}
          <div className="animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Quick Links</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-200"></span>
                  Home
                </Link>
              </li>
              <li>
                <Link to="/sectors" className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-200"></span>
                  Sectors
                </Link>
              </li>
              <li>
                <Link to="/track-donation" className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-200"></span>
                  Track Donation
                </Link>
              </li>
              <li>
                <Link to="/dashboard" className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-200"></span>
                  Dashboard
                </Link>
              </li>
            </ul>
          </div>

          {/* Support */}
          <div className="animate-slideUp" style={{ animationDelay: '0.2s' }}>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Support</h4>
            <ul className="space-y-3">
              <li>
                <a href="#faq" className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-200"></span>
                  FAQ
                </a>
              </li>
              <li>
                <a href="#contact" className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-200"></span>
                  Contact Us
                </a>
              </li>
              <li>
                <a href="#terms" className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-200"></span>
                  Terms of Service
                </a>
              </li>
              <li>
                <a href="#privacy" className="text-gray-600 hover:text-blue-600 text-sm transition-all duration-200 flex items-center gap-2 group">
                  <span className="w-0 h-0.5 bg-blue-600 group-hover:w-4 transition-all duration-200"></span>
                  Privacy Policy
                </a>
              </li>
            </ul>
          </div>

          {/* Contact Info */}
          <div className="animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Contact Info</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-gray-600 text-sm">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0 mt-0.5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <span>123 Charity Street<br />Mumbai, Maharashtra 400001</span>
              </li>
              <li className="flex items-center gap-2 text-gray-600 text-sm hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                </svg>
                <a href="mailto:contact@viyom.org">contact@viyom.org</a>
              </li>
              <li className="flex items-center gap-2 text-gray-600 text-sm hover:text-blue-600 transition-colors">
                <svg className="w-5 h-5 text-blue-600 flex-shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 5a2 2 0 012-2h3.28a1 1 0 01.948.684l1.498 4.493a1 1 0 01-.502 1.21l-2.257 1.13a11.042 11.042 0 005.516 5.516l1.13-2.257a1 1 0 011.21-.502l4.493 1.498a1 1 0 01.684.949V19a2 2 0 01-2 2h-1C9.716 21 3 14.284 3 6V5z" />
                </svg>
                <a href="tel:+911234567890">+91 123-456-7890</a>
              </li>
            </ul>
          </div>

          {/* Follow Us */}
          <div className="animate-slideUp" style={{ animationDelay: '0.4s' }}>
            <h4 className="font-semibold text-gray-900 mb-4 text-sm uppercase tracking-wider">Follow Us</h4>
            <div className="flex gap-3">
              <a 
                href="https://linkedin.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-blue-600 hover:border-blue-600 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M19 0h-14c-2.761 0-5 2.239-5 5v14c0 2.761 2.239 5 5 5h14c2.762 0 5-2.239 5-5v-14c0-2.761-2.238-5-5-5zm-11 19h-3v-11h3v11zm-1.5-12.268c-.966 0-1.75-.79-1.75-1.764s.784-1.764 1.75-1.764 1.75.79 1.75 1.764-.783 1.764-1.75 1.764zm13.5 12.268h-3v-5.604c0-3.368-4-3.113-4 0v5.604h-3v-11h3v1.765c1.396-2.586 7-2.777 7 2.476v6.759z"/>
                </svg>
              </a>
              <a 
                href="https://instagram.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-gradient-to-br hover:from-purple-600 hover:to-pink-600 hover:border-transparent transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838c-3.403 0-6.162 2.759-6.162 6.162s2.759 6.163 6.162 6.163 6.162-2.759 6.162-6.163c0-3.403-2.759-6.162-6.162-6.162zm0 10.162c-2.209 0-4-1.79-4-4 0-2.209 1.791-4 4-4s4 1.791 4 4c0 2.21-1.791 4-4 4zm6.406-11.845c-.796 0-1.441.645-1.441 1.44s.645 1.44 1.441 1.44c.795 0 1.439-.645 1.439-1.44s-.644-1.44-1.439-1.44z"/>
                </svg>
              </a>
              <a 
                href="https://facebook.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-blue-700 hover:border-blue-700 transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M9 8h-3v4h3v12h5v-12h3.642l.358-4h-4v-1.667c0-.955.192-1.333 1.115-1.333h2.885v-5h-3.808c-3.596 0-5.192 1.583-5.192 4.615v3.385z"/>
                </svg>
              </a>
              <a 
                href="https://twitter.com" 
                target="_blank" 
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-lg bg-white border border-gray-200 flex items-center justify-center text-gray-600 hover:text-white hover:bg-black hover:border-black transition-all duration-300 hover:scale-110 hover:shadow-lg"
              >
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                  <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
                </svg>
              </a>
            </div>
          </div>
        </div>

        {/* Bottom Bar */}
        <div className="border-t border-gray-200 pt-6 mt-6">
          <div className="flex flex-col md:flex-row justify-between items-center gap-4">
            <p className="text-gray-500 text-sm">
              © {currentYear} Viyom. All rights reserved.
            </p>
            <div className="flex items-center gap-6 text-sm text-gray-500">
              <a href="#terms" className="hover:text-blue-600 transition-colors">Terms</a>
              <a href="#privacy" className="hover:text-blue-600 transition-colors">Privacy</a>
              <a href="#cookies" className="hover:text-blue-600 transition-colors">Cookies</a>
            </div>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
