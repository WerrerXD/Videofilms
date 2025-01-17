import { createSlice } from "@reduxjs/toolkit";

const movieSlice = createSlice({
  name: 'movie',
  initialState: {
    movieList: [],
    currentMovie: null,
    genresList: [],
    studiosList: [],
    ratedMovies: [],
    cartItemsList: [],
    isAdmin: false
  },
  reducers: {
    setMovies(state, action) {
      state.movieList = action.payload
    },
    setCurrentMovie(state, action) {
      state.currentMovie = action.payload
    },
    setGenres(state, action) {
      state.genresList = action.payload
    },
    setStudios(state, action) {
      state.studiosList = action.payload
    },
    setRatedMovies(state, action) {
      state.ratedMovies = action.payload
    },
    setCartItems(state, action) {
      state.cartItemsList = action.payload
    },
    setIsAdmin(state, action) { // Новый редуктор
      state.isAdmin = action.payload;
    }
  }
})

export default movieSlice.reducer
export const { setMovies,setIsAdmin,setCartItems, setCurrentMovie, setGenres, setStudios, setRatedMovies } = movieSlice.actions