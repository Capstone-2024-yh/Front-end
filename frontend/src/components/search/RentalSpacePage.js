import React, { useEffect, useState, useRef } from 'react';
import { useParams } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText } from '@mui/material';
import RentalSpaceBar from '../panel/RentalSpaceBar';
import KakaoMapOnly from '../map/KakaoMapOnly';
import axios from 'axios';  // 필요 시 axios 활성화

const RentalSpacePage = () => {
  const { locationId } = useParams();  // URL에서 locationId를 추출
  const [spaceData, setSpaceData] = useState(null);
  const [loading, setLoading] = useState(true);  // 로딩 상태 추가

  // 각 단락을 참조할 수 있도록 ref 생성
  const introRef = useRef(null);
  const facilityRef = useRef(null);
  const cautionRef = useRef(null);
  const refundRef = useRef(null);
  const qaRef = useRef(null);
  const reviewRef = useRef(null);

  // 백엔드에서 데이터를 받아오기 위한 useEffect
  useEffect(() => {
    const fetchData = async () => {
      try {
        // 실제 백엔드 API 엔드포인트로 수정 필요
        const response = await axios.get(`/api/rental-space/${locationId}`);
        setSpaceData(response.data);
      } catch (error) {
        console.error('Error fetching rental space data:', error);
        // 백엔드 데이터를 가져오지 못하면 임시 데이터를 사용
        const tempData = {
          title1: '공간의 제목 1',
          title2: '공간의 제목 2',
          intro: '이 공간은 최적의 촬영 스튜디오를 제공합니다.',
          image: 'https://via.placeholder.com/600x300',
          sections: {
            intro: '이 공간은 사진 촬영과 영상 촬영에 최적화된 다양한 시설을 제공합니다.',
            facility: '스튜디오 내에는 다양한 배경과 조명 설정이 가능하며, 최신 장비도 구비되어 있습니다.',
            caution: '스튜디오 이용 시, 사전에 예약을 필히 완료해주시기 바랍니다.',
            refund: '예약 후 24시간 전까지는 전액 환불이 가능하며, 이후에는 환불이 불가합니다.',
            qa: '궁금한 사항은 언제든지 문의 바랍니다.',
            review: '많은 고객들이 만족하고 있습니다. 후기들을 확인해보세요!',
          },
          mapImage: 'https://via.placeholder.com/600x300'
        };
        setSpaceData(tempData); // 임시 데이터를 설정
      } finally {
        setLoading(false); // 데이터 로딩이 완료됨
      }
    };

    fetchData();
  }, [locationId]);

  // 백엔드 데이터가 없을 경우 로딩 처리
  if (loading) {
    return <div>Loading...</div>;
  }

  // 특정 위치로 스크롤하는 함수
  const scrollToSection = (ref) => {
    window.scrollTo({
      top: ref.current.offsetTop - 50, // 상단에서 약간 떨어지게 스크롤
      behavior: 'smooth',
    });
  };

  return (
    <Box sx={{ display: 'flex', padding: '20px' }}>
      {/* 좌측 페이지 내용 */}
      <Box sx={{ flex: 1, paddingRight: '20px' }}>
        {/* 1. 공간의 제목 1 */}
        <Typography variant="h4" sx={{ marginBottom: '10px' }}>
          {spaceData.title1}
        </Typography>

        {/* 2. 간략한 소개 문장 */}
        <Typography variant="body1" sx={{ marginBottom: '20px' }}>
          {spaceData.intro}
        </Typography>

        {/* 3. 이미지 */}
        <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={spaceData.image} alt="공간 이미지" style={{ width: '100%' }} />
        </Box>

        {/* 4. 공간의 제목 2 */}
        <Typography variant="h5" sx={{ marginBottom: '10px' }}>
          {spaceData.title2}
        </Typography>

        {/* 5. 목차 - Sticky로 상단에 고정 */}
        <Box 
          sx={{ 
              position: 'sticky', 
              top: '0', 
              backgroundColor: '#fff', 
              zIndex: '10', 
              padding: '5px 10px',            // 세로 높이를 줄이기 위한 패딩 조정
              height: '50px',                 // 높이를 직접 지정하여 줄임 
              boxShadow: '0 2px 5px rgba(0,0,0,0.1)', 
              marginBottom: '20px',
              display: 'flex',               // 가로로 나열하기 위한 flex 설정
              justifyContent: 'space-between', // 요소 간 간격을 자동으로 배치
              alignItems: 'center'            // 세로 중앙 정렬
          }}>
          <List sx={{ display: 'flex', width: '100%' }}>
            <ListItem 
              button 
              onClick={() => scrollToSection(introRef)} 
              sx={{ borderRight: '1px solid #ddd' }}  // 세로줄 추가
            >
              <ListItemText primary="공간소개" primaryTypographyProps={{ fontSize: '14px' }} />
            </ListItem>
            <ListItem 
              button 
              onClick={() => scrollToSection(facilityRef)} 
              sx={{ borderRight: '1px solid #ddd' }}  // 세로줄 추가
            >
              <ListItemText primary="시설안내" primaryTypographyProps={{ fontSize: '14px' }} />
            </ListItem>
            <ListItem 
              button 
              onClick={() => scrollToSection(cautionRef)} 
              sx={{ borderRight: '1px solid #ddd' }}  // 세로줄 추가
            >
              <ListItemText primary="유의사항" primaryTypographyProps={{ fontSize: '14px' }} />
            </ListItem>
            <ListItem 
              button 
              onClick={() => scrollToSection(refundRef)} 
              sx={{ borderRight: '1px solid #ddd' }}  // 세로줄 추가
            >
              <ListItemText primary="환불정책" primaryTypographyProps={{ fontSize: '14px' }} />
            </ListItem>
            <ListItem 
              button 
              onClick={() => scrollToSection(qaRef)} 
              sx={{ borderRight: '1px solid #ddd' }}  // 세로줄 추가
            >
              <ListItemText primary="Q&A" primaryTypographyProps={{ fontSize: '14px' }} />
            </ListItem>
            <ListItem 
              button 
              onClick={() => scrollToSection(reviewRef)} 
              sx={{ borderRight: 'none' }}  // 마지막 항목에는 세로줄 없음
            >
              <ListItemText primary="이용후기" primaryTypographyProps={{ fontSize: '14px' }} />
            </ListItem>
          </List>
        </Box>

        {/* 6. 각 단락 */}
        <Box>
          {/* 공간소개 */}
          <Typography ref={introRef} variant="h6" sx={{ marginBottom: '10px' }}>
            공간소개
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            {spaceData.sections.intro}
          </Typography>

          {/* 시설안내 */}
          <Typography ref={facilityRef} variant="h6" sx={{ marginBottom: '10px' }}>
            시설안내
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            {spaceData.sections.facility}
          </Typography>

          {/* 유의사항 */}
          <Typography ref={cautionRef} variant="h6" sx={{ marginBottom: '10px' }}>
            유의사항
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            {spaceData.sections.caution}
          </Typography>

          {/* 환불정책 */}
          <Typography ref={refundRef} variant="h6" sx={{ marginBottom: '10px' }}>
            환불정책
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            {spaceData.sections.refund}
          </Typography>

          {/* 지도는 목차에 포함되지 않음 */}
          <Typography variant="h6" sx={{ marginBottom: '10px' }}>
            지도
          </Typography>
          <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
            <KakaoMapOnly/>
          </Box>

          {/* Q&A */}
          <Typography ref={qaRef} variant="h6" sx={{ marginBottom: '10px' }}>
            Q&A
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            {spaceData.sections.qa}
          </Typography>

          {/* 이용후기 */}
          <Typography ref={reviewRef} variant="h6" sx={{ marginBottom: '10px' }}>
            이용후기
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            {spaceData.sections.review}
          </Typography>
        </Box>
      </Box>

      {/* 우측에 RentalSpaceInfo 컴포넌트 배치 */}
      <Box sx={{ flex: 1 }}>
        <RentalSpaceBar />
      </Box>
    </Box>
  );
};

export default RentalSpacePage;