import { toast } from 'react-toastify';
import axios from '../../utils/axios';
import { useState } from 'react';
import React from 'react'

const ChangePassword:React.FC = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");

    const handleChangePassword = async () => {
    try {
        const res = await axios.post('/api/auth/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
        });
        toast.success(res.data.success);
    } catch {
        toast.error("Error changing password");
    }
    };

  return (
    <div className="login-container">
      <h2 className="login-title">Login</h2>
      <form onSubmit={handleChangePassword} className="login-box">
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Username"
          className="login-input"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="Password"
          className="login-input"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Password"
          className="login-input"
          required
        />
        <button type="submit" className="login-button">Login</button>
      </form>
      <div className="login-footer">
          <p>
            Forgot your password? <a href="/reset">Reset here</a>
          </p>
        </div>
    </div>
  )
}

export default ChangePassword


