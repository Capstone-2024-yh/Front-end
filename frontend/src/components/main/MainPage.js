import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box } from '@mui/material';
import { logoutSuccess } from '../../store/authSlice';
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

      <Box sx={{ marginTop: 4 }}></Box>
      
      {/* 버튼들을 틀 안에 묶음 */}
      <h2 style={{ textAlign: 'center' }}>찾는 공간이 있나요?</h2>
      <fieldset style={{ border: '2px solid #ccc', padding: '20px', margin: '20px auto', width: 'fit-content' }}>
        {/* 첫 번째 줄 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              파티룸
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              스터디룸
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              강의실
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              카페
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              공유주방
            </StyledButton>
          </td>
        </div>

        {/* 두 번째 줄 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              회의실
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              세미나실
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              연습실
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              보컬연습실
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              악기연습실
            </StyledButton>
          </td>
        </div>

        {/* 세 번째 줄 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              녹음실
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              운동시설
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              촬영스튜디오
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              호리존
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              라이브방송
            </StyledButton>
          </td>
        </div>

        {/* 네 번째 줄 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              실외촬영
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              공연장
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              갤러리
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              스몰웨딩
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => navigate('/location-list')} style={{ padding: '10px 20px' }}>
              컨퍼런스
            </StyledButton>
          </td>
        </div>
      </fieldset>
      <div style={{ marginBottom: '20px' }}> </div>
      {/* 다른 콘텐츠 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <KakaoMap style={{ marginBottom: '5px' }} />
      </div>
      {/* <p>{isAuthenticated ? '' : '장소를 예약하거나 등록하기 위해 로그인이 필요합니다.'}</p> */}
    </div>
  );
};

export default MainPage;
