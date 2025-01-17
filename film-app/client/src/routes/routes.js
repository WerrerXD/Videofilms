import {
  MOVIES_ROUTE,
  MOVIE_ROUTE,
  RATED_MOVIES_ROUTE,
  REGISTER_ROUTE,
  LOGIN_ROUTE, LOGOUT_ROUTE, CART_ROUTE, ORDERS_ROUTE, WISHLIST_ROUTE, LICENSES_ROUTE, PAIDMOVIES_ROUTE, ADMIN_ROUTE
} from "../utils/consts";
import Movies from "pages/MoviesPage"
import Movie from "pages/MovieDetailsPage"
import RatedMovies from "pages/RatedMovies"
import LoginPage from "../pages/LoginPage";
import RegisterPage from "../pages/RegisterPage";
import Logout from "../pages/Logout";
import CartPage from "../pages/CartPage";
import OrdersPage from "../pages/OrdersPage";
import WishlistPage from "../pages/WishlistPage";
import LicensesPage from "../pages/LicensesPage";
import WatchedMoviesPage from "../pages/WatchedMoviesPage";
import AdminPanel from "../pages/AdminPanel";

export const routes = [
  {
    path: MOVIES_ROUTE,
    Component: Movies
  },
  {
    path: MOVIE_ROUTE + '/:id',
    Component: Movie
  },
  {
    path: RATED_MOVIES_ROUTE,
    Component: RatedMovies
  },
  {
    path: LOGIN_ROUTE,
    Component: LoginPage
  },
  {
    path: REGISTER_ROUTE,
    Component: RegisterPage
  },
  {
    path: LOGOUT_ROUTE,
    Component: Logout
  },
  {
    path: CART_ROUTE,
    Component: CartPage
  },
  {
    path: ORDERS_ROUTE,
    Component: OrdersPage
  },
  {
    path: WISHLIST_ROUTE,
    Component: WishlistPage
  },
  {
    path: LICENSES_ROUTE,
    Component: LicensesPage
  },
  {
    path: PAIDMOVIES_ROUTE,
    Component: WatchedMoviesPage
  },
  {
    path: ADMIN_ROUTE,
    Component: AdminPanel,
    adminOnly: true,
  }
]