import React, { useState, useEffect } from 'react';
import { Box, Select, MenuItem, Button, Grid, CircularProgress } from '@mui/material';
// import axios from 'axios';
import { useNavigate } from 'react-router-dom';

const LocationList = () => {
  const [locationData, setLocationData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortKey, setSortKey] = useState('default');
  const [loading, setLoading] = useState(true); 
  // const [error, setError] = useState(null); 
  const navigate = useNavigate();

  useEffect(() => {
    /* 
    const fetchData = async () => {
      try {
        const response = await axios.get('/api/locations');
        const data = response.data;

        // 응답 데이터가 배열인지 확인
        if (!Array.isArray(data)) {
          throw new Error('API 응답이 배열이 아닙니다.');
        }

        setLocationData(data); // 데이터가 배열일 경우에만 설정
      } catch (error) {
        console.error('Error fetching location data:', error);
        setError('데이터를 불러오지 못했습니다. 임시 데이터를 사용합니다.');

        // 오류 발생 시 임시 데이터 사용
        const tempData = Array.from({ length: 12 }, (_, index) => ({
          id: index,
          spaceName: `임시 장소 ${index + 1}`,
          mainImageBase64: 'https://via.placeholder.com/150',  
          spaceIntro: `이것은 임시 장소 ${index + 1}에 대한 설명입니다.`,
          spaceFee: Math.floor(Math.random() * 100000), // 임의의 가격
          reviewCount: Math.floor(Math.random() * 100),  // 임의의 리뷰 수
        }));
        setLocationData(tempData);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchData();
    */

    // 임시 데이터만 사용
    const tempData = Array.from({ length: 12 }, (_, index) => ({
      id: index,
      spaceName: `임시 장소 ${index + 1}`,
      mainImageBase64: 'https://via.placeholder.com/300x150',
      spaceIntro: `이것은 임시 장소 ${index + 1}에 대한 설명입니다.`,
      spaceFee: Math.floor(Math.random() * 100000), // 임의의 가격
      reviewCount: Math.floor(Math.random() * 100),  // 임의의 리뷰 수
    }));
    setLocationData(tempData);
    setSortedData(tempData);
    setLoading(false);
  }, []);

  // 정렬 함수
  const sortData = (data, key) => {
    let sortedArray = [...data];
    switch (key) {
      case 'spaceFee-high':
        sortedArray.sort((a, b) => b.spaceFee - a.spaceFee); // 가격 높은 순
        break;
      case 'spaceFee-low':
        sortedArray.sort((a, b) => a.spaceFee - b.spaceFee); // 가격 낮은 순
        break;
      case 'reviewCount':
        sortedArray.sort((a, b) => b.reviewCount - a.reviewCount); // 이용후기 많은 순
        break;
      default:
        break;
    }
    return sortedArray;
  };

  // 콤보박스에서 선택 변경 시 처리
  const handleSortChange = (event) => {
    const newSortKey = event.target.value;
    setSortKey(newSortKey);
    const sorted = sortData(locationData, newSortKey);
    setSortedData(sorted);
  };

  const handleClick = (location) => {
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
        <CircularProgress />
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
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <span style={{ marginRight: '10px' }}>👍 무료</span>
          <span>💡 할인 중</span>
        </Box>

        {/* 필터 설정 콤보박스 */}
        <Select
          value={sortKey}
          onChange={handleSortChange}
          sx={{
            width: '200px',
            height: '40px',
            fontSize: '14px',
            textAlign: 'center',
            display: 'flex',
            alignItems: 'center',
          }}
        >
          <MenuItem value="default">정렬 기준 선택</MenuItem>
          <MenuItem value="spaceFee-high">가격 높은 순</MenuItem>
          <MenuItem value="spaceFee-low">가격 낮은 순</MenuItem>
          <MenuItem value="reviewCount">이용후기 많은 순</MenuItem>
        </Select>
      </Box>

      {/*
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
      */}

      <Box
        sx={{
          overflowY: 'scroll',
          height: 'calc(100vh - 100px)', 
          paddingRight: '10px',
        }}
      >
        <Grid container spacing={2}>
          {sortedData.map((location, index) => (
            <Grid item xs={12} sm={4} key={index}>
              <Button
                onClick={() => handleClick(location)}
                sx={{
                  backgroundColor: '#ffffff',
                  borderRadius: '8px',
                  boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                  padding: '10px',
                  textAlign: 'center',
                  width: '100%',
                  display: 'flex',
                  flexDirection: 'column',
                  alignItems: 'center',
                }}
              >
                <img
                  src={location.mainImageBase64}
                  alt={location.spaceName}
                  style={{
                    width: '100%',
                    height: '150px',
                    objectFit: 'cover',
                    marginBottom: '10px',
                  }}
                />
                <Box
                  sx={{
                    fontWeight: 'bold',
                    marginBottom: '10px',
                    width: '100%',
                    textAlign: 'left',
                  }}
                >
                  {location.spaceName}
                </Box>
                <hr
                  style={{
                    border: 'none',
                    borderTop: '1px solid #ddd',
                    width: '100%',
                    marginBottom: '10px',
                  }}
                />
                <Box
                  sx={{
                    textAlign: 'left',
                    width: '100%',
                  }}
                >
                  {location.spaceIntro}
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
