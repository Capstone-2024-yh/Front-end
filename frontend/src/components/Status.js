import React from 'react';
import { useSelector } from 'react-redux';
import { Typography, Box, Alert } from '@mui/material';

function Status() {
  const { isAuthenticated, user } = useSelector((state) => state.auth);

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
      {isAuthenticated ? (
        <Alert severity="success">Logged in as {user.email}</Alert>
      ) : (
        <Alert severity="error">User is not logged in</Alert>
      )}
    </Box>
  );
}

export default Status;
