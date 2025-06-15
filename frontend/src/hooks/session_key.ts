// src/hooks/useSession.ts
import { useEffect, useState } from 'react';
import axios from 'axios';

const useSession = () => {
    const [sessionReady, setSessionReady] = useState(false);
    const [sessionKey, setSessionKey] = useState<string | null>(null);

    useEffect(() => {
        const initializeSession = async () => {
            try {
                // Call backend to trigger session creation
                await axios.get('http://127.0.0.1:8000/cart/', {
                    withCredentials: true,
                });

                // Extract sessionid from cookie
                const key = document.cookie
                    .split('; ')
                    .find(row => row.startsWith('sessionid='))
                    ?.split('=')[1];

                setSessionKey(key || null);
                setSessionReady(!!key);
            } catch (err) {
                console.error('Failed to initialize session:', err);
            }
        };

        initializeSession();
    }, []);

    return { sessionReady, sessionKey };
};

export default useSession;
