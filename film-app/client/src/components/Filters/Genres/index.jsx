/*
import React from 'react';
import { setQueryGenres } from 'store/Slices/querySlice';
import FiltersSelect from 'components/Select';

const Genres = () => {
  const genresOptions = [
    {value: '28', label: 'Action'},
    {value: '12', label: 'Adventure'},
    {value: '16', label: 'Animation'},
    {value: '35', label: 'Comedy'},
    {value: '80', label: 'Crime'},
    {value: '99', label: 'Documentary'},
    {value: '18', label: 'Drama'},
    {value: '10751', label: 'Family'},
    {value: '14', label: 'Fantasy'},
    {value: '36', label: 'History'},
    {value: '27', label: 'Horror'},
    {value: '10402', label: 'Music'},
    {value: '9648', label: 'Mystery'},
    {value: '10749', label: 'Romance'},
    {value: '878', label: 'Scirnce Fiction'},
    {value: '10770', label: 'TV Movie'},
    {value: '53', label: 'Thriller'},
    {value: '10752', label: 'War'},
    {value: '37', label: 'Western'},
  ]

  return (
    <FiltersSelect
      options={genresOptions}
      label='Genres'
      placeholder='Select genre'
      storeParam='with_genres'
      action={setQueryGenres}
      isMulti={true}
    />
  );
};

export default Genres;
*/
import React, { useEffect, useState } from 'react';
import { setQueryGenres } from 'store/Slices/querySlice';
import FiltersSelect from 'components/Select';
import { Loader } from '@mantine/core';
import {fetchGenres, fetchMovies} from "../../../http/moviesAPI";
import {useDispatch} from "react-redux";

const Genres = () => {
  const dispatch = useDispatch();
  const [genresOptions, setGenresOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const loadGenres = async () => {
      try {
        const genres = await fetchGenres(); // Предполагается, что fetchGenres возвращает массив объектов { id, name }
        const formattedGenres = genres.map(genre => ({
          value: genre.name, // Или используйте genre.id, если значение должно быть числовым
          label: genre.name,
        }));
        setGenresOptions(formattedGenres);
      } catch (error) {
        console.error('Failed to fetch genres:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadGenres();
  }, []);

  if (isLoading) {
    return <Loader />;
  }

  const handleGenreChange = (selectedGenres) => {
    // При изменении жанра, передаем его в store
    dispatch(setQueryGenres(selectedGenres));
    //dispatch(fetchMovies({ genreName: selectedGenres }));
  };

  return (
      <FiltersSelect
          options={genresOptions}
          label="Жанр"
          placeholder="Выберите жанр"
          storeParam="genreName"
          action={setQueryGenres}
          isMulti={false}
      />
  );
};

export default Genres;

