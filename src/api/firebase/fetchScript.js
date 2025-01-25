import { collection, getDocs, query, orderBy } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Firebase Firestore에서 스크립트 목록을 가져오는 함수
 * @returns {Promise<Array>} 스크립트 제목 목록
 */
export const fetchScriptList = async () => {
  try {
    const scriptsRef = collection(db, 'scripts');
    const q = query(scriptsRef, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    const scripts = ['대본을 선택해주세요'];  // 기본 옵션 추가
    querySnapshot.forEach((doc) => {
      scripts.push(doc.data().title);
    });
    
    return scripts;
  } catch (error) {
    console.error('Error fetching scripts:', error);
    throw error;
  }
};

/**
 * Firebase Firestore에서 특정 스크립트의 데이터를 가져오는 함수
 * @param {string} title - 스크립트 제목
 * @returns {Promise<Object>} 스크립트 데이터
 */
export const fetchScriptByTitle = async (title) => {
  try {
    const scriptsRef = collection(db, 'scripts');
    const q = query(scriptsRef);
    const querySnapshot = await getDocs(q);
    
    let scriptData = null;
    querySnapshot.forEach((doc) => {
      if (doc.data().title === title) {
        scriptData = doc.data();
      }
    });
    
    if (!scriptData) {
      throw new Error('스크립트를 찾을 수 없습니다.');
    }
    
    return scriptData;
  } catch (error) {
    console.error('Error fetching script:', error);
    throw error;
  }
};
