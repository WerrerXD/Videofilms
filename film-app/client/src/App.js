/* eslint-disable react-hooks/exhaustive-deps */
import {useEffect, useState} from "react";
import { BrowserRouter } from "react-router-dom";
import {useDispatch, useSelector} from "react-redux";
import AppRouter from "./routes/AppRouter";
import {fetchGenres, fetchStudios} from "http/moviesAPI";
import "./App.css"
import {setGenres, setIsAdmin, setRatedMovies} from "store/Slices/movieSlice";



const App = () => {
  const dispatch = useDispatch();
  const [loading, setLoading] = useState(true);
  const isAdmin = useSelector((state) => state.movie.isAdmin);
  const getCookieValue = (name) => {
    const cookies = document.cookie.split('; ');
    const cookie = cookies.find((c) => c.startsWith(`${name}=`));
    return cookie ? decodeURIComponent(cookie.split('=')[1]) : null;
  };
    useEffect(() => {
      const checkAdminStatus = () => {
        const isAdmin = getCookieValue("IsAdmin") === "Yes";
        dispatch(setIsAdmin(isAdmin));
      };

      checkAdminStatus();
      fetchGenres().then(data => {
        dispatch(setGenres(data.genres))
      })
      fetchStudios().then(data => {
        dispatch(setGenres(data.studios))
      })

      dispatch(setRatedMovies(JSON.parse(localStorage.getItem('rated_movies'))))
    }, [dispatch])
  
    
  return (
    <BrowserRouter>
      <AppRouter isAdmin={isAdmin}/>
    </BrowserRouter>
  );
}

export default App;
