import React from 'react';
import { AppBar, Toolbar, Typography, Container } from '@mui/material';
import { Link } from 'react-router-dom';

function Layout({ children }) {
  return (
    <div>
      <AppBar position="static">
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            My App
          </Typography>
          <Link to="/login" style={{ margin: '0 10px', color: '#fff' }}>Login</Link>
          <Link to="/register" style={{ margin: '0 10px', color: '#fff' }}>Register</Link>
          <Link to="/status" style={{ margin: '0 10px', color: '#fff' }}>Status</Link>
        </Toolbar>
      </AppBar>
      <Container style={{ marginTop: '20px' }}>
        {children}
      </Container>
    </div>
  );
}

export default Layout;
