import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, Text, Button, Loader, Center, Flex } from '@mantine/core';
import NavBar from 'components/NavBar';
import EmptyState from 'components/EmptyState';
import emptyStateIcon from 'assets/moviesEmptyState.svg'; // Пустое состояние, если список желаемого пуст
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import {useSelector} from "react-redux";

const WishlistPage = () => {
    const isAdmin = useSelector((state) => state.movie.isAdmin);
    const navigate = useNavigate();
    const [wishlistItems, setWishlistItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchWishlist = async () => {
            setIsLoaded(false);
            try {
                const response = await fetch('http://localhost:5108/Wishlists/GetMoviesFromWishlist', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setWishlistItems(data);
                } else {
                    setError('Ошибка при получении списка желаемого.');
                }
            } catch (err) {
                console.error('Ошибка при получении данных:', err);
                setError('Ошибка при загрузке списка желаемого.');
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

        fetchWishlist();
        checkAuthStatus();
    }, []);

    const handleRemoveFromWishlist = async (movieId) => {
        try {
            const response = await fetch(`http://localhost:5108/Wishlists/DeleteMovieInWishlist?movieId=${movieId}`, {
                method: 'DELETE',
                credentials: 'include',
            });

            if (response.ok) {
                setWishlistItems(wishlistItems.filter(item => item.id !== movieId));
                console.log(`Фильм с id ${movieId} удален из списка.`);
            } else {
                setError('Не удалось удалить фильм из списка желаемого.');
                console.error('Ошибка при удалении:', response);
            }
        } catch (err) {
            setError('Ошибка при удалении фильма из списка желаемого.');
            console.error('Ошибка при удалении фильма из списка желаемого:', err);
        }
    };

    const renderWishlistItems = () => {
        if (!isLoaded) {
            return (
                <Center w="100%" h="100%">
                    <Loader />
                </Center>
            );
        }

        if (wishlistItems.length === 0) {
            return (
                <EmptyState icon={emptyStateIcon} text="Ваш список желаемого пуст." />
            );
        }

        return (
            <Grid gutter="md">
                {wishlistItems.map((movie) => (
                    <Grid.Col key={movie.id} span={4}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Card.Section inheritPadding py="xs">
                                <img
                                    src={`http://localhost:5108${movie.imagePath}`}
                                    alt={movie.title}
                                    style={{ width: '100%', height: 'auto', borderRadius: '8px' }}
                                />
                            </Card.Section>
                            <Text weight={500} size="lg" align="center" mt="sm">
                                {movie.title}
                            </Text>
                            <Text color="dimmed" size="sm" mt="xs">
                                Жанр: {movie.genre}
                            </Text>
                            <Text mt="xs">Цена: {movie.price} р.</Text>
                            <Text mt="xs" color="dimmed">{movie.studio} ({movie.dateRelease})</Text>
                            <Button
                                color="red"
                                size="xs"
                                onClick={() => handleRemoveFromWishlist(movie.id)}
                                mt="sm"
                            >
                                Удалить из списка желаемого
                            </Button>
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
                <h1>Список желаемого</h1>
                {error && <Text color="red">{error}</Text>}
                {renderWishlistItems()}
            </Flex>
        </>
    );
};

export default WishlistPage;
