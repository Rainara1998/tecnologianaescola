import axios from 'axios';
const api = axios.create({
  baseURL: "https://tecnologianaescola.herokuapp.com",
})

export default api;