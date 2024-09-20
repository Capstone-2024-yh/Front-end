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

        const map = new kakao.maps.Map(container, options); // 지도 생성
      });
    };
  }, [kakaoMapKey]);

  return (
    <div
      style={{
        display: 'flex',
        justifyContent: 'center', // 가로 중앙 정렬
        alignItems: 'center', // 세로 중앙 정렬
        width: '100vw',  // 화면 전체 너비
        height: '100vh', // 화면 전체 높이
        boxSizing: 'border-box',
        padding: '20px', // 화면 가장자리 공백
      }}
    >
      <div
        ref={mapContainer}
        style={{
          width: 'calc(100vw - 40px)',  // 화면 너비에서 패딩을 제외한 전체 너비
          height: 'calc(100vh - 40px)', // 화면 높이에서 패딩을 제외한 전체 높이
          maxWidth: '1000px', // 지도의 최대 너비 제한
          maxHeight: '700px', // 지도의 최대 높이 제한
          backgroundColor: '#f0f0f0', // 지도 로딩 중 확인할 수 있도록 배경색 추가
        }}
      />
    </div>
  );
};

export default KakaoMap;
