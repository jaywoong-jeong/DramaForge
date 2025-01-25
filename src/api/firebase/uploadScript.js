import { collection, query, where, getDocs, deleteDoc, doc, setDoc } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Firebase Firestore에 스크립트를 업로드하는 함수
 * @param {Object} scriptData - 업로드할 스크립트 데이터
 * @param {string} scriptName - 스크립트 이름
 * @returns {Promise<string>} 업로드된 문서의 ID
 */
export const uploadScript = async (scriptData, scriptName) => {
  try {
    const scriptsRef = collection(db, 'scripts');
    
    // 현재 버전 확인
    const q = query(scriptsRef, where('title', '==', scriptName));
    const querySnapshot = await getDocs(q);
    const currentVersion = querySnapshot.size + 1;

    // 문서 ID 생성
    const documentId = `${scriptName}_${currentVersion}`;

    // 스크립트 데이터에 메타데이터 추가
    const scriptWithMetadata = {
      ...scriptData,
      title: scriptName,
      version: currentVersion,
      uploadedAt: new Date().toISOString(),
    };

    // Firestore에 데이터 업로드 (setDoc 사용)
    const docRef = doc(db, 'scripts', documentId);
    await setDoc(docRef, scriptWithMetadata);
    return documentId;

  } catch (error) {
    console.error('Error uploading script:', error);
    throw error;
  }
};

/**
 * Firebase Firestore에서 스크립트를 삭제하는 함수
 * @param {string} documentId - 삭제할 스크립트의 문서 ID
 */
export const deleteScript = async (documentId) => {
  try {
    const docRef = doc(db, 'scripts', documentId);
    await deleteDoc(docRef);
  } catch (error) {
    console.error('Error deleting script:', error);
    throw error;
  }
};
