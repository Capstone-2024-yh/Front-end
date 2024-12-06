import React, { useEffect, useState } from 'react';
import { useSelector } from 'react-redux';
import { useNavigate } from 'react-router-dom';
import { Box, Button } from '@mui/material';
import StyledButton from '../../styles/StyledButton';
import KakaoMap from '../map/KakaoMap';
import axios from '../../axiosConfig';

const MainPage = () => {
  const user = useSelector((state) => state.auth.user);
  const navigate = useNavigate();
  const [popularTags, setPopularTags] = useState([]);

  console.log(user);
  
  useEffect(() => {
    const fetchPopularTags = async () => {
      try {
        // 백엔드에서 인기 태그 데이터를 받아오는 부분
        const response = await axios.get('/search-summary/latest'); // API 엔드포인트 수정
        const tags = response.data
          .slice(0, 7) // 상위 7개의 태그만 사용
          .map((tag) => tag.tokenText.replace('O/', '')); // "O/" 제거
        setPopularTags(tags);
        console.log('Popular tags:', tags);
      } catch (error) {
        console.error('Failed to fetch popular tags:', error);
        // 요청 실패 시 임시 태그 사용
        setPopularTags(['스터디룸', '야외 공연', '회의실', '야외', '녹음실', '주차장', '파티룸']);
      }
    };

    fetchPopularTags();
  }, []);

  const handleTagClick = (tag) => {
    navigate(`/location-list?tag=${tag}`);
  };

  const handleTypeClick = (type) => {
    navigate(`/location-list?type=${type}`);
  };

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>어떻게 할지 감이 안오시나요?</h2>
      <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
        <Button
          onClick={() => navigate('/prompt')}
          sx={{
            backgroundColor: '#C8A2C8',     // 버튼 배경색 설정
            color: 'white',                 // 버튼 텍스트 색상
            fontSize: '1.2rem',             // 텍스트 크기
            padding: '12px 24px',           // 버튼 내부 여백 설정
            borderRadius: '8px',            // 모서리 둥글게 설정
            '&:hover': {
              backgroundColor: '#B389B3',   // 호버 시 색상 변경
            },
          }}
        >
          직접 물어보세요!
        </Button>
      </Box>

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
