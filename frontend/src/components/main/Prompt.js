import React, { useState } from 'react';
import { Box, Button, TextField, Typography, CircularProgress } from '@mui/material';
import axios from 'axios';

function Prompt() {
  const [prompt, setPrompt] = useState('');
  const [response, setResponse] = useState('');
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

      setResponse(`AI의 답변: ${res.data}`);
    } catch (error) {
      setError(true);
      setResponse(`AI의 답변(임시): ${prompt}`);
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <Box sx={{ maxWidth: 600, mx: 'auto', mt: 5, p: 3, boxShadow: 3, borderRadius: 2 }}>
      <Typography variant="h5" component="h1" gutterBottom align="center">
        AI를 통해 알맞는 장소를 찾아보세요!
      </Typography>
      <form onSubmit={handleSubmit}>
        <TextField
          label="원하시는 조건을 입력하거나 파일을 첨부해 보세요!"
          multiline
          rows={4}
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

      {isLoading && (
        <Box sx={{ display: 'flex', justifyContent: 'center', mt: 2 }}>
          <CircularProgress />
        </Box>
      )}

      {response && (
        <Box sx={{ mt: 4, p: 2, border: '1px solid #ccc', borderRadius: 2 }}>
          <Typography variant="h6">답변</Typography>
          <Typography>{response}</Typography>
        </Box>
      )}

      {error && (
        <Box sx={{ mt: 2, p: 2, border: '1px solid red', borderRadius: 2 }}>
          <Typography color="error">백엔드와의 연결에 문제가 발생했습니다. 입력하신 내용을 임시로 보여드립니다.</Typography>
        </Box>
      )}
    </Box>
  );
}

export default Prompt;
