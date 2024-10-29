import React, { useEffect, useState, useRef } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { Box, Typography, List, ListItem, ListItemText, Button } from '@mui/material';
import { useSelector } from 'react-redux';
import RentalSpaceBar from '../panel/RentalSpaceBar';
import KakaoMapOnly from '../map/KakaoMapOnly';
import CommentsSection from '../panel/CommentsSection';
import axios from '../../axiosConfig';  // axios 활성화

const RentalSpacePage = ({ isLoggedIn }) => {
  const navigate = useNavigate();
  const { venueId } = useParams();  // URL에서 venueId를 추출
  const [spaceData, setSpaceData] = useState(null);
  const [loading, setLoading] = useState(true);  // 로딩 상태 추가

  // Redux에서 로그인된 사용자 정보 가져오기
  const authState = useSelector((state) => state.auth);
  const userEmail = authState.email; // 로그인된 사용자의 이메일

  // 각 단락을 참조할 수 있도록 ref 생성
  const spaceDescriptionRef = useRef(null);
  const facilitiesRef = useRef(null);
  const precautionsRef = useRef(null);
  const refundPolicyRef = useRef(null);
  const qaRef = useRef(null);
  const reviewRef = useRef(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        // 1. 장소 정보 받아오기
        const venueResponse = await axios.get(`/venues/${venueId}`);
        const venueData = venueResponse.data;

        console.log('venueData:', venueData);

        // 2. 태그 정보 받아오기
        const tagResponse = await axios.get(`/tag/venue/${venueId}`);
        const tagsData = tagResponse.data.map(tag => tag.tag); // 태그 문자열만 추출

        // 3. 사진 정보 받아오기
        const photoResponse = await axios.get(`/venuePhoto/${venueId}`);
        const photoBase64 = photoResponse.data[0]?.photoBase64 || '';

        // 통합된 데이터를 state에 저장
        setSpaceData({
          spaceName: venueData.name,
          spaceIntro: venueData.simpleDescription,
          spaceTags: tagsData,  // 태그 정보
          mainImageBase64: photoBase64,  // 사진
          coordinates: { lat: venueData.latitude, lng: venueData.longitude },
          sections: {
            spaceDescription: venueData.simpleDescription,
            facilities: venueData.facilityInfo,
            precautions: venueData.precautions,
            refundPolicy: venueData.refundPolicy,
            qa: '궁금한 사항은 언제든지 문의 바랍니다.',
            review: '많은 고객들이 만족하고 있습니다. 후기들을 확인해보세요!',
          }
        });
      } catch (error) {
        console.error('Error fetching rental space data:', error);
        // 백엔드 데이터를 가져오지 못하면 임시 데이터를 사용
        const tempData = {
          spaceName: '공간의 제목 1',
          spaceIntro: '이 공간은 최적의 촬영 스튜디오를 제공합니다.',
          spaceTags: ['#촬영스튜디오', '#편리한위치', '#최신장비'],
          mainImageBase64: 'https://via.placeholder.com/600x300',
          coordinates: { lng: 37.5064746281, lat: 126.95559491195 },
          sections: {
            spaceDescription: '이 공간은 사진 촬영과 영상 촬영에 최적화된 다양한 시설을 제공합니다.',
            facilities: '스튜디오 내에는 다양한 배경과 조명 설정이 가능하며, 최신 장비도 구비되어 있습니다.',
            precautions: '스튜디오 이용 시, 사전에 예약을 필히 완료해주시기 바랍니다.',
            refundPolicy: '예약 후 24시간 전까지는 전액 환불이 가능하며, 이후에는 환불이 불가합니다.',
            qa: '궁금한 사항은 언제든지 문의 바랍니다.',
            review: '많은 고객들이 만족하고 있습니다. 후기들을 확인해보세요!',
          },
          mapImage: 'https://via.placeholder.com/600x300',
        };
        setSpaceData(tempData); // 임시 데이터를 설정
      } finally {
        setLoading(false); // 데이터 로딩이 완료됨
      }
    };

    fetchData();
  }, [venueId]);

  const handleTagClick = (tag) => {
    navigate(`/location-list?tag=${tag}`);
  };

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
          {spaceData?.spaceName || '제목이 없습니다.'}
        </Typography>

        {/* 2. 간략한 소개 문장 */}
        <Typography variant="body1" sx={{ marginBottom: '20px' }}>
          {spaceData?.spaceIntro || '소개 문구가 없습니다.'}
        </Typography>

        {/* 3. 태그들 */}
        <Box sx={{ marginBottom: '20px', display: 'flex', gap: '10px', flexWrap: 'wrap' }}>
          {spaceData?.spaceTags?.map((tag, index) => (
            <Button 
              key={index} 
              variant="outlined" 
              sx={{ textTransform: 'none' }}
              onClick={() => handleTagClick(tag)} // 클릭 이벤트 예시
            >
              {tag}
            </Button>
          ))}
        </Box>

        {/* 4. 이미지 */}
        <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
          <img src={spaceData?.mainImageBase64} alt="공간 이미지" style={{ width: '100%' }} />
        </Box>

        {/* 5. 공간의 제목 2 */}
        <Typography variant="h5" sx={{ marginBottom: '10px' }}>
          {spaceData?.spaceIntro || '제목이 없습니다.'}
        </Typography>

        {/* 6. 목차 - Sticky로 상단에 고정 */}
        <Box
          sx={{
            position: 'sticky',
            top: '64px',  // AppBar 높이만큼 떨어지도록 설정
            backgroundColor: '#fff',
            zIndex: '10',
            padding: '5px 10px',
            height: '50px',
            boxShadow: '0 2px 5px rgba(0,0,0,0.1)',
            marginBottom: '20px',
            display: 'flex',
            justifyContent: 'space-between',
            alignItems: 'center',
          }}
        >
          <List sx={{ display: 'flex', width: '100%' }}>
            <ListItem
              button
              onClick={() => scrollToSection(spaceDescriptionRef)}
              sx={{ borderRight: '1px solid #ddd' }}
            >
              <ListItemText primary="공간소개" primaryTypographyProps={{ fontSize: '13px' }} />
            </ListItem>
            <ListItem
              button
              onClick={() => scrollToSection(facilitiesRef)}
              sx={{ borderRight: '1px solid #ddd' }}
            >
              <ListItemText primary="시설안내" primaryTypographyProps={{ fontSize: '13px' }} />
            </ListItem>
            <ListItem
              button
              onClick={() => scrollToSection(precautionsRef)}
              sx={{ borderRight: '1px solid #ddd' }}
            >
              <ListItemText primary="유의사항" primaryTypographyProps={{ fontSize: '13px' }} />
            </ListItem>
            <ListItem
              button
              onClick={() => scrollToSection(refundPolicyRef)}
              sx={{ borderRight: '1px solid #ddd' }}
            >
              <ListItemText primary="환불정책" primaryTypographyProps={{ fontSize: '13px' }} />
            </ListItem>
            <ListItem
              button
              onClick={() => scrollToSection(qaRef)}
              sx={{ borderRight: '1px solid #ddd' }}
            >
              <ListItemText primary="Q&A" primaryTypographyProps={{ fontSize: '13px' }} />
            </ListItem>
            <ListItem
              button
              onClick={() => scrollToSection(reviewRef)}
              sx={{ borderRight: 'none' }}
            >
              <ListItemText primary="이용후기" primaryTypographyProps={{ fontSize: '13px' }} />
            </ListItem>
          </List>
        </Box>

        {/* 7. 각 단락 */}
        <Box>
          {/* 공간소개 */}
          <Typography ref={spaceDescriptionRef} variant="h6" sx={{ marginBottom: '10px' }}>
            공간소개
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            {spaceData?.sections?.spaceDescription || '공간소개 정보가 없습니다.'}
          </Typography>

          {/* 시설안내 */}
          <Typography ref={facilitiesRef} variant="h6" sx={{ marginBottom: '10px' }}>
            시설안내
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            {spaceData?.sections?.facilities || '시설안내 정보가 없습니다.'}
          </Typography>

          {/* 유의사항 */}
          <Typography ref={precautionsRef} variant="h6" sx={{ marginBottom: '10px' }}>
            유의사항
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            {spaceData?.sections?.precautions || '유의사항 정보가 없습니다.'}
          </Typography>

          {/* 환불정책 */}
          <Typography ref={refundPolicyRef} variant="h6" sx={{ marginBottom: '10px' }}>
            환불정책
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            {spaceData?.sections?.refundPolicy || '환불정책 정보가 없습니다.'}
          </Typography>

          {/* 지도는 목차에 포함되지 않음 */}
          <Typography variant="h6" sx={{ marginBottom: '10px' }}>
            지도
          </Typography>
          <Box sx={{ textAlign: 'center', marginBottom: '20px' }}>
            {spaceData?.coordinates ? (
              <KakaoMapOnly coordinates={spaceData.coordinates} />
            ) : (
              <div>지도를 표시할 수 없습니다.</div>
            )}
          </Box>

          {/* Q&A */}
          <Typography ref={qaRef} variant="h6" sx={{ marginBottom: '10px' }}>
            Q&A
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            {spaceData?.sections?.qa || 'Q&A 정보가 없습니다.'}
          </Typography>

          {/* 이용후기 */}
          <Typography ref={reviewRef} variant="h6" sx={{ marginBottom: '10px' }}>
            이용후기
          </Typography>
          <Typography variant="body1" sx={{ marginBottom: '20px' }}>
            {spaceData?.sections?.review || '이용후기 정보가 없습니다.'}
          </Typography>

          {/* 댓글 컴포넌트 사용 */}
          <CommentsSection isLoggedIn={!!userEmail} userEmail={userEmail} venueId={venueId} />
        </Box>
      </Box>

      {/* 우측에 RentalSpaceInfo 컴포넌트 배치 */}
      <Box sx={{ flex: 1, position: 'sticky', top: '64px', overflow: 'visible', alignSelf: 'start' }}>
        <RentalSpaceBar />
      </Box>
    </Box>
  );
};

export default RentalSpacePage;
