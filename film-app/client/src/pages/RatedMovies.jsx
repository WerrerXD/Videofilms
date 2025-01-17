import React, { useEffect, useState } from 'react';
import { Flex, Group, Button, Stack } from '@mantine/core';
import NavBar from 'components/NavBar';
import MovieList from 'components/MovieList';
import EmptyState from 'components/EmptyState';
import CustomPagination from 'components/Pagination';
import emptyStateIcon from 'assets/ratedMoviesEmptyState.svg'
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import Search from 'components/Search';


const RatedMovies = () => {
  const [isLoaded, setIsLoaded] = useState(false)
  const [totalPages, setTotalPages] = useState(0)
  const [currentPage, setCurrentPage] = useState(1)
  const [search, setSearch] = useState('')
  const navigate = useNavigate()
  const movies = useSelector(state => state.movie.ratedMovies)
  const filteredMovies = movies.filter(film => film.title.toLowerCase().includes(search.toLowerCase()))

  useEffect(() => {
    if (filteredMovies && filteredMovies.length > 0) {
      setIsLoaded(true)
      setTotalPages(Math.ceil(filteredMovies.length / 4))
    }
    else {
      setIsLoaded(false)
    }
  }, [filteredMovies])

  const changePageHandler = (value) => {
    setCurrentPage(value)
  }

  return (
    <>
      <NavBar />
      <Flex h='fit-content' direction='column' p='1% 6%' ml='19.4%' gap='24px'>
        <Group justify='space-between'>
          <h1>Rated movies</h1>
          <Search
            value={search}
            onChange={setSearch}
          />
        </Group>
        {!isLoaded ? (
          <Stack align='center' justify='flex-start' mt='80px'>
            <EmptyState icon={emptyStateIcon} text="You haven't rated any films yet"/>
            <Button w={'15%'} color='#9854F6' radius='8px' onClick={() => {navigate('/')}} >Find Movies</Button>
          </Stack>
        ) : (
          <>
            <MovieList movies={filteredMovies.slice(4 * (currentPage - 1), 4 * currentPage)} isLoaded={isLoaded}/>
            {totalPages > 1 && 
              <Group justify='center'>
                <CustomPagination total={totalPages} value={currentPage} onChange={changePageHandler}/>
              </Group>
            }
          </>
        )
        }
      </Flex>
    </>
  );
};

export default RatedMovies;
