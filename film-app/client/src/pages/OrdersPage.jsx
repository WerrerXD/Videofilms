import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Flex, Group, Card, Text, Button, Loader, Center, Grid, Modal, Select } from '@mantine/core';
import NavBar from 'components/NavBar';
import EmptyState from 'components/EmptyState';
import emptyStateIcon from 'assets/moviesEmptyState.svg';
import { useSelector } from "react-redux";
import { jsPDF } from "jspdf";  // Импортируем jsPDF

const OrdersPage = () => {
    const isAdmin = useSelector((state) => state.movie.isAdmin);
    const navigate = useNavigate();
    const [orders, setOrders] = useState([]);
    const [isLoaded, setIsLoaded] = useState(false);
    const [error, setError] = useState(null);
    const [modalOpened, setModalOpened] = useState(false);
    const [paymentModalOpened, setPaymentModalOpened] = useState(false);
    const [orderDetails, setOrderDetails] = useState([]);
    const [paymentMethods, setPaymentMethods] = useState([]);
    const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
    const [currentOrder, setCurrentOrder] = useState(null);
    const [isLoggedIn, setIsLoggedIn] = useState(false);
    const [paymentInfoModalOpened, setPaymentInfoModalOpened] = useState(false);
    const [paymentInfo, setPaymentInfo] = useState(null);

    useEffect(() => {
        const fetchOrders = async () => {
            setIsLoaded(false);
            try {
                const response = await fetch('http://localhost:5108/Movies/GetOrders', {
                    method: 'GET',
                    credentials: 'include',
                });

                if (response.ok) {
                    const data = await response.json();
                    setOrders(data);
                } else {
                    setError('Ошибка загрузки заказов. Попробуйте позже.');
                }
            } catch (err) {
                setError('Ошибка при загрузке заказов.');
                console.error(err);
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

        fetchOrders();
        checkAuthStatus();
    }, []);

    const fetchPaymentMethods = async () => {
        try {
            const response = await fetch('http://localhost:5108/Payments/GetAllPaymentMethods', {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setPaymentMethods(data);
            } else {
                alert('Ошибка загрузки способов оплаты.');
            }
        } catch (error) {
            console.error('Ошибка загрузки способов оплаты:', error);
        }
    };

    const handleGetOrderDetails = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5108/Movies/GetOrderItems?orderId=${orderId}`, {
                method: 'POST',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setOrderDetails(data);
                setModalOpened(true);
            } else {
                alert('Ошибка получения информации о заказе.');
            }
        } catch (error) {
            console.error('Ошибка получения информации о заказе:', error);
            alert('Ошибка получения информации о заказе.');
        }
    };

    const handleOpenPaymentModal = async (order) => {
        setCurrentOrder(order);
        await fetchPaymentMethods();
        setPaymentModalOpened(true);
    };

    const handlePayOrder = async () => {
        if (!currentOrder || !selectedPaymentMethod) {
            alert('Выберите способ оплаты.');
            return;
        }

        try {
            const response = await fetch(
                `http://localhost:5108/Movies/PayForOrder?orderId=${currentOrder.id}&price=${currentOrder.price}&paymentMethodId=${selectedPaymentMethod}`,
                {
                    method: 'POST',
                    credentials: 'include',
                }
            );

            if (response.ok) {
                alert('Заказ успешно оплачен!');
                setOrders(
                    orders.map(order =>
                        order.id === currentOrder.id ? { ...order, status: 'IsPaid' } : order
                    )
                );
                setPaymentModalOpened(false);
                setCurrentOrder(null);
                setSelectedPaymentMethod(null);
            } else {
                alert('Ошибка оплаты заказа.');
            }
        } catch (error) {
            console.error('Ошибка оплаты заказа:', error);
            alert('Ошибка оплаты заказа.');
        }
    };

    const handleGetPaymentInfo = async (orderId) => {
        try {
            const response = await fetch(`http://localhost:5108/Payments/GetInfoAboutOrderPayment?orderId=${orderId}`, {
                method: 'GET',
                credentials: 'include',
            });

            if (response.ok) {
                const data = await response.json();
                setPaymentInfo(data);
                setPaymentInfoModalOpened(true);
            } else {
                alert('Ошибка получения информации об оплате.');
            }
        } catch (error) {
            console.error('Ошибка получения информации об оплате:', error);
            alert('Ошибка получения информации об оплате.');
        }
    };

    // Функция экспорта в PDF
    const exportOrderToPDF = async (order, paymentInfo) => {
        
        if (!order.id || typeof order.id !== 'number') {
            console.error('Неверный идентификатор заказа');
            return;
        }
        // Получаем заказ по ID
        const response = await fetch(`http://localhost:5108/Movies/GetOrderItems?orderId=${order.id}`, {
            method: 'POST',
            credentials: 'include',
        });

        if (!response.ok) {
            alert('Ошибка получения информации о заказе.');
            return;
        }

        const data = await response.json();
        //setOrderDetails(data);

        const response2 = await fetch(`http://localhost:5108/Payments/GetInfoAboutOrderPayment?orderId=${order.id}`, {
            method: 'GET',
            credentials: 'include',
        });
        
        const data2 = await response2.json();
            //setPaymentInfo(data2);

        const doc = new jsPDF();
        doc.addFont('/FreeSerif.ttf', 'FreeSerif', 'normal');
        doc.setFont('FreeSerif');

        // Заголовок с номером заказа
        doc.setFontSize(18);
        doc.text(`Заказ №${order.id}`, 14, 20);

        // Дата заказа
        doc.setFontSize(12);
        doc.text(`Дата заказа: ${new Date(order.date).toLocaleString()}`, 14, 30);

        // Количество и общая цена
        doc.text(`Количество товаров: ${order.quantity}`, 14, 40);
        doc.text(`Общая цена: ${order.price.toFixed(2)} р.`, 14, 50);

        // Статус заказа
        doc.text(`Статус: ${order.status === 'IsPaid' ? 'Оплачен' : 'Активен'}`, 14, 60);

        // Заголовок списка фильмов
        doc.setFontSize(16);
        doc.text('Список фильмов в заказе:', 14, 70);

        doc.setFontSize(12);
        let yOffset = 80; // Начальная высота для списка фильмов

        // Перебор фильмов в заказе
        data.forEach(item => {
            doc.text(`Фильм: ${item.movieName}`, 14, yOffset);
            doc.text(`Лицензия: ${item.licenseName}`, 14, yOffset + 10);
            doc.text(`Количество: ${item.quantity}`, 14, yOffset + 20);
            doc.text(`Цена: ${item.price.toFixed(2)} р.`, 14, yOffset + 30);
            yOffset += 40;

            // Добавляем горизонтальную линию для разделения
            doc.setLineWidth(0.5);
            doc.line(14, yOffset, 195, yOffset);
            yOffset += 10; // Отступ после линии
        });
        console.log(data2);
        // Заголовок информации о платеже
        if (data2) {
            doc.addPage();
            doc.setFontSize(16);
            doc.text('Информация о платеже:', 14, 20);
            doc.setFontSize(12);

            let paymentYOffset = 30; // Начальная высота для данных о платеже

            // Перебор данных о платеже
            const paymentDetails = [
                { label: 'Дата оплаты', value: new Date(data2.date).toLocaleString() },
                { label: 'Сумма', value: `${data2.price.toFixed(2)} р.` },
                { label: 'Способ оплаты', value: data2.paymentMethod }
            ];

            paymentDetails.forEach(item => {
                doc.text(`${item.label}: ${item.value}`, 14, paymentYOffset);
                paymentYOffset += 10;
            });
        }

        // Сохранение PDF
        doc.save(`order_${order.id}.pdf`);
    };


    const renderOrderDetails = () => {
        if (orderDetails.length === 0) {
            return <Text>Список фильмов пуст.</Text>;
        }

        return (
            <Grid gutter="md">
                {orderDetails.map((item) => (
                    <Grid.Col key={item.id} span={6}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Text weight={500} size="lg" align="center">
                                {item.movieName}
                            </Text>
                            <Text mt="xs">Лицензия: {item.licenseName}</Text>
                            <Text mt="xs">Количество: {item.quantity}</Text>
                            <Text mt="xs" weight={700}>Цена: {item.price.toFixed(2)} р.</Text>
                        </Card>
                    </Grid.Col>
                ))}
            </Grid>
        );
    };

    const renderOrders = () => {
        if (!isLoaded) {
            return (
                <Center w="100%" h="100%">
                    <Loader />
                </Center>
            );
        }

        if (orders.length === 0) {
            return (
                <EmptyState icon={emptyStateIcon} text="У вас пока нет заказов." />
            );
        }

        return (
            <Grid gutter="md">
                {orders.map((order) => (
                    <Grid.Col key={order.id} span={4}>
                        <Card shadow="sm" padding="lg" radius="md" withBorder>
                            <Text weight={500} size="lg" align="center">
                                Заказ #{order.id}
                            </Text>
                            <Text mt="xs">Дата: {new Date(order.date).toLocaleString()}</Text>
                            <Text mt="xs">Количество: {order.quantity}</Text>
                            <Text mt="xs" weight={700}>Цена: {order.price.toFixed(2)} р.</Text>
                            <Text mt="xs" color={order.status === 'IsPaid' ? 'green' : 'orange'}>
                                Статус: {order.status === 'IsPaid' ? 'Оплачен' : 'Активен'}
                            </Text>
                            <Group position="right" mt="md">
                                <Button size="xs" onClick={() => handleGetOrderDetails(order.id)}>
                                    Информация
                                </Button>
                                {order.status !== 'IsPaid' && (
                                    <Button size="xs" color="green" onClick={() => handleOpenPaymentModal(order)}>
                                        Оплатить
                                    </Button>
                                )}
                                {order.status === 'IsPaid' && (
                                <Button size="xs" color="blue" onClick={() => exportOrderToPDF(order, paymentInfo)}>
                                    Экспорт в PDF
                                </Button>
                                )}
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
                <h1>Мои заказы</h1>
                {error && <Text color="red">{error}</Text>}
                {renderOrders()}
            </Flex>

            <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Детали заказа">
                {renderOrderDetails()}
            </Modal>

            <Modal
                opened={paymentModalOpened}
                onClose={() => setPaymentModalOpened(false)}
                title="Выбор способа оплаты"
            >
                <Select
                    data={paymentMethods.map(method => ({
                        value: method.paymentMethodId.toString(),
                        label: method.name,
                        description: method.description,
                    }))}
                    placeholder="Выберите способ оплаты"
                    onChange={(value) => setSelectedPaymentMethod(value)}
                />
                <Button
                    mt="md"
                    disabled={!selectedPaymentMethod}
                    onClick={handlePayOrder}
                >
                    Оплатить
                </Button>
            </Modal>

            <Modal opened={paymentInfoModalOpened} onClose={() => setPaymentInfoModalOpened(false)} title="Информация о платеже">
                <Text>Дата оплаты: {paymentInfo?.date}</Text>
                <Text>Сумма: {paymentInfo?.price}</Text>
                <Text>Способ оплаты: {paymentInfo?.paymentMethod}</Text>
            </Modal>
        </>
    );
};

export default OrdersPage;
