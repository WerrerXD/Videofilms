import React from 'react';
import notFoundImg from 'assets/404img.svg'
import logo from 'assets/logo.svg'
import { Button, Stack, Text } from '@mantine/core';
import { useNavigate } from 'react-router-dom';

const NotFound = () => {
  const navigate = useNavigate()

  return (
    <Stack align='center' justify='center' h='100%' gap='48px'>
      <img src={logo} alt='' style={{position: 'absolute', left: '24px', top: '24px' }} />
      <img width='45%' src={notFoundImg} alt=''/>
      <Stack align='center'>
        <Text fw={600} size='20px'>Мы не можем найти страницу которую вы ищите(((</Text>
        <Button color='#9854F6' radius='8px' onClick={() => {navigate('/')}} >Вернуться на главную</Button>
      </Stack>
    </Stack>
  );
};

export default NotFound;
