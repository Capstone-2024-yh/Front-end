import React, { useState, useEffect } from 'react';
import { useDispatch } from 'react-redux';
import { Avatar, Box, Button, Typography, List, ListItem, ListItemText, IconButton, Paper } from '@mui/material';
import FavoriteIcon from '@mui/icons-material/Favorite';
import LogoutIcon from '@mui/icons-material/Logout';
import CreditCardIcon from '@mui/icons-material/CreditCard';
import DeleteIcon from '@mui/icons-material/Delete';
import axios from '../../axiosConfig'; // axios 임포트
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
  reviews: [
    { id: 1, spaceName: "스터디룸 A", content: "아주 좋았습니다!" },
    { id: 2, spaceName: "카페 C", content: "분위기가 정말 멋졌어요." }
  ],
  wishlist: [
    { id: 1, spaceName: "세미나실 D" },
    { id: 2, spaceName: "공유 주방 E" }
  ],
  paymentMethods: [
    { id: 1, cardName: "신한카드", cardNumber: "**** **** **** 1234" },
    { id: 2, cardName: "국민카드", cardNumber: "**** **** **** 5678" }
  ]
};

const UserDashboard = () => {
  // 상태 관리 예시
  const dispatch = useDispatch();
  /*
  const [user, setUser] = useState(dummyUser);
  const [reservations, setReservations] = useState(user.reservations);
  const [reviews, setReviews] = useState(user.reviews);
  const [wishlist, setWishlist] = useState(user.wishlist);
  const [paymentMethods, setPaymentMethods] = useState(user.paymentMethods);
  */
  const [user] = useState(dummyUser);
  const [reservations] = useState(user.reservations);
  const [reviews] = useState(user.reviews);
  const [wishlist] = useState(user.wishlist);
  const [paymentMethods] = useState(user.paymentMethods);

  useEffect(() => {
    // 백엔드에서 데이터를 받아오는 함수
    /*
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/user/dashboard'); // 백엔드에서 데이터 가져오기
        const fetchedData = response.data;

        // 백엔드에서 가져온 데이터로 상태 업데이트
        setUser(fetchedData);
        setReservations(fetchedData.reservations);
        setReviews(fetchedData.reviews);
        setWishlist(fetchedData.wishlist);
        setPaymentMethods(fetchedData.paymentMethods);
      } catch (error) {
        console.error('데이터를 가져오는 중 오류가 발생했습니다:', error);
        // 오류 발생 시 더미 데이터 유지
      }
    };

    fetchData();
    */
  }, []);

  // 로그아웃 기능 구현 예시
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
    <Box sx={{ padding: '20px', maxWidth: '900px', margin: 'auto' }}>
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

      {/* 3. 리뷰 및 평가 */}
      <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>내 리뷰</Typography>
        <List>
          {reviews.length === 0 ? (
            <Typography>작성된 리뷰가 없습니다.</Typography>
          ) : (
            reviews.map((review) => (
              <ListItem key={review.id}>
                <ListItemText
                  primary={review.spaceName}
                  secondary={review.content}
                />
              </ListItem>
            ))
          )}
        </List>
        <Button variant="contained" sx={{ marginTop: '10px' }}>리뷰 작성하기</Button>
      </Paper>

      {/* 8. 위시리스트 / 즐겨찾기 */}
      <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>즐겨찾기한 공간</Typography>
        <List>
          {wishlist.length === 0 ? (
            <Typography>위시리스트가 비어 있습니다.</Typography>
          ) : (
            wishlist.map((item) => (
              <ListItem key={item.id}>
                <ListItemText primary={item.spaceName} />
                <IconButton edge="end">
                  <FavoriteIcon color="error" />
                </IconButton>
              </ListItem>
            ))
          )}
        </List>
      </Paper>

      {/* 9. 결제 수단 관리 */}
      <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px' }}>
        <Typography variant="h6" gutterBottom>결제 수단 관리</Typography>
        <List>
          {paymentMethods.length === 0 ? (
            <Typography>등록된 결제 수단이 없습니다.</Typography>
          ) : (
            paymentMethods.map((method) => (
              <ListItem key={method.id}>
                <ListItemText primary={method.cardName} secondary={method.cardNumber} />
                <IconButton edge="end">
                  <DeleteIcon color="error" />
                </IconButton>
              </ListItem>
            ))
          )}
        </List>
        <Button variant="contained" sx={{ marginTop: '10px' }} startIcon={<CreditCardIcon />}>
          결제 수단 추가
        </Button>
      </Paper>

      {/* 10. 로그아웃 및 기타 설정 */}
      <Paper elevation={3} sx={{ padding: '20px', marginBottom: '20px', display: 'flex', justifyContent: 'flex-end' }}>
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
  );
};

export default UserDashboard;
