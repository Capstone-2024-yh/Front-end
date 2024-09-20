import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../../store/authSlice';

function Layout({ children }) {
  const { isAuthenticated } = useSelector((state) => state.auth); // 로그인 상태 가져오기
  const dispatch = useDispatch();

  const handleLogout = () => {
    dispatch(logoutSuccess()); // 로그아웃 액션 디스패치
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Capstone
          </Typography>
          <Link to="/login" style={{ margin: '0 10px', color: '#fff' }}>Login</Link>
          <Link to="/register" style={{ margin: '0 10px', color: '#fff' }}>Register</Link>
          {/*
          <Link to="/status" style={{ margin: '0 10px', color: '#fff' }}>Status</Link>
          */}
          {isAuthenticated && (
            <Button color="inherit" onClick={handleLogout}>
              Logout
            </Button>
          )}
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        {children}
      </Container>
    </div>
  );
}

export default Layout;
