import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Grid, Collapse } from '@mui/material';

// 장비 이름과 ID를 매핑
const equipmentMap = {
  '빔 프로젝터': 1, '마이크': 2, '냉난방기': 3, '책상': 4, 
  '의자': 5, '화이트보드': 6, '음향 시스템': 7, '조명 장비': 8, 
  '컴퓨터': 9, '프린터': 10, '모니터': 11, 'WiFi': 12, 
  'TV': 13, '키보드': 14, '냉장고': 15, '전자레인지': 16, 
  '커피머신': 17, '세탁기': 18, '건조기': 19, '청소기': 20, 
  '카메라': 21, '삼각대': 22, '녹음 장비': 23, 'DVD 플레이어': 24, 
  '스피커': 25, '헤드셋': 26, 'HDMI 케이블': 27, '전동 스크린': 28,
  '화장실': 29, '주차장': 30, '기타 1': 31, '기타 2': 32
};

// 장비 이름 리스트
const equipmentList = Object.keys(equipmentMap);

const EquipmentChecklist = ({ selectedEquipment, setSelectedEquipment }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleCheckboxChange = (event) => {
    const { value, checked } = event.target;
    const equipmentId = parseInt(value, 10);  // 숫자로 변환
    console.log("Checkbox Value (ID):", equipmentId);  // 확인

    if (checked) {
      if (!selectedEquipment.includes(equipmentId)) {
        setSelectedEquipment(prev => [...prev, equipmentId].map(Number));  // 숫자로 강제 변환
      }
    } else {
      setSelectedEquipment(prev => prev.filter(id => id !== equipmentId).map(Number));  // 숫자로 강제 변환
    }
    console.log("Selected Equipment IDs:", selectedEquipment);  // 확인
  };

  return (
    <Box sx={{ marginTop: 2 }}>
      <Button variant="outlined" onClick={handleToggle} fullWidth>
        {open ? '기자재 목록 접기' : '구비된 기자재들을 선택하세요'}
      </Button>
      <Collapse in={open}>
        <Box sx={{ marginTop: 2 }}>
          <Grid container spacing={1}>
            {equipmentList.map((item, index) => (
              <Grid item xs={6} sm={4} md={3} key={index}>
                <FormControlLabel
                  control={
                    <Checkbox
                      checked={selectedEquipment.includes(equipmentMap[item])}
                      onChange={handleCheckboxChange}
                      value={equipmentMap[item]}  // ID만 value로 사용
                    />
                  }
                  label={item}
                />
              </Grid>
            ))}
          </Grid>
        </Box>
      </Collapse>
    </Box>
  );
};

export default EquipmentChecklist;
