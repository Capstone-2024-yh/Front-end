import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from './components/login/Login';
import Register from './components/login/Register';
import Status from './components/login/Status';
import Layout from './components/login/Layout';
import KakaoMap from './components/map/KakaoMap';
import MainPage from './components/main/MainPage'; // 메인 페이지 컴포넌트
import Prompt from './components/main/Prompt';
import LocationList from './components/main/LocationList';
import store from './store'; // Redux store

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Layout>
          <Routes>
            <Route path="/" element={<MainPage />} />
            <Route path="/login" element={<Login />} />
            <Route path="/register" element={<Register />} />
            <Route path="/status" element={<Status />} />
            <Route path="/main" element={<MainPage />} />
            <Route path="/map" element={<KakaoMap />} />
            <Route path="/prompt" element={<Prompt />} />
            <Route path="/location-list" element={<LocationList />} />
          </Routes>
        </Layout>
      </Router>
    </Provider>
  );
}

export default App;
