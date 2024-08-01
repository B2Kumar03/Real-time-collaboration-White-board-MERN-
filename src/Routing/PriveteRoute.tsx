import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

type Props = {
    children: React.ReactNode;
};

const PrivateRoute: React.FC<Props> = ({ children }) => {
    const navigate = useNavigate();
    const isAuthenticated = localStorage.getItem('auth') === 'true';

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/login', { replace: true });
        }
    }, [isAuthenticated, navigate]);

    // Render nothing if not authenticated
    if (!isAuthenticated) {
        return null;
    }

    return <>{children}</>;
};

export default PrivateRoute;
