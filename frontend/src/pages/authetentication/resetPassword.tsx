import React, { useState } from 'react';
import axios from '../../utils/axios';
import { toast } from 'react-toastify';
import { useParams } from 'react-router-dom';

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
    <div>
      <h2>Set New Password</h2>
      <input title='newPassword' value={newPassword} onChange={(e) => setNewPassword(e.target.value)} type="password" />
      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
}

export default Reset
