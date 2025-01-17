/*
import React from 'react';
import classes from './description.module.css'
import { Divider } from '@mantine/core';
import { findTrailer, getImage } from 'utils/functions';
import { LOGO_SIZES } from 'utils/consts';
import clapperboard from 'assets/clapperboard.svg' 

const MovieDescription = ({movie}) => {
  const trailer = findTrailer(movie.videos.results) 

  return (
    <div className={classes.wrapper}>
      <h3>Trailer</h3>
      {trailer ? (
        <iframe 
          className={classes.trailer}
          src={`https://www.youtube.com/embed/${trailer.key}`} 
          title="YouTube video player" 
          frameborder="0" 
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
          allowfullscreen 
        />
      ) : (
        <h4>Can't find trailer</h4>
      )
      }
      <Divider my='md'/>
      <h3>Description</h3>
      <span>{movie.overview}</span>
      <Divider my='md'/>
      <h3>Production</h3>
      {
        movie.production_companies.length ? (
          <div className={classes.companiesContainer}>
            {movie.production_companies.map(company => 
              <div className={classes.companyRow}>
                <div className={classes.logoWrap}>
                  <img className={classes.logo} src={company.logo_path ? getImage(company.logo_path, LOGO_SIZES.XXL) : clapperboard} alt=''/>
                </div>
                <span>{company.name}</span>
              </div>
            )}
          </div>
        ) : (
          <h4>Unknown</h4>
        )
      }
      
    </div>
  );
};

export default MovieDescription;
*/





/*import React from 'react';
import classes from './description.module.css';
import { Divider } from '@mantine/core';

const MovieDescription = ({ movie }) => {
    return (
        <div className={classes.wrapper}>
            <h3>Description</h3>
            <span>{movie.description || 'No description available'}</span>
            <Divider my="md" />

            <h3>Details</h3>
            <div className={classes.details}>
                <div className={classes.detailRow}>
                    <span className={classes.label}>Release Date:</span>
                    <span>{movie.dateRelease || 'Unknown'}</span>
                </div>
                <div className={classes.detailRow}>
                    <span className={classes.label}>Price:</span>
                    <span>{movie.price ? `$${movie.price.toFixed(2)}` : 'Unknown'}</span>
                </div>
                <div className={classes.detailRow}>
                    <span className={classes.label}>Genre:</span>
                    <span>{movie.genre || 'Unknown'}</span>
                </div>
                <div className={classes.detailRow}>
                    <span className={classes.label}>Studio:</span>
                    <span>{movie.studio || 'Unknown'}</span>
                </div>
            </div>
            <Divider my="md" />

            {movie.imagePath && (
                <>
                    <h3>Poster</h3>
                    <img
                        className={classes.poster}
                        src={movie.imagePath}
                        alt={`${movie.title || 'Movie'} poster`}
                    />
                    <Divider my="md" />
                </>
            )}
        </div>
    );
};

export default MovieDescription;*/


import React from 'react';
import { Divider } from '@mantine/core';
import classes from './description.module.css';
import posterPlaceholder from "../../../assets/posterPlaceholder.svg";

const MovieDescription = ({ movie }) => {
    const BASE_URL = "http://localhost:5108"; // Замените на ваш базовый URL сервера

    return (
        <div className={classes.wrapper}>
            <h3>Постер</h3>
            <img
                className={classes.poster}
                src={movie.imagePath ? `${BASE_URL}${movie.imagePath}` : posterPlaceholder}
                alt={movie.title}
            />
            <Divider my="md" />
            <h3>Описание</h3>
            <span>{movie.description || "Нету описания"}</span>
            <Divider my="md" />
            <h3>Детали</h3>
            <div>
                <p><b>Дата релиза:</b> {movie.dateRelease || "Unknown"}</p>
                <p><b>Жанр:</b> {movie.genre || "Unknown"}</p>
                <p><b>Студия:</b> {movie.studio || "Unknown"}</p>
                <p><b>Цена:</b> {movie.price?.toFixed(2) || "Unknown"} р.</p>
            </div>
        </div>
    );
};

export default MovieDescription;

