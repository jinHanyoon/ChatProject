import React, { useEffect, useState } from 'react'
import { Outlet, Navigate } from 'react-router-dom';
import useSession from '../../session.js';

function RequireAuth() {
    const isLogin = useSession((state) => state.isLogin);
    const checkSession = useSession((state) => state.checkSession);
    const [isLoading, setIsLoading] = useState(true);

    useEffect(() => {
        const init = async () => {
            await checkSession();
            setIsLoading(false);
        };
        init();
// eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    if (isLoading) return null;  // 세션 체크가 완료될 때까지 대기

    if (!isLogin) {
        return <Navigate to="/login" />;
    }

    return <Outlet />;
}

export default RequireAuth;