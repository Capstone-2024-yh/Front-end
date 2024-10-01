import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';

const KakaoMapOnly = () => {
  const mapContainer = useRef(null);
  const kakaoMapKey = process.env.REACT_APP_KAKAO_MAP_KEY;
  const [coordinates, setCoordinates] = useState({ lat: 33.450701, lng: 126.570667 }); // 기본 좌표 설정

  // 백엔드에서 좌표를 받아오는 함수 (현재는 임시로 기본 좌표를 사용)
  const fetchCoordinates = async () => {
    try {
      // 백엔드가 없으므로 임시 좌표 설정
      // 실제로는 이 부분에서 axios를 이용해 백엔드로부터 데이터를 받아오면 됩니다.
      const response = await axios.get('/api/space-coordinates'); // 백엔드 API 요청
      if (response.data && response.data.coordinates) {
        const { lat, lng } = response.data.coordinates;
        setCoordinates({ lat, lng });
      } else {
        console.warn('No coordinates received from backend, using default coordinates.');
      }
    } catch (error) {
      console.error('Error fetching coordinates, using default coordinates:', error);
    }
  };

  useEffect(() => {
    if (!kakaoMapKey) {
      console.error('Kakao Map API key is missing.');
      return;
    }

    // 좌표를 받아온 후에 지도 로드
    fetchCoordinates();

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

          // 마커를 좌표 위치에 표시
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
  }, [kakaoMapKey, coordinates]);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', height: '80vh', width: '100%', margin: 0, padding: 0 }}>
      {/* 지도 영역 */}
      <div ref={mapContainer} style={{ width: '600px', height: '500px', backgroundColor: '#f0f0f0' }} />
    </div>
  );
};

export default KakaoMapOnly;
