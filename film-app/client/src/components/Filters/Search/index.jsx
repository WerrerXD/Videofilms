import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { setTitle } from 'store/Slices/querySlice';
import Search from "../../Search";

const MovieSearch = () => {
    const dispatch = useDispatch();
    const title = useSelector((state) => state.query.params.title);

    const handleSearchChange = (value) => {
        dispatch(setTitle(value)); // Обновляем строку поиска в Redux
    };

    return (
        <Search value={title} onChange={handleSearchChange} />
    );
};

export default MovieSearch;
