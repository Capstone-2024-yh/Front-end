import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

function Prompt() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState(null);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setIsLoading(true);

    const formData = new FormData();
    formData.append('question', prompt);
    if (file) {
      formData.append('file', file);
    }

    try {
      const res = await axios.post('/gptCall/Call', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });

      setResponse(res.data);
    } catch (error) {
      setError(true);
      setResponse({
        places: [
          { title: '임시 장소 1', features: '특징 1', considerations: '주의사항 1', recommendedUsage: '추천 용도 1' },
          { title: '임시 장소 2', features: '특징 2', considerations: '주의사항 2', recommendedUsage: '추천 용도 2' },
          { title: '임시 장소 3', features: '특징 3', considerations: '주의사항 3', recommendedUsage: '추천 용도 3' },
        ],
        feedback: '임시 피드백: 프롬프트와 관련된 피드백입니다.',
        detailedPlaces: [
          {
            imageUrl: '/path/to/temporary-image1.jpg',
            location: '임시 위치 1',
            address: '임시 주소 1',
            price: '임시 가격 1',
            simpleDescription: '간단한 설명 1',
            precautions: '주의사항 1',
          },
          {
            imageUrl: '/path/to/temporary-image2.jpg',
            location: '임시 위치 2',
            address: '임시 주소 2',
            price: '임시 가격 2',
            simpleDescription: '간단한 설명 2',
            precautions: '주의사항 2',
          },
        ],
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', height: '100vh', overflowY: 'auto' }}>
      {/* AI 응답 출력 부분 */}
      <Box sx={{ width: '90%', maxWidth: 800, flex: 1, mb: '100px', overflowY: 'auto', paddingTop: 4 }}>
        {isLoading && (
          <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
            <CircularProgress />
          </Box>
        )}

        {response && (
          <Box sx={{ width: '100%', mt: 4 }}>
            {/* 1. 추천 장소 리스트 */}
            <Box sx={{ p: 2, mb: 3, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="h6">추천 장소</Typography>
              {response.places?.map((place, index) => (
                <Box key={index} sx={{ mb: 2 }}>
                  <Typography><strong>제목:</strong> {place.title}</Typography>
                  <Typography><strong>특징:</strong> {place.features}</Typography>
                  <Typography><strong>신경 써야 할 사항:</strong> {place.considerations}</Typography>
                  <Typography><strong>추천 용도:</strong> {place.recommendedUsage}</Typography>
                </Box>
              ))}
            </Box>

            {/* 2. 프롬프트에 따른 피드백 */}
            <Box sx={{ p: 2, mb: 3, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="h6">피드백</Typography>
              <Typography>{response.feedback}</Typography>
            </Box>

            {/* 3. 세부 장소 소개 */}
            <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="h6">장소 세부 정보</Typography>
              {response.detailedPlaces?.map((place, index) => (
                <Box key={index} sx={{ display: 'flex', mb: 3, border: '1px solid #eee', borderRadius: 2, p: 2 }}>
                  <img src={place.imageUrl} alt={place.title} style={{ width: '150px', height: '100px', marginRight: '20px' }} />
                  <Box>
                    <Typography><strong>위치:</strong> {place.location}</Typography>
                    <Typography><strong>주소:</strong> {place.address}</Typography>
                    <Typography><strong>가격:</strong> {place.price}</Typography>
                    <Typography><strong>간단한 설명:</strong> {place.simpleDescription}</Typography>
                    <Typography><strong>주의사항:</strong> {place.precautions}</Typography>
                  </Box>
                </Box>
              ))}
            </Box>
          </Box>
        )}
      </Box>

      {/* 프롬프트 입력 부분 */}
      <Box sx={{ position: 'fixed', bottom: 0, width: '100%', maxWidth: 800, backgroundColor: 'white', zIndex: 1, boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)', padding: 2 }}>
        <form onSubmit={handleSubmit} style={{ width: '100%' }}>
          <TextField
            label="원하시는 조건을 입력하거나 파일을 첨부해 보세요!"
            multiline
            rows={1}
            fullWidth
            margin="normal"
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            variant="outlined"
          />

          <Box sx={{ display: 'flex', alignItems: 'center', mt: 2 }}>
            <TextField
              variant="outlined"
              size="small"
              fullWidth
              value={file ? file.name : '이미지나 PDF 파일을 선택하세요.'}
              disabled
            />
            <Button variant="outlined" component="label" sx={{ ml: 1, whiteSpace: 'nowrap' }}>
              파일 선택
              <input type="file" accept="image/*,application/pdf" hidden onChange={handleFileChange} />
            </Button>
          </Box>

          <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 3 }} disabled={isLoading}>
            제출
          </Button>
        </form>
      </Box>
    </Box>
  );
}

export default Prompt;
