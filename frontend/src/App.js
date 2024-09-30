import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from './components/login/Login';
import Register from './components/login/Register';
import Status from './components/login/Status';
import Layout from './components/login/Layout';
import KakaoMap from './components/map/KakaoMap';
import MainPage from './components/main/MainPage';
import Prompt from './components/main/Prompt';
import LocationList from './components/main/LocationList';
import RentalSpacePage from './components/search/RentalSpacePage';
import SpaceRegistration from './components/search/SpaceRegisteration';
import store from './store'; // Redux store

function App() {
  return (
    <Provider store={store}>
      <Router>
        <Routes>
          {/* Layout을 라우트의 element로 설정 */}
          <Route path="/" element={<Layout />}>
            {/* index 경로에 MainPage 설정 */}
            <Route index element={<MainPage />} />
            {/* 나머지 라우트 설정 */}
            <Route path="login" element={<Login />} />
            <Route path="register" element={<Register />} />
            <Route path="status" element={<Status />} />
            <Route path="main" element={<MainPage />} />
            <Route path="map" element={<KakaoMap />} />
            <Route path="prompt" element={<Prompt />} />
            <Route path="location-list" element={<LocationList />} />
            <Route path="rental-space/:locationId" element={<RentalSpacePage />} />
            <Route path="space-registeration" element={<SpaceRegistration />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
