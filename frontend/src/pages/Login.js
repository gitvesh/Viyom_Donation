import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation, Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const Login = () => {
  const navigate = useNavigate();
  const location = useLocation();
  const { login, signup } = useAuth();
  const [isLogin, setIsLogin] = useState(true);
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    name: ''
  });
  const [isAdmin, setIsAdmin] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  // Get redirect info from location state
  const redirectMessage = location.state?.message;
  const redirectFrom = location.state?.from;

  // Initialize Google Sign-In
  useEffect(() => {
    // Only load Google Sign-In if client ID is configured
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    if (!googleClientId || googleClientId === 'YOUR_GOOGLE_CLIENT_ID') {
      console.log('Google OAuth not configured. Skipping Google Sign-In initialization.');
      return;
    }

    // Load Google Sign-In script
    const script = document.createElement('script');
    script.src = 'https://accounts.google.com/gsi/client';
    script.async = true;
    script.defer = true;
    document.body.appendChild(script);

    script.onload = () => {
      if (window.google) {
        window.google.accounts.id.initialize({
          client_id: googleClientId,
          callback: handleGoogleSignIn,
        });
      }
    };

    return () => {
      if (document.body.contains(script)) {
        document.body.removeChild(script);
      }
    };
  }, [handleGoogleSignIn]);

  const handleGoogleSignIn = async (response) => {
    try {
      console.log('Google Sign-In response:', response);
      // Here you would send the credential to your backend
      // For now, we'll simulate a successful login
      
      // Decode the JWT token to get user info
      const userInfo = JSON.parse(atob(response.credential.split('.')[1]));
      console.log('User info:', userInfo);
      
      // Simulate login with Google account
      await login(userInfo.email, 'google-oauth-' + userInfo.sub);
      
      if (redirectFrom) {
        navigate(redirectFrom);
      } else {
        navigate('/dashboard');
      }
    } catch (err) {
      console.error('Google Sign-In failed:', err);
    }
  };

  const handleGoogleButtonClick = () => {
    const googleClientId = process.env.REACT_APP_GOOGLE_CLIENT_ID;
    
    // Check if Google OAuth is configured
    if (!googleClientId || googleClientId === 'YOUR_GOOGLE_CLIENT_ID') {
      alert('Google OAuth is not configured yet.\n\nTo enable Google Sign-In:\n1. Follow the setup guide in GOOGLE_OAUTH_SETUP.md\n2. Get your Client ID from Google Cloud Console\n3. Add it to frontend/.env as REACT_APP_GOOGLE_CLIENT_ID');
      return;
    }

    if (window.google) {
      window.google.accounts.id.prompt();
    } else {
      console.error('Google Sign-In not loaded');
      alert('Google Sign-In is not available. Please try again later.');
    }
  };

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    if (isLogin) {
      try {
        await login(formData.email, formData.password);
        // Redirect to original destination or default based on admin status
        if (redirectFrom) {
          navigate(redirectFrom);
        } else if (isAdmin) {
          navigate('/admin/dashboard');
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Login failed:', err);
        // Error is handled in AuthContext
      }
    } else {
      try {
        await signup(formData.name, formData.email, formData.password, formData.phone, formData.pan);
        // After signup, redirect to original destination or dashboard
        if (redirectFrom) {
          navigate(redirectFrom);
        } else {
          navigate('/dashboard');
        }
      } catch (err) {
        console.error('Signup failed:', err);
      }
    }
  };

  return (
    <div className="flex-1 flex items-center justify-center min-h-screen py-12 px-4 bg-gradient-to-br from-blue-50 via-white to-purple-50 relative overflow-hidden">
      {/* Animated Background Elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-20 left-10 w-72 h-72 bg-blue-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob"></div>
        <div className="absolute top-40 right-10 w-72 h-72 bg-purple-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-2000"></div>
        <div className="absolute -bottom-8 left-1/2 w-72 h-72 bg-pink-200 rounded-full mix-blend-multiply filter blur-3xl opacity-20 animate-blob animation-delay-4000"></div>
      </div>

      <div className="relative w-full max-w-md">
        <div className="bg-white/80 backdrop-blur-xl p-10 rounded-3xl shadow-2xl border border-gray-100">
          {redirectMessage && (
            <div className="mb-6 p-4 bg-blue-50 border border-blue-200 rounded-xl text-blue-800 text-sm animate-slideUp">
              <div className="flex items-center gap-2">
                <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                  <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                </svg>
                {redirectMessage}
              </div>
            </div>
          )}
          
          <div className="text-center mb-8 animate-slideUp">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 bg-gradient-to-br from-blue-600 to-blue-700 text-white flex items-center justify-center rounded-2xl text-3xl font-bold shadow-lg shadow-blue-600/30 transform hover:scale-110 transition-transform duration-300">
                V
              </div>
            </div>
            <h1 className="text-3xl font-bold mb-2 text-gray-900" style={{ fontFamily: "'Inter', sans-serif" }}>
              Welcome to Viyom
            </h1>
            <p className="text-sm text-gray-600" style={{ fontFamily: "'Inter', sans-serif" }}>
              Secure and transparent NGO donations powered by blockchain.
            </p>
          </div>

          <div className="flex gap-2 mb-8 bg-gray-100 p-1 rounded-xl animate-slideUp" style={{ animationDelay: '0.1s' }}>
            <button
              className={`flex-1 py-2.5 font-semibold transition-all duration-300 rounded-lg ${
                isLogin
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setIsLogin(true)}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Login
            </button>
            <button
              className={`flex-1 py-2.5 font-semibold transition-all duration-300 rounded-lg ${
                !isLogin
                  ? 'bg-white text-blue-600 shadow-md'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
              onClick={() => setIsLogin(false)}
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              Sign Up
            </button>
          </div>

          <form onSubmit={handleSubmit} className="mb-6 animate-slideUp" style={{ animationDelay: '0.2s' }}>
            {!isLogin && (
              <div className="mb-5">
                <label className="block font-medium mb-2 text-gray-700 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                  Full Name
                </label>
                <input
                  type="text"
                  name="name"
                  value={formData.name}
                  onChange={handleChange}
                  placeholder="Enter your full name"
                  className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-600 transition-colors bg-white"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  required={!isLogin}
                />
              </div>
            )}
            
            <div className="mb-5">
              <label className="block font-medium mb-2 text-gray-700 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Email
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="your.email@example.com"
                className="w-full px-4 py-3 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-600 transition-colors bg-white"
                style={{ fontFamily: "'Inter', sans-serif" }}
                required
              />
            </div>

            <div className="mb-5">
              <label className="block font-medium mb-2 text-gray-700 text-sm" style={{ fontFamily: "'Inter', sans-serif" }}>
                Password
              </label>
              <div className="relative">
                <input
                  type={showPassword ? 'text' : 'password'}
                  name="password"
                  value={formData.password}
                  onChange={handleChange}
                  placeholder="Enter your password"
                  className="w-full px-4 py-3 pr-12 border-2 border-gray-200 rounded-xl outline-none focus:border-blue-600 transition-colors bg-white"
                  style={{ fontFamily: "'Inter', sans-serif" }}
                  required
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700 transition-colors"
                >
                  {showPassword ? (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 12a3 3 0 11-6 0 3 3 0 016 0z" />
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z" />
                    </svg>
                  )}
                </button>
              </div>
            </div>

            {isLogin && (
              <div className="mb-6">
                <div className="flex justify-between items-center mb-3">
                  <label className="flex items-center gap-2.5 text-sm cursor-pointer group bg-blue-50 px-4 py-3 rounded-xl border-2 border-blue-200 hover:border-blue-300 transition-all">
                    <input
                      type="checkbox"
                      checked={isAdmin}
                      onChange={(e) => setIsAdmin(e.target.checked)}
                      className="w-4 h-4 cursor-pointer accent-blue-600"
                    />
                    <span className="text-blue-700 font-semibold group-hover:text-blue-800 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                      Login as Admin
                    </span>
                  </label>
                  <Link to="#forgot" className="text-blue-600 text-sm font-medium hover:text-blue-700 transition-colors" style={{ fontFamily: "'Inter', sans-serif" }}>
                    Forgot password?
                  </Link>
                </div>
                {isAdmin && (
                  <div className="text-xs text-blue-600 bg-blue-50 px-3 py-2 rounded-lg border border-blue-200">
                    💡 You will be redirected to Admin Dashboard after login
                  </div>
                )}
              </div>
            )}

            <button 
              type="submit" 
              className="w-full bg-gradient-to-r from-blue-600 to-blue-700 text-white py-3.5 rounded-xl font-semibold hover:from-blue-700 hover:to-blue-800 transition-all duration-300 shadow-lg shadow-blue-600/30 hover:shadow-xl hover:shadow-blue-600/40 hover:scale-[1.02]"
              style={{ fontFamily: "'Inter', sans-serif" }}
            >
              {isLogin ? 'Login' : 'Sign Up'}
            </button>
          </form>

          <div className="relative text-center mb-6 animate-slideUp" style={{ animationDelay: '0.3s' }}>
            <div className="absolute inset-0 flex items-center">
              <div className="w-full border-t border-gray-200"></div>
            </div>
            <div className="relative bg-white/80 px-4 text-sm text-gray-500 font-medium" style={{ fontFamily: "'Inter', sans-serif" }}>
              OR
            </div>
          </div>

          <button 
            onClick={handleGoogleButtonClick}
            type="button"
            className="w-full bg-white text-gray-700 py-3.5 rounded-xl font-medium border-2 border-gray-200 hover:bg-gray-50 hover:border-gray-300 transition-all duration-300 flex items-center justify-center gap-3 shadow-sm hover:shadow-md group animate-slideUp"
            style={{ fontFamily: "'Inter', sans-serif", animationDelay: '0.4s' }}
          >
            <svg className="w-5 h-5" viewBox="0 0 24 24">
              <path fill="#4285F4" d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"/>
              <path fill="#34A853" d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"/>
              <path fill="#FBBC05" d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"/>
              <path fill="#EA4335" d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"/>
            </svg>
            <span className="group-hover:text-gray-900 transition-colors">
              Continue with Google
            </span>
            {(!process.env.REACT_APP_GOOGLE_CLIENT_ID || process.env.REACT_APP_GOOGLE_CLIENT_ID === 'YOUR_GOOGLE_CLIENT_ID') && (
              <span className="ml-2 text-xs text-gray-400">(Setup Required)</span>
            )}
          </button>

          <div className="mt-4 text-center text-xs text-gray-500 animate-slideUp" style={{ animationDelay: '0.5s' }}>
            By continuing, you agree to our Terms of Service and Privacy Policy
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
