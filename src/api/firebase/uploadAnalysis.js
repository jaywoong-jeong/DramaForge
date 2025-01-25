import { collection, addDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Firebase Firestore에 분석 결과를 업로드하는 함수
 * @param {Object} analysisResult - 업로드할 분석 결과 데이터
 * @returns {Promise<string>} 업로드된 분석 문서의 ID
 */
export const uploadAnalysis = async (analysisResult) => {
  try {
    console.log("업로딩..")
    const analysisRef = collection(db, 'analysis');
    const docRef = await addDoc(analysisRef, {
      ...analysisResult,
      createdAt: new Date().toISOString(),
    });
    
    return docRef.id;
  } catch (error) {
    console.error('Error uploading analysis:', error);
    throw error;
  }
};
