import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from 'axios';
import Compressor from 'compressorjs';

// Daum Postcode API를 사용하기 위한 스크립트 로드
const loadDaumPostcodeScript = () => {
  const script = document.createElement('script');
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  script.async = true;
  document.body.appendChild(script);
};

const SpaceRegistration = () => {
  const [formData, setFormData] = useState({
    spaceName: '',
    spaceType: '',
    spaceIntro: '',
    spaceDescription: '',
    spaceFee: '',
    spaceArea: '',
    spaceCapacity: '',
    spaceTags: '',
    facilities: '',
    precautions: '',
    website: '',
    pageUrl: '',
    mainImageBase64: null,  // 대표 이미지 파일
    additionalImagesBase64: [],  // 이미지 리스트
    postalCode: '',
    roadAddress: '',
    detailAddress: '',
    coordinates: null,
  });

  const [mainImageName, setMainImageName] = useState('');
  const [additionalImageNames, setAdditionalImageNames] = useState([]);

  const navigate = useNavigate();

  // Kakao API로 좌표 찾기
  const getCoordinates = async (address) => {
    try {
      const response = await axios.get(
        `https://dapi.kakao.com/v2/local/search/address.json?query=${address}`,
        {
          headers: {
            Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_KEY}`, // Kakao API JavaScript 키
          },
        }
      );
      if (response.data.documents.length > 0) {
        const { x, y } = response.data.documents[0].road_address; // roadAddress 좌표만 사용
        console.log(`Coordinates found: ${x}, ${y}`);
        setFormData((prevFormData) => ({
          ...prevFormData,
          coordinates: { x, y }, // 좌표를 상태에 저장
        }));
      } else {
        console.error('Coordinates not found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  // 주소 검색을 실행하는 함수
  const handlePostcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        const roadAddr = data.roadAddress;
        const extraRoadAddr = data.bname ? `(${data.bname})` : '';
        setFormData({
          ...formData,
          postalCode: data.zonecode,
          roadAddress: roadAddr + extraRoadAddr,
        });
        // 주소가 입력되면 좌표를 찾는다
        getCoordinates(roadAddr);
      },
    }).open();
  };

  // File을 Base64로 변환하는 함수
  const convertToBase64 = (file) => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => resolve(reader.result);
      reader.onerror = (error) => reject(error);
    });
  };

  // 대표 이미지 변경
  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          convertToBase64(result).then((base64) => {
            console.log(base64);
            setFormData({
              ...formData,
              mainImageBase64: base64,  // 압축 후 Base64로 변환
            });
            console.log("Compressed file:", result.name);
            setMainImageName(result.name);  // 대표 이미지 파일 이름 저장
          });
        },
        error(err) {
          console.log(err.message);
        },
      });
    }
  };

  // 추가 이미지 변경
  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files.length + formData.additionalImagesBase64.length <= 10) {
      const compressedFilesPromises = Array.from(files).map((file) =>
        new Promise((resolve, reject) => {
          new Compressor(file, {
            quality: 0.6,
            success(result) {
              convertToBase64(result).then((base64) => {
                console.log(base64);
                resolve(base64);
              });
              console.log("Compressed file:", result.name);
            },
            error(err) {
              reject(err);
            },
          });
        })
      );

      Promise.all(compressedFilesPromises).then((base64Images) => {
        setFormData({
          ...formData,
          additionalImagesBase64: [...formData.additionalImagesBase64, ...base64Images],  // Base64로 변환된 이미지 추가
        });
        setAdditionalImageNames([...additionalImageNames, ...Array.from(files).map(file => file.name)]);
      }).catch((err) => {
        console.error('Image compression error:', err);
      });
    } else {
      alert('이미지는 최대 10장까지 업로드할 수 있습니다.');
    }
  };

  // 각 입력 필드의 값이 변경될 때 실행되는 함수
  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  // 저장 버튼을 눌렀을 때 실행되는 함수
  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      // FormData를 사용해 파일 데이터도 함께 전송
      const data = new FormData();
      data.append('spaceName', formData.spaceName);
      data.append('mainImageBase64', formData.mainImageBase64);  // 대표 이미지 Base64
      formData.additionalImagesBase64.forEach((base64Image, index) => {
        data.append(`additionalImagesBase64[${index}]`, base64Image);  // 추가 이미지 Base64 리스트
      });

      // 백엔드로 데이터 전송
      const response = await axios.post('/api/register-space', data, {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      });
      console.log('Response data:', response.data);
      alert('공간이 성공적으로 등록되었습니다!');
    } catch (error) {
      console.error('Error saving space information:', error);
      alert('공간 등록에 실패했습니다.');
    }
  };

  // Daum Postcode 스크립트 로드
  React.useEffect(() => {
    loadDaumPostcodeScript();
  }, []);

  return (
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
      {/* 제목 가운데 정렬 */}
      <Typography variant="h4" gutterBottom align="center">
        공간 등록 정보 입력
      </Typography>
      <hr style={{ border: 'none', borderTop: '1px solid #ddd', margin: '10px 0' }} />
      
      <form onSubmit={handleSubmit}>
        {/* 1. 공간명 입력 */}
        <Typography variant="h6" gutterBottom>
          공간명
        </Typography>
        <TextField
          label="공간명은 상호명, 간판 등 다른 공간과 구별될 수 있는 고유 이름으로 작성해주세요."
          fullWidth
          required
          name="spaceName"
          value={formData.spaceName}
          onChange={handleChange}
          margin="normal"
        />

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 2. 공간 유형 선택 */}
        <Typography variant="h6" gutterBottom>
          공간 유형
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>공간 유형</InputLabel>
          <Select
            label="공간 유형"
            required
            name="spaceType"
            value={formData.spaceType}
            onChange={handleChange}
          >
            <MenuItem value="" disabled>모임</MenuItem>
            <MenuItem value="party">파티룸</MenuItem>
            <MenuItem value="study">스터디룸</MenuItem>
            <MenuItem value="lecture">강의실</MenuItem>
            <MenuItem value="cafe">카페</MenuItem>
            <MenuItem value="kitchen">공유주방</MenuItem>
            <MenuItem value="discussion">회의실</MenuItem>
            <MenuItem value="seminar">세미나실</MenuItem>
            <MenuItem value="" disabled>연습</MenuItem>
            <MenuItem value="practice">연습실</MenuItem>
            <MenuItem value="vocal">보컬연습실</MenuItem>
            <MenuItem value="music">악기연습실</MenuItem>
            <MenuItem value="record">녹음실</MenuItem>
            <MenuItem value="workout">운동시설</MenuItem>
            <MenuItem value="" disabled>촬영</MenuItem>
            <MenuItem value="studio">촬영스튜디오</MenuItem>
            <MenuItem value="cyclorama">호리존</MenuItem>
            <MenuItem value="live">라이브방송</MenuItem>
            <MenuItem value="outside">실외촬영</MenuItem>
            <MenuItem value="" disabled>행사</MenuItem>
            <MenuItem value="concert">공연장</MenuItem>
            <MenuItem value="hall">갤러리</MenuItem>
            <MenuItem value="wedding">스몰웨딩</MenuItem>
            <MenuItem value="conference">컨퍼런스</MenuItem>
          </Select>
        </FormControl>

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 3. 공간 한 줄 소개 */}
        <Typography variant="h6" gutterBottom>
          공간 한 줄 소개
        </Typography>
        <TextField
          label="공간의 가장 큰 장점을 한 문장으로 표현해주세요."
          fullWidth
          required
          name="spaceIntro"
          value={formData.spaceIntro}
          onChange={handleChange}
          margin="normal"
        />

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 4. 공간 소개 */}
        <Typography variant="h6" gutterBottom>
          공간 소개
        </Typography>
        <TextField
          label="공간의 컨셉, 스토리, 공간 사용 방법을 자세히 적어주세요."
          fullWidth
          required
          name="spaceDescription"
          value={formData.spaceDescription}
          onChange={handleChange}
          helperText=""
          margin="normal"
          multiline
          rows={4}
        />

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 대여 가격 입력 */}
        <Typography variant="h6" gutterBottom>
          대여 가격
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          <TextField
            label="시간 당 공간 대여 가격을 입력해주세요"
            fullWidth
            required
            name="spaceFee"
            type="number"
            value={formData.spaceFee}
            onChange={handleChange}
            margin="normal"
          />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>
            ₩
          </Typography>
        </Box>

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 공간 면적 입력 */}
        <Typography variant="h6" gutterBottom>
          공간 면적
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          <TextField
            label="공간의 면적을 입력해주세요"
            fullWidth
            required
            name="spaceArea"
            type="number"
            value={formData.spaceArea}
            onChange={handleChange}
            margin="normal"
          />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>
            ㎡
          </Typography>
        </Box>

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 수용 인원 입력 */}
        <Typography variant="h6" gutterBottom>
          수용 인원
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 2 }}>
          <TextField
            label="권장하는 수용 인원을 입력해주세요."
            fullWidth
            required
            name="spaceCapacity"
            type="number"
            value={formData.spaceCapacity}
            onChange={handleChange}
            margin="normal"
          />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>
            명
          </Typography>
        </Box>

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 5. 공간 태그 */}
        <Typography variant="h6" gutterBottom>
          공간 태그
        </Typography>
        <TextField
          label="공간 태그"
          fullWidth
          required
          name="spaceTags"
          value={formData.spaceTags}
          onChange={handleChange}
          helperText="#태그 형식으로 주요 특징을 입력해주세요."
          margin="normal"
          onFocus={(e) => {
            if (formData.spaceTags === '') {
              setFormData({
                ...formData,
                spaceTags: '#', // 입력 시작 시 #을 추가
              });
              e.target.value = '#'; // 텍스트 필드의 값도 업데이트
            }
          }}
          onBlur={(e) => {
            // 입력이 없을 때 #이 아닌 상태로 두기
            if (e.target.value === '#') {
              setFormData({
                ...formData,
                spaceTags: '', // 공백으로 초기화
              });
            }
          }}
        />

        <Box sx={{ marginTop: 2 }}></Box>
        
        {/* 6. 시설안내 */}
        <Typography variant="h6" gutterBottom>
          시설 안내
        </Typography>
        <TextField
          label="시설 안내"
          fullWidth
          required
          name="facilities"
          value={formData.facilities}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
        />

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 7. 예약시 주의사항 */}
        <Typography variant="h6" gutterBottom>
          예약 시 주의사항
        </Typography>
        <TextField
          label="예약 시 주의사항"
          fullWidth
          required
          name="precautions"
          value={formData.precautions}
          onChange={handleChange}
          margin="normal"
          multiline
          rows={3}
        />

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 8. 웹사이트 */}
        <Typography variant="h6" gutterBottom>
          웹사이트 URL
        </Typography>
        <TextField
          label="웹사이트 URL을 입력해주세요."
          fullWidth
          name="website"
          value={formData.website}
          onChange={handleChange}
          margin="normal"
        />

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 9. 대표 이미지 첨부 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant="h6">
                대표 이미지
            </Typography>
            <Typography variant="caption" color="textSecondary">
                최대 3MB
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'center', marginTop: 1 }}>
            <Box sx={{ flexGrow: 1, marginRight: 1 }}>
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    value={mainImageName || "이미지가 선택되지 않았습니다."}  // 이미지가 없을 때 기본 메시지 표시
                    disabled
                />
            </Box>
            <Button variant="outlined" component="label">
                이미지 첨부
                <input
                    type="file"
                    accept="image/*"
                    hidden
                    onChange={handleMainImageChange}
                />
            </Button>
        </Box>

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 10. 추가 이미지 첨부 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}>
            <Typography variant="h6">
                추가 이미지
            </Typography>
            <Typography variant="caption" color="textSecondary">
                최대 3MB
            </Typography>
        </Box>
        <Box sx={{ display: 'flex', alignItems: 'flex-start', marginTop: 1 }}>
            <Box sx={{ flexGrow: 1, marginRight: 1 }}>
                <TextField
                    variant="outlined"
                    size="small"
                    fullWidth
                    multiline
                    rows={10}
                    maxRows={10}
                    value={additionalImageNames.join('\n') || "이미지가 선택되지 않았습니다."}
                    disabled
                    sx={{ overflow: 'auto' }}
                />
            </Box>
            <Button variant="outlined" component="label" sx={{ height: '40px' }}>
                이미지 첨부
                <input
                    type="file"
                    accept="image/*"
                    multiple
                    hidden
                    onChange={handleImageChange}
                />
            </Button>
        </Box>

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 11. 주소 입력 */}
        <Typography variant="h6" gutterBottom>
            주소
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
            <TextField
                label="실제 서비스되는 공간의 주소를 입력해주세요."
                fullWidth
                name="roadAddress"
                value={formData.roadAddress}
                onChange={handleChange}
                margin="normal"
                disabled
            />
            <Button 
                variant="outlined" 
                onClick={handlePostcodeSearch}
                sx={{ marginLeft: 2, minWidth: 108 }}
            >
                주소 찾기
            </Button>
        </Box>
        <TextField
            label="상세 주소"
            fullWidth
            required
            name="detailAddress"
            value={formData.detailAddress}
            onChange={handleChange}
            margin="normal"
        />

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 13. 이전, 저장 버튼 */}
        <Box sx={{ display: 'flex', justifyContent: 'space-between', marginTop: '20px' }}>
          <Button variant="outlined" onClick={() => navigate(-1)} fullWidth sx={{ marginRight: 2 }}>
            이전
          </Button>
          <Button variant="contained" type="submit" fullWidth>
            저장
          </Button>
        </Box>
      </form>
    </Box>
  );
};

export default SpaceRegistration;
