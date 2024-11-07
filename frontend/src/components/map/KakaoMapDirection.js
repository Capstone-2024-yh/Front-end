import React, { useEffect, useRef, useState } from 'react';
import InfoPanel from '../panel/InfoPanel';

const KakaoMapDirection = () => {
  const mapContainer = useRef(null);
  const kakaoMapKey = process.env.REACT_APP_KAKAO_MAP_KEY;
  const [coordinates, setCoordinates] = useState({ lat: 33.450701, lng: 126.570667 }); // 기본 좌표 설정
  const [errorOccurred, setErrorOccurred] = useState(false); // 위치 오류 발생 여부 상태

  useEffect(() => {
    if (!kakaoMapKey) {
      console.error('Kakao Map API key is missing.');
      return;
    }

    // Geolocation을 사용하여 현재 위치를 가져오는 함수
    const getCurrentLocation = () => {
      if (navigator.geolocation && !errorOccurred) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`현재 위치: 위도 ${latitude}, 경도 ${longitude}`);
            setCoordinates({ lat: latitude, lng: longitude }); // 상태에 좌표 저장
          },
          (error) => {
            console.error('Geolocation 오류:', error);
            setErrorOccurred(true); // 오류 발생 시 상태 업데이트
            // 오류가 발생하면 기본 좌표 사용
            setCoordinates({ lat: 33.450701, lng: 126.570667 });
          },
          {
            enableHighAccuracy: true, // 정확도 높이기
            maximumAge: 0, // 캐시된 정보 사용하지 않음
            timeout: 15000, // 15초 제한
          }
        );
      } else if (!navigator.geolocation) {
        console.error('Geolocation을 지원하지 않는 브라우저입니다.');
        setErrorOccurred(true); // 지원하지 않는 경우도 오류로 처리
      }
    };

    // 현재 위치를 먼저 가져옴
    getCurrentLocation();

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        const kakao = window.kakao;
        const container = mapContainer.current;
        if (container) {
          const options = {
            center: new kakao.maps.LatLng(coordinates.lat, coordinates.lng),
            level: 3,
          };
          const map = new kakao.maps.Map(container, options);

          // 사용자의 현재 위치에 마커 표시
          const markerPosition = new kakao.maps.LatLng(coordinates.lat, coordinates.lng);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);
        } else {
          console.error('Map container is null');
        }
      });
    };
  }, [kakaoMapKey, errorOccurred, coordinates.lat, coordinates.lng]); // coordinates와 errorOccurred가 변경될 때만 지도 업데이트

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', height: '70vh', width: '100%', margin: 0, padding: 0 }}>
      {/* 지도 영역 */}
      <div ref={mapContainer} style={{ width: '600px', height: '500px', backgroundColor: '#f0f0f0' }} />

      {/* 우측 정보 패널 */}
      <InfoPanel />
    </div>
  );
};

export default KakaoMapDirection;
