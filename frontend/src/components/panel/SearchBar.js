import React, { useState } from 'react';
import { Box, TextField, Button } from '@mui/material';
import axios from 'axios';

const SearchBar = ({ onSearch }) => {
  const [query, setQuery] = useState('');

  const handleInputChange = (event) => {
    setQuery(event.target.value);
  };

  const handleSearchClick = async () => {
    if (query.trim()) {
      try {
        const response = await axios.get('/api/search', {
          params: {
            query: query
          }
        });
        console.log('검색 결과:', response.data); // 데이터를 콘솔에 출력하거나 원하는 방식으로 처리
      } catch (error) {
        console.error('검색 요청 오류:', error);
      }
    }
  };

  return (
    <Box
      sx={{
        position: 'sticky',
        top: '64px',
        display: 'flex',
        justifyContent: 'center',
        margin: '20px 0',
        backgroundColor: '#fff',  // 배경색을 설정하여 스크롤 시 뒤 배경과 구분
        zIndex: 1000,  // 다른 요소 위에 위치하도록 zIndex 조정
        padding: '10px 0',
        boxShadow: '0px 4px 6px rgba(0, 0, 0, 0.1)', // 약간의 그림자 추가
      }}
    >
      <TextField
        value={query}
        onChange={handleInputChange}
        placeholder="원하시는 항목을 검색하세요"
        sx={{ width: '70%' }}
      />
      <Button onClick={handleSearchClick} variant="contained" sx={{ marginLeft: '10px' }}>
        검색
      </Button>
    </Box>
  );
};

export default SearchBar;
