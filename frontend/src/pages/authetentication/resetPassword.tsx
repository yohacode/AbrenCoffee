import React, { useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';
import './resetPassword.css';
import Backbutton from '../../component/backbutton';
import PasswordInput from '../../component/viewPassword';

const Reset:React.FC = () => {
  const { uid, token } = useParams();
  const [newPassword, setNewPassword] = useState("");

  const handleReset = async () => {
    try {
      await axios.post("/api/auth/reset-password/", {
        uid,
        token,
        new_password: newPassword,
      });
      toast.success("Password reset successfully.");
    } catch {
      toast.error("Reset failed.");
    }
  };

  return (
    <div className='reset-password'>
      <Backbutton />
      <div className="reset-passowrd-box">
        <h2>Set New Password</h2>
        <PasswordInput 
          name='newPassword' 
          value={newPassword} 
          onChange={(e) => setNewPassword(e.target.value)} 
          className='reset-password-input'
          required
          />
        <button onClick={handleReset}>Reset Password</button>
      </div>
    </div>
  );
}

export default Reset
