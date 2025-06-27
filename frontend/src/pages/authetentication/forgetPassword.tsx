import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';
import './forgetPassword.css';
import Backbutton from '../../component/backbutton';

const ForgetPassword:React.FC = () => {
    const [email, setEmail] = useState("");

  const handleRequest = async () => {
    try {
      await axios.post("/api/auth/request-password-reset/", { email });
      toast.success("Check your email for reset link.");
    } catch {
      toast.error("Error sending reset link");
    }
  };

   return (
    <div className='forget-password'>
      <Backbutton />
      <div className="forget-password-container">
        <h2 className='forget-password-title'>Forgot Password</h2>
        <input className='forget-password-input' value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" />
        <button className='forget-password-button' onClick={handleRequest}>Send Reset Link</button>
      </div>
    </div>
  );
}

export default ForgetPassword
