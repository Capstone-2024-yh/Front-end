import React, { useEffect, useRef, useState } from 'react';
import InfoPanel from '../panel/InfoPanel';
import axios from 'axios';

const KakaoMap = () => {
  const mapContainer = useRef(null);
  const kakaoMapKey = process.env.REACT_APP_KAKAO_MAP_KEY;
  const [coordinates, setCoordinates] = useState({ lat: 33.450701, lng: 126.570667 });
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [nearbyLocations, setNearbyLocations] = useState([]); // 가까운 장소 목록

  useEffect(() => {
    if (!kakaoMapKey) {
      console.error('Kakao Map API key is missing.');
      return;
    }

    const getCurrentLocation = () => {
      if (navigator.geolocation && !errorOccurred) {
        navigator.geolocation.getCurrentPosition(
          (position) => {
            const { latitude, longitude } = position.coords;
            console.log(`현재 위치: 위도 ${latitude}, 경도 ${longitude}`);
            setCoordinates({ lat: latitude, lng: longitude });
          },
          (error) => {
            console.error('Geolocation 오류:', error);
            setErrorOccurred(true);
            setCoordinates({ lat: 33.450701, lng: 126.570667 });
          },
          {
            enableHighAccuracy: true,
            maximumAge: 0,
            timeout: 15000,
          }
        );
      } else if (!navigator.geolocation) {
        console.error('Geolocation을 지원하지 않는 브라우저입니다.');
        setErrorOccurred(true);
      }
    };

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

          // 현재 위치에 마커 표시
          const markerPosition = new kakao.maps.LatLng(coordinates.lat, coordinates.lng);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);

          // 가까운 장소 가져오기
          const fetchNearbyLocations = async () => {
            console.log('가까운 장소를 가져옵니다...');
            try {
              const response = await axios.get('/venues/locationSearch', {
                params: {
                  latitude: coordinates.lat,
                  longitude: coordinates.lng,
                  distance: 100.0,
                  limit: 10,
                },
              });
              const data = response.data;
              setNearbyLocations(data);

              // 장소 데이터로 마커 표시
              data.forEach((location) => {
                const marker = new kakao.maps.Marker({
                  position: new kakao.maps.LatLng(location.latitude, location.longitude),
                });
                marker.setMap(map);
              });
              console.log('가까운 장소 목록:', data);
            } catch (error) {
              console.error('근처 장소를 가져오는 데 실패했습니다:', error);
            }
          };

          fetchNearbyLocations();
        } else {
          console.error('Map container is null');
        }
      });
    };
  }, [kakaoMapKey, errorOccurred, coordinates.lat, coordinates.lng]);

  return (
    <div style={{ display: 'flex', justifyContent: 'flex-start', height: '70vh', width: '100%', margin: 0, padding: 0 }}>
      <div ref={mapContainer} style={{ width: '600px', height: '500px', backgroundColor: '#f0f0f0' }} />
      <InfoPanel locations={nearbyLocations} /> {/* InfoPanel에 위치 데이터 전달 */}
    </div>
  );
};

export default KakaoMap;
