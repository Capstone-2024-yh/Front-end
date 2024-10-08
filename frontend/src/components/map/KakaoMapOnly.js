import React, { useEffect, useRef } from 'react';

const KakaoMapOnly = ({ latitude, longitude }) => {
  const mapContainer = useRef(null);
  const kakaoMapKey = process.env.REACT_APP_KAKAO_MAP_KEY;

  // 디버그용 기본 좌표
  const defaultLatitude = 33.450701;
  const defaultLongitude = 126.570667;

  // 좌표가 없으면 기본 좌표를 사용
  const mapLatitude = latitude ?? defaultLatitude;
  const mapLongitude = longitude ?? defaultLongitude;

  useEffect(() => {
    if (!kakaoMapKey) {
      console.error('Kakao Map API key is missing.');
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
            center: new kakao.maps.LatLng(mapLatitude, mapLongitude), // 기본 좌표 적용
            level: 3,
          };
          const map = new kakao.maps.Map(container, options);

          // 마커를 좌표 위치에 표시
          const markerPosition = new kakao.maps.LatLng(Number(mapLatitude), Number(mapLongitude)); // 기본 좌표 적용
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);
        } else {
          console.error('Map container is null');
        }
      });
    };
  }, [kakaoMapKey, mapLatitude, mapLongitude]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'flex-start',
        height: '70vh',
        width: '100%',
        margin: 0,
        padding: 0,
      }}
    >
      {/* 지도 영역 */}
      <div
        ref={mapContainer}
        style={{ width: '600px', height: '500px', backgroundColor: '#f0f0f0' }}
      />
    </div>
  );
};

export default KakaoMapOnly;
