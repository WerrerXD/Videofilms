
import React, { useEffect, useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Flex, Group } from '@mantine/core';
import { setPage } from 'store/Slices/querySlice';
import { fetchMovies } from 'http/moviesAPI';
import NavBar from 'components/NavBar';
import MovieList from 'components/MovieList';
import Filters from 'components/Filters';
import Sort from 'components/Sort';
import EmptyState from 'components/EmptyState';
import CustomPagination from 'components/Pagination';
import emptyStateIcon from 'assets/moviesEmptyState.svg';
import MovieSearch from "../components/Filters/Search";
import {useNavigate} from "react-router-dom";

const MoviesPage = () => {
    const isAdmin = useSelector((state) => state.movie.isAdmin);
  const dispatch = useDispatch();
  const movies = useSelector((state) => state.movie.movieList);
  const queryParams = useSelector((state) => state.query.params); // Состояние для жанра, поиска и страницы
  const [isLoaded, setIsLoaded] = useState(false);
  const [totalPages, setTotalPages] = useState(0);
  const [search, setSearch] = useState('');
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const navigate = useNavigate();


  useEffect(() => {
    setIsLoaded(false);
    // Диспатчим thunk-экшен
    dispatch(fetchMovies(queryParams))
        .then(() => setIsLoaded(true)) // Вы можете также обновить состояние загрузки, когда запрос завершен
        .catch((error) => {
          console.error('Error fetching movies:', error);
          setIsLoaded(true);
        });
    console.log(isAdmin);
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
  }, [queryParams, dispatch]);

  const changePageHandler = (value) => {
    dispatch(setPage(value)); // Обновляем номер страницы
  };
  

  // Простой механизм для предотвращения ошибок при отсутствии данных
  const renderMovies = () => {
    if (!isLoaded) {
      return null; // Пока данные не загружены, ничего не рендерим
    }

    if (movies.length === 0) {
      return <EmptyState icon={emptyStateIcon} text="No movies available, try different filters." />;
    }

    return (
        <>
          <MovieList movies={movies} isLoaded={isLoaded} />
          <Group justify="flex-end">
            <CustomPagination
                total={totalPages} // Общее количество страниц
                value={queryParams.page}
                onChange={changePageHandler}
            />
          </Group>
        </>
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

              <h1>Фильмы</h1>
              <Filters/> {/* Добавляем компонент фильтра */}
              <Sort/>
              <MovieSearch value={search} onChange={setSearch}/>
              {renderMovies()} {/* Отображение фильмов */}
          </Flex>
      </>
  );
};

export default MoviesPage;


