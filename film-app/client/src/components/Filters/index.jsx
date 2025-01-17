import React from 'react';
import classes from './Filters.module.css';
import Genres from './Genres';
import Year from './Year';
import { useDispatch } from 'react-redux';
import { resetFilters } from 'store/Slices/querySlice';
import Price from "./Price";
import Studios from "./Studios";

const Filters = () => {
  const dispatch = useDispatch()
  const resetHandler = () => {
    dispatch(resetFilters())
  }

  return (
      <div className={classes.filtersContainer}>
          <div className={classes.filterWrapper}>
              <Genres/>
          </div>
          <div className={classes.filterWrapper}>
              <Studios/>
          </div>
          <div className={classes.filterWrapper}>
              <Year/>
          </div>
          <div className={classes.filterWrapper}>
              <Price/>
          </div>
          <button className={classes.reset} onClick={resetHandler}>Cброс фильтров</button>
      </div>
  );
};


export default Filters;
