import React, { useState, useEffect } from 'react';

// ComparePagePrompt 컴포넌트
function ComparePagePrompt() {

  const tempData = {
    facilities: [
      {
        id: 0,
        name: '임시 장소 1',
        location: '임시 위치 1',
        amount: 10000,
        simpleDesc: '간단한 설명 1',
        caution: ['주의사항 1', '주의사항 2'],
        recommand: ['추천 용도 1', '추천 용도 2'],
      },
      {
        id: 1,
        name: '임시 장소 2',
        location: '임시 위치 2',
        amount: 15000,
        simpleDesc: '간단한 설명 2',
        caution: ['주의사항 3', '주의사항 4'],
        recommand: ['추천 용도 3', '추천 용도 4'],
      },
    ],
    leftFacilityId: 0,
    rightFacilityId: 1,
  };

  const sessionData = JSON.parse(sessionStorage.getItem('compareFacilities')) || tempData;

  const { facilities, leftFacilityId, rightFacilityId } = sessionData;

  console.log('facilities:', facilities);
  console.log('leftFacilityId:', leftFacilityId);
  console.log('rightFacilityId:', rightFacilityId);

  return (
    <div
      className="compare-page"
      style={{
        display: 'flex',
        justifyContent: 'center',
        alignItems: 'center',
        minHeight: '100vh',
        flexDirection: 'column',
      }}
    >
      <ComparisonArea
        facilities={facilities}
        leftFacilityId={leftFacilityId}
        rightFacilityId={rightFacilityId}
      />
    </div>
  );
}

// ComparisonArea 컴포넌트
function ComparisonArea({ facilities = [], leftFacilityId = null, rightFacilityId = null }) {
  const [leftFacility, setLeftFacility] = useState(null);
  const [rightFacility, setRightFacility] = useState(null);

  useEffect(() => {
    if (facilities && facilities.length > 0) {
      const leftFacilityData = facilities.find((facility) => facility.id === Number(leftFacilityId));
      const rightFacilityData = facilities.find((facility) => facility.id === Number(rightFacilityId));
  
      setLeftFacility(leftFacilityData || null);
      setRightFacility(rightFacilityData || null);
  
      console.log('Left Facility:', leftFacilityData);
      console.log('Right Facility:', rightFacilityData);
    }
  }, [facilities, leftFacilityId, rightFacilityId]);  

  // 비교할 항목들 정의
  const comparisonItems = [
    { label: '공간한줄', field: 'simpleDesc' },
    { label: '가격', field: 'amount' },
    { label: '위치', field: 'location' },
    { label: '주의사항', field: 'caution' },
    { label: '추천 활동', field: 'recommand' },
  ];

  if (!facilities || facilities.length === 0) {
    return <div>시설 데이터를 불러오는 중입니다...</div>;
  }

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
      {/* 상단 시설 이미지 및 이름 */}
      <div
        style={{
          display: 'flex',
          justifyContent: 'center',
          alignItems: 'flex-start',
          width: '100%',
        }}
      >
        <div style={{ width: '45%', margin: '0 10px' }}>
          <FacilitySimpleDetail facility={leftFacility} />
        </div>

        {/* 중앙 공간 */}
        <div style={{ width: '80px', minWidth: '80px' }}></div>

        <div style={{ width: '45%', margin: '0 10px' }}>
          <FacilitySimpleDetail facility={rightFacility} />
        </div>
      </div>

      <hr style={{ width: '100%', borderTop: '1px solid #ccc', margin: '20px 0' }} />

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
                <FacilityDetailItem facility={leftFacility} field={item.field} />
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
                <FacilityDetailItem facility={rightFacility} field={item.field} />
              </div>
            </div>
            {/* 분리선 */}
            <hr
              style={{
                width: '95%',
                border: 'none',
                borderTop: '1px solid #C8A2C8',
                margin: '10px auto',
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
  if (!facility) return <div>시설 정보를 불러올 수 없습니다.</div>;

  return (
    <div
      className="facility-simple-detail"
      style={{ display: 'flex', flexDirection: 'column', alignItems: 'center' }}
    >
      <h2>{facility.name}</h2>
    </div>
  );
}

// FacilityDetailItem 컴포넌트
function FacilityDetailItem({ facility, field }) {
  if (!facility || !field) return <div>정보를 불러올 수 없습니다.</div>;

  let content = '';

  switch (field) {
    case 'simpleDesc':
      content = facility.simpleDesc || '설명 없음';
      break;
    case 'amount':
      content = facility.amount ? `₩${facility.amount}` : '가격 정보 없음';
      break;
    case 'location':
      content = facility.location || '위치 정보 없음';
      break;
    case 'caution':
      content = facility.caution?.join(' ') || '주의사항 없음';
      break;
    case 'recommand':
      content = facility.recommand?.join(' ') || '추천 활동 없음';
      break;
    default:
      content = facility[field] || '정보 없음';
  }

  return (
    <div style={{ textAlign: 'center', padding: '10px' }}>
      <p>{content}</p>
    </div>
  );
}

const labelStyle = {
  fontSize: '16px',
  fontWeight: 'bold',
  margin: '0',
  lineHeight: '1.2',
  textAlign: 'center',
};

export default ComparePagePrompt;
