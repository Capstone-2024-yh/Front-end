import React, { useState, useEffect } from 'react';
import { Box, Button, Grid } from '@mui/material';
// import axios from '../../axiosConfig'; // 백엔드와의 통신 부분은 주석 처리

const LocationList = () => {
  const [locationData, setLocationData] = useState([]);

  useEffect(() => {
    // 주석 해제 시 백엔드로부터 데이터를 받아옴
    /*
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/locations'); // API 경로 예시
        setLocationData(response.data);
      } catch (error) {
        console.error('Error fetching location data:', error);
      }
    };
    fetchData();
    */
    
    // 임시 데이터 설정 (주석 처리 가능)
    const tempData = Array.from({ length: 12 }, (_, index) => ({
      id: index,
      name: `임시 장소 ${index + 1}`,
      image: 'https://via.placeholder.com/150',  // 임시 이미지 URL
      description: `이것은 임시 장소 ${index + 1}에 대한 설명입니다.`,
    }));
    setLocationData(tempData);
  }, []);

  // 버튼을 클릭했을 때 실행되는 함수
  const handleClick = (location) => {
    console.log(`${location.name} 버튼 클릭됨`);
  };

  return (
    <Box
      sx={{
        width: '100%',
        height: '100vh',
        backgroundColor: '#f5f5f5',
        padding: '20px',
      }}
    >
      {/* 필터 박스 */}
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '20px',
          backgroundColor: '#e0e0e0',
          padding: '10px',
        }}
      >
        {/* 좌측 아이콘과 필터 옵션 */}
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>👍 무료</span>
          <span>💡 할인 중</span>
        </Box>

        {/* 우측 필터 설정 버튼 */}
        <Button
          variant="contained"
          color="primary"
          sx={{
            width: '100px',
            height: '40px',
          }}
        >
          필터 설정
        </Button>
      </Box>

      {/* 목록 박스 */}
      <Box
        sx={{
          overflowY: 'scroll',
          height: 'calc(100vh - 100px)', // 전체 높이에서 필터 박스와 여백을 제외한 높이
          paddingRight: '10px',
        }}
      >
        <Grid container spacing={2}>
          {/* 임시 정보 버튼들 */}
          {locationData.map((location, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Button
                onClick={() => handleClick(location)} // 버튼 클릭 시 실행
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  padding: '10px',
                  textAlign: 'center',
                  width: '100%', // 버튼이 그리드 안에서 가득 차도록 설정
                  display: 'flex',
                  flexDirection: 'column', // 상단에 이미지, 중간에 제목, 하단에 설명
                  alignItems: 'center', // 가운데 정렬
                }}
              >
                {/* 이미지 */}
                <img
                  src={location.image}
                  alt={location.name}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    marginBottom: '10px',
                  }}
                />
                {/* 제목 */}
                <Box
                  sx={{
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    width: '100%', // 제목을 가득 채우도록 설정
                    textAlign: 'left', // 텍스트 좌측 정렬
                  }}
                >
                  {location.name}
                </Box>
                {/* 구분선 */}
                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid #ddd',
                    width: '100%',
                    marginBottom: '10px',
                  }}
                />
                {/* 설명 */}
                <Box
                  sx={{
                    textAlign: 'left', // 설명 텍스트도 좌측에 정렬
                    width: '100%',
                  }}
                >
                  {location.description}
                </Box>
              </Button>
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};

export default LocationList;
