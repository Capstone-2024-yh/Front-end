import React, { useState, useEffect } from 'react';
import { Box, Button, Grid, CircularProgress } from '@mui/material';
import axios from 'axios'; // 백엔드와의 통신 활성화
import { useNavigate } from 'react-router-dom'; // React Router에서 useNavigate 사용

const LocationList = () => {
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 오류 상태 추가
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 함수

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 백엔드에서 데이터를 받아오는 부분
        const response = await axios.get('/api/locations'); // API 경로를 실제 경로로 변경
        const data = Array.isArray(response.data) ? response.data : []; // 배열인지 확인 후 설정
        setLocationData(data);
      } catch (error) {
        console.error('Error fetching location data:', error);
        setError('데이터를 불러오지 못했습니다. 임시 데이터를 사용합니다.');

        // 오류 발생 시 임시 데이터 사용
        const tempData = Array.from({ length: 12 }, (_, index) => ({
          id: index,
          name: `임시 장소 ${index + 1}`,
          image: 'https://via.placeholder.com/150',  // 임시 이미지 URL
          description: `이것은 임시 장소 ${index + 1}에 대한 설명입니다.`,
        }));
        setLocationData(tempData);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchData();
  }, []);

  // 버튼을 클릭했을 때 실행되는 함수
  const handleClick = (location) => {
    // 해당 location의 ID를 기반으로 RentalSpaceBar로 이동
    navigate(`/rental-space/${location.id}`);
  };

  if (loading) {
    return (
      <Box
        sx={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'center',
          height: '100vh',
        }}
      >
        <CircularProgress /> {/* 로딩 애니메이션 */}
      </Box>
    );
  }

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

      {/* 에러 메시지 출력 */}
      {error && (
        <Box
          sx={{
            color: 'red',
            marginBottom: '20px',
            textAlign: 'center',
          }}
        >
          {error}
        </Box>
      )}

      {/* 목록 박스 */}
      <Box
        sx={{
          overflowY: 'scroll',
          height: 'calc(100vh - 100px)', // 전체 높이에서 필터 박스와 여백을 제외한 높이
          paddingRight: '10px',
        }}
      >
        <Grid container spacing={2}>
          {/* 백엔드에서 받아온 정보 또는 임시 정보 출력 */}
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
