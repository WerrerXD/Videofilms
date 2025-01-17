/*
import FiltersSelect from 'components/Select';
import React from 'react';
import { setYear } from 'store/Slices/querySlice';

const Year = () => {
  let yearOptions = []
  const currentYear = new Date().getFullYear();
  for (let year = currentYear; year >= 1874; year--) {
    yearOptions.push(year + '')
  }

  return (
    <FiltersSelect 
      options={yearOptions}
      label='Year'
      placeholder='Select release year'
      storeParam='primary_release_year'
      action={setYear}
    />
  );
};

export default Year;
*/
import React from 'react';
import FiltersSelect from 'components/Select';
import { setYear } from 'store/Slices/querySlice';

const YearFilter = () => {
  const yearOptions = Array.from(
      { length: new Date().getFullYear() - 1873 },
      (_, i) => (new Date().getFullYear() - i).toString()
  );

  return (
      <FiltersSelect
          options={yearOptions}
          label="Год выхода"
          placeholder="Выберите год выхода"
          storeParam="year" // Убедитесь, что это соответствует полю в querySlice
          action={setYear} // Передаем экшен для обновления значения года
      />
  );
};

export default YearFilter;
