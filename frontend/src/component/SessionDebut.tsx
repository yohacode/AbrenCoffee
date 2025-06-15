// components/SessionDebug.tsx
import React from 'react';
import { useCookieDebug } from '../hooks/useCookieDebug';

const SessionDebug: React.FC = () => {
  const { cookies, localTokens } = useCookieDebug();

  return (
    <div style={{
      backgroundColor: '#f9f9f9',
      border: '1px solid #ccc',
      padding: '1rem',
      fontSize: '0.9rem',
      marginBottom: '1rem',
    }}>
      <h4>🛠 Session Debug Info</h4>
      <p><strong>Cookie: sessionid</strong> — {cookies.sessionid || '❌ Not Found'}</p>
      <p><strong>Cookie: csrftoken</strong> — {cookies.csrftoken || '❌ Not Found'}</p>
      <p><strong>LocalStorage: access_token</strong> — {localTokens.access_token || '❌ Not Found'}</p>
      <p><strong>LocalStorage: refresh_token</strong> — {localTokens.refresh_token || '❌ Not Found'}</p>
    </div>
  );
};

export default SessionDebug;
