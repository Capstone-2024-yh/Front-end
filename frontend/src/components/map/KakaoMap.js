import React, { useEffect, useRef, useState } from 'react';
import InfoPanel from '../panel/InfoPanel';
import axios from 'axios';

const KakaoMap = () => {
  const mapContainer = useRef(null);
  const kakaoMapKey = process.env.REACT_APP_KAKAO_MAP_KEY;
  const [coordinates, setCoordinates] = useState({ lat: 33.450701, lng: 126.570667 });
  const [errorOccurred, setErrorOccurred] = useState(false);
  const [nearbyLocations, setNearbyLocations] = useState([]);

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

          const markerPosition = new kakao.maps.LatLng(coordinates.lat, coordinates.lng);
          const marker = new kakao.maps.Marker({
            position: markerPosition,
          });
          marker.setMap(map);

          // 거리 계산 함수 추가 (Haversine 공식을 사용하여 거리 계산)
          const calculateDistance = (lat1, lng1, lat2, lng2) => {
            const R = 6371; // 지구 반지름 (킬로미터)
            const dLat = (lat2 - lat1) * (Math.PI / 180);
            const dLng = (lng2 - lng1) * (Math.PI / 180);
            const a =
              Math.sin(dLat / 2) * Math.sin(dLat / 2) +
              Math.cos(lat1 * (Math.PI / 180)) * Math.cos(lat2 * (Math.PI / 180)) *
              Math.sin(dLng / 2) * Math.sin(dLng / 2);
            const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a));
            return R * c;
          };

          const fetchNearbyLocations = async () => {
            try {
              const response = await axios.get('/venues/locationSearch', {
                params: {
                  latitude: coordinates.lat,
                  longitude: coordinates.lng,
                  distance: 10.0,
                  limit: 10,
                },
              });
              const data = response.data;

              // 각 장소의 거리를 계산하여 data 배열을 거리 기준으로 정렬
              const sortedData = data
                .map((location) => ({
                  ...location,
                  distance: calculateDistance(
                    coordinates.lat,
                    coordinates.lng,
                    location.latitude,
                    location.longitude
                  ),
                }))
                .sort((a, b) => a.distance - b.distance); // 거리 오름차순 정렬

              setNearbyLocations(sortedData);

              // 장소 데이터로 마커 표시
              sortedData.forEach((location) => {
                const marker = new kakao.maps.Marker({
                  position: new kakao.maps.LatLng(location.latitude, location.longitude),
                });
                marker.setMap(map);
              });
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
      <InfoPanel locations={nearbyLocations} />
    </div>
  );
};

export default KakaoMap;
