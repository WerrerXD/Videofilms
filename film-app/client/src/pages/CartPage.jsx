import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import {useDispatch, useSelector} from 'react-redux';
import { Flex, Group, Card, Text, Button, Loader, Center, Grid } from '@mantine/core';
import NavBar from 'components/NavBar';
import EmptyState from 'components/EmptyState';
import emptyStateIcon from 'assets/moviesEmptyState.svg';
import { getCartItems } from 'http/moviesAPI';

const CartPage = () => {
    const isAdmin = useSelector((state) => state.movie.isAdmin);
    const navigate = useNavigate();
    const dispatch = useDispatch();
    const [cartItems, setCartItems] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);

    useEffect(() => {
        const fetchCart = async () => {
            setIsLoaded(false);
            try {
                const data = await getCartItems();
                setCartItems(data);
                setIsLoaded(true);
            } catch (err) {
                setError('Ваша корзина пуста. Добавьте фильмы, чтобы продолжить!');
                console.error(err);
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

        fetchCart();
        checkAuthStatus();
    }, [dispatch]);

    const handleRemoveItem = async (itemId) => {
        try {
            const response = await fetch(`http://localhost:5108/Movies/RemoveItemFromCart?itemId=${itemId}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                setCartItems(cartItems.filter(item => item.id !== itemId));
            } else {
                setError('Не удалось удалить элемент из корзины.');
            }
        } catch (err) {
            setError('Ошибка при удалении элемента из корзины.');
            console.error(err);
        }
    };

    const handleCheckout = async () => {
        if (!isLoggedIn) {
            alert('Для оформления заказа необходимо войти в аккаунт.');
            return;
        }

        try {
            const response = await fetch('http://localhost:5108/Movies/AddItemsFromCartToOrder', {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                alert('Заказ успешно оформлен!');
                setCartItems([]); // Очищаем корзину после оформления заказа
            } else {
                const errorData = await response.json();
                alert(`Ошибка при оформлении заказа: ${errorData.message || 'Неизвестная ошибка'}`);
            }
        } catch (error) {
            console.error('Ошибка при оформлении заказа:', error);
            alert('Ошибка при оформлении заказа. Попробуйте позже.');
        }
    };


    const renderCartItems = () => {
        if (!isLoaded) {
            return (
                <Center w="100%" h="100%">
                    <Loader />
                </Center>
            );
        }

        if (cartItems.length === 0) {
            return (
                <EmptyState icon={emptyStateIcon} text="Ваша корзина пуста. Добавьте фильмы, чтобы продолжить!" />
            );
        }

        return (
            <Grid gutter="md">
                {cartItems.map((item) => (
                    <Grid.Col key={item.id} span={4}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Card.Section inheritPadding py="xs">
                                <Text weight={500} size="lg" align="center">
                                    {item.movieName}
                                </Text>
                            </Card.Section>
                            <Text color="dimmed" size="sm" mt="xs">
                                Лицензия: {item.licenseName}
                            </Text>
                            <Text mt="xs">Количество: {item.quantity}</Text>
                            <Text mt="xs" weight={700}>
                                Цена: {item.price.toFixed(2)} р.
                            </Text>
                            <Group position="right" mt="md">
                                <Button color="red" size="xs" onClick={() => handleRemoveItem(item.id)}>
                                    Удалить
                                </Button>
                            </Group>
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
                <h1>Корзина</h1>
                {error && <Text color="red">{error}</Text>}
                {renderCartItems()}
                {cartItems.length > 0 && (
                    <Group justify="flex-end" mt="20px">
                        <Button color="green" onClick={handleCheckout}>
                            Оформить заказ
                        </Button>
                    </Group>
                )}
            </Flex>
        </>
    );
};

export default CartPage;
