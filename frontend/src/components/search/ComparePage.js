import React, { useState, useEffect } from 'react';
import axios from 'axios';

// Sidebar 컴포넌트
function Sidebar({ setSelectedType }) {
  const [facilityTypes, setFacilityTypes] = useState([]);
  const [activeType, setActiveType] = useState(null);

  useEffect(() => {
    async function fetchFacilityTypes() {
      try {
        const response = await axios.get('/api/facility-types');
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
  }, [setSelectedType]);

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

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const response = await axios.get(`/api/facilities?type=${selectedType}`);
        setFacilities(response.data);
        setLeftFacility(response.data[0]?.id);
        setRightFacility(response.data[1]?.id);
      } catch (error) {
        console.error("Error fetching facilities", error);
        const tempFacilities = [
          { id: 'temp1', name: '임시 시설 1', image: 'https://via.placeholder.com/150', shortDescription: '이 문장은 임시 소개문입니다.', price: 1000, area: 50, capacity: 10, precautions: '주의사항 예시', refundPolicy: '환불 정책 예시' },
          { id: 'temp2', name: '임시 시설 2', image: 'https://via.placeholder.com/150', shortDescription: '이 문장은 임시 소개문입니다.', price: 2000, area: 70, capacity: 20, precautions: '주의사항 예시', refundPolicy: '환불 정책 예시' },
        ];
        setFacilities(tempFacilities);
        setLeftFacility('temp1');
        setRightFacility('temp2');
      }
    }

    if (selectedType) {
      fetchFacilities();
    }
  }, [selectedType]);

  const handleLeftFacilityChange = (event) => {
    setLeftFacility(event.target.value);
  };

  const handleRightFacilityChange = (event) => {
    setRightFacility(event.target.value);
  };

  const leftFacilityData = facilities.find(facility => facility.id === leftFacility);
  const rightFacilityData = facilities.find(facility => facility.id === rightFacility);

  return (
    <div className="comparison-area" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', width: '80%', maxWidth: '1200px', marginLeft: '200px', marginTop: '-100px' }}>
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
          <div style={{ height: '100px', display: 'flex', alignItems: 'center', marginTop: '180px' }}>
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
          <div style={{ height: '38px', display: 'flex', alignItems: 'center', marginTop: '5px' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', lineHeight: '1.2', textAlign: 'center' }}>가격</p>
          </div>
          <div style={{ height: '38px', display: 'flex', alignItems: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', textAlign: 'center' }}>면적</p>
          </div>
          <div style={{ height: '38px', display: 'flex', alignItems: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', textAlign: 'center' }}>수용인원</p>
          </div>
          <div style={{ height: '38px', display: 'flex', alignItems: 'center' }}>
            <p style={{ fontSize: '16px', fontWeight: 'bold', margin: '0', textAlign: 'center' }}>주의사항</p>
          </div>
          <div style={{ height: '38px', display: 'flex', alignItems: 'center' }}>
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
      <p>{facility.precautions}</p>
      <p>{facility.refundPolicy}</p>
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
