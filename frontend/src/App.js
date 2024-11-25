import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import { Provider } from 'react-redux';
import Login from './components/login/Login';
import Register from './components/login/Register';
import Status from './components/login/Status';
import UserDashboard from './components/main/UserDashBoard';
import Layout from './components/login/Layout';
import KakaoMap from './components/map/KakaoMap';
import MainPage from './components/main/MainPage';
import Prompt from './components/main/Prompt';
import CommonPrompt from './components/main/CommonPrompt';
import LocationList from './components/main/LocationList';
import RentalSpacePage from './components/search/RentalSpacePage';
import SpaceRegistration from './components/search/SpaceRegisteration';
import ComparePage from './components/search/ComparePage';
import ComparePagePrompt from './components/search/ComparePagePrompt';
import SearchResultsPage from './components/search/SearchResultsPage';
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
            <Route path="user-page" element={<UserDashboard />} />
            <Route path="main" element={<MainPage />} />
            <Route path="map" element={<KakaoMap />} />
            <Route path="prompt" element={<Prompt />} />
            <Route path="common-prompt" element={<CommonPrompt />} />
            <Route path="location-list" element={<LocationList />} />
            <Route path="rental-space/:venueId" element={<RentalSpacePage />} />
            <Route path="space-registeration" element={<SpaceRegistration />} />
            <Route path="compare-page" element={<ComparePage />} />
            <Route path="compare-page-prompt" element={<ComparePagePrompt />} />
            <Route path="search-results" element={<SearchResultsPage />} />
          </Route>
        </Routes>
      </Router>
    </Provider>
  );
}

export default App;
