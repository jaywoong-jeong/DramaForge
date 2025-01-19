# DramaForge

DramaForge는 드라마/영화 대본을 분석하고 각색하기 위한 웹 기반 도구입니다.

## 주요 기능

### 1. 인물 분석
- 등장인물별 대사량 시각화 (막대 그래프)
- 무대 체류 시간 분석 (막대 그래프)
- 등장인물 타임라인 (간트 차트)
- 인물별 대사 하이라이트 기능

### 2. 사건 분석
- 장면별 메타데이터 분석 (유형/시간/장소)
- Unit 단위 타임라인 시각화
- 플롯 구조 시각화 (exposition → development → climax → conclusion)
- Unit별 상세 정보 (등장인물/대화 주제/상황 변화/분위기)

### 3. 각색 지원
- 인물 통합/분할 기능
- 사건 구조 수정
- 배경 및 설정 변경

## 기술 스택

- Frontend: React
- 상태 관리: Jotai
- 시각화: recharts, reactflow

## 프로젝트 구조

```
src/
├── components/
│   ├── analysis/       # 분석 관련 컴포넌트
│   ├── editor/         # 대본 편집 컴포넌트
│   └── common/         # 공통 컴포넌트
├── services/
│   ├── analysis/       # 분석 관련 서비스
│   └── api/           # API 설정
├── store/              # Jotai 상태 관리
└── App.jsx             # 메인 애플리케이션

public/
└── scripts/           # 샘플 대본 JSON 파일
```

## 라이선스

MIT License
