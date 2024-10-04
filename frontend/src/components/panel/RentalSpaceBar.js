import React, { useEffect, useState } from 'react';
// import axios from 'axios'; // axios 활성화
import { Box, Button, MenuItem, Select, Typography, CircularProgress, Grid } from '@mui/material';

const RentalSpaceBar = () => {
  const [spaceData, setSpaceData] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  // const [error, setError] = useState(null); // 에러 상태 추가

  // 임시 데이터를 설정하는 함수
  const setTemporaryData = () => {
    const tempData = {
      spaceName: '현대맨션 지층',
      spaceFee: '18000',
      mainImageBase64: 'https://via.placeholder.com/300x200',
      spaceDescription: '태국에서 직접 수입한 소품들이 공간 곳곳에 배치되어 있어 독특한 분위기를 연출합니다.',
      spaceType: '촬영스튜디오 / 렌탈스튜디오',
      spaceArea: '20',
      reservationTime: '최소 1시간부터',
      spaceCapacity: '15',
      options: [
        { available: true }
      ],
      equipment: [
        '빔 프로젝터', '마이크', '냉난방기', '책상', '의자', '화이트보드',
        '음향 시스템', '조명 장비', 'WiFi'
      ],
    };
    setSpaceData(tempData);
  };

  useEffect(() => {
    /*
    const fetchData = async () => {
      try {
        // 백엔드에서 데이터를 불러옴
        const response = await axios.get('/api/rental-space'); // API 경로 수정 필요
        setSpaceData(response.data);
      } catch (error) {
        console.error('Error fetching rental space data:', error);
        setError('데이터를 불러오지 못했습니다. 임시 데이터를 사용합니다.');

        // 임시 데이터 (오류 발생 시 사용)
        const tempData = {
          spaceName: '현대맨션 지층',
          spaceFee: '₩18,000 / 시간',
          mainImageBase64: 'https://via.placeholder.com/300x200',
          spaceDescription: '태국에서 직접 수입한 소품들이 공간 곳곳에 배치되어 있어 독특한 분위기를 연출합니다.',
          spaceType: '촬영스튜디오 / 렌탈스튜디오',
          spaceArea: '20㎡',
          reservationTime: '최소 1시간부터',
          spaceCapacity: '최소 5명 - 최대 5명',
          options: [
            { available: true }
          ],
          equipment: [
            '빔 프로젝터', '마이크', '냉난방기', '책상', '의자', '화이트보드',
            '음향 시스템', '조명 장비', 'WiFi'
          ],
        };
        setSpaceData(tempData);
      } finally {
        setLoading(false); // 로딩 상태 해제
      }
    };

    fetchData();
    */

    // 임시 데이터만 사용
    setTemporaryData();
    setLoading(false); // 로딩 상태 해제
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
  /*
  if (error) {
    return (
      <Box sx={{ textAlign: 'center', color: 'red', padding: '20px' }}>
        {error}
      </Box>
    );
  }
  */

  return (
    <Box sx={{ width: '350px', margin: '0 auto', padding: '20px', border: '1px solid #ddd', borderRadius: '10px', marginBottom: '20px' }}>
      {/* 1. '호스트 승인 후 예약 확정' 문장 */}
      <Typography variant="h6" sx={{ textAlign: 'center', marginBottom: '10px' }}>
        호스트 승인 후 예약확정
      </Typography>

      {/* 2. 선택지와 가격대 */}
      <Box sx={{ display: 'flex', alignItems: 'center', marginBottom: '10px' }}>
        <Box sx={{ display: 'flex', alignItems: 'center', gap: '5px' }}>
          {/* options가 존재하는지 확인 후 map 실행 */}
          {spaceData?.options?.map((option, index) => (
            <label key={index}>
              <input type="checkbox" checked={option.available} readOnly />
              {option.label}
            </label>
          ))}
        </Box>
        <Typography variant="h6" sx={{ marginLeft: '10px' }}>{spaceData?.spaceName}</Typography>
        <Typography variant="h6" sx={{ marginLeft: 'auto' }}>
          ₩ {spaceData?.spaceFee} / 시간
        </Typography>
      </Box>

      {/* 3. 사진, 설명, 공간 정보 */}
      <Box sx={{ border: '1px solid #ddd', padding: '20px', borderRadius: '10px', marginBottom: '20px' }}>
        {/* 사진 */}
        <Box sx={{ textAlign: 'center', marginBottom: '10px' }}>
          <img src={spaceData?.mainImageBase64} alt={spaceData?.spaceName} style={{ width: '100%' }} />
        </Box>

        {/* 설명 */}
        <Typography variant="body1" sx={{ marginBottom: '10px' }}>
          {spaceData?.spaceDescription}
        </Typography>
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />

        {/* 공간 유형 */}
        <Typography variant="body2" sx={{ marginBottom: '5px', margin: '10px 0' }}>
          공간유형: {spaceData?.spaceType}
        </Typography>
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />

        {/* 공간면적 */}
        <Typography variant="body2" sx={{ marginBottom: '10px' }}>
          공간면적: {spaceData?.spaceArea} ㎡
        </Typography>
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />

        {/* 예약시간 */}
        <Typography variant="body2" sx={{ marginBottom: '10px' }}>
          예약시간: {spaceData?.reservationTime}
        </Typography>
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />

        {/* 수용인원 */}
        <Typography variant="body2" sx={{ marginBottom: '10px' }}>
          수용인원: {spaceData?.spaceCapacity} 명
        </Typography>
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />

        {/* 기자재 목록 */}
        <Typography variant="body2" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
          제공 기자재
        </Typography>
        <Grid container spacing={1}>
          {spaceData?.equipment?.map((item, index) => (
            <Grid item xs={4} key={index}>
              <Typography variant="body2">{item}</Typography>
            </Grid>
          ))}
        </Grid>
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
