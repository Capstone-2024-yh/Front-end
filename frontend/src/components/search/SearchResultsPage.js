import React from 'react';
import { useLocation } from 'react-router-dom';
import SearchResults from './SearchResults';

const SearchResultsPage = () => {
  const location = useLocation();
  const searchParams = new URLSearchParams(location.search);
  const query = searchParams.get('query') || '';

  return (
    <div>
      <h2 style={{ textAlign: 'center' }}>검색 결과</h2>
      <SearchResults searchQuery={query} />
    </div>
  );
};

export default SearchResultsPage;
