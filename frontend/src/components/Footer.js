import React from 'react';
import { Link } from 'react-router-dom';

const Footer = () => {
  return (
    <footer className="bg-gray-100 pt-12 pb-4 mt-auto">
      <div className="max-w-7xl mx-auto px-8">
        <div className="grid grid-cols-1 md:grid-cols-5 gap-8 mb-8">
          <div>
            <div className="flex items-center gap-2 text-2xl font-bold text-blue-600 mb-4">
              <div className="w-8 h-8 bg-blue-600 text-white flex items-center justify-center rounded font-bold">V</div>
              <span>Viyom</span>
            </div>
            <p className="text-gray-500 text-sm">© 2026 Viyom. All rights reserved.</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Quick Links</h4>
            <ul className="space-y-2">
              <li><Link to="/" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Home</Link></li>
              <li><Link to="/sectors" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Sectors</Link></li>
              <li><Link to="/track-donation" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Track Donation</Link></li>
              <li><Link to="/dashboard" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Dashboard</Link></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Support</h4>
            <ul className="space-y-2">
              <li><a href="#faq" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">FAQ</a></li>
              <li><a href="#contact" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Contact Us</a></li>
              <li><a href="#terms" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Terms of Service</a></li>
              <li><a href="#privacy" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Privacy Policy</a></li>
            </ul>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Contact Info</h4>
            <p className="text-gray-500 text-sm">123 Charity Street</p>
            <p className="text-gray-500 text-sm">Mumbai, Maharashtra 400001</p>
            <p className="text-gray-500 text-sm">Email: contact@viyom.org</p>
            <p className="text-gray-500 text-sm">Phone: +91 123-456-7890</p>
          </div>
          <div>
            <h4 className="font-semibold text-gray-900 mb-4">Follow Us</h4>
            <div className="flex gap-4">
              <a href="#linkedin" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">LinkedIn</a>
              <a href="#instagram" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Instagram</a>
              <a href="#facebook" className="text-gray-500 hover:text-blue-600 text-sm transition-colors">Facebook</a>
            </div>
          </div>
        </div>
        <div className="border-t border-gray-300 pt-4 text-left">
          <span className="text-gray-500 text-sm">Made with Visily</span>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
