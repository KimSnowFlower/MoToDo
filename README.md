MoToDo <br>
directed by 김평화, 노성민, 이준서

Web : React/Node.js - To Do List<br><hr>

코드 스타일 <br>
- 파일명은 대문자 시작 ex) Header.js / Header.css
- 변수명은 소문자 및 단어 여러 조합은 두번째 단어부터 대문자 ex) useState, useEffect
- 변수명은 최대한 간략이 아닌 확고하게 표현 ex) rep(x), response(o)
- 추후 코드는 여러 수정을 거칠 예정<br>
<hr>

README.md 작성법 <br>
- commit마다 올라간 파일명 모두 기입
- 변수 연결을 쉽게하기 위해 각 파일마다 변수 작성 및 간단 설명
- 항상 commit한 날짜 기입 및 작성자 기입<br>
<h3>EX)</h3>
2024.07.10 - 김평화 <br><br>

Index.js <br>
- const app // express 사용 변수<br><br>

Header.css <br>
- headerFont // 헤더 폰트<br>
- headerSize // 헤더 사이즈 <br>
<hr>
<h3>2024.07.10 - 김평화</h3> <br><br>
다들 필요한 설치 파일 <br>

# dependency 설치
npm install [dependency 이름]
- express : 백엔드 프레임워크
- cors : cors 설정
- json : json 파싱
- body-parser : 요청 body 받기
- nodemon : index.js 저장시 서버 새로고침<br>
<hr>

<h3>2024.07.16 - 김평화</h3> <br><br>
다들 필요한 설치 파일 <br>

# npm install
npm install react-icons --save <br>
npm install react-router-dom <br>
npm install axios <br>
npm install express mysql2 bcrypt cors <br><br>

# Components
- Assets <br>
 1. LoginForm_background.png : 로그인 화면 배경화면 <br>
- LoginForm <br>
 1. LoginForm.css : 로그인 폼 css<br>
 2. LoginForm.jsx : 로그인 폼 jsx <br>
- Register <br>
 1. Register.css : 회원가입 css <br>
 2. Register.jsx : 회원가입 jsx<br>

# server
- server.js : 서버 관련 js 파일 <br>

# 추가 정보
- 테스트 시 node server.js를 실행하고 npm start
- 만일 테스트 시 필요하면 App.js에 Router 부분을 주석 후 필요한 화면을 호출하여 실행할 것!
<hr>

<h3>2024.07.24 - 김평화</h3> <br><br>
홈 화면 구성 전 버전 <br>
다들 필요한 설치 파일 <br>

# npm install
npm install jsonwebtoken <br>

# Components
- Home <br>
1. Home.css : 홈 화면 css <br>
2. Home.jsx : 홈 화면 jsx <br>
- MenuBar <br>
1. MenuBar.css : 왼쪽 메뉴바 css <br>
2. MenuBar.jsx : 왼쪽 메뉴바 jsx <br>

아직 홈 화면을 다 구성한 버전이 아님 주의!!
<hr>

<h3>2024.07.25 - 김평화</h3> <br><br>
홈 화면 구성 버전 2 <br>

# 주요 구성 바꿈
- MenuBar.css <br>
1. 왼쪽 바에 Menu / Home / Calendar / Sticky 아이콘 추가
2. Collapse에 아이콘을 상황에 맞게 바뀌게 설정
3. 코드 전체적인 수정

<h3>2024.07.27 - 김평화</h3> <br><br>
MySQL - MariaDB -> Cloudtype 연동 완료 <br>

근데 나중에 다른 사람들도 가능한지는 테스트 해야 할듯 ㅠㅠ
<hr>

<h3>2024.07.28 - 김평화</h3> <br><br>

# npm install
npm install express-validator <br>
npm install date-fns <br>

# Components
- CurrentDateTime <br>
1. CurrentDateTime.css : 메인 시간 css <br>
2. CurrentDateTime.jsx : 메인 시간 jsx <br>

CurrentDateTime은 MoToDo에 필요한 시간을 표시하는 UI <br>

# 나머지 수정 사항
1. MenuBar.jsx 수정
2. Register.jsx : Maria DB를 사용하게 수정 및 아이디 영어와 특수기호만 입력하게 수정
3. Home.css / Home.jsx : CurrentDateTime 추가
4. index.css : background 이미지 제거
5. server.js : Maria DB를 사용하게 수정 및 Register 관련 조금 더 디테일하게 수정

# 추가 변경사항
1. client와 server 파일로 나누어 만듬. 나머지 프로젝트에 필요한 파일은 client/src/Components에 만들면 됩니다!
2. 그리고 pull 받고 cmd 창에서 motodo/server에서 npm install 하고 motodo/client에서 npm install 한번 해주시고 웹 실행 부탁드립니당.
3. (무조건 2개의 cmd 활성화 후) 실행할 때 motodo/server에서는 node server.js 먼저 실행하고 motodo/client에서 npm start 해야 정상적으로 서버에 데이터를 전달합니다.
4. 단, github에 올릴 때는 다시 motodo (프로젝트 파일 기준 폴더 위치)에서 git add . 진행 해야 함!!
<hr>

<h3>2024.07.30 - 이준서</h3> <br><br>

# Components
- Calender <br>
1. Calender.css : 캘린더 css <br>
2. Calender.jsx : 캘린더 jsx <br>

Calender은 MoToDo에 필요한 캘린더를 표시하는 UI <br>

# 나머지 수정 사항
1. App.js 수정 : Calender와 연결되는 라우팅 설정
2. MenuBar.jsx : Calender링크가 라우터의 경로로 이동하도록 수정 - 아직은 미완성
<hr>

<h3>2024.07.31 - 김평화</h3> <br><br>

# Components
- App.js : Calednar 라우팅 수정
- MenuBar.jsx : import useNvaigate 추가, HandleHomeClick, HandleCalendarClick 추가