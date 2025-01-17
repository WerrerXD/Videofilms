import React, {useEffect, useState} from 'react';
import FiltersSelect from 'components/Select';
import { setSorting } from 'store/Slices/querySlice';
import classes from './Sort.module.css'

const Sort = () => {
  const [sortOptions, setSortOptions] = useState([]);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadSortOptions = async () => {
      try {
        // Данные сортировки можно либо захардкодить, либо загружать с сервера, если требуется динамика.
        const options = [
          { value: 'primary_release_date.asc', label: 'Дата релиза (Более старые сначала)' },
          { value: 'primary_release_date.desc', label: 'Дата релиза (Более новые сначала)' },
          { value: 'title.asc', label: 'Название (А-Я)' },
          { value: 'title.desc', label: 'Название (Я-А)' },
          { value: 'price.asc', label: 'Цена (От дешевого к дорогому)' },
          { value: 'price.desc', label: 'Цена (От дорогого к дешевому)' },
        ];
        setSortOptions(options);
      } catch (error) {
        console.error('Failed to load sort options:', error);
      } finally {
        setIsLoading(false);
      }
    };

    loadSortOptions();
  }, []);

  return (
    <div className={classes.wrapper}>
      <FiltersSelect 
        options={sortOptions} 
        label='Сортировать по' 
        placeholder='Выберите сортировку' 
        storeParam='sortBy' 
        action={setSorting}
      />
    </div>
  );
};

export default Sort;
