import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import axios from 'axios';

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

// Sidebar 컴포넌트
function Sidebar({ setSelectedType }) {
  const [facilityTypes, setFacilityTypes] = useState([]);
  const [activeType, setActiveType] = useState(null);
  const { venueId } = useParams();

  useEffect(() => {
    async function fetchFacilityTypes() {
      try {
        const response = await axios.get(`/venues/${venueId}`);
        setFacilityTypes(response.data);
        const firstTypeId = response.data[0]?.id;
        setSelectedType(firstTypeId);
        setActiveType(firstTypeId);
      } catch (error) {
        console.error("Error fetching facility types", error);
        const defaultTypes = [
          { id: 1, name: "임시 유형 1" },
          { id: 2, name: "임시 유형 2" },
          { id: 3, name: "임시 유형 3" },
          { id: 4, name: "임시 유형 4" },
          { id: 5, name: "임시 유형 5" },
          { id: 6, name: "임시 유형 6" },
          { id: 7, name: "임시 유형 7" },
          { id: 8, name: "임시 유형 8" },
          { id: 9, name: "임시 유형 9" },
          { id: 10, name: "임시 유형 10" },
          { id: 11, name: "임시 유형 11" },
          { id: 12, name: "임시 유형 12" }
        ];
        setFacilityTypes(defaultTypes);
        setSelectedType(defaultTypes[0].id);
        setActiveType(defaultTypes[0].id);
      }
    }
    fetchFacilityTypes();
  }, [venueId, setSelectedType]);

  const handleTypeClick = (typeId) => {
    setSelectedType(typeId);
    setActiveType(typeId);
  };

  return (
    <div className="sidebar" style={{ width: '200px', position: 'fixed', top: '64px', left: 0, height: 'calc(100% - 64px)', backgroundColor: '#f4f4f4', zIndex: 1, overflowY: 'auto' }}>
      {facilityTypes.map(type => (
        <button
          key={type.id}
          onClick={() => handleTypeClick(type.id)}
          style={{
            width: '100%', padding: '15px 10px',
            backgroundColor: activeType === type.id ? '#4CAF50' : '#fff',
            color: activeType === type.id ? '#fff' : '#333',
            border: 'none', borderBottom: '1px solid #ddd',
            cursor: 'pointer', textAlign: 'left', fontSize: '16px',
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
  const { venueId } = useParams();

  useEffect(() => {
    async function fetchSpaceTypeAndFacilities() {
      try {
        // venueId를 사용하여 spaceType을 가져옵니다
        const venueResponse = await axios.get(`/avenues/${venueId}`);
        const spaceType = venueResponse.data.spaceType;
  
        // spaceType에 맞는 시설 데이터를 가져옵니다
        const facilitiesResponse = await axios.get(`/api/facilities?type=${spaceType}`);
        setFacilities(facilitiesResponse.data);
        setLeftFacility(facilitiesResponse.data[0]?.id);
        setRightFacility(facilitiesResponse.data[1]?.id);
      } catch (error) {
        console.error("Error fetching facilities", error);
        const tempFacilities = [
          { id: 'temp1', name: '임시 시설 1', image: 'https://via.placeholder.com/150', shortDescription: '이 문장은 임시 소개문입니다.', price: 1000, area: 50, capacity: 10, equipment: [1, 2, 3], refundPolicy: '환불 정책 예시' },
          { id: 'temp2', name: '임시 시설 2', image: 'https://via.placeholder.com/150', shortDescription: '이 문장은 임시 소개문입니다.', price: 2000, area: 70, capacity: 20, equipment: [4, 5, 6], refundPolicy: '환불 정책 예시' },
        ];
        setFacilities(tempFacilities);
        setLeftFacility('temp1');
        setRightFacility('temp2');
      }
    }
  
    if (venueId) {
      fetchSpaceTypeAndFacilities();
    }
  }, [venueId]);

  const handleLeftFacilityChange = (event) => {
    setLeftFacility(event.target.value);
  };

  const handleRightFacilityChange = (event) => {
    setRightFacility(event.target.value);
  };

  const leftFacilityData = facilities.find(facility => facility.id === leftFacility);
  const rightFacilityData = facilities.find(facility => facility.id === rightFacility);

  return (
    <div className="comparison-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%', maxWidth: '1200px', marginLeft: '200px', marginTop: '-50px' }}>
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'flex-start', width: '100%' }}>
        <div style={{ width: '45%', margin: '0 10px' }}>
          <select value={leftFacility} onChange={handleLeftFacilityChange} style={{
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
            marginBottom: '10px'
          }}>
            {facilities.map(facility => (
              <option key={facility.id} value={facility.id}>{facility.name}</option>
            ))}
          </select>
          <FacilitySimpleDetail facility={leftFacilityData} />
        </div>
        {/* 가운데 목차 영역 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80px', minWidth: '80px', marginTop: '70px' }}>
          <div style={{ height: '103px', display: 'flex', alignItems: 'center', marginTop: '180px' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', lineHeight: '1.2', textAlign: 'center' }}>공간한줄</p>
          </div>
          <div style={{ height: '0px', display: 'flex', alignItems: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', textAlign: 'center' }}>가격</p>
          </div>
        </div>
        <div style={{ width: '45%', margin: '0 10px' }}>
          <select value={rightFacility} onChange={handleRightFacilityChange} style={{
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
            marginBottom: '10px'
          }}>
            {facilities.map(facility => (
              <option key={facility.id} value={facility.id}>{facility.name}</option>
            ))}
          </select>
          <FacilitySimpleDetail facility={rightFacilityData} />
        </div>
      </div>

      <hr style={{ width: '100%', borderTop: '1px solid #ccc', margin: '20px 0' }} />

      <div style={{ display: 'flex', justifyContent: 'space-around', width: '100%', marginTop: '20px' }}>
        <FacilityDetail facility={leftFacilityData} />
        {/* 가운데 목차 영역 */}
        <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', width: '80px', minWidth: '40px' }}>
          <div style={{ height: '40px', display: 'flex', alignItems: 'center', marginTop: '5px' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', lineHeight: '1.2', textAlign: 'center' }}>가격</p>
          </div>
          <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', textAlign: 'center' }}>면적</p>
          </div>
          <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', textAlign: 'center' }}>수용인원</p>
          </div>
          <div style={{ height: '70px', display: 'flex', alignItems: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', textAlign: 'center' }}>기자재</p>
          </div>
          <div style={{ height: '40px', display: 'flex', alignItems: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', textAlign: 'center' }}>환불정책</p>
          </div>
        </div>
        <FacilityDetail facility={rightFacilityData} />
      </div>
    </div>
  );
}

// FacilitySimpleDetail 컴포넌트
function FacilitySimpleDetail({ facility }) {
  return facility ? (
    <div className="facility-simple-detail" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src={facility.image} alt={facility.name} style={{ width: '100%', maxWidth: '150px', marginBottom: '10px' }} />
      <h2>{facility.name}</h2>
      <p>{facility.shortDescription}</p>
      <p>₩{facility.price}</p>
    </div>
  ) : null;
}

// FacilityDetail 컴포넌트
function FacilityDetail({ facility }) {
  return facility ? (
    <div className="facility-detail" style={{ textAlign: 'center', width: '45%', margin: '0 10px' }}>
      <h3>₩{facility.price}</h3>
      <p>{facility.area}㎡</p>
      <p>최대 {facility.capacity}명</p>
      <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
        <p>{facility.equipment?.map((id) => equipmentMap[id]).join(', ')}</p>
      </div>
      <div style={{ maxHeight: '80px', overflowY: 'auto' }}>
        <p>{facility.refundPolicy}</p>
      </div>
    </div>
  ) : null;
}

// ComparePage 컴포넌트
function ComparePage() {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div className="compare-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Sidebar setSelectedType={setSelectedType} />
      <ComparisonArea selectedType={selectedType} />
    </div>
  );
}

export default ComparePage;
