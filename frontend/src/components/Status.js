import React, { useEffect, useState } from 'react';
import axios from '../axiosConfig';
import { Typography, Box, Alert } from '@mui/material';

function Status() {
  const [status, setStatus] = useState('');

  useEffect(() => {
    const checkStatus = async () => {
      try {
        const response = await axios.get('/auth/status');
        setStatus(response.data);
      } catch (error) {
        setStatus('User is not logged in');
      }
    };

    checkStatus();
  }, []);

  return (
    <Box
      sx={{
        maxWidth: 600,
        mx: 'auto',
        mt: 5,
        p: 3,
        boxShadow: 3,
        borderRadius: 2,
        textAlign: 'center',
      }}
    >
      <Typography variant="h5" component="h2" gutterBottom>
        Login Status
      </Typography>
      {status.includes('logged in') ? (
        <Alert severity="success">{status}</Alert>
      ) : (
        <Alert severity="error">{status}</Alert>
      )}
    </Box>
  );
}

export default Status;
