import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert } from '@mui/material';
import axios from '../../axiosConfig';
import { useDispatch, useSelector } from 'react-redux';
import { loginSuccess } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';

function Login() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Redux 상태를 불러와서 콘솔에 출력해보는 방법
  const authState = useSelector((state) => state.auth);
  console.log('Redux Auth State:', authState);

  const handleLogin = async (e) => {
    e.preventDefault();
  
    try {
      const response = await axios.post('/auth/login', {
        "email": email,
        "password": password,
      });
  
      if (response.status === 200) {
        // 응답 데이터 전체 확인
        console.log('Login response data:', response.data);
  
        // response.data에서 사용자 ID 추출
        const id = response.data;
        console.log('Extracted ID:', id); // id 값 확인
  
        // loginSuccess 액션에 사용자 ID만 전달하여 저장
        dispatch(loginSuccess({ id }));
  
        navigate('/main'); 
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('회원정보가 존재하지 않습니다.');
      } else {
        setErrorMessage('로그인에 문제가 발생하였습니다.');
      }
    }
  };

  const handleRegisterRedirect = () => {
    navigate('/register'); // Register 페이지로 이동
  };

  return (
    <Box
      component="form"
      onSubmit={handleLogin}
      sx={{
        maxWidth: 400,
        mx: 'auto',
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
      }}
    >
      <Typography variant="h5" component="h1" align="center" gutterBottom>
        로그인
      </Typography>
      <TextField
        label="이메일"
        fullWidth
        margin="normal"
        value={email}
        onChange={(e) => setEmail(e.target.value)}
      />
      <TextField
        label="비밀번호"
        type="password"
        fullWidth
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
      />
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        로그인
      </Button>
      <Typography
        variant="body2"
        align="center"
        sx={{ mt: 2, cursor: 'pointer', textDecoration: 'underline' }}
        onClick={handleRegisterRedirect}
        color="primary"
      >
        계정 만들기
      </Typography>
    </Box>
  );
}

export default Login;
