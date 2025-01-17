import React, { useState, useEffect } from 'react';
import {Button, Modal, TextInput, Select, Flex, Group, Text, Card, Grid, FileInput, NumberInput} from '@mantine/core';
import NavBar from 'components/NavBar';
import $movies from "../http";

const AdminPanel = () => {
    const [modalType, setModalType] = useState(null); // 'add', 'edit', 'delete', 'read'
    const [entityType, setEntityType] = useState(null); // 'genres', 'movies', 'studios', 'licenses', 'users'
    const [entities, setEntities] = useState([]);
    const [formValues, setFormValues] = useState({});
    const [selectedEntity, setSelectedEntity] = useState(null);
    const [genres, setGenres] = useState([]);
    const [studios, setStudios] = useState([]);

    // Загружаем данные на основе типа сущности
    useEffect(() => {
        if (entityType) {
            fetchEntities();
        }

        if (entityType === 'movies') {
            fetchGenres();
            fetchStudios();
        }
    }, [entityType]);

    const fetchEntities = async () => {
        let url = '';
        switch (entityType) {
            case 'genres':
                url = 'http://localhost:5108/Genres/GetAllGenres';
                break;
            case 'movies':
                url = 'http://localhost:5108/Movies/GetAll';
                break;
            case 'studios':
                url = 'http://localhost:5108/Studios/GetAllStudios';
                break;
            case 'licenses':
                url = 'http://localhost:5108/Licenses/GetAllLicenses';
                break;
            case 'users':
                url = 'http://localhost:5108/Users/GetAll';
                break;
            case 'payments':
                url = 'http://localhost:5108/Payments/GetAllPaymentMethods';
                break;
            default:
                break;
        }
        const response = await fetch(url, {method: 'GET', credentials: 'include'});
        const data = await response.json();
        setEntities(data);
    };

    const fetchGenres = async () => {
        const {data} = await $movies.get('Genres/GetAllGenres');
        setGenres(data);
    };

    const fetchStudios = async () => {
        const {data} = await $movies.get('Studios/GetAllStudios');
        setStudios(data);
    };

    const handleOpenModal = (type) => {
        setModalType(type);
    };

    const handleCloseModal = () => {
        setModalType(null);
        setFormValues({});
        setSelectedEntity(null);
    };

    const handleSubmit = async () => {
        console.log(`Отправка ${modalType} для ${entityType}:`, formValues);

        const entityIdField = entityIdFieldMapping[entityType]; // Получаем правильное имя поля для идентификатора
        const entityId = selectedEntity ? selectedEntity[entityIdField] : null; // Используем выбранное значение для ID

        if (entityType === 'users') {
            alert('Для добавления пользователей используйте регистрацию.');
            return;
        }

        let url = '';
        let options = {
            method: 'PUT', // Используем PUT для добавления и редактирования
            credentials: 'include',
        };

        let formData = null; // Создаем FormData только для фильмов

        // Формируем URL и данные для разных типов сущностей
        if (modalType === 'add') {
            switch (entityType) {
                case 'genres':
                    url = `http://localhost:5108/Genres/AddGenre?name=${encodeURIComponent(formValues.name)}`;
                    options.headers = { 'Content-Type': 'application/json' };
                    options.body = JSON.stringify({ name: formValues.name }); // Отправляем данные в JSON
                    break;

                case 'movies': {
                    // Проверяем обязательные поля
                    if (!formValues.title || !formValues.genreId || !formValues.studioId) {
                        alert('Пожалуйста, заполните все обязательные поля.');
                        return;
                    }

                    // Собираем URL с учетом необязательных полей
                    url = `http://localhost:5108/Movies/Add?title=${encodeURIComponent(formValues.title)}` +
                        `&description=${encodeURIComponent(formValues.description || '')}` +
                        (formValues.dateRelease ? `&dateRelease=${formValues.dateRelease}` : '') +
                        (formValues.price ? `&price=${formValues.price}` : '') +
                        `&genreId=${String(formValues.genreId)}` +
                        `&studioId=${String(formValues.studioId)}`;

                    // Если есть изображение, используем FormData
                    formData = new FormData();
                    if (formValues.image) {
                        formData.append('image', formValues.image);
                    }
                    options.body = formData; // Отправляем через FormData
                    break;
                }

                case 'studios':
                    url = `http://localhost:5108/Studios/Add?name=${encodeURIComponent(formValues.name)}` +
                        `&country=${encodeURIComponent(formValues.country || '')}` +
                        `&yearFounded=${encodeURIComponent(formValues.yearFounded || '')}`;
                    options.headers = { 'Content-Type': 'application/json' };
                    options.body = JSON.stringify({
                        name: formValues.name,
                        country: formValues.country,
                        yearFounded: formValues.yearFounded,
                    });
                    break;

                case 'licenses':
                    url = `http://localhost:5108/Licenses/AddLicense?name=${encodeURIComponent(formValues.name)}` +
                        `&durationInHours=${formValues.durationInHours || ''}` +
                        `&priceMultiplier=${formValues.priceMultiplier || ''}`;
                    options.headers = { 'Content-Type': 'application/json' };
                    options.body = JSON.stringify({
                        name: formValues.name,
                        durationInHours: formValues.durationInHours,
                        priceMultiplier: formValues.priceMultiplier,
                    });
                    break;

                case 'payments':
                    url = `http://localhost:5108/Payments/AddPaymentMethod?name=${encodeURIComponent(formValues.name)}&description=${encodeURIComponent(formValues.description)}`;
                    break;

                default:
                    break;
            }
        } else if (modalType === 'edit') {
            switch (entityType) {
                case 'genres':
                    url = `http://localhost:5108/Genres/UpdateGenre?id=${entityId}&newName=${encodeURIComponent(formValues.name)}`;
                    break;
                case 'movies':
                    url = `http://localhost:5108/Movies/UpdateMovie?id=${entityId}&title=${encodeURIComponent(formValues.title)}` +
                        `&description=${encodeURIComponent(formValues.description || '')}` +
                        (formValues.dateRelease ? `&dateRelease=${formValues.dateRelease}` : '') +
                        (formValues.price ? `&price=${formValues.price}` : '') +
                        `&genreId=${formValues.genreId}` +
                        `&studioId=${formValues.studioId}`;
                    break;
                case 'studios':
                    url = `http://localhost:5108/Studios/Update?id=${entityId}&name=${encodeURIComponent(formValues.name)}` +
                        `&country=${encodeURIComponent(formValues.country || '')}` +
                        `&yearFounded=${encodeURIComponent(formValues.yearFounded || '')}`;
                    break;
                case 'licenses':
                    url = `http://localhost:5108/Licenses/UpdateLicense?id=${entityId}&name=${encodeURIComponent(formValues.name)}` +
                        `&durationInHours=${formValues.durationInHours || ''}` +
                        `&priceMultiplier=${formValues.priceMultiplier || ''}`;
                    break;
                case 'payments':
                    url = `http://localhost:5108/Payments/UpdatePaymentMethod?id=${entityId}&name=${encodeURIComponent(formValues.name)}&description=${encodeURIComponent(formValues.description)}`;
                    break;
                default:
                    break;
            }
        }

        // Выполняем запрос
        try {
            const response = await fetch(url, options);

            if (response.ok) {
                alert('Элемент успешно добавлен/обновлен.');
                fetchEntities(); // Перезагружаем список сущностей после успешного обновления
                handleCloseModal();
            } else {
                const error = await response.json();
                alert(`Ошибка при добавлении/обновлении: ${error.message || response.statusText}`);
            }
        } catch (error) {
            console.error('Ошибка при отправке запроса:', error);
            alert('Произошла ошибка при обработке запроса.');
        }
    };





    const handleEdit = (entity) => {
        setSelectedEntity(entity);
        setFormValues(entity);
        setModalType('edit');
    };

    const entityIdFieldMapping = {
        genres: 'genreId',
        movies: 'movieId',
        studios: 'studioId',
        licenses: 'licenseId',
        users: 'userId',
        payments: 'paymentMethodId',
    };

    const handleDelete = async (entity) => {
        console.log(entity);
        const entityIdField = entityIdFieldMapping[entityType];
        const entityId = entity[entityIdField];

        if (!entityId) {
            alert('Ошибка: не удалось найти идентификатор');
            return;
        }

        let url = '';
        switch (entityType) {
            case 'genres':
                url = `http://localhost:5108/Genres/DeleteGenre?id=${entityId}`;
                break;
            case 'movies':
                url = `http://localhost:5108/Movies/DeleteMovie?id=${entityId}`;
                break;
            case 'studios':
                url = `http://localhost:5108/Studios/DeleteStudio?id=${entityId}`;
                break;
            case 'licenses':
                url = `http://localhost:5108/Licenses/DeleteLicense?id=${entityId}`;
                break;
            case 'users':
                url = `http://localhost:5108/Users/DeleteUser?id=${entityId}`;
                break;
            default:
                break;
        }

        const response = await fetch(url, {method: 'DELETE', credentials: 'include'});
        if (response.ok) {
            alert('Элемент удален успешно');
            setEntities(entities.filter((item) => item[entityIdField] !== entityId));
        } else {
            alert('Ошибка при удалении');
        }
    };

    const renderForm = () => {
        switch (entityType) {
            case 'genres':
                return (
                    <TextInput
                        label="Название жанра"
                        placeholder="Введите название жанра"
                        value={formValues.name || ''}
                        onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                    />
                );
            case 'movies':
                return (
                    <>
                        <TextInput
                            label="Название фильма"
                            placeholder="Введите название фильма"
                            value={formValues.title || ''}
                            onChange={(e) =>
                                setFormValues({ ...formValues, title: e.target.value.trim() })
                            }
                            required
                        />
                        <TextInput
                            label="Описание"
                            placeholder="Введите описание фильма"
                            value={formValues.description || ''}
                            onChange={(e) =>
                                setFormValues({ ...formValues, description: e.target.value })
                            }
                        />
                        <TextInput
                            label="Дата выхода"
                            type="date"
                            value={formValues.dateRelease || ''}
                            onChange={(e) =>
                                setFormValues({ ...formValues, dateRelease: e.target.value })
                            }
                        />
                        <NumberInput
                            label="Цена"
                            placeholder="Введите цену фильма"
                            value={formValues.price || ''}
                            onChange={(value) =>
                                setFormValues({ ...formValues, price: value !== '' ? Number(value) : null })
                            }
                        />
                        <FileInput
                            label="Изображение фильма"
                            onChange={(file) => setFormValues({ ...formValues, image: file })}
                        />
                        <Select
                            label="Жанр"
                            placeholder="Выберите жанр"
                            data={genres.map((genre) => ({
                                value: String(genre.genreId),
                                label: genre.name,
                            }))}
                            value={formValues.genreId !== undefined ? String(formValues.genreId) : ''}
                            onChange={(value) =>
                                setFormValues({ ...formValues, genreId: Number(value) })
                            }
                            required
                        />
                        <Select
                            label="Студия"
                            placeholder="Выберите студию"
                            data={studios.map((studio) => ({
                                value: String(studio.studioId),
                                label: studio.name,
                            }))}
                            value={formValues.studioId !== undefined ? String(formValues.studioId) : ''}
                            onChange={(value) =>
                                setFormValues({ ...formValues, studioId: Number(value) })
                            }
                            required
                        />
                    </>
                );

            case 'studios':
                return (
                    <>
                        <TextInput
                            label="Название студии"
                            placeholder="Введите название студии"
                            value={formValues.name || ''}
                            onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                        />
                        <TextInput
                            label="Страна"
                            placeholder="Введите страну"
                            value={formValues.country || ''}
                            onChange={(e) => setFormValues({...formValues, country: e.target.value})}
                        />
                        <TextInput
                            label="Год основания"
                            placeholder="Введите год основания"
                            value={formValues.yearFounded || ''}
                            onChange={(e) => setFormValues({...formValues, yearFounded: e.target.value})}
                        />
                    </>
                );
            case 'licenses':
                return (
                    <>
                        <TextInput
                            label="Название лицензии"
                            placeholder="Введите название лицензии"
                            value={formValues.name || ''}
                            onChange={(e) => setFormValues({...formValues, name: e.target.value})}
                        />
                        <TextInput
                            label="Продолжительность (часы)"
                            placeholder="Введите продолжительность"
                            value={formValues.durationInHours || ''}
                            onChange={(e) => setFormValues({...formValues, durationInHours: e.target.value})}
                        />
                        <TextInput
                            label="Множитель цены"
                            placeholder="Введите множитель цены"
                            value={formValues.priceMultiplier || ''}
                            onChange={(e) => setFormValues({...formValues, priceMultiplier: e.target.value})}
                        />
                    </>
                );
            case 'users':
                return (
                    <>
                        <TextInput
                            label="Электронная почта"
                            placeholder="Введите электронную почту"
                            value={formValues.email || ''}
                            onChange={(e) => setFormValues({...formValues, email: e.target.value})}
                        />
                        <TextInput
                            label="Полное имя"
                            placeholder="Введите полное имя"
                            value={formValues.fullName || ''}
                            onChange={(e) => setFormValues({...formValues, fullName: e.target.value})}
                        />
                    </>
                );
            case 'payments':
                return (
                    <>
                        <TextInput
                            label="Название способа оплаты"
                            placeholder="Введите название"
                            value={formValues.name || ''}
                            onChange={(e) => setFormValues({ ...formValues, name: e.target.value })}
                        />
                        <TextInput
                            label="Описание"
                            placeholder="Введите описание"
                            value={formValues.description || ''}
                            onChange={(e) => setFormValues({ ...formValues, description: e.target.value })}
                        />
                    </>
                );
            default:
                return null;
        }
    };

    return (
        <>
            <NavBar/>
            <Flex h="fit-content" direction="column" p="1% 6%" ml="19.4%" gap="24px">
                <Text size="xl" weight={700} align="center">Админ-панель</Text>

                <Select
                    label="Выберите тип элемента"
                    placeholder="Выберите тип"
                    data={[
                        {value: 'genres', label: 'Жанры'},
                        {value: 'movies', label: 'Фильмы'},
                        {value: 'studios', label: 'Студии'},
                        {value: 'licenses', label: 'Лицензии'},
                        {value: 'users', label: 'Пользователи'},
                        {value: 'payments', label: 'Способы оплаты' },
                    ]}
                    onChange={(value) => setEntityType(value)}
                    style={{marginBottom: '20px'}}
                />

                {entityType && (
                    <>
                        <Group position="center" spacing="md" style={{ marginTop: '20px' }}>
                            <Button onClick={() => handleOpenModal('add')} color="green">
                                Добавить элемент
                            </Button>
                        </Group>


                        <Grid>
                            {entities.map((entity) => (
                                <Grid.Col span={3} key={entity.id}>
                                    <Card shadow="sm" padding="lg">
                                        <Text weight={500}>
                                            {entityType === 'users' ? entity.fullName : entity.name || entity.title}
                                        </Text>
                                        <Group position="center">
                                            <Button color="yellow" onClick={() => handleEdit(entity)}>Изменить</Button>
                                            <Button color="red" onClick={() => handleDelete(entity)}>Удалить</Button>
                                        </Group>
                                    </Card>
                                </Grid.Col>
                            ))}
                        </Grid>
                    </>
                )}
            </Flex>

            {/* Модальные окна */}
            <Modal opened={modalType === 'add'} onClose={handleCloseModal} title="Добавить элемент">
                {renderForm()}
                <Group position="center" style={{ marginTop: '20px' }}>
                    <Button color="green" onClick={handleSubmit}>
                        Сохранить
                    </Button>
                    <Button color="gray" onClick={handleCloseModal}>
                        Отмена
                    </Button>
                </Group>

            </Modal>

            <Modal opened={modalType === 'edit'} onClose={handleCloseModal} title="Изменить элемент">
                {renderForm()}
                <Group position="center" style={{ marginTop: '20px' }}>
                    <Button color="green" onClick={handleSubmit}>
                        Обновить
                    </Button>
                    <Button color="gray" onClick={handleCloseModal}>
                        Отмена
                    </Button>
                </Group>

            </Modal>
        </>
    );
};

export default AdminPanel;
