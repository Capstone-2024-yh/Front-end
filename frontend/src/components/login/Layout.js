import React, { useState, useEffect } from 'react';
import { AppBar, Toolbar, Typography, Container, Button, Drawer, IconButton } from '@mui/material';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../../store/authSlice';
import { Outlet } from 'react-router-dom'; // Outlet 임포트
import UserDashBar from '../panel/UserDashBar';
import { loginSuccess } from '../../store/authSlice';
import MenuIcon from '@mui/icons-material/Menu';

function Layout() {
  const { isAuthenticated } = useSelector((state) => state.auth); // 로그인 상태 가져오기
  const dispatch = useDispatch();
  const [showDashBar, setShowDashBar] = useState(false);

  useEffect(() => {
    const savedAuth = localStorage.getItem('auth');
    if (savedAuth) {
      const authData = JSON.parse(savedAuth);
      if (authData.isAuthenticated) {
        dispatch(loginSuccess(authData.user)); // 로그인 상태 복원
      }
    }
  }, [dispatch]);

  const handleLogout = () => {
    dispatch(logoutSuccess()); // 로그아웃 액션 디스패치
    setTimeout(() => {
        window.location.reload();  // 페이지 새로고침
    }, 0);
  };

  const toggleDashBar = () => {
    setShowDashBar(!showDashBar); // 대시바 토글
  };

  return (
    <div>
      <AppBar position="sticky" sx={{ backgroundColor: '#C8A2C8' }}>
        <Toolbar>
          {/* 메뉴 토글 버튼 */}
          <IconButton color="inherit" onClick={toggleDashBar}>
            <MenuIcon />
          </IconButton>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            <Link to="/" style={{ textDecoration: 'none', color: '#fff' }}>
              Capstone
            </Link>
          </Typography>
          <Button
            component={Link}
            to="/compare-page"
            variant="outlined"
            color="inherit"
            style={{ margin: '0 10px' }}
          >
            비교하세요!
          </Button>
          <Button
            component={Link}
            to="/space-registeration"
            variant="outlined"
            color="inherit"
            style={{ margin: '0 10px' }}
          >
            공간 등록
          </Button>
          {!isAuthenticated && (
            <div>
              <Button
                component={Link}
                to="/login"
                variant="outlined"
                color="inherit"
                style={{ margin: '0 10px' }}
              >
                로그인
              </Button>
              <Button
                component={Link}
                to="/register"
                variant="outlined"
                color="inherit"
                style={{ margin: '0 10px' }}
              >
                회원가입
              </Button>
            </div>
          )}
          {isAuthenticated && (
            <div>
              <Button color="inherit" onClick={handleLogout}>
                로그아웃
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>

      {/* Drawer를 사용해 UserDashBar를 사이드 패널처럼 보여줌 */}
      <Drawer anchor="left" open={showDashBar} onClose={toggleDashBar}>
        <UserDashBar />
      </Drawer>
      
      <Container style={{ marginTop: '20px' }}>
        {/* children 대신 Outlet 사용 */}
        <Outlet />
      </Container>
    </div>
  );
}

export default Layout;
