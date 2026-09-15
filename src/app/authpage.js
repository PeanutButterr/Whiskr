"use client";

import React, { useState } from 'react';

export default function AuthPage() {
  const [isSignUp, setIsSignUp] = useState(true);

  // Form state to eventually send to your Node/Express backend
  const [formData, setFormData] = useState({
    username: '',
    email: '',
    password: '',
    confirmPassword: ''
  });

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log("Submitting:", formData);
    // You can connect this to your Express API routing here
  };

  return (
    <div className="auth-container">
      {/* Left Panel: Visuals */}
      <div className="auth-left">
        <div className="brand">Whiskrs</div>
        <div className="center-content">
          <h2>A Softer Place</h2>
          <p>Follow the purr.</p>
          <p>Whiskr is a warm, little place for cat people</p>
          <p>and the cats that tolerate them.</p>
        </div>
      </div>

      {/* Right Panel: Form */}
      <div className="auth-right">
        <div className="toggle-wrapper">
          <div className="toggle-buttons">
            <button 
              className={isSignUp ? 'active' : ''} 
              onClick={() => setIsSignUp(true)}
            >
              Sign Up
            </button>
            <button 
              className={!isSignUp ? 'active' : ''} 
              onClick={() => setIsSignUp(false)}
            >
              Log In
            </button>
          </div>
        </div>

        <h2>{isSignUp ? 'Create An Account' : 'Welcome Back'}</h2>

        <form className="auth-form" onSubmit={handleSubmit}>
          {isSignUp && (
            <input type="text" name="username" placeholder="Username" onChange={handleChange} />
          )}
          
          <input type="email" name="email" placeholder="Enter Your Email" onChange={handleChange} />
          <input type="password" name="password" placeholder="Password" onChange={handleChange} />
          
          {isSignUp && (
            <input type="password" name="confirmPassword" placeholder="Confirm Password" onChange={handleChange} />
          )}

          <button type="submit" className="submit-btn">
            {isSignUp ? 'Create an Account' : 'Log In'}
          </button>
        </form>
      </div>
    </div>
  );
}