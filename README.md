# 개발자의 놀이터, PlaygroundDev


## 스택  

* FrontEnd - React
* BackEnd - Nodejs
* Database - MariaDB

## 로컬 개발환경 설치 및 실행

### 설치
- Nodejs: https://nodejs.org/en
- Docker: https://www.docker.com/

###  패키지 설치

```
// /frontend
npm install
```

### 환경변수 설정

#### FrontEnd
.env.template -> .env로 이름 변경

#### BackEnd
.env.template -> .env로 이름 변경

#### Google OAuth Key 설정
참고 링크: https://support.google.com/workspacemigrate/answer/9222992?hl=ko

### 실행

#### FrontEnd 실행
```
// /frontend
npm start
```

#### BackEnd, Database 실행
```
// /backend
./start.cmd // For Windows
./start.sh // For Mac


// Permission 에러 발생시
chmod +x start.sh
```
