import React, { useState, useRef, useEffect } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import { useLocation } from 'react-router-dom';
import { useSelector } from 'react-redux';
import axios from 'axios';

// 초기 상태 컴포넌트
function InitialPrompt({ handleSubmit, handleFileChange, file, prompt, setPrompt, isLoading }) {
  return (
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
                width: '400px',
                pr: '70px', // 버튼 크기만큼 여백
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
  );
}

// 입력 이후 컴포넌트
function ResponseDisplay({ response, isLoading, error, handleSubmit, handleFileChange, file, prompt, setPrompt }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    if (response.length > 0) {
      bottomRef.current.scrollIntoView({ behavior: 'smooth' });
    }
  }, [response]);

  return (
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
              {res.venueInfo?.slice(0, 3).map((place, index) => (
                <Box
                  key={index}
                  sx={{ display: 'flex', mb: 3, border: '1px solid #eee', borderRadius: 2, p: 2 }}
                >
                  <img
                    src={place.photoBase64 || 'https://via.placeholder.com/150'}
                    alt={place.name}
                    style={{ width: '150px', height: '150px', marginRight: '20px' }}
                  />
                  <Box>
                    <Typography>
                      <strong>이름:</strong> {place.name}
                    </Typography>
                    <Typography>
                      <strong>위치:</strong> {place.location}
                    </Typography>
                    <Typography>
                      <strong>가격:</strong> ₩{place.amount}
                    </Typography>
                    <Typography>
                      <strong>간단한 설명:</strong> {place.simpleDesc}
                    </Typography>
                    <Typography>
                      <strong>주의사항:</strong> {place.caution.join(' ')}
                    </Typography>
                    <Typography>
                      <strong>추천 활동:</strong> {place.recommand.join(' ')}
                    </Typography>
                  </Box>
                </Box>
              ))}
            </Box>

            {/* 두 장소 비교하기 버튼 */}
            <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
              <Button
                variant="contained"
                color="primary"
                onClick={() => {
                  const leftFacilityId = res.venueInfo[0]?.id.toString() || 'temp1';
                  const rightFacilityId = res.venueInfo[1]?.id.toString() || 'temp2';

                  // ComparePagePrompt로 이동
                  window.open(
                    `/compare-page-prompt?left=${leftFacilityId}&right=${rightFacilityId}`,
                    '_blank' // 새 탭이나 새 창에서 열기
                  );
                }}
              >
                두 장소 비교하기
              </Button>
            </Box>
          </Box>
        ))}
      </Box>

      {/* 프롬프트 입력 부분 */}
      <Box
        sx={{
          position: 'sticky',
          bottom: 0,
          width: '100%',
          maxWidth: 800,
          backgroundColor: 'white',
          zIndex: 1,
          boxShadow: '0px -2px 10px rgba(0, 0, 0, 0.1)',
          padding: 2,
        }}
      >
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
                width: 'calc(100% - 70px)',
                pr: '0px', // 오른쪽 패딩 제거
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
      <div ref={bottomRef} />
    </>
  );
}

// 메인 Prompt 컴포넌트
function Prompt() {
  const location = useLocation();
  const auth = useSelector((state) => state.auth);

  const [prompt, setPrompt] = useState(location.state?.prompt || '');
  const [response, setResponse] = useState(location.state?.response || []);
  const [error, setError] = useState(null);
  const [isLoading, setIsLoading] = useState(false);
  const [file, setFile] = useState(location.state?.file || null);

  const handleFileUpload = async (file) => {
    const formData = new FormData();
    formData.append('file', file);

    try {
      const res = await axios.post('/fileAssist', formData, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      return res.data; // 서버로부터 받은 파일 정보 반환
    } catch (error) {
      console.error('파일 업로드 실패:', error);
      throw new Error('파일 업로드에 실패했습니다.');
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (prompt.trim() === '/kill') {
      setResponse([]);
      setPrompt('');
      return;
    }

    setIsLoading(true);

    let fileData = null;

    // 파일 전송 로직
    if (file) {
      try {
        fileData = await handleFileUpload(file);
      } catch (error) {
        setError('파일 업로드 중 문제가 발생했습니다.');
        setIsLoading(false);
        return;
      }
    }

    const uid = auth?.user?.id || 0;

    try {
      console.log('Prompt:', prompt);
      console.log('User ID:', uid);

      const res = await axios.post(
        '/search/searchAssist',
        {
          keyword: prompt,
          uid, // 로그인되지 않은 경우 0으로 설정
          fileId: fileData?.fileId, // 파일 ID 추가
        },
        {
          headers: {
            'Content-Type': 'application/json', // JSON 요청으로 설정
          }
        }
      );

      // 각 장소의 이미지를 가져옵니다.
      const venueInfoWithImages = await Promise.all(
        res.data.venueInfo.map(async (venue) => {
          try {
            const photoResponse = await axios.get(`/venuePhoto/${venue.id}`);
            const imageBase64 = photoResponse.data[0]?.photoBase64 || '';
            
            // Base64 데이터가 있다면, data:image/jpeg;base64, 또는 기본 이미지로 설정
            const imageData = imageBase64 
              ? `data:image/jpeg;base64,${imageBase64}` 
              : 'https://via.placeholder.com/150';
      
            return {
              ...venue,
              photoBase64: imageData,
            };
          } catch (error) {
            console.error(`Error fetching photo for venue ID ${venue.id}:`, error);
            return {
              ...venue,
              photoBase64: 'https://via.placeholder.com/150', // 기본 이미지
            };
          }
        })
      );      

      // 이미지가 포함된 venueInfo로 업데이트합니다.
      res.data.venueInfo = venueInfoWithImages;

      // 백엔드로부터 받은 데이터 저장
      setResponse((prevResponse) => [
        ...(prevResponse || []),
        res.data,
      ]);

      console.log('Prompt response:', res.data);
    } catch (error) {
      setError(true);

      // 임시 데이터 사용
      const tempData = {
        id: 0,
        feedback: ['임시 피드백: 프롬프트와 관련된 피드백입니다.'],
        venueIdList: [0, 1, 2],
        venueInfo: [
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
          {
            id: 2,
            name: '임시 장소 3',
            location: '임시 위치 3',
            amount: 20000,
            simpleDesc: '간단한 설명 3',
            caution: ['주의사항 5', '주의사항 6'],
            recommand: ['추천 용도 5', '추천 용도 6'],
          },
        ],
      };

      setResponse((prevResponse) => [
        ...(prevResponse || []),
        tempData,
      ]);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', minHeight: '100vh' }}>
      {response.length === 0 && !isLoading && !error ? (
        <InitialPrompt
          handleSubmit={handleSubmit}
          handleFileChange={handleFileChange}
          file={file}
          prompt={prompt}
          setPrompt={setPrompt}
          isLoading={isLoading}
        />
      ) : (
        <ResponseDisplay
          response={response}
          isLoading={isLoading}
          error={error}
          handleSubmit={handleSubmit}
          handleFileChange={handleFileChange}
          file={file}
          prompt={prompt}
          setPrompt={setPrompt}
        />
      )}
    </Box>
  );
}

export default Prompt;
