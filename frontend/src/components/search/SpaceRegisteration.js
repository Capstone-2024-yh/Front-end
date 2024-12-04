import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { Box, Button, TextField, Typography, MenuItem, Select, FormControl, InputLabel } from '@mui/material';
import axios from '../../axiosConfig';
import Compressor from 'compressorjs';
import EquipmentChecklist from '../panel/EquipmentCheckList';

// Daum Postcode API를 사용하기 위한 스크립트 로드
const loadDaumPostcodeScript = () => {
  const script = document.createElement('script');
  script.src = '//t1.daumcdn.net/mapjsapi/bundle/postcode/prod/postcode.v2.js';
  script.async = true;
  document.body.appendChild(script);
};

const SpaceRegistration = () => {
  // 외부 데이터들
  const ownerId = useSelector((state) => state.auth.user?.id);
  const [spaceName, setSpaceName] = useState('');
  const [spaceType, setSpaceType] = useState('');
  const [spaceIntro, setSpaceIntro] = useState('');
  const [spaceDescription, setSpaceDescription] = useState('');
  const [spaceFee, setSpaceFee] = useState('');
  const [spaceArea, setSpaceArea] = useState('');
  const [spaceCapacity, setSpaceCapacity] = useState('');
  const [spaceTags, setSpaceTags] = useState([]);
  const [facilityInfo, setFacilityInfo] = useState('');
  const [precautions, setPrecautions] = useState('');
  const [refundPolicy, setRefundPolicy] = useState('');
  const [website, setWebsite] = useState('');
  const [mainImageBase64, setMainImageBase64] = useState(null);
  const [postalCode, setPostalCode] = useState('');
  const [roadAddress, setRoadAddress] = useState('');
  const [detailAddress, setDetailAddress] = useState('');
  const [coordinates, setCoordinates] = useState(null);
  const [selectedEquipment, setSelectedEquipment] = useState([]);
  // const [additionalImagesBase64, setAdditionalImagesBase64] = useState([]);

  const [popularTags, setPopularTags] = useState([]);

  // 내부 데이터들
  const [inputTag, setInputTag] = useState('');
  const [mainImageName, setMainImageName] = useState('');
  // const [additionalImageNames, setAdditionalImageNames] = useState([]);

  const navigate = useNavigate();

  // Daum Postcode 스크립트 로드
  useEffect(() => {
    // 인기 태그 데이터 가져오기
    const fetchPopularTags = async () => {
      try {
        const response = await axios.get('/search-summary/latest'); // API 호출
        const tags = response.data
          .slice(0, 5) // 상위 5개 태그만 사용
          .map(tag => `#${tag.tokenText.replace('O/', '')}`);
        setPopularTags(tags);
      } catch (error) {
        console.error('Failed to fetch popular tags:', error);
        setPopularTags(['#예시태그1', '#예시태그2', '#예시태그3', '#예시태그4', '#예시태그5']); // 기본 태그
      }
    };
    fetchPopularTags();

    loadDaumPostcodeScript();
  }, []);

  // Kakao API 요청용 별도의 axios 인스턴스
  const kakaoInstance = axios.create({
    baseURL: '',  // baseURL을 비워두고 프록시를 통해 Kakao API 요청
  });

  // Kakao API로 좌표 찾기
  const getCoordinates = async (address) => {
    try {
      const response = await kakaoInstance.get(
          `/v2/local/search/address.json?query=${encodeURIComponent(address)}`, // 프록시 사용
          {
            headers: {
              Authorization: `KakaoAK ${process.env.REACT_APP_KAKAO_REST_KEY}`,
            },
          }
      );
      if (response.data.documents.length > 0) {
        const { x: longitude, y: latitude } = response.data.documents[0].road_address;
        setCoordinates({ latitude, longitude });
      } else {
        console.error('Coordinates not found');
      }
    } catch (error) {
      console.error('Error fetching coordinates:', error);
    }
  };

  // 태그 입력 처리
  const handleTagInput = (e) => {
    if (e.key === ' ') {
      e.preventDefault();
      if (inputTag.trim() !== '') {
        setSpaceTags([...spaceTags, `#${inputTag.trim()}`]);
        setInputTag('');
      }
    } else {
      setInputTag(e.target.value);
    }
  };

  const handleTagDelete = (index) => {
    setSpaceTags(spaceTags.filter((_, i) => i !== index));
  };

  // 주소 검색
  const handlePostcodeSearch = () => {
    new window.daum.Postcode({
      oncomplete: (data) => {
        const roadAddr = data.roadAddress;
        const extraRoadAddr = data.bname ? `(${data.bname})` : '';
        setPostalCode(data.zonecode);
        setRoadAddress(roadAddr + extraRoadAddr);
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

  // 대표 이미지 처리
  const handleMainImageChange = (event) => {
    const file = event.target.files[0];
    if (file) {
      new Compressor(file, {
        quality: 0.6,
        success(result) {
          convertToBase64(result).then((base64) => {
            setMainImageBase64(base64);
            setMainImageName(result.name);
          });
        },
        error(err) {
          console.error(err.message);
        },
      });
    }
  };

  // 추가 이미지 처리
  /*
  const handleImageChange = (event) => {
    const files = event.target.files;
    if (files.length + additionalImagesBase64.length <= 10) {
      const compressedFilesPromises = Array.from(files).map((file) =>
        new Promise((resolve, reject) => {
          new Compressor(file, {
            quality: 0.6,
            success(result) {
              convertToBase64(result).then((base64) => {
                resolve(base64);
              });
            },
            error(err) {
              reject(err);
            },
          });
        })
      );

      Promise.all(compressedFilesPromises)
        .then((base64Images) => {
          setAdditionalImagesBase64([...additionalImagesBase64, ...base64Images]);
          setAdditionalImageNames([...additionalImageNames, ...Array.from(files).map((file) => file.name)]);
        })
        .catch((err) => {
          console.error('Image compression error:', err);
        });
    } else {
      alert('이미지는 최대 10장까지 업로드할 수 있습니다.');
    }
  };
  */

  // 저장 버튼을 눌렀을 때 실행되는 함수
  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const sanitizedTags = spaceTags.map(tag => tag.replace(/^#/, ''));
      console.log('Sanitized tags:', sanitizedTags);
      const data = {
        // 추가할 사항들
        "ownerId":                ownerId,                // 사용자 id
        "name":                   spaceName,              // 공간 제목 - X string
        "spaceType":              spaceType,              // 공간 유형 - O
        "simpleDescription":      spaceIntro,             // 공간 한줄 - X string
        "description":            spaceDescription,       // 공간 설명 - X string
        "rentalFee":              spaceFee,               // 대여 가격 - O
        "area":                   spaceArea,              // 공간 면적 - O
        "capacity":               spaceCapacity,          // 수용 인원 - O int
        "facilityInfo":           facilityInfo,           // 시설 안내 - X string
        "precautions":            precautions,            // 예약 시 주의사항 - X string
        "refundPolicy":           refundPolicy,           // 환불 정책 - X string
        "websiteURL":             website,                // 웹사이트 URL - X string
        "postalCode":             postalCode,             // 우편번호 - X int - 제외 예정
        "address":                roadAddress,            // 도로명 주소 - O
        "detailAddress":          detailAddress,          // 상세 주소 - X string
        "latitude":               coordinates ? coordinates.latitude : null, // 위도 - O
        "longitude":              coordinates ? coordinates.longitude : null, // 경도 - O
        // "additionalImagesBase64": additionalImagesBase64, // 추가 이미지 - X string 배열 - 제외
      };

      console.log('Data: ', data)

      const response = await axios.post('/venues/create', data, {
        headers: {
          'Content-Type': 'application/json',
        },
      });

      const venueId = response.data.venueId;

      // spaceTags를 별도의 API로 전송
      if (sanitizedTags.length > 0) {
        const tagsResponse = await axios.post('/tag/create', {
          "venueId": venueId,
          "tags": sanitizedTags,
        });
        console.log('Tags Response:', tagsResponse.data);
      }

      // mainImageBase64를 별도의 API로 전송
      if (mainImageBase64) {
        const imageResponse = await axios.post('/venuePhoto/create', {
          "venueId": venueId,
          "base64Image": mainImageBase64,
        });
        console.log('Image Response:', imageResponse.data);
      }

      // selectedEquipment를 별도의 API로 전송
      if (selectedEquipment.length > 0) {
        const sanitizedEquipment = selectedEquipment.map(Number);
        const equipmentResponse = await axios.post('/equipment/create', {
          "venueId": venueId,
          "equipments": sanitizedEquipment,
        });
        console.log('Equipment Response:', equipmentResponse.data);
      }

      console.log('Response data:', response.data);
      alert('공간 등록을 성공적으로 신청하였습니다!');
      navigate('/');
    } catch (error) {
      console.error('Error saving space information:', error);
      alert('공간 등록에 실패했습니다.');
    }
  };

  return (
    <Box sx={{ padding: '20px', maxWidth: '800px', margin: 'auto' }}>
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
          value={spaceName}
          onChange={(e) => setSpaceName(e.target.value)}
          margin="normal"
        />

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 2. 공간 유형 선택 */}
        <Typography variant="h6" gutterBottom>
          공간 유형
        </Typography>
        <FormControl fullWidth margin="normal">
          <InputLabel>공간 유형을 선택해주세요.</InputLabel>
          <Select
            label="공간 유형"
            required
            value={spaceType}
            onChange={(e) => setSpaceType(e.target.value)}
          >
            <MenuItem value="" disabled>
              모임
            </MenuItem>
            <MenuItem value="파티룸">파티룸</MenuItem>
            <MenuItem value="스터디룸">스터디룸</MenuItem>
            <MenuItem value="강의실">강의실</MenuItem>
            <MenuItem value="카페">카페</MenuItem>
            <MenuItem value="공유주방">공유주방</MenuItem>
            <MenuItem value="회의실">회의실</MenuItem>
            <MenuItem value="세미나실">세미나실</MenuItem>
            <MenuItem value="" disabled>
              연습
            </MenuItem>
            <MenuItem value="연습실">연습실</MenuItem>
            <MenuItem value="보컬연습실">보컬연습실</MenuItem>
            <MenuItem value="악기연습실">악기연습실</MenuItem>
            <MenuItem value="녹음실">녹음실</MenuItem>
            <MenuItem value="운동시설">운동시설</MenuItem>
            <MenuItem value="" disabled>
              촬영
            </MenuItem>
            <MenuItem value="촬영스튜디오">촬영스튜디오</MenuItem>
            <MenuItem value="호리존">호리존</MenuItem>
            <MenuItem value="라이브방송">라이브방송</MenuItem>
            <MenuItem value="실외촬영">실외촬영</MenuItem>
            <MenuItem value="" disabled>
              행사
            </MenuItem>
            <MenuItem value="공연장">공연장</MenuItem>
            <MenuItem value="갤러리">갤러리</MenuItem>
            <MenuItem value="스몰웨딩">스몰웨딩</MenuItem>
            <MenuItem value="컨퍼런스">컨퍼런스</MenuItem>
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
          value={spaceIntro}
          onChange={(e) => setSpaceIntro(e.target.value)}
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
          value={spaceDescription}
          onChange={(e) => setSpaceDescription(e.target.value)}
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
            type="number"
            value={spaceFee}
            onChange={(e) => setSpaceFee(e.target.value)}
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
            type="number"
            value={spaceArea}
            onChange={(e) => setSpaceArea(e.target.value)}
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
            type="number"
            value={spaceCapacity}
            onChange={(e) => setSpaceCapacity(e.target.value)}
            margin="normal"
          />
          <Typography variant="body1" sx={{ marginLeft: 1 }}>
            명
          </Typography>
        </Box>

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 5. 공간 태그 */}
        <Typography variant="h6" gutterBottom sx={{ marginBottom: '0px' }}>
          공간 태그
        </Typography>
        <Typography variant="body2" sx={{ color: '#757575', mb: 2 }}>
          현재 인기 태그: {popularTags.join(' ')}
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center', flexWrap: 'wrap', gap: 1, mb: 2 }}>
          {spaceTags.map((tag, index) => (
            <Box
              key={index}
              sx={{
                backgroundColor: '#e0e0e0',
                padding: '5px 10px',
                borderRadius: '15px',
                display: 'flex',
                alignItems: 'center',
              }}
            >
              <Typography variant="body2" sx={{ mr: 1 }}>
                {tag}
              </Typography>
              <Button
                size="small"
                onClick={() => handleTagDelete(index)}
                sx={{
                  minWidth: '24px',
                  padding: '2px',
                  fontSize: '12px',
                }}
              >
                X
              </Button>
            </Box>
          ))}
        </Box>
        <TextField
          label="태그를 입력해주세요. (스페이스바로 구분됩니다)"
          fullWidth
          value={inputTag}
          onChange={(e) => setInputTag(e.target.value)}
          onKeyDown={handleTagInput}
          margin="normal"
        />

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 6. 시설안내 */}
        <Typography variant="h6" gutterBottom>
          시설 안내
        </Typography>
        <TextField
          label="시설 안내사항을 입력해주세요."
          fullWidth
          required
          value={facilityInfo}
          onChange={(e) => setFacilityInfo(e.target.value)}
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
          label="예약 시 주의사항을 입력해주세요."
          fullWidth
          required
          value={precautions}
          onChange={(e) => setPrecautions(e.target.value)}
          margin="normal"
          multiline
          rows={3}
        />

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 환불 정책 */}
        <Typography variant="h6" gutterBottom>
          환불 정책
        </Typography>
        <TextField
          label="환불 정책을 입력해주세요."
          fullWidth
          required
          value={refundPolicy}
          onChange={(e) => setRefundPolicy(e.target.value)}
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
          value={website}
          onChange={(e) => setWebsite(e.target.value)}
          margin="normal"
        />

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 9. 대표 이미지 첨부 */}
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}
        >
          <Typography variant="h6">대표 이미지</Typography>
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
              value={mainImageName || '이미지가 선택되지 않았습니다.'}
              disabled
            />
          </Box>
          <Button variant="outlined" component="label">
            이미지 첨부
            <input type="file" accept="image/*" hidden onChange={handleMainImageChange} />
          </Button>
        </Box>

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 10. 추가 이미지 첨부
        <Box
          sx={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 1 }}
        >
          <Typography variant="h6">추가 이미지</Typography>
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
              value={additionalImageNames.join('\n') || '이미지가 선택되지 않았습니다.'}
              disabled
              sx={{ overflow: 'auto' }}
            />
          </Box>
          <Button variant="outlined" component="label" sx={{ height: '40px' }}>
            이미지 첨부
            <input type="file" accept="image/*" multiple hidden onChange={handleImageChange} />
          </Button>
        </Box>
         */}

        <Box sx={{ marginTop: 2 }}></Box>

        {/* 11. 주소 입력 */}
        <Typography variant="h6" gutterBottom>
          주소
        </Typography>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          <TextField
            label="실제 서비스되는 공간의 주소를 입력해주세요."
            fullWidth
            value={roadAddress}
            margin="normal"
            disabled
          />
          <Button variant="outlined" onClick={handlePostcodeSearch} sx={{ marginLeft: 2, minWidth: 108 }}>
            주소 찾기
          </Button>
        </Box>
        <TextField
          label="상세 주소를 입력해주세요."
          fullWidth
          required
          value={detailAddress}
          onChange={(e) => setDetailAddress(e.target.value)}
          margin="normal"
        />

        {/* 12. 기자재 체크리스트 */}
        <EquipmentChecklist
          selectedEquipment={selectedEquipment}
          setSelectedEquipment={setSelectedEquipment}
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
