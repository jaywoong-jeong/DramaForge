import { doc, updateDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Firebase Firestore의 스크립트 문서를 업데이트하는 함수
 * @param {string} scriptId - 업데이트할 스크립트의 문서 ID
 * @param {string} analysisId - 연결할 분석 결과의 문서 ID
 * @param {boolean} isAnalyzed - 분석 완료 여부
 * @returns {Promise<void>}
 */
export const updateScript = async (title, version, analysisId, isAnalyzed) => {
  try {
    const documentId = `${title}_${version}`;
    const scriptRef = doc(db, 'scripts', documentId);
    await updateDoc(scriptRef, {
      isAnalyzed: isAnalyzed,
      analysisId: analysisId,
      updatedAt: new Date().toISOString(),
    });
  } catch (error) {
    console.error('Error updating script:', error);
    throw error;
  }
};
