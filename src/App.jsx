import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import Header from './Header';
import PipelineDocumentation from './PipelineDocumentation';
import HomePage from './pages/HomePage';
import PipelineStagePage from './pages/PipelineStagePage';
import VisualizationPage from './pages/VisualizationPage';



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
                    <Route path="/" element={<HomePage />} />
          <Route path="/stage/:stageId" element={<PipelineStagePage />} />
          <Route path="/visualization" element={<VisualizationPage />} />
          <Route path="/old" element={<PipelineDocumentation />} />
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
