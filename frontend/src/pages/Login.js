import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isAdmin, setIsAdmin] = useState(false);

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    if (isLogin) {
      login(formData.email, formData.password, isAdmin);
      if (isAdmin) {
        navigate('/admin/dashboard');
      } else {
        navigate('/dashboard');
      }
    } else {
      signup(formData.email, formData.password, formData.name);
      navigate('/dashboard');
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center py-16 px-4 bg-gray-50">
      <div className="w-full max-w-md">
        <div className="bg-white p-12 rounded-xl shadow-md">
          <div className="text-center mb-8">
            <div className="flex justify-center mb-4">
              <div className="w-15 h-15 bg-blue-600 text-white flex items-center justify-center rounded-xl text-3xl font-bold">V</div>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900">Welcome to Viyom</h1>
            <p className="text-sm text-gray-600">Secure and transparent NGO donations powered by blockchain.</p>
          </div>

          <div className="flex gap-2 mb-8 border-b-2 border-gray-200">
            <button
              className={`flex-1 py-3 font-medium transition-colors border-b-2 -mb-[2px] ${
                isLogin
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent'
              }`}
              onClick={() => setIsLogin(true)}
            >
              Login
            </button>
            <button
              className={`flex-1 py-3 font-medium transition-colors border-b-2 -mb-[2px] ${
                !isLogin
                  ? 'text-blue-600 border-blue-600'
                  : 'text-gray-500 border-transparent'
              }`}
              onClick={() => setIsLogin(false)}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mb-6">
            {!isLogin && (
              <div className="mb-6">
                <label className="block font-medium mb-2 text-gray-700">Full Name</label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600"
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="mb-6">
              <label className="block font-medium mb-2 text-gray-700">Email</label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600"
                required
              />
            </div>

            <div className="mb-6">
              <label className="block font-medium mb-2 text-gray-700">Password</label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Enter your password"
                className="w-full px-3 py-3 border-2 border-gray-200 rounded-lg outline-none focus:border-blue-600"
                required
              />
            </div>

            {isLogin && (
              <div className="flex justify-between items-center mb-6">
                <label className="flex items-center gap-2 text-sm cursor-pointer">
                  <input
                    type="checkbox"
                    checked={isAdmin}
                    onChange={(e) => setIsAdmin(e.target.checked)}
                    className="w-5 h-5 cursor-pointer"
                  />
                  Login as Admin
                </label>
                <Link to="#forgot" className="text-blue-600 text-sm font-medium hover:underline">Forgot password?</Link>
              </div>
            )}

            <button type="submit" className="w-full bg-blue-600 text-white py-3 rounded-lg font-semibold hover:bg-blue-700 transition-colors">
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="relative text-center mb-6">
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative bg-white px-4 text-sm text-gray-500">OR</div>
          </div>

          <button className="w-full bg-white text-gray-700 py-3 rounded-lg font-medium border-2 border-gray-200 hover:bg-gray-50 transition-colors flex items-center justify-center gap-2">
            <span className="text-xl font-bold text-blue-500">G</span>
            Continue with Google
          </button>
        </div>
      </div>
    </div>
  );
};

export default Login;
