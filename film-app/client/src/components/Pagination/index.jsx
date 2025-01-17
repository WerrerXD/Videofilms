import React from 'react';
import { Pagination } from '@mantine/core';
import classes from './Pagination.module.css'

const CustomPagination = ({total, value, onChange}) => {
  return (
    <Pagination
      classNames={{control: classes.control}}
      total={total}
      value={value}
      onChange={onChange}
    />
  );
};

export default CustomPagination;