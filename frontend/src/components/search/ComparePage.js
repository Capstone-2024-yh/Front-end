import React, { useState, useEffect } from 'react';
import axios from 'axios';

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

// facilityTypes 정의
const facilityTypes = [
  { id: '파티룸', name: '파티룸' },
  { id: '스터디룸', name: '스터디룸' },
  { id: '강의실', name: '강의실' },
  { id: '카페', name: '카페' },
  { id: '공유주방', name: '공유주방' },
  { id: '회의실', name: '회의실' },
  { id: '세미나실', name: '세미나실' },
  { id: '연습실', name: '연습실' },
  { id: '보컬연습실', name: '보컬연습실' },
  { id: '악기연습실', name: '악기연습실' },
  { id: '녹음실', name: '녹음실' },
  { id: '운동시설', name: '운동시설' },
  { id: '촬영스튜디오', name: '촬영스튜디오' },
  { id: '호리존', name: '호리존' },
  { id: '라이브방송', name: '라이브방송' },
  { id: '실외촬영', name: '실외촬영' },
  { id: '공연장', name: '공연장' },
  { id: '갤러리', name: '갤러리' },
  { id: '스몰웨딩', name: '스몰웨딩' },
  { id: '컨퍼런스', name: '컨퍼런스' },
];

// Sidebar 컴포넌트
function Sidebar({ setSelectedType }) {
  const [activeType, setActiveType] = useState(facilityTypes[0]?.id);

  useEffect(() => {
    setSelectedType(facilityTypes[0]?.id);
  }, [setSelectedType]);

  const handleTypeClick = (typeId) => {
    setSelectedType(typeId);
    setActiveType(typeId);
  };

  return (
    <div
      className="sidebar"
      style={{
        width: '200px',
        position: 'fixed',
        top: '64px',
        left: 0,
        height: 'calc(100% - 64px)',
        backgroundColor: '#f4f4f4',
        zIndex: 1,
        overflowY: 'auto',
      }}
    >
      {facilityTypes.map((type) => (
        <button
          key={type.id}
          onClick={() => handleTypeClick(type.id)}
          style={{
            width: '100%',
            padding: '15px 10px',
            backgroundColor: activeType === type.id ? '#4CAF50' : '#fff',
            color: activeType === type.id ? '#fff' : '#333',
            border: 'none',
            borderBottom: '1px solid #ddd',
            cursor: 'pointer',
            textAlign: 'left',
            fontSize: '16px',
          }}
        >
          {type.name}
        </button>
      ))}
    </div>
  );
}

