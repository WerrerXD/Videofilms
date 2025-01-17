import React, { useEffect, useState } from 'react';
import { Anchor, Breadcrumbs, Center, Flex, Loader, Text, Grid } from '@mantine/core';
import Navbar from 'components/NavBar';
import { useNavigate, useParams } from 'react-router-dom';
import { fetchMovieDetails, fetchLicenses, addToCart } from 'http/moviesAPI';
import MovieCard from 'components/MovieDetails/MovieCard';
import MovieDescription from 'components/MovieDetails/MovieDescription';
import { useSelector } from 'react-redux';

const Movie = () => {
  const isAdmin = useSelector((state) => state.movie.isAdmin);
  const [isLoaded, setIsLoaded] = useState(false);
  const [licenses, setLicenses] = useState([]);
  const [currMovie, setCurrMovie] = useState(null);
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const { id } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    fetchMovieDetails(id).then(data => {
      if (!data || data.status_code) {
        navigate('/404');
      } else {
        setCurrMovie(data);
        setIsLoaded(true);
      }
    });

    fetchLicenses().then(data => setLicenses(data));

    // Проверка авторизации
    const checkAuthStatus = async () => {
      try {
        const response = await fetch('http://localhost:5108/Users/CheckAuth', {
          method: 'GET',
          credentials: 'include', // Важно для работы с cookie
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

    checkAuthStatus();
  }, [id, navigate]);

  const handleAddToCart = async (movieId, licenseId) => {
    if (!isLoggedIn) {
      alert('Для добавления в корзину необходимо войти в аккаунт.');
      return;
    }

    try {
      await addToCart(movieId, licenseId, 1);
      alert('Фильм добавлен в корзину!');
    } catch (error) {
      console.error(error);
      alert(`Ошибка при добавлении в корзину: ${error.message}`);
    }
  };

  return (
      <Flex h="100vh" direction="row">
        {/* Навигация слева */}
        <Navbar />

        {/* Основной контент */}
        <Flex direction="column" flex="1" p="3% 6%" ml="15%">
          <div style={{height: '100%'}}>
            <nav className="bg-purple-300 text-white p-4 flex justify-between items-center rounded-xl" style={{ marginTop: '-10px' }}>
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

            {isLoaded ? (
                <Flex direction="column" p="3% 13%" gap="20px">
                  <Breadcrumbs separatorMargin="10px">
                    <Anchor onClick={() => navigate('/')}>
                      <Text c="#9854F6" size="14px">
                        Фильмы
                      </Text>
                    </Anchor>
                    <Anchor>
                      <Text c="#9854F6" size="14px">
                        {currMovie.title}
                      </Text>
                    </Anchor>
                  </Breadcrumbs>
                  <MovieCard movie={currMovie} licenses={licenses} onAddToCart={handleAddToCart} />
                  <MovieDescription movie={currMovie} />
                </Flex>
            ) : (
                <Center w="100%" h="100%">
                  <Loader />
                </Center>
            )}
          </div>
        </Flex>
      </Flex>
  );
};

export default Movie;
