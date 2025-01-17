import $movies from ".";
import {setMovies} from "../store/Slices/movieSlice";

export const fetchMovies = (queryParams) => {
  return async (dispatch) => {
    try {
      // Удаляем undefined или пустые параметры
      const sanitizedParams = Object.fromEntries(
          Object.entries(queryParams).filter(([_, value]) => value !== undefined && value !== "")
      );

      const query = new URLSearchParams(sanitizedParams).toString();
      const response = await fetch(`http://localhost:5108/Movies/GetAllWithFilter?${query}`);
      const data = await response.json();
      console.log(data)
      dispatch(setMovies(data));
    } catch (error) {
      console.error("Error fetching movies:", error);
    }
  };
};

export const fetchMovieDetails = async (id, language = 'en') => {
  const {data} = await $movies.get(`Movies/GetById/${id}`)
  console.log(data)
  return data
}

export const fetchGenres = async (language = 'en') => {
  const {data} = await $movies.get(`Genres/GetAllGenres`)
  console.log(data)
  return data
}

export const fetchStudios = async (language = 'en') => {
  const {data} = await $movies.get(`Studios/GetAllStudios`)
  console.log(data)
  return data
}

export const fetchLicenses = async () => {
  const response = await fetch('http://localhost:5108/Licenses/GetAllLicenses');
  const data = await response.json();
  return data;
};

// Метод для добавления фильма в корзину
// Метод для добавления фильма в корзину
export const addToCart = async (movieId, licenseId) => {
  try {
    const url = `http://localhost:5108/Movies/AddMovieToUserCart?movieId=${movieId}&licenseId=${licenseId}&quantity=1`;
    console.log('Запрос на URL:', url); // Логируем запрос
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
    });

    if (response.status === 400) {
      throw new Error(`Этот фильм уже есть в корзине`);
    }
    // Проверка на успешность ответа
    // if (!response.ok) {
    //   throw new Error(`Ошибка при добавлении в корзину: ${response.statusMessage} (status: ${response.status})`);
    // }

    // Чтение и парсинг ответа
    const text = await response.text();
    if (text) {
      return JSON.parse(text);  // Парсим ответ, если он не пустой
    } else {
      throw new Error('Ответ пустой');
    }
  } catch (error) {
    console.error('Ошибка в addToCart:', error);
    throw error;  // Пробрасываем ошибку для дальнейшей обработки
  }
};

export const getCartItems = async () => {
  try {
    const url = `http://localhost:5108/Movies/GetItemsFromCart`;
    console.log('Запрос на URL:', url); // Логируем запрос
    const response = await fetch(url, {
      method: 'POST',
      credentials: 'include',
    });

    // Проверка на успешность ответа
    if (!response.ok) {
      throw new Error(`Ошибка при получении корзины: ${response.statusText} (status: ${response.status})`);
    }

    // Чтение и парсинг ответа
    const text = await response.text();
    if (text) {
      return JSON.parse(text); // Парсим ответ, если он не пустой
    } else {
      throw new Error('Ответ пустой');
    }
  } catch (error) {
    console.error('Ошибка в getCartItems:', error);
    throw error; // Пробрасываем ошибку для дальнейшей обработки
  }
};



