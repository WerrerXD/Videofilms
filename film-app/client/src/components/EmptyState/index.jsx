import React from 'react';
import { Stack } from '@mantine/core';
import classes from './EmptyState.module.css'

const EmptyState = ({icon, text}) => {
  return (
    <Stack align='center' justify='center'>
      <img src={icon} alt='' />
      <span className={classes.text}>{text}</span>
    </Stack>
  );
};

export default EmptyState;
