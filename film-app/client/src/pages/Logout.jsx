import React, { useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const Logout = () => {
    const navigate = useNavigate();

    useEffect(() => {
        const logout = async () => {
            try {
                const response = await fetch('http://localhost:5108/Users/LogOut', {
                    method: 'POST', // Убедитесь, что метод совпадает с тем, что ожидает ваш API
                    credentials: 'include',
                });

                if (response.ok) {
                    // После успешного выхода перенаправляем на главную страницу
                    navigate('/');
                    window.location.reload();
                } else {
                    console.error('Не удалось выйти из системы.');
                }
            } catch (error) {
                console.error('Ошибка при попытке выхода:', error);
            }
        };
        
        logout();
    }, [navigate]);

    return (
        <div className="flex justify-center items-center min-h-screen">
            <p>Выход из системы...</p>
        </div>
    );
};

export default Logout;
