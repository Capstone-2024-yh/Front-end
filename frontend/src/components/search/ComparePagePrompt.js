import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { useLocation } from 'react-router-dom';

// equipmentMap 정의
const equipmentMap = {
  1: '빔 프로젝터', 2: '마이크', 3: '냉난방기', 4: '책상',
  5: '의자', 6: '화이트보드', 7: '음향 시스템', 8: '조명 장비',
  9: '컴퓨터', 10: '프린터', 11: '모니터', 12: 'WiFi',
  13: 'TV', 14: '키보드', 15: '냉장고', 16: '전자레인지',
  17: '커피머신', 18: '세탁기', 19: '건조기', 20: '청소기',
  21: '카메라', 22: '삼각대', 23: '녹음 장비', 24: 'DVD 플레이어',
  25: '스피커', 26: '헤드셋', 27: 'HDMI 케이블', 28: '전동 스크린',
  29: '화장실', 30: '주차장', 31: '기타 1', 32: '기타 2'
};

// ComparePagePrompt 컴포넌트
function ComparePagePrompt() {
  return (
    <div
      className="compare-page"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      <ComparisonArea />
    </div>
  );
}

// ComparisonArea 컴포넌트
function ComparisonArea() {
  const [leftFacility, setLeftFacility] = useState(null);
  const [rightFacility, setRightFacility] = useState(null);
  const [facilities, setFacilities] = useState([]);

  const location = useLocation();

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const response = await axios.get('/venues/AllSearch', { responseType: 'text' });
        let responseData = response.data;
        responseData = responseData.replace(/"location":\{[^{}]*\},?/g, '');
        const venues = JSON.parse(responseData);

        const facilitiesData = await Promise.all(
          venues.map(async (venue) => {
            const photoResponse = await axios.get(`/venuePhoto/${venue.venueId}`);
            const imageBase64 = photoResponse.data[0]?.photoBase64 || '';

            const equipmentResponse = await axios.get(`/equipment/${venue.venueId}`);
            const equipmentIds = equipmentResponse.data.map((eq) => eq.equipmentTypeId);

            return {
              id: venue.venueId,
              name: venue.name,
              image: `data:image/jpeg;base64,${imageBase64}`,
              shortDescription: venue.simpleDescription,
              price: venue.rentalFee,
              area: venue.area,
              capacity: venue.capacity,
              equipment: equipmentIds,
              facilityInfo: venue.facilityInfo,
              precautions: venue.precautions,
              refundPolicy: venue.refundPolicy,
            };
          })
        );

        setFacilities(facilitiesData);

        // URL에서 쿼리 파라미터로부터 시설 ID를 가져옵니다.
        const params = new URLSearchParams(location.search);
        const leftId = params.get('left');
        const rightId = params.get('right');

        // 시설 ID를 설정합니다.
        setLeftFacility(leftId || facilitiesData[0]?.id);
        setRightFacility(rightId || facilitiesData[1]?.id);

      } catch (error) {
        console.error('Error fetching facilities:', error);
      }
    }

    fetchFacilities();
  }, [location.search]);

  const handleLeftFacilityChange = (event) => {
    setLeftFacility(event.target.value);
  };

  const handleRightFacilityChange = (event) => {
    setRightFacility(event.target.value);
  };

  const leftFacilityData = facilities.find((facility) => facility.id.toString() === leftFacility);
  const rightFacilityData = facilities.find((facility) => facility.id.toString() === rightFacility);

  return (
    <div
      className="comparison-area"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '80%',
        maxWidth: '1200px',
        marginTop: '0px',
      }}
    >
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <div style={{ width: '45%', margin: '0 10px' }}>
          <select
            value={leftFacility || ''}
            onChange={handleLeftFacilityChange}
            style={selectStyle}
          >
            {facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
          </select>
          <FacilitySimpleDetail facility={leftFacilityData} />
        </div>

        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            minWidth: '80px',
            marginTop: '70px',
          }}
        >
          <div style={{ height: '103px', display: 'flex', alignItems: 'center', marginTop: '180px' }}>
            <p style={labelStyle}>공간한줄</p>
          </div>
          <div style={{ height: '0px', display: 'flex', alignItems: 'center' }}>
            <p style={labelStyle}>가격</p>
          </div>
        </div>

        <div style={{ width: '45%', margin: '0 10px' }}>
          <select
            value={rightFacility || ''}
            onChange={handleRightFacilityChange}
            style={selectStyle}
          >
            {facilities.map((facility) => (
              <option key={facility.id} value={facility.id}>
                {facility.name}
              </option>
            ))}
          </select>
          <FacilitySimpleDetail facility={rightFacilityData} />
        </div>
      </div>
      <hr style={{ width: '100%', borderTop: '1px solid #ccc', margin: '20px 0' }} />
      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: '20px' }}>
        <FacilityDetail facility={leftFacilityData} />
        <div
          style={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            width: '80px',
            minWidth: '40px',
          }}
        >
          {['가격', '면적', '수용인원', '기자재', '이용 안내', '주의사항', '환불정책'].map(
            (label) => (
              <div key={label} style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
                <p style={labelStyle}>{label}</p>
              </div>
            )
          )}
        </div>
        <FacilityDetail facility={rightFacilityData} />
      </div>
    </div>
  );
}

// FacilitySimpleDetail 컴포넌트
function FacilitySimpleDetail({ facility }) {
  return facility ? (
    <div
      className="facility-simple-detail"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <img
        src={facility.image}
        alt={facility.name}
        style={{ width: '100%', maxWidth: '150px', marginBottom: '10px' }}
      />
      <h2>{facility.name}</h2>
      <p>{facility.shortDescription}</p>
      <p>₩{facility.price}</p>
    </div>
  ) : null;
}

// FacilityDetail 컴포넌트
function FacilityDetail({ facility }) {
  return facility ? (
    <div
      className="facility-detail"
      style={{ textAlign: 'center', width: '45%', margin: '0 10px' }}
    >
      <h3>₩{facility.price}</h3>
      <p>{facility.area}㎡</p>
      <p>최대 {facility.capacity}명</p>
      <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
        <p>{facility.equipment?.map((id) => equipmentMap[id]).join(', ')}</p>
      </div>
      <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
        <p>{facility.facilityInfo}</p>
      </div>
      <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
        <p>{facility.precautions}</p>
      </div>
      <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
        <p>{facility.refundPolicy}</p>
      </div>
    </div>
  ) : null;
}

// 스타일 정의
const selectStyle = {
  width: '70%',
  padding: '6px',
  fontSize: '16px',
  fontWeight: 'bold',
  color: '#333',
  backgroundColor: '#f0f0f0',
  border: '1px solid #ccc',
  borderRadius: '5px',
  appearance: 'none',
  cursor: 'pointer',
  margin: '0 auto',
  display: 'block',
  marginBottom: '10px',
};

const labelStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1.2',
  textAlign: 'center',
};

export default ComparePagePrompt;
