import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Avatar, Box, Button, Typography, List, ListItem, ListItemText, Paper, Drawer } from '@mui/material';
import LogoutIcon from '@mui/icons-material/Logout';
import AccessibilityNewIcon from '@mui/icons-material/AccessibilityNew';
import axios from 'axios'; // axios 임포트
import { logoutSuccess } from '../../store/authSlice';

// 더미 데이터 예시
const dummyUser = {
  name: "홍길동",
  email: "hong@example.com",
  profileImage: "https://via.placeholder.com/150",
  reservations: [
    { id: 1, spaceName: "스터디룸 A", date: "2024-10-05", status: "확정" },
    { id: 2, spaceName: "파티룸 B", date: "2024-10-12", status: "취소됨" },
  ],
};

const UserDashBar = () => {  
  // 상태 관리 예시
  const dispatch = useDispatch();
  const navigate = useNavigate();
  /*
  const [user, setUser] = useState(dummyUser);
  const [reservations, setReservations] = useState(user.reservations);
  */
  const [user] = useState(dummyUser);
  const [reservations] = useState(user.reservations);
  const [sidebarOpen, setSidebarOpen] = useState(true);

  useEffect(() => {
    // 백엔드에서 데이터를 받아오는 함수
    /*
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/user/dashBar'); // 백엔드에서 데이터 가져오기
        const fetchedData = response.data;

        // 백엔드에서 가져온 데이터로 상태 업데이트
        setUser(fetchedData);
        setReservations(fetchedData.reservations);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
        // 오류 발생 시 더미 데이터 유지
      }
    };

    fetchData();
    */
  }, []);

  const handleUser = (user) => {
    setSidebarOpen(false);
    navigate(`/user-page?user=${user.name}`);
    setTimeout(() => {
        window.location.reload();  // 페이지 새로고침
    }, 0);
  };

  // 로그아웃 기능 구현
  const handleLogout = async () => {
    console.log("로그아웃 처리");
    try {
        // 백엔드에 로그아웃 요청 (토큰 무효화 등)
        await axios.post('/api/auth/logout');

        // 로그아웃 성공 시 Redux 상태 업데이트
        dispatch(logoutSuccess());
    } catch (error) {
        console.error('로그아웃 중 오류가 발생했습니다:', error);
    }
  };

  return (
    <Drawer
      variant="persistent"
      open={sidebarOpen} // 사이드바 열림/닫힘 상태에 따라 Drawer 컴포넌트 렌더링
      onClose={() => setSidebarOpen(false)} // 사이드바 닫기
    >
        <Box sx={{ padding: '20px', maxWidth: '900px', margin: 'auto', marginTop: '10px' }}>
            {/* 1. 사용자 정보 섹션 */}
            <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px' }}>
                <Box sx={{ display: 'flex', alignItems: 'center' }}>
                <Avatar src={user.profileImage} alt={user.name} sx={{ width: 100, height: 100, marginRight: '20px' }} />
                <Box>
                    <Typography variant="h5">{user.name}</Typography>
                    <Typography variant="body1">{user.email}</Typography>
                    <Button variant="outlined" sx={{ marginTop: '10px' }}>프로필 수정</Button>
                </Box>
                </Box>
            </Paper>

            {/* 2. 예약 및 스케줄 관리 */}
            <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px' }}>
                <Typography variant="h6" gutterBottom>예약 내역</Typography>
                <List>
                {reservations.length === 0 ? (
                    <Typography>예약 내역이 없습니다.</Typography>
                ) : (
                    reservations.map((reservation) => (
                    <ListItem key={reservation.id}>
                        <ListItemText
                        primary={reservation.spaceName}
                        secondary={`날짜: ${reservation.date} | 상태: ${reservation.status}`}
                        />
                    </ListItem>
                    ))
                )}
                </List>
                <Button variant="contained" sx={{ marginTop: '10px' }}>새 예약 만들기</Button>
            </Paper>

            {/* 3. 로그아웃 및 기타 설정 */}
            <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'flex-end', gap: '30px' }}>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<AccessibilityNewIcon />}
                    BackdropProps={{ invisible: true }}
                    hideBackdrop={true}
                    onClick={handleUser}
                >
                    마이페이지
                </Button>
                <Button
                    variant="contained"
                    color="secondary"
                    startIcon={<LogoutIcon />}
                    onClick={handleLogout}
                >
                    로그아웃
                </Button>
            </Paper>
        </Box>
    </Drawer>
  );
};

export default UserDashBar;
