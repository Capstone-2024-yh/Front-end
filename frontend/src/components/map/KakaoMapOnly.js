// KakaoMapOnly.js

import React, { useEffect, useRef } from 'react';

const KakaoMapOnly = ({ coordinates }) => {
  const mapContainer = useRef(null);
  const kakaoMapKey = process.env.REACT_APP_KAKAO_MAP_KEY;

  useEffect(() => {
    if (!kakaoMapKey) {
      console.error('Kakao Map API key is missing.');
      return;
    }

    if (!coordinates) {
      console.error('Coordinates are missing.');
      return;
    }

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
    <div style={{ display: 'flex', justifyContent: 'flex-start', height: '70vh', width: '100%', margin: 0, padding: 0 }}>
      {/* 지도 영역 */}
      <div ref={mapContainer} style={{ width: '600px', height: '500px', backgroundColor: '#f0f0f0' }} />
    </div>
  );
};

export default KakaoMapOnly;
