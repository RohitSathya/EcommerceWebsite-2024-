import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { fastcount } from './Redux/totalslice';
import axios from 'axios';
import link from './link';
import PhoneInput from 'react-phone-input-2';
import 'react-phone-input-2/lib/style.css';
import zxcvbn from 'zxcvbn';
import { signInWithGoogle } from './firebase';

const Signup = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [name, setName] = useState('');
  const [phoneno, setPhoneNo] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [passwordStrength, setPasswordStrength] = useState(null);
  const [showPassword, setShowPassword] = useState(false);

  useEffect(() => {
    const navid = document.getElementById('navbar');
    if (navid) navid.style.display = 'none';
  }, []);

  useEffect(() => {
    const result = zxcvbn(password);
    setPasswordStrength(result);
  }, [password]);

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(String(email).toLowerCase());
  };

  const validatePassword = (password) => {
    return (
      password.length >= 8 &&
      /[A-Z]/.test(password) &&
      /[a-z]/.test(password) &&
      /\d/.test(password) &&
      /[@$!%*?&#]/.test(password)
    );
  };

  async function handleSubmit() {
    if (!validatePassword(password)) {
      alert('Password must be at least 8 characters long, and include uppercase, lowercase, number, and special character.');
      return;
    }

    try {
      const response = await axios.post(link + '/product/register', {
        name,
        phoneno,
        email,
        password,
      });
      const { message, userdetail } = response.data;
      if (message === 'failed') {
        alert('Email already exists. Please use a different email.');
      } else {
        localStorage.setItem('userdetail', JSON.stringify(userdetail));
        dispatch(fastcount());
        navigate('/');
        const navid = document.getElementById('navbar');
        if (navid) navid.style.display = 'flex';
      }
    } catch (error) {
      alert('An error occurred. Please try again.');
    }
  }

  async function handleGoogleSignUp() {
    try {
      const user = await signInWithGoogle();
      localStorage.setItem('userdetail', JSON.stringify(user));
      dispatch(fastcount());
      navigate('/');
    } catch (error) {
      alert('Google sign-up failed. Please try again.');
    }
  }

  const passwordStrengthLabel = () => {
    if (!passwordStrength) return '';
    switch (passwordStrength.score) {
      case 0:
        return 'Very Weak';
      case 1:
        return 'Weak';
      case 2:
        return 'Fair';
      case 3:
        return 'Good';
      case 4:
        return 'Strong';
      default:
        return '';
    }
  };

  const passwordStrengthColor = () => {
    if (!passwordStrength) return '';
    switch (passwordStrength.score) {
      case 0:
        return 'bg-red-500';
      case 1:
        return 'bg-orange-500';
      case 2:
        return 'bg-yellow-500';
      case 3:
        return 'bg-blue-500';
      case 4:
        return 'bg-green-500';
      default:
        return '';
    }
  };

  return (
    <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 text-gray-800">
      <div className="w-full max-w-md bg-white rounded-lg shadow-lg p-8 sm:p-12">
        <div className="text-center mb-6">
          <h1 className="text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-indigo-500 via-purple-500 to-pink-500">
            ROYOMART
          </h1>
          <h2 className="text-xl font-semibold text-gray-700">Create Your Account</h2>
        </div>
        <div className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm font-medium text-gray-600">
              Full Name
            </label>
            <input
              type="text"
              id="name"
              placeholder="First and Last Name"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="phoneno" className="block text-sm font-medium text-gray-600">
              Mobile Number
            </label>
            <PhoneInput
              country={'in'}
              value={phoneno}
              onChange={setPhoneNo}
              inputStyle={{
                width: '100%',
                paddingLeft: '40px',
                paddingRight: '10px',
                borderRadius: '6px',
                border: '1px solid #d1d5db',
                color: 'black',
              }}
              containerStyle={{ width: '100%' }}
              buttonStyle={{ backgroundColor: 'white', borderRight: '1px solid #d1d5db' }}
              dropdownStyle={{ backgroundColor: 'white', color: 'black', maxHeight: '150px', overflowY: 'scroll' }}
              enableLongNumbers
            />
          </div>
          <div>
            <label htmlFor="email" className="block text-sm font-medium text-gray-600">
              Email Address
            </label>
            <input
              type="email"
              id="email"
              placeholder="you@example.com"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>
          <div>
            <label htmlFor="password" className="block text-sm font-medium text-gray-600">
              Password
            </label>
            <input
              type={showPassword ? 'text' : 'password'}
              id="password"
              placeholder="Password"
              className="w-full mt-2 px-4 py-2 border border-gray-300 rounded-lg focus:ring-indigo-500 focus:border-indigo-500"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
            <div className="mt-2 flex items-center">
              <div className={`h-2 w-full rounded-full ${passwordStrengthColor()}`}></div>
              <span className="ml-2 text-sm">{passwordStrengthLabel()}</span>
            </div>
            <label className="mt-2 flex items-center text-sm">
              <input
                type="checkbox"
                className="form-checkbox h-4 w-4 text-indigo-600"
                checked={showPassword}
                onChange={() => setShowPassword(!showPassword)}
              />
              <span className="ml-2">Show Password</span>
            </label>
            <p className="text-xs text-gray-500 mt-1">
              Must be at least 8 characters, including uppercase, lowercase, number, and symbol.
            </p>
          </div>
          <button
            onClick={handleSubmit}
            className="w-full py-3 bg-indigo-600 text-white font-semibold rounded-lg shadow-lg hover:bg-indigo-700"
          >
            Create Account
          </button>
          <button
            onClick={handleGoogleSignUp}
            className="w-full py-3 mt-4 bg-white border border-gray-300 text-gray-700 rounded-lg shadow-md hover:bg-gray-50 flex items-center justify-center"
          >
            <img src="https://developers.google.com/identity/images/g-logo.png" alt="Google" className="h-5 mr-3" />
            Sign up with Google
          </button>
          <div className="mt-4 text-center">
            <p className="text-gray-600">Already have an account?</p>
            <button onClick={() => navigate('/login')} className="text-indigo-600 font-semibold hover:underline mt-1">
              Sign In
            </button>
          </div>
        </div>
        <div className="mt-8 text-center text-xs text-gray-500">
          <p>By signing up, you agree to Royomart's Terms of Service and Privacy Policy.</p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
