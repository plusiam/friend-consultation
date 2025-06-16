# 친구의 마음 헤아리기: 3단계 컨설팅 완전판

## 📋 프로젝트 소개

**"친구의 마음 헤아리기"**는 학생들이 또래 친구들의 고민을 듣고 공감하며, 도움을 제안하는 연습을 할 수 있는 교육용 웹 애플리케이션입니다.

### 주요 특징
- 🎯 **90가지 실제 고민 사례**: 학생들이 겪을 수 있는 다양한 상황 제공
- 💬 **3단계 체계적 컨설팅 프로세스**: 공감 → 제안 → 격려
- 🎁 **100개의 격려 메시지**: 따뜻한 응원 메시지 데이터베이스
- 📸 **격려 카드 제작 및 다운로드**: 나만의 특별한 격려 카드 만들기
- 📊 **컨설팅 보고서 출력**: 이미지/PDF로 저장 가능

## 🎯 교육 목표

1. **공감 능력 향상**: 친구의 입장에서 생각하고 감정을 이해하는 연습
2. **문제 해결 능력**: 실질적이고 건설적인 도움을 제안하는 방법 학습
3. **긍정적 의사소통**: 따뜻하고 격려하는 메시지 작성 연습
4. **디지털 리터러시**: 웹 기반 도구를 활용한 창의적 표현

## 🛠️ 기술 스택

- **Frontend**: HTML5, CSS3, JavaScript (ES6 모듈)
- **스타일링**: Tailwind CSS
- **라이브러리**: 
  - html2canvas (이미지 캡처)
  - jsPDF (PDF 생성)

## 📁 프로젝트 구조

```
friend-consultation/
├── index.html              # 메인 HTML 파일
├── css/
│   └── styles.css         # 커스텀 스타일
├── js/
│   ├── main.js           # 메인 진입점
│   ├── data.js           # 데이터 로더 및 상태 관리
│   ├── consulting.js     # 컨설팅 화면 로직
│   ├── card-maker.js     # 카드 제작 기능
│   └── utils.js          # 유틸리티 함수
├── data/
│   ├── worries.json      # 고민 사례 데이터
│   └── encouragements.json # 격려 메시지 데이터
└── README.md
```

## 🚀 사용 방법

### 온라인 접속
[https://plusiam.github.io/friend-consultation/](https://plusiam.github.io/friend-consultation/)

### 로컬 실행
1. 리포지토리 클론
   ```bash
   git clone https://github.com/plusiam/friend-consultation.git
   cd friend-consultation
   ```

2. 로컬 서버 실행 (Python 예시)
   ```bash
   python -m http.server 8000
   ```

3. 브라우저에서 접속
   ```
   http://localhost:8000
   ```

## 📖 활용 가이드

### 교실에서 활용하기

1. **개별 활동**: 학생들이 각자 컴퓨터나 태블릿으로 접속하여 활동
2. **모둠 활동**: 3-4명이 함께 고민 사례를 읽고 토의 후 작성
3. **전체 공유**: 완성된 격려 카드를 출력하여 게시판에 전시

### 활동 진행 순서

1. **도입 (5분)**
   - 공감과 경청의 중요성 설명
   - 프로그램 사용법 안내

2. **본활동 (30분)**
   - 고민 사례 읽기
   - 1단계: 공감 메시지 작성
   - 2단계: 도움 제안하기
   - 3단계: 격려 카드 만들기

3. **마무리 (10분)**
   - 작성한 내용 공유
   - 느낀 점 나누기

## 🎨 주요 기능 설명

### 1단계: 마음 공감하기
- 친구의 고민을 읽고 그 감정을 이해하는 연습
- 공감적 표현 연습

### 2단계: 도움 제안하기
- 비난이나 평가가 아닌 건설적 제안
- 실질적이고 구체적인 도움 방법 생각하기

### 3단계: 격려 카드 만들기
- 6가지 템플릿 중 선택
- 격려 메시지 뽑기 (최대 4개)
- 나만의 특별한 메시지 추가
- 배경 이미지 업로드 (선택)

## 🤝 기여하기

이 프로젝트는 교육 목적으로 만들어졌습니다. 개선 사항이나 제안이 있으시면 Issues나 Pull Request를 통해 기여해주세요.

### 기여 방법
1. Fork the Project
2. Create your Feature Branch (`git checkout -b feature/AmazingFeature`)
3. Commit your Changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the Branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## 📝 라이선스

이 프로젝트는 교육 목적으로 자유롭게 사용할 수 있습니다.

## 👨‍🏫 제작자

- **제작**: plusiam
- **목적**: 학생들의 공감 능력과 긍정적 의사소통 능력 향상
- **문의**: [GitHub Issues](https://github.com/plusiam/friend-consultation/issues)

---

💚 친구의 마음을 헤아리는 따뜻한 세상을 만들어가요! 💚