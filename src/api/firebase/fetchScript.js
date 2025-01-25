import { collection, getDocs, query, orderBy, where } from 'firebase/firestore';
import { db } from '../firebase';

/**
 * Firebase Firestore에서 스크립트 목록을 가져오는 함수
 * @returns {Promise<Array>} 스크립트 제목 목록 (중복 제거됨)
 */
export const fetchScriptList = async () => {
  try {
    const scriptsRef = collection(db, 'scripts');
    const q = query(scriptsRef, orderBy('uploadedAt', 'desc'));
    const querySnapshot = await getDocs(q);
    
    // 중복 제거를 위한 Set 사용
    const uniqueTitles = new Set(['대본을 선택해주세요']);
    querySnapshot.forEach((doc) => {
      uniqueTitles.add(doc.data().title);
    });
    
    return Array.from(uniqueTitles);
  } catch (error) {
    console.error('Error fetching scripts:', error);
    throw error;
  }
};

/**
 * Firebase Firestore에서 특정 스크립트의 최신 버전 데이터를 가져오는 함수
 * @param {string|Object} titleOrScript - 스크립트 제목 또는 스크립트 객체
 * @returns {Promise<Object>} 스크립트 데이터
 */
export const fetchScriptByTitle = async (titleOrScript) => {
  // title 추출: 문자열이거나 객체의 title 속성
  const title = typeof titleOrScript === 'string' ? titleOrScript : titleOrScript?.title;

  if (!title || title === '대본을 선택해주세요') {
    throw new Error('유효하지 않은 스크립트 제목입니다.');
  }

  try {
    const scriptsRef = collection(db, 'scripts');
    // 정확한 title 매칭을 위한 쿼리
    const q = query(
      scriptsRef, 
      where('title', '==', title)
    );
    const querySnapshot = await getDocs(q);
    
    if (querySnapshot.empty) {
      console.error(`스크립트를 찾을 수 없습니다: ${title}`);
      throw new Error('스크립트를 찾을 수 없습니다.');
    }
    
    // 클라이언트에서 날짜순 정렬
    const scripts = querySnapshot.docs.map(doc => ({
      ...doc.data(),
      id: doc.id
    }));
    
    // uploadedAt으로 정렬하여 가장 최신 버전 가져오기
    scripts.sort((a, b) => {
      if (!a.uploadedAt || !b.uploadedAt) return 0;
      return b.uploadedAt.localeCompare(a.uploadedAt);
    });
    
    const latestScript = scripts[0];
    latestScript.version = scripts.length; // 전체 버전 수
    
    console.log('Found script:', latestScript);
    return latestScript;
  } catch (error) {
    console.error('Error fetching script:', error);
    throw error;
  }
};
