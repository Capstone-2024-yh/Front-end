import React, { useEffect, useRef } from 'react';

const KakaoMap = () => {
  const mapContainer = useRef(null); // 지도를 표시할 div를 위한 ref
  const kakaoMapKey = process.env.REACT_APP_KAKAO_MAP_KEY; // .env에서 API 키 가져오기

  useEffect(() => {
    if (!kakaoMapKey) {
      console.error('Kakao Map API key is missing.');
      return;
    }

    // Kakao Maps API를 로드
    const script = document.createElement('script');
    script.src = `//dapi.kakao.com/v2/maps/sdk.js?appkey=${kakaoMapKey}&autoload=false`;
    script.async = true;
    document.head.appendChild(script);

    script.onload = () => {
      // Kakao Maps API가 로드된 후, kakao 객체가 전역에 등록됨
      window.kakao.maps.load(() => {
        const kakao = window.kakao; // Kakao Maps API에 접근
        const container = mapContainer.current;
        const options = {
          center: new kakao.maps.LatLng(33.450701, 126.570667), // 초기 지도 중심 좌표
          level: 3, // 지도 확대 수준
        };

        // const map = new kakao.maps.Map(container, options); // 지도 생성
        new kakao.maps.Map(container, options);
      });
    };
  }, [kakaoMapKey]);

  return (
    <div
      ref={mapContainer}
      style={{
        width: '500px',
        height: '400px',
      }}
    />
  );
};

export default KakaoMap;
