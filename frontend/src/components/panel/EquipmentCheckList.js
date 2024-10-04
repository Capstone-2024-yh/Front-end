import React, { useState } from 'react';
import { Box, Button, Checkbox, FormControlLabel, Grid, Collapse } from '@mui/material';

const equipmentList = [
  '빔 프로젝터', '마이크', '냉난방기', '책상', 
  '의자', '화이트보드', '음향 시스템', '조명 장비', 
  '컴퓨터', '프린터', '모니터', 'WiFi', 
  'TV', '키보드', '냉장고', '전자레인지', 
  '커피머신', '세탁기', '건조기', '청소기', 
  '카메라', '삼각대', '녹음 장비', 'DVD 플레이어', 
  '스피커', '헤드셋', 'HDMI 케이블', '전동 스크린',
  '화장실', '주차장', '기타 1', '기타 2'
];

const EquipmentChecklist = ({ selectedEquipment, setSelectedEquipment }) => {
  const [open, setOpen] = useState(false);

  const handleToggle = () => {
    setOpen(!open);
  };

  const handleCheckboxChange = (event) => {
    const { name, checked } = event.target;
    if (checked) {
      setSelectedEquipment([...selectedEquipment, name]);
    } else {
      setSelectedEquipment(selectedEquipment.filter(item => item !== name));
    }
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
                      checked={selectedEquipment.includes(item)}
                      onChange={handleCheckboxChange}
                      name={item}
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
