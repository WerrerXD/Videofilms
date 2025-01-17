import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Register = () => {
    const navigate = useNavigate();
    const [formData, setFormData] = useState({
        email: "",
        password: "",
        fullName: "",
    });

    const [error, setError] = useState("");
    const [success, setSuccess] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;
        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setSuccess(false);

        const { email, password, fullName } = formData;

        try {
            const response = await fetch(
                `http://localhost:5108/Users/Register?email=${email}&password=${password}&fullName=${fullName}`,
                { method: "POST" }
            );

            if (!response.ok) {
                throw new Error("Не удалось зарегистрироваться. Проверьте данные.");
            }

            setSuccess(true);
            setTimeout(() => navigate('/login'), 2000); // Перенаправление через 2 секунды
        } catch (err) {
            setError(err.message || "Произошла ошибка.");
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white rounded-lg shadow-md p-6">
                <h2 className="text-2xl font-bold mb-6 text-center">Регистрация</h2>
                {error && <p className="text-red-500 text-center mb-4">{error}</p>}
                {success && (
                    <p className="text-green-500 text-center mb-4">
                        Регистрация прошла успешно! Перенаправление...
                    </p>
                )}
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label
                            htmlFor="email"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Email
                        </label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            required
                            value={formData.email}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="password"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Пароль
                        </label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            required
                            value={formData.password}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <div>
                        <label
                            htmlFor="fullName"
                            className="block text-sm font-medium text-gray-700"
                        >
                            Полное имя
                        </label>
                        <input
                            id="fullName"
                            name="fullName"
                            type="text"
                            required
                            value={formData.fullName}
                            onChange={handleChange}
                            className="mt-1 block w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm placeholder-gray-400 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500 sm:text-sm"
                        />
                    </div>
                    <button
                        type="submit"
                        className="w-full flex justify-center py-2 px-4 border border-transparent rounded-md shadow-sm text-sm font-medium text-white bg-indigo-600 hover:bg-indigo-500 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500"
                    >
                        Зарегистрироваться
                    </button>
                </form>
                <p className="mt-4 text-center text-sm text-gray-500">
                    Уже есть аккаунт?{" "}
                    <a
                        href="/login"
                        className="text-indigo-600 hover:underline"
                    >
                        Войти
                    </a>
                </p>
            </div>
        </div>
    );
};

export default Register;
