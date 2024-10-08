import axios from 'axios';

const instance = axios.create({
  baseURL: process.env.BASE_URL,  // Spring Boot 서버의 기본 URL
  withCredentials: true,  // 쿠키 기반 인증을 위한 옵션
});

export default instance;
