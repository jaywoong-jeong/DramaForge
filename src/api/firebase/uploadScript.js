import { collection, addDoc, getDocs, query, where } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Firebase Firestore에 스크립트를 업로드하는 함수
 * @param {Object} scriptData - 업로드할 스크립트 데이터
 * @param {string} scriptName - 스크립트 이름
 * @returns {Promise<string>} 업로드된 문서의 ID
 */
export const uploadScript = async (scriptData, scriptName) => {
  try {
    // 먼저 같은 이름의 스크립트가 있는지 확인
    const scriptsRef = collection(db, 'scripts');
    const q = query(scriptsRef, where('title', '==', scriptName));
    const querySnapshot = await getDocs(q);

    if (!querySnapshot.empty) {
      throw new Error('이미 같은 이름의 스크립트가 존재합니다.');
    }

    // 스크립트 데이터에 메타데이터 추가
    const scriptWithMetadata = {
      ...scriptData,
      title: scriptName,
      uploadedAt: new Date().toISOString(),
    };

    // Firestore에 데이터 업로드
    const docRef = await addDoc(collection(db, 'scripts'), scriptWithMetadata);
    return docRef.id;

  } catch (error) {
    console.error('Error uploading script:', error);
    throw error;
  }
};
