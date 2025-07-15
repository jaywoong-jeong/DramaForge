import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ArrowRight } from 'lucide-react';

const navigatorStyle = {
  display: 'flex',
  justifyContent: 'space-around',
  alignItems: 'center',
  padding: '24px 0',
  marginTop: '60px',
  borderTop: '1px solid #eaeaea',
};

const baseButtonStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: '12px 30px',
  border: 'none',
  borderRadius: '8px',
  cursor: 'pointer',
  fontSize: '15px',
  fontWeight: '500',
  transition: 'all 0.2s ease-in-out',
  boxShadow: '0 2px 4px rgba(0,0,0,0.05)',
};

const prevButtonStyle = {
  ...baseButtonStyle,
  background: '#f5f5f5',
  color: '#333',
};

const nextButtonStyle = {
  ...baseButtonStyle,
  background: '#000',
  color: '#fff',
};

const disabledButtonStyle = {
  ...baseButtonStyle,
  background: '#f5f5f5',
  color: '#aaa',
  cursor: 'not-allowed',
  boxShadow: 'none',
};

const stageIndicatorStyle = {
  fontSize: '14px',
  color: '#111',
  fontWeight: '600',
  padding: '8px 16px',
  borderRadius: '20px',
  background: '#eee',
};

const StageNavigator = ({ currentStage, totalStages = 6 }) => {
  const navigate = useNavigate();
  const current = parseInt(currentStage, 10);

  const handlePrev = () => {
    if (current <= 1) return; // Cannot go back from home
    if (current === 2) {
      navigate('/'); // From stage 1 to home
    } else {
      navigate(`/stage/${current - 2}`); // From stage N to stage N-1
    }
  };

  const handleNext = () => {
    if (current >= totalStages) return; // Cannot go forward from last stage
    navigate(`/stage/${current}`); // From home (1) to stage 1, or from stage N to stage N+1
  };

  return (
    <div style={navigatorStyle}>
      <button
        onClick={handlePrev}
        disabled={current <= 1}
        style={current <= 1 ? disabledButtonStyle : prevButtonStyle}
        onMouseOver={(e) => { if (current > 1) e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseOut={(e) => { if (current > 1) e.currentTarget.style.transform = 'none'; }}
      >
        <ArrowLeft size={16} style={{ marginRight: '10px' }} />
        Previous
      </button>
      <span style={stageIndicatorStyle}>
        {current} of {totalStages}
      </span>
      <button
        onClick={handleNext}
        disabled={current >= totalStages}
        style={current >= totalStages ? { ...disabledButtonStyle, background: '#333' } : nextButtonStyle}
        onMouseOver={(e) => { if (current < totalStages) e.currentTarget.style.transform = 'translateY(-2px)'; }}
        onMouseOut={(e) => { if (current < totalStages) e.currentTarget.style.transform = 'none'; }}
      >
        Next
        <ArrowRight size={16} style={{ marginLeft: '10px' }} />
      </button>
    </div>
  );
};

export default StageNavigator;
