import { useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";

const Logout: React.FC = () => {
    const navigate = useNavigate();

    useEffect(() => {
        localStorage.removeItem('access_token');

        navigate('/');
    }, [navigate]);

    return (
        <div>
            <h1>Logged out Successfully!</h1>
            <button><Link to='/login'>Log back in</Link></button>
        </div>
    );
};

export default Logout;