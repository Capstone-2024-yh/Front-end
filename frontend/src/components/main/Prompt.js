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
      <Typography variant="h6" gutterBottom>
        - 조건만 입력하신다면 최적의 장소를 추천해 드립니다.
      </Typography>
      <Typography variant="h6" gutterBottom>
        - 제안서나 사진을 첨부하면 피드백도 제공해 드립니다.
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
                width: '500px',
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
            {res.feedback && res.feedback.length > 0 && (
              <Box sx={{ p: 2, mb: 3, border: '1px solid #ccc', borderRadius: 2 }}>
                <Typography variant="h6">피드백</Typography>
                {res.feedback.map((item, idx) => (
                  <Typography key={idx}>{item}</Typography> // 각 피드백 항목 출력
                ))}
              </Box>
            )}

            {/* 세부 장소 소개 */}
            <Box sx={{ p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
              <Typography variant="h6">장소 세부 정보</Typography>
              {res.venueInfo.slice(0, 5).map((place, index) => (
                <Box key={index} sx={{ mb: 4 }}>
                  {/* 첫 번째 블록: 이미지, 이름, 위치, 가격, 간단한 설명 */}
                  <Box
                    sx={{
                      display: 'flex',
                      mb: 2,
                      border: '1px solid #eee',
                      borderRadius: 2,
                      p: 2,
                      cursor: 'pointer',
                    }}
                    onClick={() => window.open(`/rental-space/${place.id}`, '_blank')}
                  >
                    {/* 이미지 표시 */}
                    {place.photoBase64 ? (
                      <img
                        src={place.photoBase64}
                        alt={place.name}
                        style={{ width: '150px', height: '150px', marginRight: '20px' }}
                      />
                    ) : (
                      <Box
                        sx={{
                          width: '150px',
                          height: '150px',
                          display: 'flex',
                          alignItems: 'center',
                          justifyContent: 'center',
                          backgroundColor: '#f0f0f0',
                          marginRight: '20px',
                        }}
                      >
                        <CircularProgress size={24} />
                      </Box>
                    )}

                    {/* 장소 정보 */}
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
                    </Box>
                  </Box>

                  {/* 두 번째 블록: 주의사항 및 추천 이유 */}
                  {(place.caution || place.recommand) && (
                    <Box
                      sx={{
                        border: '1px solid #ccc',
                        borderRadius: 2,
                        p: 2,
                        mt: 2,
                        backgroundColor: '#f9f9f9',
                      }}
                    >
                      {place.caution && (
                        <Typography sx={{ mb: 1 }}>
                          <strong>주의사항:</strong> {place.caution.join(' ')}
                        </Typography>
                      )}
                      {place.recommand && (
                        <Typography>
                          <strong>추천 이유:</strong> {place.recommand.join(' ')}
                        </Typography>
                      )}
                    </Box>
                  )}
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

                  // 데이터 저장
                  sessionStorage.setItem(
                    'compareFacilities',
                    JSON.stringify({
                      facilities: res.venueInfo,
                      leftFacilityId,
                      rightFacilityId,
                    })
                  );

                  // 새로운 페이지 열기
                  window.open('/compare-page-prompt', '_blank'); // 새 탭에서 열기
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
  const [response, setResponse] = useState([]);
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
    setIsLoading(true);

    const uid = auth?.user?.id || 0;
    let fileData = null;

    if (file) {
      try {
        fileData = await handleFileUpload(file);
      } catch (error) {
        setError('파일 업로드 중 문제가 발생했습니다.');
        setIsLoading(false);
        return;
      }
    }

    try {
      // 1. 검색 결과 가져오기
      const searchRes = await axios.post('/search/searchKeyword', {
        keyword: prompt,
        uid,
      });

      const venueIds = searchRes.data.searchResults.map((result) => result.venueId);
      const feedback = searchRes.data.feedback;

      if (venueIds.length === 0) {
        throw new Error('검색 결과가 없습니다.');
      }

      // 피드백 데이터 추가
      setResponse((prevResponse) => [
        ...prevResponse,
        { feedback, venueInfo: [] },
      ]);

      // 2. 각 장소 데이터를 개별적으로 가져오기
      for (const id of venueIds) {
        try {
          const venueResponse = await axios.post(`/search/getResponse/${id}`, {
            Tokens: [
              {
                Require: prompt,
                Subject: '',
                Summary: '',
                Token: fileData?.fileId || '',
              },
            ],
          });

          const venue = venueResponse.data;
          venue.photoBase64 = null; // 이미지 초기화

          // 점진적으로 데이터 추가
          setResponse((prevResponse) =>
            prevResponse.map((res) =>
              res.feedback === feedback
                ? { ...res, venueInfo: [...res.venueInfo, venue] }
                : res
            )
          );

          // 이미지 데이터 로드
          try {
            const photoResponse = await axios.get(`/venuePhoto/${venue.id}`);
            const imageBase64 = photoResponse.data[0]?.photoBase64 || '';
            const imageData = /^data:image\/[a-zA-Z]+;base64,/.test(imageBase64)
              ? imageBase64
              : `data:image/jpeg;base64,${imageBase64}`;

            // 이미지 데이터 업데이트
            setResponse((prevResponse) =>
              prevResponse.map((res) =>
                res.feedback === feedback
                  ? {
                      ...res,
                      venueInfo: res.venueInfo.map((v) =>
                        v.id === venue.id ? { ...v, photoBase64: imageData } : v
                      ),
                    }
                  : res
              )
            );
          } catch (error) {
            console.error(`Error fetching photo for venue ID ${venue.id}:`, error);
          }
        } catch (error) {
          console.error(`Error fetching details for venue ID ${id}:`, error);
        }
      }
    } catch (error) {
      setError('데이터 로드 중 문제가 발생했습니다.');
      console.error(error);
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
