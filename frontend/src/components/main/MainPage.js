import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import StyledButton from '../../styles/StyledButton';
import KakaoMap from '../map/KakaoMap';
import Prompt from './Prompt';

const MainPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate('/login');
  };

  // 각각의 버튼 기능을 구현할 함수들
  const handleBookVenue = () => {
    console.log('Book Venue button clicked');
  };

  const handleViewRecommendations = () => {
    console.log('View Recommendations button clicked');
  };

  const handleViewReservations = () => {
    console.log('View Reservations button clicked');
  };

  return (
    <div>
      {isAuthenticated ? (
        <>
          <h1>어서오세요, {user && user.username}!</h1>
          <StyledButton onClick={handleLogout}>Logout</StyledButton>
        </>
      ) : (
        <>
          <h1>어서오세요, 게스트님!</h1>
          <p>
            모든 기능을 사용하기 위해 로그인이 필요합니다.
            {/*
            <StyledButton onClick={() => navigate('/login')}>Go to Login</StyledButton>
            */}
          </p>
        </>
      )}
      <Prompt/>

      {/* 버튼들을 테이블 형식으로 배치 */}
      <table style={{ margin: '0 auto', marginTop: '20px' }}>
        <tbody>
          {/* 첫 번째 줄 */}
          <tr>
            <td style={{ padding: '10px' }}>
              <StyledButton onClick={handleBookVenue} style={{ padding: '10px 20px' }}>
                예약하기
              </StyledButton>
            </td>
            <td style={{ padding: '10px' }}>
              <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
                추천 장소
              </StyledButton>
            </td>
            <td style={{ padding: '10px' }}>
              <StyledButton onClick={handleViewReservations} style={{ padding: '10px 20px' }}>
                내 장소 보기
              </StyledButton>
            </td>
            <td style={{ padding: '10px' }}>
              <StyledButton onClick={() => navigate('/map')} style={{ padding: '10px 20px' }}>
                지도 보기
              </StyledButton>
            </td>
          </tr>

          {/* 두 번째 줄 */}
          <tr>
            <td style={{ padding: '10px' }}>
              <StyledButton onClick={handleBookVenue} style={{ padding: '10px 20px' }}>
                기능 5
              </StyledButton>
            </td>
            <td style={{ padding: '10px' }}>
              <StyledButton onClick={handleViewRecommendations} style={{ padding: '10px 20px' }}>
                기능 6
              </StyledButton>
            </td>
            <td style={{ padding: '10px' }}>
              <StyledButton onClick={handleViewReservations} style={{ padding: '10px 20px' }}>
                기능 7
              </StyledButton>
            </td>
            <td style={{ padding: '10px' }}>
              <StyledButton onClick={() => navigate('/map')} style={{ padding: '10px 20px' }}>
                기능 8
              </StyledButton>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 다른 콘텐츠 */}
      <KakaoMap/>
      {/* <p>{isAuthenticated ? '' : '장소를 예약하거나 등록하기 위해 로그인이 필요합니다.'}</p> */}
    </div>
  );
};

export default MainPage;
