# ChatProject

React, Socket.IO, Tailwind CSS를 사용하여 실시간 채팅 앱을 만든 프로젝트입니다.  
사용자는 **Supabase**를 통해 로그인하고, 실시간 채팅을 통해 메시지를 주고받을 수 있습니다.  
닉네임 변경 기능과 GPT API를 통해 채팅 내용을 날짜별로 요약할 수 있습니다.  
날짜 처리는 **day.js**를 사용하고, UI는 **Tailwind CSS**로 반응형으로 디자인되었습니다.

채팅 기록은 **Supabase**에 저장되어 유저별로 관리됩니다.

---

## 기술 스택

- **React** – UI 라이브러리
- **Socket.IO** – 실시간 양방향 통신
- **Tailwind CSS** – 유틸리티 기반 CSS 프레임워크
- **Supabase** – 인증 기능 및 채팅 기록 저장
- **GPT API** – OpenAI GPT를 이용한 채팅 요약
- **day.js** – 날짜 및 시간 처리를 위한 라이브러리

---

## 주요 기능

- [x] **로그인 기능** (Supabase Auth)
- [x] **실시간 채팅** (Socket.IO)
- [x] **닉네임 변경 기능**
- [x] **GPT API**를 통한 날짜별 채팅 내용 요약
- [x] **채팅 기록 유저별 저장** (Supabase에 기록 저장)
- [x] **반응형 UI** (Tailwind CSS)

---

## 설치 방법

```bash
git clone https://github.com/jinhanyoon/ChatProject.git
cd ChatProject
npm install
npm start