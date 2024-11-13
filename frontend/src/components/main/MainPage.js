import React, { useEffect, useState } from 'react';
import { useSelector, useDispatch } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import { logoutSuccess } from '../../store/authSlice';
import StyledButton from '../../styles/StyledButton';
import KakaoMap from '../map/KakaoMap';
import CommonPrompt from './CommonPrompt';
import SearchBar from '../panel/SearchBar';
// import axios from '../../axiosConfig';

const MainPage = () => {
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);
  const user = useSelector((state) => state.auth.user);
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const [popularTags, setPopularTags] = useState([]);

  console.log(user);
  
  useEffect(() => {
    const fetchPopularTags = async () => {
      /*
      try {
        // 백엔드에서 인기 태그 데이터를 받아오는 부분
        const response = await axios.get('/api/popular-tags'); // API 엔드포인트 수정
        setPopularTags(response.data.tags); // 받아온 태그 데이터를 상태에 저장
      } catch (error) {
        console.error('Failed to fetch popular tags:', error);
        // 백엔드 요청 실패 시 임시 태그 사용
        setPopularTags(['#조은거', '#더조은거', '#더더조은거', '#매우조은거', '#좋지안은거', '#더좋지안은거', '#평범한거']);
      }
      */
      setPopularTags(['#조은거', '#더조은거', '#더더조은거', '#매우조은거', '#좋지안은거', '#더좋지안은거', '#평범한거']);
    };

    fetchPopularTags();
  }, []);

  const handleLogout = () => {
    dispatch(logoutSuccess());
    navigate('/');
  };

  const handleTagClick = (tag) => {
    navigate(`/location-list?tag=${tag}`);
  };

  const handleTypeClick = (type) => {
    navigate(`/location-list?type=${type}`);
  };

  const handleSearch = (query) => {
    navigate(`/search-results?query=${query}`);
  };

  return (
    <div>
      <SearchBar onSearch={handleSearch} />

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
      <CommonPrompt/>

      {/* 인기 태그 표시 */}
      <h2 style={{ textAlign: 'center' }}>인기 태그들을 확인해보세요!</h2>
      <Box sx={{ display: 'flex', justifyContent: 'center', marginTop: '20px', marginBottom: '20px' }}>
        {popularTags.map((tag, index) => (
          <Button
            key={index}
            variant="outlined"
            sx={{ margin: '5px', textTransform: 'none' }}
            onClick={() => handleTagClick(tag)}
          >
            {tag}
          </Button>
        ))}
      </Box>

      <Box sx={{ marginTop: 4 }}></Box>
      
      {/* 버튼들을 틀 안에 묶음 */}
      <h2 style={{ textAlign: 'center' }}>찾는 공간이 있나요?</h2>
      <fieldset style={{ border: '2px solid #ccc', padding: '20px', margin: '20px auto', width: 'fit-content' }}>
        {/* 첫 번째 줄 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('파티룸')} style={{ padding: '10px 20px' }}>
              파티룸
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('스터디룸')} style={{ padding: '10px 20px' }}>
              스터디룸
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('강의실')} style={{ padding: '10px 20px' }}>
              강의실
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('카페')} style={{ padding: '10px 20px' }}>
              카페
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('공유주방')} style={{ padding: '10px 20px' }}>
              공유주방
            </StyledButton>
          </td>
        </div>

        {/* 두 번째 줄 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('회의실')} style={{ padding: '10px 20px' }}>
              회의실
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('세미나실')} style={{ padding: '10px 20px' }}>
              세미나실
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('연습실')} style={{ padding: '10px 20px' }}>
              연습실
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('보컬연습실')} style={{ padding: '10px 20px' }}>
              보컬연습실
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('악기연습실')} style={{ padding: '10px 20px' }}>
              악기연습실
            </StyledButton>
          </td>
        </div>

        {/* 세 번째 줄 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('녹음실')} style={{ padding: '10px 20px' }}>
              녹음실
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('운동시설')} style={{ padding: '10px 20px' }}>
              운동시설
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('촬영스튜디오')} style={{ padding: '10px 20px' }}>
              촬영스튜디오
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('호리존')} style={{ padding: '10px 20px' }}>
              호리존
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('라이브방송')} style={{ padding: '10px 20px' }}>
              라이브방송
            </StyledButton>
          </td>
        </div>

        {/* 네 번째 줄 */}
        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('실외촬영')} style={{ padding: '10px 20px' }}>
              실외촬영
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('공연장')} style={{ padding: '10px 20px' }}>
              공연장
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('갤러리')} style={{ padding: '10px 20px' }}>
              갤러리
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('스몰웨딩')} style={{ padding: '10px 20px' }}>
              스몰웨딩
            </StyledButton>
          </td>
          <td style={{ padding: '10px' }}>
            <StyledButton onClick={() => handleTypeClick('컨퍼런스')} style={{ padding: '10px 20px' }}>
              컨퍼런스
            </StyledButton>
          </td>
        </div>
      </fieldset>
      <div style={{ marginBottom: '20px' }}> </div>
      {/* 다른 콘텐츠 */}
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', flexDirection: 'column' }}>
        <h2 style={{ textAlign: 'center' }}>가까운 장소에서 찾아보세요!</h2>
        <KakaoMap style={{ marginBottom: '5px' }} />
      </div>
      {/* <p>{isAuthenticated ? '' : '장소를 예약하거나 등록하기 위해 로그인이 필요합니다.'}</p> */}
    </div>
  );
};

export default MainPage;
