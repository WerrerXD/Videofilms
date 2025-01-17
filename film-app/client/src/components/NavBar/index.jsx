import { Group } from '@mantine/core';
import classes from './NavBar.module.css';
import { useLocation } from 'react-router-dom';
import logo from 'assets/logo.svg'


const data = [
  { link: '/', label: 'Фильмы'},
  { link: '/cart', label: 'Корзина'},
  { link: '/orders', label: 'Заказы'},
  { link: '/paidmovies', label: 'Купленные фильмы'},
  { link: '/licenses', label: 'Активные лицензии'},
  { link: '/wishlist', label: 'Список желаемого'}
];


const Navbar = () => {
  const location = useLocation()

  const links = data.map((item) => (
    <a
      className={classes.link}
      data-active={item.link === location.pathname || (item.link === '/' && location.pathname.includes('movie/')) || undefined}
      href={item.link}
      key={item.label}
    >
      <span>{item.label}</span>
    </a>
  ));

  return (
    <nav className={classes.navbar}>
      <div className={classes.navbarMain}>
        <Group className={classes.header} >
        </Group>
        {links}
      </div>
    </nav>
  );
}

export default Navbar