// 사이드바 레이아웃을 위한 임시 코드

import React, { useState } from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Drawer, IconButton } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../../store/authSlice';
import { Outlet } from 'react-router-dom';
import UserDashboard from '../main/UserDashBoard'; // UserDashboard 임포트
import MenuIcon from '@mui/icons-material/Menu'; // 메뉴 아이콘 임포트

function Layout() {
  const { isAuthenticated } = useSelector((state) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [showDashboard, setShowDashboard] = useState(false); // 대시보드 상태 관리

  const handleLogout = () => {
    dispatch(logoutSuccess());
  };

  const toggleDashboard = () => {
    setShowDashboard(!showDashboard); // 대시보드 토글
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          {/* 메뉴 토글 버튼 */}
          {isAuthenticated && (
            <div>
              <IconButton color="inherit" onClick={toggleDashboard}>
                <MenuIcon />
              </IconButton>
            </div>
          )}
          {/* 임시 토글 버튼 */}
          <IconButton color="inherit" onClick={toggleDashboard}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
              Capstone
            </Link>
          </Typography>
          <Button
            component={Link}
            to="/space-registeration"
            variant="outlined"
            color="inherit"
            style={{ margin: '0 10px' }}
          >
            공간 등록
          </Button>
          {isAuthenticated && (
            <div>
              <Button color="inherit" onClick={handleLogout}>
                로그아웃
              </Button>
            </div>
          )}
          {!isAuthenticated && (
            <div>
              <Button component={Link} to="/login" variant="outlined" color="inherit" style={{ margin: '0 10px' }}>
                로그인
              </Button>
              <Button component={Link} to="/register" variant="outlined" color="inherit" style={{ margin: '0 10px' }}>
                회원가입
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer를 사용해 UserDashboard를 사이드 패널처럼 보여줌 */}
      <Drawer anchor="left" open={showDashboard} onClose={toggleDashboard}>
        <UserDashboard />
      </Drawer>

      <Container style={{ marginTop: '20px' }}>
        <Outlet />
      </Container>
    </div>
  );
}

export default Layout;
