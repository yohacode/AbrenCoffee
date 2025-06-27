import React, { useState } from 'react';
import { toast } from 'react-toastify';
import axios from '../../utils/axios';

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
    <div>
      <h2>Forgot Password</h2>
      <input value={email} onChange={(e) => setEmail(e.target.value)} placeholder="Your email" />
      <button onClick={handleRequest}>Send Reset Link</button>
    </div>
  );
}

export default ForgetPassword
