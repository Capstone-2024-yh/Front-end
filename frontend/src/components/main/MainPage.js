import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { logoutSuccess } from '../../store/authSlice';
import { useNavigate } from 'react-router-dom';
import StyledButton from '../../styles/StyledButton';

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
          <h1>Welcome, {user && user.username}!</h1>
          <StyledButton onClick={handleLogout}>Logout</StyledButton>
        </>
      ) : (
        <>
          <h1>Welcome, Guest!</h1>
          <p>
            Please log in to use all features.  
            <StyledButton onClick={() => navigate('/login')}>Go to Login</StyledButton>
          </p>
        </>
      )}

      {/* 버튼들을 테이블 형식으로 배치 */}
      <table style={{ width: '100%', marginTop: '20px' }}>
        <tbody>
          <tr>
            <td>
              <StyledButton onClick={handleBookVenue}>Book a Venue</StyledButton>
            </td>
            <td>
              <StyledButton onClick={handleViewRecommendations}>View Recommendations</StyledButton>
            </td>
          </tr>
          <tr>
            <td>
              <StyledButton onClick={handleViewReservations}>View My Reservations</StyledButton>
            </td>
            <td>
              <StyledButton onClick={() => navigate('/map')}>Open Kakao Map</StyledButton>
            </td>
          </tr>
        </tbody>
      </table>

      {/* 다른 콘텐츠 */}
      <p>{isAuthenticated ? '' : 'Log in to book or save your favorite places.'}</p>
    </div>
  );
};

export default MainPage;
