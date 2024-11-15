import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

function Prompt() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState([]);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(null);
  const bottomRef = useRef(null);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (prompt.trim() === '/kill') {
      setResponse([]);
      setPrompt('');
      return;
    }

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
  
      setResponse((prevResponse) => [
        ...(prevResponse || []),
        {
          feedback: res.data.feedback,
          detailedPlaces: res.data.detailedPlaces,
        },
      ]);
    } catch (error) {
      setError(true);
      setResponse((prevResponse) => [
        ...(prevResponse || []),
        {
          feedback: '임시 피드백: 프롬프트와 관련된 피드백입니다.',
          detailedPlaces: [
            {
              imageUrl: 'https://via.placeholder.com/150',
              title: '임시 장소 1', 
              location: '임시 위치 1',
              address: '임시 주소 1',
              price: '임시 가격 1',
              simpleDescription: '간단한 설명 1',
              precautions: '주의사항 1',
              recommendedUsage: '추천 용도 1',
            },
            {
              imageUrl: 'https://via.placeholder.com/150',
              title: '임시 장소 2', 
              location: '임시 위치 2',
              address: '임시 주소 2',
              price: '임시 가격 2',
              simpleDescription: '간단한 설명 2',
              precautions: '주의사항 2',
              recommendedUsage: '추천 용도 2',
            },
            {
              imageUrl: 'https://via.placeholder.com/150',
              title: '임시 장소 3', 
              location: '임시 위치 3',
              address: '임시 주소 3',
              price: '임시 가격 3',
              simpleDescription: '간단한 설명 3',
              precautions: '주의사항 3',
              recommendedUsage: '추천 용도 3',
            },
          ],
        },
      ]);
    } finally {
      setIsLoading(false);
    }
  };  

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  useEffect(() => {
    // response가 변경될 때마다 하단으로 스크롤
    if (response.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  return (
    <Box
      sx={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        minHeight: '100vh',
      }}
    >
      {response.length === 0 && !isLoading && !error ? (
        // 초기 상태: 메시지와 입력 박스를 화면 중앙에 배치
        <Box
          sx={{
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            flexGrow: 1,
          }}
        >
          <Typography variant="h4" gutterBottom>
            무엇을 도와드릴까요?
          </Typography>
          {/* 입력 폼 */}
          <Box sx={{ width: '100%', maxWidth: 800, mt: 2 }}>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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

              <Box sx={{ position: 'relative', mt: 2 }}>
              <TextField
                label="원하시는 조건을 입력하거나 파일을 첨부해 보세요!"
                multiline
                margin="normal"
                value={prompt}
                onChange={(e) => setPrompt(e.target.value)}
                variant="outlined"
                maxRows={10}
                sx={{
                  width: response.length === 0 ? '400px' : 'calc(100% - 70px)',
                  pr: response.length === 0 ? '70px' : '0px', // 초기 상태에서 버튼 크기만큼 여백 추가
                }}
              />
                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    right: 8,
                    bottom: 8,
                    minWidth: '48px',
                    minHeight: '57px',
                    padding: '8px',
                  }}
                  disabled={isLoading}
                >
                  ↥
                </Button>
              </Box>
            </form>
          </Box>
        </Box>
      ) : (
        // 입력 이후: 기존 레이아웃으로 변경
        <>
          {/* AI 응답 출력 부분 */}
          <Box sx={{ width: '90%', maxWidth: 800, flexGrow: 1, mb: 3, mt: 2 }}>
            {isLoading && (
              <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
                <CircularProgress />
              </Box>
            )}

            {error && (
              <Box sx={{ color: 'red', mt: 2 }}>
                <Typography>에러가 발생했습니다. 다시 시도해 주세요.</Typography>
              </Box>
            )}

            {response.map((res, index) => (
              <Box key={index} sx={{ width: '100%', mt: 4 }}>
                {/* 피드백 */}
                <Box sx={{ p: 2, mb: 3, border: '1px solid #ccc', borderRadius: 2 }}>
                  <Typography variant="h6">피드백</Typography>
                  <Typography>{res.feedback}</Typography>
                </Box>

                {/* 세부 장소 소개 */}
                <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
                  <Typography variant="h6">장소 세부 정보</Typography>
                  {res.detailedPlaces?.map((place, index) => (
                    <Box key={index} sx={{ display: 'flex', mb: 3, border: '1px solid #eee', borderRadius: 2, p: 2 }}>
                      <img src={place.imageUrl} alt={place.title} style={{ width: '150px', height: '150px', marginRight: '20px' }} />
                      <Box>
                        <Typography><strong>제목:</strong> {place.title}</Typography>
                        <Typography><strong>위치:</strong> {place.location}</Typography>
                        <Typography><strong>주소:</strong> {place.address}</Typography>
                        <Typography><strong>가격:</strong> {place.price}</Typography>
                        <Typography><strong>간단한 설명:</strong> {place.simpleDescription}</Typography>
                        <Typography><strong>주의사항:</strong> {place.precautions}</Typography>
                        <Typography><strong>추천 용도:</strong> {place.recommendedUsage}</Typography>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            ))}
          </Box>

          {/* 프롬프트 입력 부분 */}
          <Box sx={{ position: 'sticky', bottom: 0, width: '100%', maxWidth: 800, backgroundColor: 'white', zIndex: 1, boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)', padding: 2 }}>
            <form onSubmit={handleSubmit} style={{ width: '100%' }}>
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

              <Box sx={{ position: 'relative', mt: 2 }}>
                <TextField
                  label="원하시는 조건을 입력하거나 파일을 첨부해 보세요!"
                  multiline
                  margin="normal"
                  value={prompt}
                  onChange={(e) => setPrompt(e.target.value)}
                  variant="outlined"
                  maxRows={6}
                  sx={{
                    width: response.length === 0 ? '400px' : 'calc(100% - 70px)',
                    pr: '70px', // 오른쪽 패딩 추가
                  }}
                />

                <Button
                  type="submit"
                  variant="contained"
                  color="primary"
                  sx={{
                    position: 'absolute',
                    right: 8,
                    bottom: 8, // 버튼을 입력 칸의 하단에 고정
                    minWidth: '48px',
                    minHeight: '57px',
                    padding: '8px',
                  }}
                  disabled={isLoading}
                >
                  ↥
                </Button>
              </Box>
            </form>
          </Box>
        </>
      )}
      <div ref={bottomRef} />
    </Box>
  );
}

export default Prompt;
