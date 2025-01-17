import axios from "axios"

const $movies = axios.create({
  baseURL: 'http://localhost:5108/'
})

export default $movies
