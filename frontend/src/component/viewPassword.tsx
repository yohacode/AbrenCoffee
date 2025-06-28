import React, { useState } from 'react';

interface PasswordInputProps {
  id?: string;
  name: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  required: boolean;
}

const PasswordInput: React.FC<PasswordInputProps> = ({ id, name, value, onChange, placeholder }) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="password-wrapper">
      <input
        id={id || name}
        type={showPassword ? 'text' : 'password'}
        name={name}
        value={value}
        onChange={onChange}
        placeholder={placeholder || 'Enter password'}
        className="password-input"
      />
      <button
        type="button"
        onClick={() => setShowPassword(prev => !prev)}
        className="toggle-btn"
      >
        {showPassword ? 'Hide' : 'Show'}
      </button>
    </div>
  );
};

export default PasswordInput;