// ComparisonArea 컴포넌트
function ComparisonArea({ selectedType }) {
  const [leftFacility, setLeftFacility] = useState(null);
  const [rightFacility, setRightFacility] = useState(null);
  const [facilities, setFacilities] = useState([]);

  useEffect(() => {
    async function fetchFacilities() {
      try {
        // 응답을 텍스트로 받아옵니다.
        const response = await axios.get('/venues/AllSearch', { responseType: 'text' });
        let responseData = response.data;
  
        // 'location' 필드를 제거하며 JSON 형식을 유지합니다.
        responseData = responseData.replace(/"location":\{[^{}]*\},?/g, '');
  
        // JSON 파싱을 진행합니다.
        const venues = JSON.parse(responseData);
        const filteredVenues = venues.filter((venue) => venue.spaceType === selectedType);
  
        const facilitiesData = await Promise.all(
          filteredVenues.map(async (venue) => {
            const photoResponse = await axios.get(`/venuePhoto/${venue.venueId}`);
            const imageBase64 = photoResponse.data[0]?.photoBase64 || '';
            const imageData = imageBase64 && /^data:image\/[a-zA-Z]+;base64,/.test(imageBase64)
            ? imageBase64
            : 'https://via.placeholder.com/150';

            console.log("imageData: ", imageData);
  
            const equipmentResponse = await axios.get(`/equipment/${venue.venueId}`);
            const equipmentIds = equipmentResponse.data.map((eq) => eq.equipmentTypeId);
  
            return {
              id: venue.venueId,
              name: venue.name,
              image: imageData,
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
        setLeftFacility(facilitiesData[0]?.id);
        setRightFacility(facilitiesData[1]?.id);
      } catch (error) {
        console.error('Error fetching facilities:', error);
        // 에러 발생 시 임시 데이터 사용
        const tempFacilities = [
          {
            id: 'temp1',
            name: '임시 시설 1',
            image: 'https://via.placeholder.com/150',
            shortDescription: '이 문장은 임시 소개문입니다.',
            price: 1000,
            area: 50,
            capacity: 10,
            equipment: [1, 2, 3],
            facilityInfo: '시설 운영 예시',
            precautions: '주의사항 예시',
            refundPolicy: '환불 정책 예시',
          },
          {
            id: 'temp2',
            name: '임시 시설 2',
            image: 'https://via.placeholder.com/150',
            shortDescription: '이 문장은 임시 소개문입니다.',
            price: 2000,
            area: 70,
            capacity: 20,
            equipment: [4, 5, 6],
            facilityInfo: '시설 운영 예시',
            precautions: '주의사항 예시',
            refundPolicy: '환불 정책 예시',
          },
        ];
        setFacilities(tempFacilities);
        setLeftFacility('temp1');
        setRightFacility('temp2');
      }
    }
    fetchFacilities();
  }, [selectedType]);

  const handleLeftFacilityChange = (event) => {
    setLeftFacility(parseInt(event.target.value));
  };

  const handleRightFacilityChange = (event) => {
    setRightFacility(parseInt(event.target.value));
  };

  const leftFacilityData = facilities.find((facility) => facility.id === leftFacility);
  const rightFacilityData = facilities.find((facility) => facility.id === rightFacility);

  // 비교할 항목들 정의
  const comparisonItems = [
    { label: '가격', field: 'price' },
    { label: '면적', field: 'area' },
    { label: '수용인원', field: 'capacity' },
    { label: '기자재', field: 'equipment' },
    { label: '이용 안내', field: 'facilityInfo' },
    { label: '주의사항', field: 'precautions' },
    { label: '환불정책', field: 'refundPolicy' },
  ];

  return (
    <div
      className="comparison-area"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        width: '80%',
        maxWidth: '1200px',
        marginLeft: '200px',
        marginTop: '20px',
      }}
    >
      {/* 상단 비교 영역 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
          marginBottom: '40px',
        }}
      >
        {/* 좌측 시설 선택 및 간단 정보 */}
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

        {/* 중앙 비교 항목 레이블 */}
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
          <div
            style={{
              height: '103px',
              display: 'flex',
              alignItems: 'center',
              marginTop: '180px',
            }}
          >
            <p style={labelStyle}>공간한줄</p>
          </div>
          <div style={{ height: '0px', display: 'flex', alignItems: 'center' }}>
            <p style={labelStyle}>가격</p>
          </div>
        </div>

        {/* 우측 시설 선택 및 간단 정보 */}
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

      <hr
        style={{
          width: '100%',
          borderTop: '1px solid #ccc',
          margin: '20px 0',
        }}
      />

      {/* 상세 비교 영역 */}
      <div className="detail-comparison" style={{ width: '100%' }}>
        {comparisonItems.map((item, index) => (
          <React.Fragment key={index}>
            {/* 단락 */}
            <div
              className="detail-row"
              style={{
                display: 'flex',
                alignItems: 'center',
                marginBottom: '20px',
              }}
            >
              {/* 좌측 시설 정보 */}
              <div style={{ width: '45%', margin: '0 10px' }}>
                <FacilityDetailItem facility={leftFacilityData} field={item.field} />
              </div>
              {/* 중앙 목차 */}
              <div
                style={{
                  width: '80px',
                  minWidth: '40px',
                  textAlign: 'center',
                }}
              >
                <p style={labelStyle}>{item.label}</p>
              </div>
              {/* 우측 시설 정보 */}
              <div style={{ width: '45%', margin: '0 10px' }}>
                <FacilityDetailItem facility={rightFacilityData} field={item.field} />
              </div>
            </div>
            {/* 분리선 */}
            <hr
              style={{
                width: '80%', // 분리선 길이
                border: 'none',
                borderTop: '1px solid #C8A2C8', // 분리선 색상
                margin: '10px auto', // 분리선 간격
              }}
            />
          </React.Fragment>
        ))}
      </div>
    </div>
  );
}

// FacilitySimpleDetail 컴포넌트
function FacilitySimpleDetail({ facility }) {
  return facility ? (
    <div
      className="facility-simple-detail"
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'space-between',
        height: '300px', // 전체 높이를 고정
        padding: '10px',
        boxSizing: 'border-box',
      }}
    >
      <div
        style={{
          width: '100%',
          height: '150px', // 이미지 영역 고정
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          marginBottom: '10px',
          overflow: 'hidden',
        }}
      >
        <img
          src={facility.image}
          alt={facility.name}
          style={{
            maxWidth: '100%',
            maxHeight: '100%',
            objectFit: 'contain', // 이미지를 비율에 맞게 축소
          }}
        />
      </div>
      <h2 style={{ margin: '10px 0', fontSize: '18px', textAlign: 'center' }}>
        {facility.name}
      </h2>
      <p style={{ margin: '5px 0', textAlign: 'center', fontSize: '14px', color: '#555' }}>
        {facility.shortDescription}
      </p>
      <p style={{ margin: '5px 0', fontWeight: 'bold', fontSize: '16px', color: '#333' }}>
        ₩{facility.price}
      </p>
    </div>
  ) : null;
}

// FacilityDetail 컴포넌트
function FacilityDetailItem({ facility, field }) {
  if (!facility) return null;

  let content = '';

  switch (field) {
    case 'price':
      content = `₩${facility.price}`;
      break;
    case 'area':
      content = `${facility.area}㎡`;
      break;
    case 'capacity':
      content = `최대 ${facility.capacity}명`;
      break;
    case 'equipment':
      content = facility.equipment?.map((id) => equipmentMap[id]).join(', ');
      break;
    default:
      content = facility[field];
  }

  return (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      <p>{content}</p>
    </div>
  );
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

// ComparePage 컴포넌트
function ComparePage() {
  const [selectedType, setSelectedType] = useState(facilityTypes[0]?.id);

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
      <Sidebar setSelectedType={setSelectedType} />
      <ComparisonArea selectedType={selectedType} />
    </div>
  );
}

export default ComparePage;
