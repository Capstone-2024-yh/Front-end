import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from './components/Login';
import Register from './components/Register';
import Status from './components/Status';
import Layout from './components/Layout';
import store from './store'; // Redux store

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/status" element={<Status />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
