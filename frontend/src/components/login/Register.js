import React, { useState } from 'react';
import { TextField, Button, Typography, Box, Alert, FormControlLabel, Radio, RadioGroup } from '@mui/material';
import axios from '../../axiosConfig';
import { useNavigate } from 'react-router-dom';

function Register() {
  const [username, setUsername] = useState('');
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [userType, setUserType] = useState(''); // 회원의 종류 상태 관리
  const [errorMessage, setErrorMessage] = useState('');
  const navigate = useNavigate();

  const handleRegister = async (e) => {
    e.preventDefault();

    // 회원 종류 확인 (이용자 또는 사업자 중 하나 선택)
    if (!userType) {
      setErrorMessage('회원의 종류를 선택해주세요.');
      return;
    }

    try {
      const response = await axios.post('/auth/register', {
        username,
        email,
        password,
        userType,
      });

      if (response.status === 200) {
        alert('회원가입에 성공하였습니다.');
        navigate('/login');
      }
    } catch (error) {
      setErrorMessage('회원가입에 실패하였습니다.');
    }
  };

  return (
    <Box
      component="form"
      onSubmit={handleRegister}
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
        회원가입
      </Typography>
      <TextField
        label="회원 아이디"
        fullWidth
        margin="normal"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
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
      <Typography variant="subtitle1" gutterBottom sx={{ mt: 2, textAlign: 'center' }}>
        회원 종류 선택:
      </Typography>
      <RadioGroup
        row
        value={userType}
        onChange={(e) => setUserType(e.target.value)}
        sx={{ justifyContent: 'center' }}
      >
        <FormControlLabel
          value="이용자"
          control={<Radio />}
          label="이용자"
        />
        <FormControlLabel
          value="사업자"
          control={<Radio />}
          label="사업자"
        />
      </RadioGroup>
      {errorMessage && <Alert severity="error">{errorMessage}</Alert>}
      <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
        회원 가입하기
      </Button>
    </Box>
  );
}

export default Register;
