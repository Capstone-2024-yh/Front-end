import React, { useEffect, useRef } from 'react';

const KakaoMapOnly = ({ coordinates }) => {
  const mapContainer = useRef(null);
  const kakaoMapKey = process.env.REACT_APP_KAKAO_MAP_KEY;

  // 기본 좌표 설정
  const defaultLatitude = 33.450701;
  const defaultLongitude = 126.570667;

  // 전달된 좌표가 없을 경우 기본 좌표 사용
  const mapLatitude = coordinates?.lat ?? defaultLatitude;
  const mapLongitude = coordinates?.lng ?? defaultLongitude;

  console.log('mapLatitude:', mapLatitude);
  console.log('mapLongitude:', mapLongitude);

  useEffect(() => {
    if (!kakaoMapKey || !mapContainer.current) {
      console.error('Kakao Map API key is missing or map container is null.');
      return;
    }

    console.log('Map coordinates:', { latitude: mapLatitude, longitude: mapLongitude });

    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      window.kakao.maps.load(() => {
        if (mapContainer.current) {
          const options = {
            center: new window.kakao.maps.LatLng(mapLatitude, mapLongitude),
            level: 3,
          };
          const map = new window.kakao.maps.Map(mapContainer.current, options);

          const markerPosition = new window.kakao.maps.LatLng(mapLatitude, mapLongitude);
          const marker = new window.kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);
        } else {
          console.error('Map container is null after script loaded');
        }
      });
    };

    return () => {
      document.head.removeChild(script);
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
        style={{ width: '100%', height: '500px', backgroundColor: '#f0f0f0' }}
      />
    </div>
  );
};

export default KakaoMapOnly;
