import React from 'react';
import classes from './Search.module.css'
import icon from 'assets/Search.svg'

const Search = ({value, onChange}) => {
  return (
    <div className={classes.wrapper}>
      <img src={icon} className={classes.icon} alt=''/>
      <input
        className={classes.input}
        placeholder='Поиск по названию фильма'
        value={value}
        onChange={(e) => {onChange(e.target.value)}}
        spellCheck='false'
      />
    </div>
  );
};

export default Search;
