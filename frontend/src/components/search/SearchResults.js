import React, { useState, useEffect } from 'react';
import { Box, Grid, CircularProgress, Button } from '@mui/material';
import { useNavigate } from 'react-router-dom';
import axios from "axios";

const SearchResults = ({ searchQuery }) => {
  const [locationData, setLocationData] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    if (!searchQuery) return;

    const fetchData = async () => {
      setLoading(true);
      setError(null);

      try {
        const response = await axios.get(`/venues/search`, { params: { query: searchQuery } });
        const data = response.data;

        if (!Array.isArray(data)) {
          throw new Error('API 응답이 배열이 아닙니다.');
        }

        const imagePromises = data.map((venue) =>
          axios.get(`/venuePhoto/${venue.venueId}`)
        );

        const images = await Promise.all(imagePromises);
        const imageData = images.map((image) =>
          image.data[0]?.photoBase64 || 'https://via.placeholder.com/150'
        );

        const ConvData = data.map((venue, index) => ({
          id: venue.venueId,
          spaceName: venue.name || `임시 장소 ${index + 1}`,
          mainImageBase64: imageData[index],
          spaceIntro: venue.simpleDescription || `이것은 임시 장소 ${index + 1}에 대한 설명입니다.`,
          spaceFee: venue.rentalFee || Math.floor(Math.random() * 100000),
          reviewCount: Math.floor(Math.random() * 100),
        }));

        setLocationData(ConvData);
      } catch (error) {
        console.error('Error fetching search results:', error);
        setError('검색 결과를 불러오지 못했습니다. 임시 데이터를 표시합니다.');

        const tempData = Array.from({ length: 5 }, (_, index) => ({
          id: index,
          spaceName: `임시 장소 ${index + 1}`,
          mainImageBase64: 'https://via.placeholder.com/150',
          spaceIntro: `이것은 임시 장소 ${index + 1}에 대한 설명입니다.`,
          spaceFee: Math.floor(Math.random() * 100000),
          reviewCount: Math.floor(Math.random() * 100),
        }));

        setLocationData(tempData);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [searchQuery]);

  if (loading) {
    return (
      <Box sx={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '60vh' }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div>
      {error && (
        <Box sx={{ color: 'red', textAlign: 'center', marginBottom: '20px' }}>
          {error}
        </Box>
      )}
      <Grid container spacing={2}>
        {locationData.map((location) => (
          <Grid item xs={12} sm={4} key={location.id}>
            <Button
              onClick={() => navigate(`/rental-space/${location.id}`)}
              sx={{
                backgroundColor: '#ffffff',
                borderRadius: '8px',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.1)',
                padding: '10px',
                textAlign: 'center',
                width: '100%',
                height: '200px', // 높이 조정
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
              }}
            >
              <img
                src={location.mainImageBase64}
                alt={location.spaceName}
                loading="lazy"
                style={{
                  width: '80%',  // 너비 조정
                  height: '100px', // 높이 조정
                  objectFit: 'cover',
                  marginBottom: '10px',
                }}
              />
              <Box sx={{ fontWeight: 'bold', marginBottom: '5px', width: '100%', textAlign: 'left', fontSize: '14px' }}>
                {location.spaceName}
              </Box>
              <Box sx={{ textAlign: 'left', width: '100%', fontSize: '12px', color: '#555' }}>
                {location.spaceIntro}
              </Box>
            </Button>
          </Grid>
        ))}
      </Grid>
    </div>
  );
};

export default SearchResults;
