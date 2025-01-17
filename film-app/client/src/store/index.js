/*
import { configureStore, combineReducers } from "@reduxjs/toolkit";
import movieSlice from "./Slices/movieSlice";
import querySlice from "./Slices/querySlice";
import {thunk} from "redux-thunk";


const rootReducer = combineReducers({
  movie: movieSlice,
  query: querySlice
})

export const store = configureStore({
  reducer: rootReducer,
  middleware: (getDefaultMiddleware) => getDefaultMiddleware().concat(thunk),
})*/
import { configureStore } from '@reduxjs/toolkit';
import movieSlice from './Slices/movieSlice';
import querySlice from './Slices/querySlice';

export const store = configureStore({
  reducer: {
    movie: movieSlice,
    query: querySlice,
  },
  // Убираем ручное добавление redux-thunk, так как он уже включен по умолчанию
});




