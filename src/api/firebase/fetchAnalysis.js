import { doc, getDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Firebase Firestore에서 분석 결과를 가져오는 함수
 * @param {string} analysisId - 가져올 분석 결과의 문서 ID
 * @returns {Promise<Object>} 분석 결과 데이터
 */
export const fetchAnalysis = async (analysisId) => {
  try {
    const analysisRef = doc(db, 'analysis', analysisId);
    const analysisDoc = await getDoc(analysisRef);
    
    if (!analysisDoc.exists()) {
      throw new Error('Analysis document not found');
    }

    return analysisDoc.data();
  } catch (error) {
    console.error('Error fetching analysis:', error);
    throw error;
  }
};
