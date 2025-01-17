import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Grid, Card, Text, Button, Loader, Center, Flex, Rating, Modal, Textarea } from '@mantine/core';
import NavBar from 'components/NavBar';
import {useSelector} from "react-redux";

const WatchedMoviesPage = () => {
    const isAdmin = useSelector((state) => state.movie.isAdmin);
    const navigate = useNavigate();
    const [movies, setMovies] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [opened, setOpened] = useState(false);
    const [selectedMovieId, setSelectedMovieId] = useState(null);
    const [rating, setRating] = useState(0);
    const [comment, setComment] = useState('');

    useEffect(() => {
        const fetchWatchedMovies = async () => {
            setIsLoaded(false);
            try {
                const response = await fetch('http://localhost:5108/Reviews/GetWatchedMovies', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setMovies(data);
                } else {
                    setError('Ошибка при получении купленных фильмов.');
                }
            } catch (err) {
                console.error('Ошибка при получении данных:', err);
                setError('Ошибка при загрузке купленных фильмов.');
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

        fetchWatchedMovies();
        checkAuthStatus();
    }, []);

    const handleAddReview = async (movieId) => {
        if (rating === 0) {
            alert('Минимальная оценка - 1 звезда. Пожалуйста, выберите рейтинг.');
            return;
        }

        try {
            const response = await fetch(`http://localhost:5108/Reviews/AddReviewToWatchedMovie?movieId=${movieId}&rating=${rating}&comment=${comment}`, {
                method: 'PUT',
                credentials: 'include',
            });

            if (response.ok) {
                setOpened(false);
                setRating(0);
                setComment('');
                alert('Отзыв добавлен!');
            } else {
                setError('Не удалось добавить отзыв.');
            }
        } catch (err) {
            setError('Ошибка при добавлении отзыва.');
            console.error(err);
        }
    };

    const renderMovies = () => {
        if (!isLoaded) {
            return (
                <Center w="100%" h="100%">
                    <Loader />
                </Center>
            );
        }

        if (movies.length === 0) {
            return (
                <Text>Список купленных фильмов пуст.</Text>
            );
        }

        return (
            <Grid gutter="md">
                {movies.map((movie) => (
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
                                color="blue"
                                size="xs"
                                onClick={() => {
                                    setSelectedMovieId(movie.id);
                                    setOpened(true);
                                }}
                                mt="sm"
                            >
                                Оставить отзыв
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
                <h1>Купленные фильмы</h1>
                {error && <Text color="red">{error}</Text>}
                {renderMovies()}

                <Modal
                    opened={opened}
                    onClose={() => setOpened(false)}
                    title="Оставить отзыв"
                >
                    <Rating
                        value={rating}
                        onChange={(value) => setRating(value)}
                    />
                    <Textarea
                        value={comment}
                        onChange={(event) => setComment(event.currentTarget.value)}
                        placeholder="Напишите ваш отзыв"
                        mt="sm"
                    />
                    <Button
                        color="green"
                        onClick={() => handleAddReview(selectedMovieId)}
                        mt="sm"
                    >
                        Отправить
                    </Button>
                </Modal>
            </Flex>
        </>
    );
};

export default WatchedMoviesPage;
