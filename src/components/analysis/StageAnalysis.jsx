import React, { useEffect, useState } from 'react';
import { Box, Typography, Alert, Paper, CircularProgress } from '@mui/material';
import PropTypes from 'prop-types';

const StageAnalysis = ({ data }) => {
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  // 개발 환경에서만 디버깅
  useEffect(() => {
    if (process.env.NODE_ENV === 'development' && mounted) {
      console.log('StageAnalysis data:', data);
    }
  }, [data, mounted]);

  if (!mounted) {
    return <CircularProgress />;
  }

  if (!data) {
    return (
      <Box sx={{ padding: 2, margin: 2 }}>
        <Alert severity="info">분석 데이터를 기다리는 중입니다...</Alert>
      </Box>
    );
  }

  return (
    <Paper elevation={3} sx={{ 
      padding: 2,
      margin: 2,
      border: '1px solid #ccc',
      borderRadius: 1,
      display: 'block',
      width: '100%',
      maxWidth: '800px',
      backgroundColor: '#fff'
    }}>
      <Typography variant="h6" sx={{ marginBottom: 2, color: '#000' }}>
        무대 분석
      </Typography>
      <Box sx={{ backgroundColor: '#f5f5f5', padding: 2, borderRadius: 1 }}>
        <Typography component="pre" sx={{ whiteSpace: 'pre-wrap' }}>
          {JSON.stringify(data, null, 2)}
        </Typography>
      </Box>
    </Paper>
  );
};

StageAnalysis.propTypes = {
  data: PropTypes.shape({
    // 예상되는 데이터 구조에 맞게 PropTypes 정의
    stages: PropTypes.array,
    // ... 기타 필요한 prop types
  })
};

export default StageAnalysis;
