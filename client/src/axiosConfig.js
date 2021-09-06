import axios from 'axios';

console.log(`### axios config: ${process.env.NODE_ENV}`);

let baseURL;
if (process.env.NODE_ENV === 'development') {
  baseURL = 'http://localhost:5000/api';
} else {
  baseURL = 'https://ourdatinghistory.herokuapp.com/api';
}
export const axiosInst = axios.create({
  baseURL,
});
