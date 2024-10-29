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
        const defaultTypes = [{ id: 1, name: "임시 유형 1" }, 
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
                              { id: 12, name: "임시 유형 12" }];
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
  const [facilityOptions, setFacilityOptions] = useState([]);
  const [selectedFacilityId, setSelectedFacilityId] = useState(null);

  useEffect(() => {
    async function fetchFacilities() {
      try {
        const response = await axios.get(`/api/facilities?type=${selectedType}`);
        setFacilityOptions(response.data);
        setLeftFacility(response.data[0]?.id);
        setRightFacility(response.data[1]?.id);
      } catch (error) {
        console.error("Error fetching facilities", error);
        setFacilityOptions([
          { id: 'temp1', name: '임시 시설 1', image: 'https://via.placeholder.com/150', shortDescription: '임시 소개', price: 1000 },
          { id: 'temp2', name: '임시 시설 2', image: 'https://via.placeholder.com/150', shortDescription: '임시 소개', price: 2000 },
        ]);
        setLeftFacility('temp1');
        setRightFacility('temp2');
      }
    }

    if (selectedType) {
      fetchFacilities();
    }
  }, [selectedType]);

  return (
    <div className="comparison-area" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', width: '80%', maxWidth: '1200px', marginTop: '-200px' }}>
      <div className="facility-box" style={{ width: '45%', textAlign: 'center', margin: '0 10px' }}>
        {leftFacility && <FacilitySimpleDetail id={leftFacility} facilityOptions={facilityOptions} setSelectedFacilityId={setSelectedFacilityId} />}
      </div>

      <div className="facility-box" style={{ width: '45%', textAlign: 'center', margin: '0 10px' }}>
        {rightFacility && <FacilitySimpleDetail id={rightFacility} facilityOptions={facilityOptions} setSelectedFacilityId={setSelectedFacilityId} />}
      </div>

      {/* FacilityDetail 팝업 */}
      {selectedFacilityId && (
        <div className="facility-detail-overlay" style={{ position: 'fixed', top: 0, left: 0, width: '100%', height: '100%', backgroundColor: 'rgba(0, 0, 0, 0.5)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
          <div style={{ backgroundColor: '#fff', padding: '20px', borderRadius: '8px', width: '80%', maxWidth: '500px' }}>
            <button onClick={() => setSelectedFacilityId(null)} style={{ position: 'absolute', top: '10px', right: '10px', cursor: 'pointer' }}>X</button>
            <FacilityDetail id={selectedFacilityId} />
          </div>
        </div>
      )}
    </div>
  );
}

// FacilitySimpleDetail 컴포넌트
function FacilitySimpleDetail({ id, facilityOptions, setSelectedFacilityId }) {
  const facility = facilityOptions.find(option => option.id === id);

  return facility ? (
    <div className="facility-simple-detail" style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}>
      <img src={facility.image} alt={facility.name} style={{ width: '100%', maxWidth: '150px', marginBottom: '10px' }} />
      <h2>{facility.name}</h2>
      <p>{facility.shortDescription}</p>
      <p>₩{facility.price}</p>
      <button onClick={() => setSelectedFacilityId(id)}>상세 정보 보기</button>
    </div>
  ) : null;
}

// FacilityDetail 컴포넌트
function FacilityDetail({ id }) {
  const [facility, setFacility] = useState(null);

  useEffect(() => {
    async function fetchFacilityDetail() {
      try {
        const response = await axios.get(`/api/facilities/${id}/details`);
        setFacility(response.data);
      } catch (error) {
        console.error("Error fetching facility details", error);
        // 임시 데이터 사용
        setFacility({ price: 3000, area: 100, capacity: 50, precautions: "주의사항 예시", refundPolicy: "환불 정책 예시" });
      }
    }
    if (id) fetchFacilityDetail();
  }, [id]);

  return facility ? (
    <div className="facility-detail" style={{ textAlign: 'center', marginTop: '20px' }}>
      <h3>가격: ₩{facility.price}</h3>
      <p>면적: {facility.area}㎡</p>
      <p>수용 인원: {facility.capacity}</p>
      <p>주의사항: {facility.precautions}</p>
      <p>환불 정책: {facility.refundPolicy}</p>
    </div>
  ) : null;
}

// ComparePage 컴포넌트
function ComparePage() {
  const [selectedType, setSelectedType] = useState(null);

  return (
    <div className="compare-page" style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '100vh' }}>
      <Sidebar setSelectedType={setSelectedType} />
      <div style={{ flex: 1, display: 'flex', justifyContent: 'center', alignItems: 'center', marginLeft: '250px' }}>
        <ComparisonArea selectedType={selectedType} />
      </div>
    </div>
  );
}

export default ComparePage;
