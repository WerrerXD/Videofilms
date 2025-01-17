import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, Text, Button, Loader, Center, Flex } from '@mantine/core';
import NavBar from 'components/NavBar';
import EmptyState from 'components/EmptyState';
import emptyStateIcon from 'assets/moviesEmptyState.svg';
import {useSelector} from "react-redux"; // Пустое состояние, если список лицензий пуст

const LicensesPage = () => {
    const isAdmin = useSelector((state) => state.movie.isAdmin);
    const navigate = useNavigate();
    const [licenses, setLicenses] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchLicenses = async () => {
            setIsLoaded(false);
            try {
                const response = await fetch('http://localhost:5108/Licenses/GetActualLicenses', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setLicenses(data);
                } else {
                    setError('Ошибка при получении активных лицензий.');
                }
            } catch (err) {
                console.error('Ошибка при получении данных:', err);
                setError('Ошибка при загрузке активных лицензий.');
            } finally {
                setIsLoaded(true);
            }
        };

        const checkAuthStatus = async () => {
            try {
                const response = await fetch('http://localhost:5108/Users/CheckAuth', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setIsLoggedIn(data.isAuthenticated);
                } else {
                    setIsLoggedIn(false);
                }
            } catch (error) {
                console.error('Ошибка проверки авторизации:', error);
                setIsLoggedIn(false);
            }
        };

        fetchLicenses();
        checkAuthStatus();
    }, []);

    const renderLicenses = () => {
        if (!isLoaded) {
            return (
                <Center w="100%" h="100%">
                    <Loader />
                </Center>
            );
        }

        if (licenses.length === 0) {
            return (
                <EmptyState icon={emptyStateIcon} text="У вас нет активных лицензий." />
            );
        }

        return (
            <Grid gutter="md">
                {licenses.map((license) => (
                    <Grid.Col key={license.id} span={4}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Card.Section inheritPadding py="xs">
                                <Text weight={500} size="lg" align="center" mt="sm">
                                    {license.movieName}
                                </Text>
                                <Text color="dimmed" size="sm" mt="xs">
                                    Лицензия: {license.licenseName}
                                </Text>
                                <Text mt="xs">
                                    Период действия: {new Date(license.startDate).toLocaleDateString()} -
                                    {license.endDate === '9999-12-31T23:59:59.9999999' ? 'Навсегда' : new Date(license.endDate).toLocaleDateString()}
                                </Text>
                            </Card.Section>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        );
    };

    return (
        <>
            <NavBar />
            <Flex h="fit-content" direction="column" p="1% 6%" ml="19.4%" gap="24px">
                <nav className="bg-purple-300 text-white p-4 flex justify-between items-center rounded-xl">
                    <h1 className="text-lg font-bold">КиноМагазин</h1>
                    <div className="flex gap-4">
                        {isLoggedIn && isAdmin && (
                            <button
                                onClick={() => navigate('/admin')}
                                className="bg-green-600 px-4 py-2 rounded hover:bg-green-700"
                            >
                                Админ панель
                            </button>
                        )}
                        {isLoggedIn ? (
                            <button
                                onClick={() => navigate('/logout')}
                                className="bg-red-600 px-4 py-2 rounded hover:bg-red-700"
                            >
                                Выйти
                            </button>
                        ) : (
                            <button
                                onClick={() => navigate('/login')}
                                className="bg-blue-600 px-4 py-2 rounded hover:bg-blue-700"
                            >
                                Войти
                            </button>
                        )}
                    </div>
                </nav>
                <h1>Активные лицензии</h1>
                {error && <Text color="red">{error}</Text>}
                {renderLicenses()}
            </Flex>
        </>
    );
};

export default LicensesPage;
