import React from 'react';
import { NumberInput } from '@mantine/core';
import classes from './Price.module.css'
import { useDispatch, useSelector } from 'react-redux';
import {setMaxPrice, setMinPrice} from 'store/Slices/querySlice';

const Price = () => {
  const dispatch = useDispatch()
  const min_price = useSelector(store => store.query.params.minPrice)
  const max_price = useSelector(store => store.query.params.maxPrice)

  return (
    <div className={classes.container}>
      <NumberInput 
        classNames={{wrapper: classes.wrapper, input: classes.input, label: classes.label, control: classes.control, error: classes.error}}
        variant='filled'
        label='Цена'
        placeholder='от'
        min={0}
        max={9999}
        clampBehavior="strict"
        allowNegative={false}
        value={min_price === 0 ? '' : min_price}
        onChange={(_value) => {dispatch(setMinPrice(_value))}}
        error={min_price > max_price ? 'минимальная цена должна быть больше максимальной' : false}
      />
      <NumberInput 
        classNames={{wrapper: classes.wrapper, input: classes.input, label: classes.label, control: classes.control, error: classes.error}}
        variant='filled'
        placeholder='до'
        min={1}
        max={9999}
        clampBehavior="strict"
        allowNegative={false}
        value={max_price === 9999 ? '' : max_price}
        onChange={(_value) => {dispatch(setMaxPrice(_value))}}
        error={min_price > max_price ? 'максимальная цена должна быть больше минимальной' : false}
      />
    </div>
  );
};

export default Price;
