
import React from 'react';
import { Grid, Loader } from '@mantine/core';
import ListItem from 'components/ListItem'; // Убедитесь, что ListItem работает с вашей структурой
import classes from './MovieList.module.css';

const MovieList = ({ movies, isLoaded }) => {
  if (!isLoaded) {
    return <Loader className={classes.loader} />;
  }

  return (
      <Grid>
        {movies.map((movie, index) => (
            <Grid.Col key={index} span={6}>
              <ListItem movie={movie} />
            </Grid.Col>
        ))}
      </Grid>
  );
};

export default MovieList;
