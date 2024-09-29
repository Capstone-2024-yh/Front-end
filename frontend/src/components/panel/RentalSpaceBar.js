import React, { useEffect, useState } from 'react';
import axios from 'axios'; // axios 활성화
import { Box, Button, MenuItem, Select, Typography, CircularProgress } from '@mui/material';

const RentalSpaceBar = () => {
  const [spaceData, setSpaceData] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [error, setError] = useState(null); // 에러 상태 추가

  // 백엔드에서 데이터를 받아오기 위한 useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 백엔드에서 데이터를 불러옴
        const response = await axios.get('/api/rental-space'); // API 경로 수정 필요
        setSpaceData(response.data);
      } catch (error) {
        console.error('Error fetching rental space data:', error);
        //setError('데이터를 불러오지 못했습니다. 임시 데이터를 사용합니다.');
        setError();

        // 임시 데이터 (오류 발생 시 사용)
        const tempData = {
          title: '현대맨션 지층',
          price: '₩18,000 / 시간',
          image: 'https://via.placeholder.com/300x200',
          description: '태국에서 직접 수입한 소품들이 공간 곳곳에 배치되어 있어 독특한 분위기를 연출합니다.',
          type: '촬영스튜디오 / 렌탈스튜디오',
          area: '20㎡',
          reservationTime: '최소 1시간부터',
          capacity: '최소 5명 - 최대 5명',
          options: [
            { available: true }
          ],
        };
        setSpaceData(tempData);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchData();
  }, []);

  // 백엔드 데이터가 없을 경우 로딩 처리
  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
        <CircularProgress /> {/* 로딩 애니메이션 */}
      </Box>
    );
  }

  // 에러 메시지 표시
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', color: 'red', padding: '20px' }}>
        {error}
      </Box>
    );
  }

  return (
    <Box sx={{ width: '350px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '20px' }}>
      {/* 1. '호스트 승인 후 예약 확정' 문장 */}
      <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '10px' }}>
        호스트 승인 후 예약확정
      </Typography>

      {/* 2. 선택지와 가격대 */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {spaceData.options.map((option, index) => (
            <label key={index}>
              <input type="checkbox" checked={option.available} readOnly />
              {option.label}
            </label>
          ))}
        </Box>
        <Typography variant="h6" sx={{ marginLeft: '10px' }}>{spaceData.title}</Typography>
        <Typography variant="h6" sx={{ marginLeft: 'auto' }}>{spaceData.price}</Typography>
      </Box>

      {/* 3. 사진, 설명, 공간 정보 */}
      <Box sx={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        {/* 사진 */}
        <Box sx={{ textAlign: 'center', marginBottom: '10px' }}>
          <img src={spaceData.image} alt={spaceData.title} style={{ width: '100%' }} />
        </Box>

        {/* 설명 */}
        <Typography variant="body1" sx={{ marginBottom: '10px' }}>
          {spaceData.description}
        </Typography>
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />
        
        {/* 공간 유형 */}
        <Typography variant="body2" sx={{ marginBottom: '5px', margin: '10px 0' }}>
          공간유형: {spaceData.type}
        </Typography>
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />
        
        {/* 공간면적 */}
        <Typography variant="body2" sx={{ marginBottom: '10px' }}>
          공간면적: {spaceData.area}
        </Typography>
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />
        
        {/* 예약시간 */}
        <Typography variant="body2" sx={{ marginBottom: '10px' }}>
          예약시간: {spaceData.reservationTime}
        </Typography>
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />
        
        {/* 수용인원 */}
        <Typography variant="body2" sx={{ marginBottom: '10px' }}>
          수용인원: {spaceData.capacity}
        </Typography>
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />

        {/* 예약 선택 */}
        <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
          예약선택
        </Typography>

        {/* 예약시간 콤보박스 */}
        <Select fullWidth defaultValue="select" sx={{ marginBottom: '10px' }}>
          <MenuItem value="select" disabled>시간 선택</MenuItem>
          <MenuItem value="1hour">1시간 예약</MenuItem>
          <MenuItem value="2hours">2시간 예약</MenuItem>
          <MenuItem value="3hours">3시간 예약</MenuItem>
          <MenuItem value="4hours">4시간 예약</MenuItem>
          <MenuItem value="5hours">5시간 예약</MenuItem>
        </Select>
      </Box>

      {/* 4. 전화, 채팅, 예약 신청하기 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button variant="outlined" sx={{ width: '30%' }}>
          전화
        </Button>
        <Button variant="outlined" sx={{ width: '30%' }}>
          채팅
        </Button>
        <Button variant="contained" color="primary" sx={{ width: '35%' }}>
          예약 신청
        </Button>
      </Box>
    </Box>
  );
};

export default RentalSpaceBar;
