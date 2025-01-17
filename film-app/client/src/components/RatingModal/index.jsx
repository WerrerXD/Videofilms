import React, { useState } from 'react';
import classes from './Modal.module.css'
import { Group, Modal, Rating, Button } from '@mantine/core';
import { useDispatch, useSelector } from 'react-redux';
import { setRatedMovies } from 'store/Slices/movieSlice';

const RatingModal = ({opened, onClose, movie, defaultRating}) => {
  const [rating, setRating] = useState(defaultRating)
  const ratedMovies = useSelector(state => state.movie.ratedMovies)
  const dispatch = useDispatch()

  const handleRatingSave = (id, rate) => {
    let updatedMovies = [...ratedMovies]
    const movieIndex = updatedMovies.findIndex(film => film.id === id)

    if (movieIndex !== -1) {
      updatedMovies[movieIndex] = {
        ...updatedMovies[movieIndex],
        user_rate: rate
      }
    } else {
      updatedMovies.push({
        ...movie,         //TODO: movie rated from main page and details page has different properties (genre_ids/genres etc.)
        user_rate: rate
      })
    }

    dispatch(setRatedMovies(updatedMovies));
    localStorage.setItem("rated_movies", JSON.stringify(updatedMovies))
    onClose()
  }
  
  const handleRatingRemove = (id) => {
    let updatedMovies = ratedMovies.filter(film => film.id !== id)
    localStorage.setItem("rated_movies", JSON.stringify(updatedMovies))
    dispatch(setRatedMovies(updatedMovies))
    setRating(0)
    onClose()
  }

  return (    
    <Modal 
      opened={opened} 
      onClose={onClose} 
      title='Your rating' 
      classNames={{body: classes.body, inner: classes.inner, header: classes.header, overlay: classes.overlay}}
    >
      <span className={classes.title}>{movie.title}</span>
      <Rating 
        size='30px' 
        count='10' 
        defaultValue={defaultRating} 
        onChange={setRating} 
        classNames={{root: classes.starsContainer}} 
      />
      <Group>
        <Button color='#9854F6' radius='8px' onClick={() => {handleRatingSave(movie.id, rating)}}>
          Save
        </Button>
        <Button onClick={() => {handleRatingRemove(movie.id)}}>
          Remove rating
        </Button>
      </Group>
    </Modal>
  );
};

export default RatingModal;
