/*
import React, { useState } from 'react';
import classes from './Select.module.css'
import { MultiSelect, Select } from '@mantine/core';
import chevrone from 'assets/ChevronDown.svg'
import { useDispatch, useSelector } from 'react-redux';

const FiltersSelect = ({options, label, placeholder, storeParam, action, isMulti}) => {
  const [isOpen, setIsOpen] = useState(false)
  const chevroneImg = <img src={chevrone} className={isOpen ? classes.openedChevron : classes.closedChevron} alt='' />
  
  const value = useSelector(state => state.query.params[storeParam])
  const dispatch = useDispatch()
  
  return isMulti ? ( 
    <MultiSelect
      classNames={{label: classes.label, input: classes.input, option: classes.option, wrapper: classes.wrapper, pill: classes.pill, pillsList: classes.pillsList}}
      label={label}
      placeholder={!value && placeholder}
      value={value ? value.split(', ') : []}
      onChange={(_value, option) => {dispatch(action(_value.join(', ')))}}
      data={options}
      rightSection={chevroneImg}
      withCheckIcon={false}
      w={'100%'}
      onDropdownOpen={() => {setIsOpen(true)}}
      onDropdownClose={() => {setIsOpen(false)}}
    />
  ) : (
    <Select
      classNames={{label: classes.label, input: classes.input, option: classes.option, wrapper: classes.wrapper}}
      label={label}
      placeholder={placeholder}
      value={value}
      onChange={(_value, option) => {dispatch(action(_value))}}
      data={options}
      rightSection={chevroneImg}
      withCheckIcon={false}
      onDropdownOpen={() => {setIsOpen(true)}}
      onDropdownClose={() => {setIsOpen(false)}}
    />
  )
};

export default FiltersSelect;
*/
import React, { useState } from 'react';
import classes from './Select.module.css';
import { MultiSelect, Select } from '@mantine/core';
import chevrone from 'assets/ChevronDown.svg';
import { useDispatch, useSelector } from 'react-redux';

const FiltersSelect = ({ options, label, placeholder, storeParam, action, isMulti }) => {
  const [isOpen, setIsOpen] = useState(false);
  const chevroneImg = (
      <img
          src={chevrone}
          className={isOpen ? classes.openedChevron : classes.closedChevron}
          alt=""
      />
  );

  const value = useSelector((state) => state.query.params[storeParam]);
  const dispatch = useDispatch();

  const handleChange = (selectedValue) => {
    // Если `isMulti`, приводим массив значений к строке
    const updatedValue = isMulti ? selectedValue.join(', ') : selectedValue;

    // Диспатчим действие, если оно валидное
    if (action) {
      dispatch(action(updatedValue));
    } else {
      console.error('Action is undefined or invalid:', action);
    }
  };

  return isMulti ? (
      <MultiSelect
          classNames={{
            label: classes.label,
            input: classes.input,
            option: classes.option,
            wrapper: classes.wrapper,
            pill: classes.pill,
            pillsList: classes.pillsList,
          }}
          label={label}
          placeholder={!value && placeholder}
          value={value ? value.split(', ') : []}
          onChange={handleChange}
          data={options}
          rightSection={chevroneImg}
          withCheckIcon={false}
          w={'100%'}
          onDropdownOpen={() => setIsOpen(true)}
          onDropdownClose={() => setIsOpen(false)}
      />
  ) : (
      <Select
          classNames={{
            label: classes.label,
            input: classes.input,
            option: classes.option,
            wrapper: classes.wrapper,
          }}
          label={label}
          placeholder={placeholder}
          value={value}
          onChange={handleChange}
          data={options}
          rightSection={chevroneImg}
          withCheckIcon={false}
          onDropdownOpen={() => setIsOpen(true)}
          onDropdownClose={() => setIsOpen(false)}
      />
  );
};

export default FiltersSelect;

