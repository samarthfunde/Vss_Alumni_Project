import React from 'react';
import { useNavigate } from 'react-router-dom';

const IsLogin = () => {
    const navigate = useNavigate();

    const handleLoginRedirect = () => {
        navigate('/login', { state: { action: 'navtologin' } });
    };

    return (
        <div className="d-flex flex-column justify-content-center align-items-center vh-100">
            {/* Using a simple emoji */}
            <h1 className="display-1">
                <span role="img" aria-label="sad emoji">😢</span>
            </h1>
            <h2>Please Sign In First</h2>
            <p className="lead"></p>
            <button onClick={handleLoginRedirect} className="btn btn-primary d-block mx-auto">
                Login
            </button>
        </div>
    );
};

export default IsLogin;
