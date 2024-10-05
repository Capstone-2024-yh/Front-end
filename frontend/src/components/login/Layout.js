import React from 'react';
import { AppBar, Toolbar, Typography, Container, Button } from '@mui/material';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';
import { logoutSuccess } from '../../store/authSlice';
import { Outlet } from 'react-router-dom'; // Outlet 임포트

function Layout() {
  const { isAuthenticated } = useSelector((state) => state.auth); // 로그인 상태 가져오기
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutSuccess()); // 로그아웃 액션 디스패치
  };

  const handleUser = (user) => {
    navigate(`/user-page?user=${user}`);
  };

  return (
    <div>
      <AppBar position="static">
        <Toolbar>
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
              <Button color="inherit" onClick={handleUser}>
                마이페이지
              </Button>
              <Button color="inherit" onClick={handleLogout}>
                로그아웃
              </Button>
            </div>
          )}
        </Toolbar>
      </AppBar>
      
      <Container style={{ marginTop: '20px' }}>
        {/* children 대신 Outlet 사용 */}
        <Outlet />
      </Container>
    </div>
  );
}

export default Layout;
