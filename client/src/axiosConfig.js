import axios from 'axios';

export const axiosInst = axios.create({
  baseURL: 'https://ourdatinghistory.herokuapp.com/api',
});
