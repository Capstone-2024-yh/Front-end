import React, { useEffect, useState, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Button, MenuItem, Select, Typography, CircularProgress, Grid } from '@mui/material';
import { useSelector } from 'react-redux';
import FullCalendar from '@fullcalendar/react';
import dayGridPlugin from '@fullcalendar/daygrid';
import interactionPlugin from '@fullcalendar/interaction';
import axios from '../../axiosConfig'; // axios 활성화

const equipmentMap = {
  1: '빔 프로젝터', 2: '마이크', 3: '냉난방기', 4: '책상', 
  5: '의자', 6: '화이트보드', 7: '음향 시스템', 8: '조명 장비', 
  9: '컴퓨터', 10: '프린터', 11: '모니터', 12: 'WiFi', 
  13: 'TV', 14: '키보드', 15: '냉장고', 16: '전자레인지', 
  17: '커피머신', 18: '세탁기', 19: '건조기', 20: '청소기', 
  21: '카메라', 22: '삼각대', 23: '녹음 장비', 24: 'DVD 플레이어', 
  25: '스피커', 26: '헤드셋', 27: 'HDMI 케이블', 28: '전동 스크린',
  29: '화장실', 30: '주차장', 31: '기타 1', 32: '기타 2'
};

const RentalSpaceBar = () => {
  const ownerId = useSelector((state) => state.auth.user?.id);
  const isAuthenticated = useSelector((state) => state.auth.isAuthenticated);

  const { venueId } = useParams();
  const [spaceData, setSpaceData] = useState(null);
  const [loading, setLoading] = useState(true); // 로딩 상태 추가
  const [selectedDate, setSelectedDate] = useState(null);
  const [selectedTime, setSelectedTime] = useState('');
  const [availableTimes, setAvailableTimes] = useState([]);
  const [selectedStartTime, setSelectedStartTime] = useState('');
  // const [isLoggedIn, setIsLoggedIn] = useState(true); // 로그인 상태 추가
  // const [error, setError] = useState(null); // 에러 상태 추가

  // 임시 데이터를 설정하는 함수
  const setTemporaryData = () => {
    const tempData = {
      spaceName: '현대맨션 지층',
      spaceFee: '18000',
      mainImageBase64: 'https://via.placeholder.com/300x200',
      spaceDescription: '태국에서 직접 수입한 소품들이 공간 곳곳에 배치되어 있어 독특한 분위기를 연출합니다.',
      website: 'https://www.google.com/',
      spaceType: '촬영스튜디오 / 렌탈스튜디오',
      spaceArea: '20',
      reservationTime: '최소 1시간부터',
      spaceCapacity: '15',
      options: [
        { available: true }
      ],
      equipment: [1, 2, 3, 4, 5, 6, 7, 8, 12],
    };
    setSpaceData(tempData);
  };

  // 장소, 사진, 장비 정보를 백엔드에서 받아오는 함수
  const fetchSpaceData = useCallback(async () => {
    try {
      // 1. 장소 정보 받아오기
      const venueResponse = await axios.get(`/venues/${venueId}`);

      // console.log('venueResponse:', venueResponse.data);
  
      // 2. 사진 정보 받아오기
      const photoResponse = await axios.get(`/venuePhoto/${venueId}`);
      const photoBase64 = photoResponse.data[0]?.photoBase64 || '';
  
      // 3. 장비 정보 받아오기
      const equipmentResponse = await axios.get(`/equipment/${venueId}`);
      const equipmentIds = equipmentResponse.data.map(equip => equip.equipmentId);
  
      // 받아온 정보들 중 필요한 데이터만 사용 (location 제외)
      setSpaceData({
        spaceName: venueResponse.data.name,
        spaceFee: venueResponse.data.rentalFee,
        spaceCapacity: venueResponse.data.capacity,
        mainImageBase64: photoBase64,
        spaceDescription: venueResponse.data.simpleDescription,
        website: venueResponse.data.websiteURL,
        spaceType: venueResponse.data.spaceType,
        spaceArea: venueResponse.data.area,
        reservationTime: '최소 1시간부터',
        // 여기서 location은 무시
        equipment: equipmentIds,
      });
    } catch (error) {
      console.error('Error fetching rental space data:', error);
      setTemporaryData(); // 오류 시 임시 데이터 설정
    } finally {
      setLoading(false); // 로딩 상태 해제
    }
  }, [venueId]);  

  useEffect(() => {
    fetchSpaceData();
  }, [fetchSpaceData]);

  const handleDateSelect = (info) => {
    setSelectedDate(info.dateStr);
    // 시간 테이블을 열기 위한 가짜 데이터 생성
    const times = Array.from({ length: 25 }, (_, i) => `${i}:00`);
    setAvailableTimes(times);
  };

  const handleTimeSelect = (event) => {
    setSelectedTime(event.target.value);
  };

  const handleStartTimeChange = (event) => {
    setSelectedStartTime(event.target.value);
  };

  const handleReservationSubmit = () => {
    if (!selectedDate || !selectedTime || !selectedStartTime) {
      alert('날짜, 시간을 선택해주세요.');
      return;
    }

    // 예약 정보를 백엔드로 전송하는 부분
    const reservationData = {
      "ownerId":    ownerId,            // 사용자
      "time":       selectedTime,       // 예약 시간
      "date":       selectedDate,       // 예약 날짜
      "startTime":  selectedStartTime,  // 시작 시간
    };
    console.log('예약 정보 전송:', reservationData);

    // 여기서 axios나 fetch로 백엔드에 요청을 보냄
    async function makeReservation() {
      try {
        const response = await axios.post('/api/reservations', reservationData); // POST 요청
        console.log('예약 성공:', response.data);
        alert('예약 신청이 완료되었습니다!');
      } catch (error) {
        console.error('예약 오류:', error);
        alert('예약 신청이 완료되었습니다!');
      }
    }
    
    // 함수 호출
    makeReservation();
  };

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

  const CalendarStyles = `
    .fc-header-toolbar {
      font-size: 12px;
    }

    .fc-button {
      padding: 3px 6px;
      font-size: 12px;
    }
  `;

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
        <Typography variant="h6" sx={{ marginLeft: '10px', fontSize: '16px' }}>
          {spaceData?.spaceName}
        </Typography>
        <Typography variant="h6" sx={{ marginLeft: 'auto', fontSize: '16px' }}>
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

        {/* 공간 사이트 */}
        <Typography variant="body2" sx={{ marginBottom: '5px', margin: '10px 0' }}>
          공간URL:{" "}
          {spaceData?.website ? (
            <a
              href={spaceData.website.startsWith('http://') || spaceData.website.startsWith('https://') 
                ? spaceData.website 
                : `https://${spaceData.website}`}
              target="_blank"
              rel="noopener noreferrer"
            >
              {spaceData.website}
            </a>
          ) : (
            "URL이 없습니다"
          )}
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
              <Typography variant="body2">{equipmentMap[item]}</Typography>
            </Grid>
          ))}
        </Grid>
        <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />

        {/* 예약 선택 */}
        <Typography variant="body2" sx={{ fontWeight: 'bold', marginBottom: '10px' }}>
          예약선택
        </Typography>

        {/* 예약시간 콤보박스 */}
        <Select fullWidth value={selectedStartTime} onChange={handleStartTimeChange} sx={{ marginBottom: '10px' }}>
          <MenuItem value="select" disabled>시간 선택</MenuItem>
          <MenuItem value="1hour">1시간 예약</MenuItem>
          <MenuItem value="2hours">2시간 예약</MenuItem>
          <MenuItem value="3hours">3시간 예약</MenuItem>
          <MenuItem value="4hours">4시간 예약</MenuItem>
          <MenuItem value="5hours">5시간 예약</MenuItem>
        </Select>

        {/* FullCalendar 날짜 선택 */}
        {selectedStartTime && (
          <Box>
            <style>{CalendarStyles}</style>
            <FullCalendar
              plugins={[dayGridPlugin, interactionPlugin]}
              initialView="dayGridMonth"
              selectable={true}
              dateClick={handleDateSelect}
              validRange={{
                start: new Date(new Date().setDate(new Date().getDate() + 1)).toISOString().split("T")[0], // 내일 날짜부터 선택 가능
              }}
            />
          </Box>
        )}

        {selectedDate && (
          <Box>
            <Typography variant="body2" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
              선택한 날짜: {selectedDate}
            </Typography>

            {/* 시간 선택 콤보박스 */}
            <Select
              fullWidth
              value={selectedTime}
              onChange={handleTimeSelect}
              displayEmpty
              sx={{ marginBottom: '10px' }}
            >
              <MenuItem value="" disabled>
                시간 선택
              </MenuItem>
              {availableTimes.map((time, index) => (
                <MenuItem key={index} value={time}>
                  {time}
                </MenuItem>
              ))}
            </Select>
          </Box>
        )}
      </Box>

      {/* 4. 전화, 채팅, 예약 신청하기 버튼 */}
      <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
        <Button variant="outlined" sx={{ width: '30%' }}>
          전화
        </Button>
        <Button variant="outlined" sx={{ width: '30%' }}>
          채팅
        </Button>
        {isAuthenticated ? (
          selectedTime ? (
            <Box>
              <Typography variant="body2" sx={{ marginBottom: '10px', fontWeight: 'bold' }}>
                선택한 시간: {selectedTime}
              </Typography>
              <Button variant="contained" color="primary" fullWidth onClick={handleReservationSubmit}>
                예약 신청
              </Button>
            </Box>
          ) : null
        ) : (
          <Typography
            variant="body2"
            sx={{
              color: 'red',
              fontWeight: 'bold',
              textAlign: 'center', // 가운데 정렬
              width: '30%', // 버튼 크기와 동일하게 설정
            }}
          >
            로그인!
          </Typography>
        )}
      </Box>
    </Box>
  );
};

export default RentalSpaceBar;
