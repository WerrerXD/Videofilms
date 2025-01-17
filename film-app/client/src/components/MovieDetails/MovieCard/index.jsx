import React, { useState, useEffect } from 'react';
import { Button, Modal, Select, Textarea, Rating } from '@mantine/core';
import { FaRegHeart, FaHeart } from 'react-icons/fa';
import classes from './MainInfo.module.css';
import posterPlaceholder from 'assets/posterPlaceholder.svg';

const BASE_URL = "http://localhost:5108";

const MovieCard = ({ movie, licenses, onAddToCart }) => {
  const [modalOpened, setModalOpened] = useState(false);
  const [reviewModalOpened, setReviewModalOpened] = useState(false);
  const [selectedLicense, setSelectedLicense] = useState(null);
  const [isInWishlist, setIsInWishlist] = useState(false);
  const [reviews, setReviews] = useState([]);
  const [isReviewsLoaded, setIsReviewsLoaded] = useState(false);

  const handleAddToCart = () => {
    if (selectedLicense) {
      onAddToCart(movie.id, selectedLicense);
      setModalOpened(false);
    } else {
      alert('Выберите лицензию!');
    }
  };

  const handleAddToWishlist = async () => {
    try {
      const response = await fetch(`http://localhost:5108/Wishlists/AddMovieToWishlist?movieId=${movie.id}`, {
        method: 'PUT',
        credentials: 'include',
      });

      if (response.ok) {
        setIsInWishlist(true);
        alert('Фильм добавлен в список желаемого!');
      } else if (response.status === 400) {
        alert('Этот фильм уже в вашем списке желаемого.');
      } else {
        alert('Ошибка при добавлении в список желаемого.');
      }
    } catch (error) {
      console.error('Ошибка при добавлении в список желаемого:', error);
      alert('Ошибка при добавлении в список желаемого.');
    }
  };

  const fetchReviews = async () => {
    setIsReviewsLoaded(false);
    try {
      const response = await fetch(`http://localhost:5108/Reviews/GetMovieReviews?movieId=${movie.id}`, {
        method: 'GET',
        credentials: 'include',
      });

      if (response.ok) {
        const data = await response.json();
        setReviews(data);
      } else {
        console.error('Ошибка при получении отзывов.');
      }
    } catch (err) {
      console.error('Ошибка при получении данных:', err);
    } finally {
      setIsReviewsLoaded(true);
    }
  };

  const formatDate = (dateString) => {
    const options = { year: 'numeric', month: 'long', day: 'numeric', hour: '2-digit', minute: '2-digit' };
    return new Date(dateString).toLocaleDateString('ru-RU', options);
  };

  const renderReviews = () => {
    if (!isReviewsLoaded) {
      return <p>Загрузка отзывов...</p>;
    }

    if (reviews.length === 0) {
      return <p>Отзывов пока нет.</p>;
    }

    return (
        <div>
          {reviews.map((review) => (
              <div key={review.createdAt} style={{ borderBottom: '1px solid #eee', padding: '10px 0' }}>
                <p><strong>{review.userName}</strong> ({formatDate(review.createdAt)})</p>
                <Rating value={review.rating} readOnly />
                <p>{review.comment}</p>
              </div>
          ))}
        </div>
    );
  };

  return (
      <div className={classes.wrapper}>
        <div className={classes.content}>
          <img
              className={classes.poster}
              src={movie.imagePath ? `${BASE_URL}${movie.imagePath}` : posterPlaceholder}
              alt="Постер"
          />
          <div className={classes.info}>
            <div className={classes.textInfo}>
              <span className={classes.title}>{movie.title}</span>
              <span className={classes.grayText}>{movie.studio}</span>
              <span className={classes.grayText}>{movie.dateRelease}</span>
            </div>
            <div className={classes.description}>
              <div className={classes.descriptionRow}>
                <span className={classes.grayText}>Жанр</span>
                <span>{movie.genre}</span>
              </div>
              <div className={classes.descriptionRow}>
                <span className={classes.grayText}>Цена</span>
                <span>{movie.price} р.</span>
              </div>
              <div className={classes.descriptionRow}>
                <span className={classes.grayText}>Описание</span>
                <span>{movie.description}</span>
              </div>
            </div>

            <div className={classes.buttons}>
              <Button onClick={() => setModalOpened(true)} variant="filled" color="blue" className={classes.addToCartButton}>
                Добавить в корзину
              </Button>

              <Button onClick={() => {
                setReviewModalOpened(true);
                fetchReviews();
              }} variant="outline" color="blue" className={classes.addReviewButton}>
                Посмотреть отзывы
              </Button>

              <button
                  onClick={handleAddToWishlist}
                  className={classes.wishlistButton}
                  style={{ marginLeft: '10px' }}
                  disabled={isInWishlist}
              >
                {isInWishlist ? <FaHeart color="red" size={30} /> : <FaRegHeart color="#ccc" size={30} />}
              </button>
            </div>
          </div>
        </div>

        <Modal opened={modalOpened} onClose={() => setModalOpened(false)} title="Выберите лицензию">
          <Select
              label="Лицензия"
              placeholder="Выберите лицензию"
              data={licenses.map(license => ({
                value: license.licenseId.toString(),
                label: `${license.name} - ${license.priceMultiplier}x стоимость`,
              }))}
              value={selectedLicense}
              onChange={setSelectedLicense}
          />
          <Button onClick={handleAddToCart} mt="20px" variant="filled" color="green">
            Добавить в корзину
          </Button>
        </Modal>

        <Modal opened={reviewModalOpened} onClose={() => setReviewModalOpened(false)} title="Отзывы пользователей">
          {renderReviews()}
        </Modal>
      </div>
  );
};

export default MovieCard;
