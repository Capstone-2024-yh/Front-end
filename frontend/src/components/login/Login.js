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
        email,
        password,
      });

      if (response.status === 200) {
        dispatch(loginSuccess({ email }));
        // 로그인 성공 시 KakaoMap 페이지로 이동
        navigate('/main'); // '/map' 경로로 리디렉션
      }
    } catch (error) {
      if (error.response && error.response.status === 401) {
        setErrorMessage('Invalid credentials');
      } else {
        setErrorMessage('An error occurred');
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
