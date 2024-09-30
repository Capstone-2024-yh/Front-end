import React, { useState, useEffect } from 'react';
import { Button, Box } from '@mui/material';
import { useNavigate } from 'react-router-dom'; // React Router의 useNavigate 사용
import axios from 'axios';  // 백엔드에서 데이터를 받아오기 위해 axios 사용

const InfoPanel = () => {
  const [locationData, setLocationData] = useState([]);
  //const [error, setError] = useState(null);
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 함수

  // 백엔드에서 데이터 받아오기
  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/locations'); // 실제 API 호출
        const data = Array.isArray(response.data) ? response.data : [];
        setLocationData(data); // 백엔드 데이터 설정
      } catch (error) {
        console.error('Error fetching location data:', error);
        //setError('데이터를 불러오는 데 실패했습니다. 임시 데이터를 사용합니다.'); // 오류 메시지 설정

        // 오류 발생 시 임시 데이터를 설정
        const tempData = Array.from({ length: 10 }, (_, index) => ({
          id: index,
          name: `임시 장소 ${index + 1}`,
          image: 'https://via.placeholder.com/50', // 임시 이미지 URL
          description: `이것은 임시 장소 ${index + 1}에 대한 설명입니다.`,
        }));
        setLocationData(tempData);
      }
    };

    fetchData(); // 데이터 가져오기 함수 호출
  }, []);

  // 버튼 클릭 시 해당 위치로 이동하는 함수
  const handleLocationClick = (location) => {
    if (!location || typeof location.id === 'undefined') {
      console.error('Invalid location object:', location);
      return;
    }
    navigate(`/rental-space/${location.id}`); // ID를 기반으로 페이지 이동
  };

  return (
    <Box
      sx={{
        width: '550px',
        height: '480px', // 지도의 높이와 동일하게 설정
        backgroundColor: '#f9f9f9',
        padding: '10px',
        marginLeft: '20px',
        borderRadius: '5px',
        boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
        position: 'relative', // 필터 버튼을 고정시키기 위해
        display: 'flex',
        flexDirection: 'column', // 필터 버튼과 리스트를 위아래로 배치
      }}
    >
      {/* 필터 설정 버튼 - 스크롤 영향을 받지 않음 */}
      <Box
        sx={{
          position: 'sticky', // 스크롤과 무관하게 고정
          top: 0,
          zIndex: 1, // 버튼을 다른 요소보다 위에 위치하게 함
          backgroundColor: '#f9f9f9', // 버튼의 배경색
          paddingBottom: '10px',
          textAlign: 'right',
        }}
      >
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: '100px',
            height: '40px',
            marginBottom: '10px',
          }}
        >
          필터 설정
        </Button>
      </Box>

      {/* 정보 버튼들 - 스크롤 가능한 영역 */}
      <Box
        sx={{
          overflowY: 'scroll',
          flexGrow: 1, // 남은 공간을 모두 차지하게 함
        }}
      >
        {locationData.map((location, index) => (
          <Button
            key={index}
            variant="outlined"
            fullWidth
            onClick={() => handleLocationClick(location)} // 버튼 클릭 시 해당 위치로 이동
            sx={{
              marginBottom: '10px',
              height: '80px', // 버튼 높이를 현재의 2배로 설정
              display: 'flex',
              justifyContent: 'flex-start', // 좌측 정렬
              alignItems: 'center', // 수직 가운데 정렬
              padding: '10px', // 버튼 내부 패딩
            }}
          >
            {/* 좌측에 이미지 */}
            <img
              src={location.image}
              alt={location.name}
              style={{ width: '50px', height: '50px', marginRight: '15px' }}
            />
            {/* 우측에 글 */}
            <Box sx={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold' }}>{location.name}</div>
              <div>{location.description}</div>
            </Box>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default InfoPanel;
