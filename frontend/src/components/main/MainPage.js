import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import StyledButton from '../../styles/StyledButton';
import KakaoMap from '../map/KakaoMap';
{/*
import Prompt from './Prompt';
*/}

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
      {/* <Prompt/> */}

      {/* 버튼들을 테이블 형식으로 배치 */}
      <table style={{ width: '100%', marginTop: '20px' }}>
        <tbody>
          <tr>
            <td>
              <StyledButton onClick={handleBookVenue}>예약하기</StyledButton>
            </td>
            <td>
              <StyledButton onClick={handleViewRecommendations}>추천 장소</StyledButton>
            </td>
          </tr>
          <tr>
            <td>
              <StyledButton onClick={handleViewReservations}>내 장소 보기</StyledButton>
            </td>
            <td>
              <StyledButton onClick={() => navigate('/map')}>지도 보기</StyledButton>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 다른 콘텐츠 */}
      <KakaoMap/>
      <p>{isAuthenticated ? '' : '장소를 예약하거나 등록하기 위해 로그인이 필요합니다.'}</p>
    </div>
  );
};

export default MainPage;
