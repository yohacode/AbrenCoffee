import { toast } from 'react-toastify';
import axios from '../../utils/axios';
import { useState } from 'react';
import React from 'react';
import { useNavigate } from 'react-router-dom';
import './changePassword.css';
import Backbutton from '../../component/backbutton';

const ChangePassword:React.FC = () => {
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [confirmPassword, setConfirmPassword] = useState("");
    const navigate = useNavigate();

    const handleChangePassword = async () => {
    try {
        const res = await axios.post('/api/auth/change-password/', {
        old_password: oldPassword,
        new_password: newPassword,
        confirm_password: confirmPassword,
        });
        toast.success(res.data.success);
        navigate(-1);
    } catch {
        toast.error("Error changing password");
    }
    };

  return (
    <div className="change-password">
      <Backbutton />
      <h2 className="change-password-title">Login</h2>
      <form onSubmit={handleChangePassword} className="change-password-box">
        <input
          type="password"
          value={oldPassword}
          onChange={(e) => setOldPassword(e.target.value)}
          placeholder="Old Password"
          className="change-password-input"
          required
        />
        <input
          type="password"
          value={newPassword}
          onChange={(e) => setNewPassword(e.target.value)}
          placeholder="New Password"
          className="change-password-input"
          required
        />
        <input
          type="password"
          value={confirmPassword}
          onChange={(e) => setConfirmPassword(e.target.value)}
          placeholder="Confirm Password"
          className="change-password-input"
          required
        />
        <button type="submit" className="change-password-button">Submit</button>
      </form>
    </div>
  )
}

export default ChangePassword


