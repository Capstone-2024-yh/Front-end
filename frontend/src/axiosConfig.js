import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.REACT_APP_BASE_URL,
  // baseURL: 'http://localhost:8080',
  withCredentials: false,  // 쿠키 기반 인증을 위한 옵션
});

export default instance;
