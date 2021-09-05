import axios from 'axios';

export const axiosInst = axios.create({
  baseURL: 'https://ourdatinghistory.herokuapp.com/api',
});
// export const axiosInst = axios.create({
//   baseURL: 'http://localhost:5000/api',
// });
