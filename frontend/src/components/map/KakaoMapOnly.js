import React, { useEffect, useRef } from 'react';

const KakaoMapOnly = () => {
  const mapContainer = useRef(null);
  const kakaoMapKey = process.env.REACT_APP_KAKAO_MAP_KEY;

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
        const options = {
          center: new kakao.maps.LatLng(33.450701, 126.570667),
          level: 3,
        };

        new kakao.maps.Map(container, options);
      });
    };
  }, [kakaoMapKey]);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', height: '80vh', width: '100%', margin: 0, padding: 0 }}>
      {/* 지도 영역 */}
      <div ref={mapContainer} style={{ width: '600px', height: '500px', backgroundColor: '#f0f0f0' }} />
    </div>
  );
};

export default KakaoMapOnly;
