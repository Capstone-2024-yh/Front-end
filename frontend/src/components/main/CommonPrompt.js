// 이 파일을 복사해서 여러 프롬프트로 사용

import React, { useState } from 'react';
import { TextField, Button, Box, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

function CommonPrompt() {
  const [commonPrompt, setCommonPrompt] = useState(''); // 사용자가 입력한 프롬프트 저장
  const [response, setResponse] = useState(''); // GPT 응답 저장
  const [error, setError] = useState(null); // 오류 상태 저장
  const [isLoading, setIsLoading] = useState(false); // 로딩 상태 저장

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null); // 오류 초기화
    setIsLoading(true); // 로딩 시작

    try {
      // axios를 사용한 백엔드 API 호출
      const res = await axios.post('/gptCall/Call', {
        question: commonPrompt, // Question 객체에 맞게 key를 "question"으로 전송
      });

      setResponse(`AI의 답변: ${res.data}`); // 백엔드에서 받은 응답 출력
    } catch (error) {
      // 오류가 발생하면 입력된 프롬프트를 그대로 출력
      console.error("Error during API call:", error);
      setError(true);
      setResponse(`AI의 답변(임시): ${commonPrompt}`);
    } finally {
      setIsLoading(false); // 로딩 종료
    }
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        AI를 통해 알맞는 장소를 찾아보세요!
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="원하시는 조건을 입력하세요"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={commonPrompt}
          onChange={(e) => setCommonPrompt(e.target.value)}
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }} disabled={isLoading}>
          제출
        </Button>
      </form>

      {/* 로딩 표시 */}
      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {/* GPT 응답을 보여주는 박스 */}
      {response && (
        <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h6">답변</Typography>
          <Typography>{response}</Typography>
        </Box>
      )}

      {/* 오류 메시지 출력 */}
      {error && (
        <Box sx={{ mt: 2, p: 2, border: '1px solid red', borderRadius: 2 }}>
          <Typography color="error">백엔드와의 연결에 문제가 발생했습니다. 입력하신 내용을 임시로 보여드립니다.</Typography>
        </Box>
      )}
    </Box>
  );
}

export default CommonPrompt;
