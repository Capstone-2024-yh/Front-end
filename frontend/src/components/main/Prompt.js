import React, { useState } from 'react';
import { TextField, Button, Box, Typography } from '@mui/material';

function Prompt() {
  const [prompt, setPrompt] = useState(''); // 사용자가 입력한 프롬프트 저장
  const [response, setResponse] = useState(''); // 추후 GPT 응답 저장 (현재는 임시값)

  const handleSubmit = (e) => {
    e.preventDefault();
    // GPT 서비스로 프롬프트 전송하는 API 호출 부분이 추후 추가될 예정
    console.log('User prompt:', prompt);

    // 임시로 사용자가 입력한 프롬프트를 그대로 응답에 출력
    setResponse(`AI의 답변: ${prompt}`);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        조건 입력기
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="원하시는 조건을 입력하세요"
          multiline
          rows={4}
          fullWidth
          margin="normal"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          variant="outlined"
        />
        <Button type="submit" variant="contained" color="primary" fullWidth sx={{ mt: 2 }}>
          제출
        </Button>
      </form>

      {/* GPT 응답을 보여주는 임시 박스 */}
      {response && (
        <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h6">답변</Typography>
          <Typography>{response}</Typography>
        </Box>
      )}
    </Box>
  );
}

export default Prompt;
