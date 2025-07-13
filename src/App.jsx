import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import PipelineDocumentation from './PipelineDocumentation';



const appContainerStyle = {
  display: 'flex',
  flexDirection: 'column',
  height: '100vh',
  width: '100vw'
};

function App() {
  return (
    <Router>
      <div style={appContainerStyle}>
        <Header />
        <Routes>
          <Route path="/" element={<PipelineDocumentation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
