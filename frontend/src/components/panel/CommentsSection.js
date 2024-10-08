import React, { useState } from 'react';
import { Box, Typography, Button, TextField } from '@mui/material';
// import axios from '../../axiosConfig';  // 필요 시 axios 활성화

const CommentsSection = ({ isLoggedIn, userEmail, locationId }) => {
    const [comments, setComments] = useState([]); // 댓글 상태 관리
    const [newComment, setNewComment] = useState(''); // 새 댓글 입력 상태

    const handleCommentChange = (e) => {
        setNewComment(e.target.value);
    };

    const handleCommentSubmit = () => {
        /*
        if (!isLoggedIn) {
            alert('로그인 후 댓글을 작성할 수 있습니다.');
            return;
        }
        */

        const newCommentData = {
            id: comments.length + 1, // 임시 ID, 실제 백엔드에서 처리 시 변경
            text: newComment,
            userId: userEmail,
        };

        setComments([...comments, newCommentData]);
        setNewComment(''); // 입력 필드 초기화

        // 여기에 axios로 백엔드에 전송하는 코드 추가
        /*
        axios.post('/api/comments', { locationId, comment: newCommentData })
            .then(response => console.log('댓글 전송 성공', response))
            .catch(error => console.error('댓글 전송 실패', error));
        */
    };

    return (
        <Box>
            <Box sx={{ marginTop: '20px' }}>
                <Typography variant="h6" sx={{ marginBottom: '10px' }}>댓글 목록</Typography>
                {comments.length > 0 ? (
                    comments.map((comment) => (
                        <Box key={comment.id} sx={{ padding: '10px 0', borderBottom: '1px solid #ddd' }}>
                            <Typography variant="body2">{comment.text}</Typography>
                            <Typography variant="caption" color="textSecondary">작성자: {comment.userId}</Typography>
                        </Box>
                    ))
                ) : (
                    <Typography variant="body2">댓글이 없습니다.</Typography>
                )}
            </Box>
            
            {/* 실제 댓글 처리 부분 
            {isLoggedIn ? (
                <>
                    <TextField
                        label="댓글을 입력하세요"
                        variant="outlined"
                        fullWidth
                        multiline
                        value={newComment}
                        onChange={handleCommentChange}
                    />
                    <Button 
                        variant="contained" 
                        sx={{ marginTop: '10px' }} 
                        onClick={handleCommentSubmit} 
                        disabled={!newComment.trim()}
                    >
                        댓글 등록
                    </Button>
                </>
            ) : (
                <Typography variant="body1">로그인 후 댓글을 작성할 수 있습니다.</Typography>
            )}
            */}

            {/* 임시 댓글 입력 필드 */}  
            <TextField
                label="댓글을 입력하세요"
                variant="outlined"
                fullWidth
                multiline
                value={newComment}
                onChange={handleCommentChange}
            />
            <Button 
                variant="contained" 
                sx={{ marginTop: '10px' }} 
                onClick={handleCommentSubmit} 
                disabled={!newComment.trim()}
            >
                댓글 등록
            </Button>
        </Box>
    );
};

export default CommentsSection;
