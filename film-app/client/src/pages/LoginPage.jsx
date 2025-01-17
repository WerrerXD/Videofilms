import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const LoginPage = () => {
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [is2FA, setIs2FA] = useState(false); // Состояние для проверки, требуется ли 2FA
    const [twoFactorCode, setTwoFactorCode] = useState('');
    const [error, setError] = useState('');
    const [isAdmin, setIsAdmin] = useState(false); // Состояние для проверки, является ли пользователь админом
    const [isLoggedIn, setIsLoggedIn] = useState(false); // Состояние для входа пользователя
    const navigate = useNavigate();

    useEffect(() => {
        const checkAdminStatus = () => {
            const cookies = document.cookie.split('; ');
            const adminCookie = cookies.find(cookie => cookie.startsWith('IsAdmin='));

            if (adminCookie) {
                const isAdminValue = adminCookie.split('=')[1];
                setIsAdmin(isAdminValue === 'Yes');
            }
        };

        checkAdminStatus();
    }, []);

    // Обработчик отправки формы
    const handleLoginSubmit = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5108/Users/Login?email=${email}&password=${password}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                // Если нужно пройти 2FA
                const message = await response.text();
                if (message.includes('2FA required')) {
                    setIs2FA(true);  // Устанавливаем флаг для отображения поля для ввода кода
                } else {
                    alert('Вход выполнен успешно!');
                    setIsLoggedIn(true);
                    navigate('/');
                    window.location.reload();// Перенаправление на главную страницу
                }
            } else {
                setError('Ошибка входа. Проверьте данные.');
            }
        } catch (error) {
            console.error('Login error:', error);
            setError('Ошибка сервера.');
        }
    };

    // Обработчик для проверки кода 2FA
    const handleVerify2FACode = async (e) => {
        e.preventDefault();
        try {
            const response = await fetch(`http://localhost:5108/Users/VerifyTwoFactorCode?email=${email}&code=${twoFactorCode}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                alert('Аутентификация успешна!');
                setIsLoggedIn(true);
                navigate('/'); // Перенаправление на главную страницу
            } else {
                alert('Неверный или истекший код 2FA');
            }
        } catch (error) {
            console.error('2FA error:', error);
            alert('Ошибка сервера.');
        }
    };

    return (
        <div className="min-h-screen flex flex-col justify-center items-center bg-gray-100">
            <div className="max-w-md w-full bg-white p-6 rounded shadow-md">
                <h2 className="text-2xl font-bold text-center mb-6">Вход</h2>

                {!is2FA ? (
                    // Страница ввода данных пользователя (email и password)
                    <form onSubmit={handleLoginSubmit} className="space-y-4">
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
                                Электронная почта
                            </label>
                            <input
                                id="email"
                                type="email"
                                value={email}
                                onChange={(e) => setEmail(e.target.value)}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <div>
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
                                Пароль
                            </label>
                            <input
                                id="password"
                                type="password"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                        >
                            Войти
                        </button>
                    </form>
                ) : (
                    // Страница для ввода кода 2FA
                    <form onSubmit={handleVerify2FACode} className="space-y-4">
                        <div>
                            <label htmlFor="twoFactorCode" className="block text-sm font-medium text-gray-700">
                                Введите код из письма
                            </label>
                            <input
                                id="twoFactorCode"
                                type="text"
                                value={twoFactorCode}
                                onChange={(e) => setTwoFactorCode(e.target.value)}
                                required
                                className="w-full mt-1 p-2 border border-gray-300 rounded-md"
                            />
                        </div>
                        <button
                            type="submit"
                            className="w-full bg-indigo-600 text-white py-2 px-4 rounded hover:bg-indigo-700"
                        >
                            Подтвердить
                        </button>
                    </form>
                )}

                {error && <p className="mt-4 text-center text-sm text-red-500">{error}</p>}

                {!is2FA && (
                    <p className="mt-4 text-center text-sm text-gray-500">
                        Нет аккаунта?{' '}
                        <button
                            onClick={() => navigate('/register')}
                            className="font-medium text-indigo-600 hover:text-indigo-500"
                        >
                            Зарегистрироваться
                        </button>
                    </p>
                )}
                
            </div>
        </div>
    );
};

export default LoginPage;
