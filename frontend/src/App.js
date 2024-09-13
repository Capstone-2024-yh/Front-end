import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from './components/login/Login';
import Register from './components/login/Register';
import Status from './components/login/Status';
import Layout from './components/login/Layout';
import KakaoMap from './components/map/KakaoMap';
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
            <Route path="/map" element={<KakaoMap />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
