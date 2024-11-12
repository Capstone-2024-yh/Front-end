import React, { useState, useEffect } from 'react';
import { Box, Select, MenuItem, Button } from '@mui/material'; // Button 추가
import { useNavigate } from 'react-router-dom';
import coordinates from '../map/KakaoMap'
import axios from "axios"; // React Router의 useNavigate 사용
// import axios from '../../axiosConfig';  // 백엔드에서 데이터를 받아오기 위해 axios 사용

const InfoPanel = ({ locations }) => {
  const [locationData, setLocationData] = useState([]);
  const [sortedData, setSortedData] = useState([]);
  const [sortKey, setSortKey] = useState('default');
  const navigate = useNavigate(); // 페이지 이동을 위한 네비게이트 함수

  // 임시 데이터 설정 함수
  const setTemporaryData = () => {
    const tempData = Array.from({ length: 10 }, (_, index) => ({
      id: index,
      spaceName: `임시 장소 ${index + 1}`,
      mainImageBase64: 'https://via.placeholder.com/50',
      spaceIntro: `이것은 임시 장소 ${index + 1}에 대한 설명입니다.`,
      spaceFee: Math.floor(Math.random() * 100000), // 임의의 가격
      reviewCount: Math.floor(Math.random() * 100),  // 임의의 리뷰 수
    }));
    setLocationData(tempData);
    setSortedData(tempData); // 처음엔 정렬 없이 표시
  };

  useEffect(() => {
    setSortedData(locations);

    const fetchData = async () => {
       try {
           const params = {
               latitude : coordinates.lat || 0,
               longitude: coordinates.lng || 0,
               distance : 10.0
           };

         const response = await axios.get('/venues/locationSearch', {params});
         const data = response.data;

           const imagePromises = data.map((venue) =>
               axios.get(`/venuePhoto/${venue.venue_id}`)
           );

           const images = await Promise.all(imagePromises);
           const imageData = images.map((image) =>
               image.data[0]?.photoBase64 || 'https://via.placeholder.com/150'
           );

         // 응답 데이터가 배열인지 확인하고, 아니면 임시 데이터 사용
         if (Array.isArray(data)) {
             const list = data.map((venue, index) => {
                 return {
                     id: venue.venue_id || index,
                     spaceName: venue.name || `임시 장소 ${index + 1}`,
                     mainImageBase64: imageData[index],
                     spaceIntro: venue.simpledescription || `이것은 임시 장소 ${index + 1}에 대한 설명입니다.`,
                     spaceFee: venue.rental_fee || Math.floor(Math.random() * 100000), // 임의의 가격
                     reviewCount: Math.floor(Math.random() * 100),  // 임의의 리뷰 수
                 }
             });
           setLocationData(list);
             setSortedData(list);
         } else {
           setTemporaryData();
         }
       } catch (error) {
         // axios 요청 실패 시 임시 데이터 설정
           console.log(error)
         setTemporaryData();
       }
    };

    fetchData();

    // 임시 데이터만 사용
    //setTemporaryData();
  }, [locations]);

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
      {/* 정렬 콤보박스 - 스크롤 영향을 받지 않음 */}
      <Box
        sx={{
          position: 'sticky', // 스크롤과 무관하게 고정
          top: 0,
          zIndex: 1,
          backgroundColor: '#f9f9f9',
          paddingBottom: '10px',
          textAlign: 'right', // 콤보박스를 우측 정렬
          display: 'flex', 
          justifyContent: 'flex-end', // 박스 자체를 우측으로 이동
        }}
      >
        <Select
          value={sortKey}
          onChange={handleSortChange}
          sx={{
            width: '165px',
            height: '40px',
            marginBottom: '10px',
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

      {/* 정보 버튼들 - 스크롤 가능한 영역 */}
      <Box
        sx={{
          overflowY: 'scroll',
          flexGrow: 1, // 남은 공간을 모두 차지하게 함
        }}
      >
        {sortedData.map((location, index) => (
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
              src={location.mainImageBase64}
              alt={location.spaceName}
              style={{ width: '50px', height: '50px', marginRight: '15px' }}
            />
            {/* 우측에 글 */}
            <Box sx={{ textAlign: 'left' }}>
              <div style={{ fontWeight: 'bold' }}>{location.spaceName}</div>
              <div>{location.spaceIntro}</div>
            </Box>
          </Button>
        ))}
      </Box>
    </Box>
  );
};

export default InfoPanel;
