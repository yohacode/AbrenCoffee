// hooks/useCookieDebug.ts
import { useEffect, useState } from 'react';

function getCookie(name: string): string | null {
  const cookieString = document.cookie;
  const cookies = cookieString.split(';').map(cookie => cookie.trim());
  for (const cookie of cookies) {
    if (cookie.startsWith(`${name}=`)) {
      return decodeURIComponent(cookie.split('=')[1]);
    }
  }
  return null;
}

export const useCookieDebug = () => {
  const [cookies, setCookies] = useState<{ [key: string]: string | null }>({});
  const [localTokens, setLocalTokens] = useState<{ [key: string]: string | null }>({});

  useEffect(() => {
    setCookies({
      sessionid: getCookie('sessionid'),
      csrftoken: getCookie('csrftoken'),
    });

    setLocalTokens({
      access_token: localStorage.getItem('access_token'),
      refresh_token: localStorage.getItem('refresh_token'),
    });
  }, []);

  return { cookies, localTokens };
};
