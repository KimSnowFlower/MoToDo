MoToDo <br>
directed by 김평화, 이준서, 최정인 (R.I.P 노성민)

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

<h3>2024.08.12 - 김평화</h3> <br><br>

봉사와 힘든 시간을 견디고 오랜만에 돌아왔다... <br>

# Main
- App.js : 모든 Routes에 동일 된 css 적용을 위한 className 적용
- App.css : index.css에 있던 내용을 합치고 모든 페이지 구성에 대한 기초적인 코드 구성
- index.js : index.css 삭제 후 import 삭제

# Components
- CurrentDateTime.css : 화면에 위치에 고정 시키고 css 수정 (글자는 뒷 배경 결정되면 수정해야 할듯)
- CurrentDateTime.jsx : 시간 흘러가는 기능 구현 (초 단위는 삭제할지 고려 중)
- Home.css : 미리 화면 구성할 .home 생성 (추후 지울 예정)
- Home.jsx : 불필요한 Collapse 코드 정리 + MenuBar와 OptionBar로 화면 구성 변경
- LoginForm.css : App.js 화면 구성 변경으로 인한 기본 body 수정
- MenuBar.css : 가로 폭과 폰트를 수식을 통해 정해진 사이즈에 맞추어 조절 수정 + MenuBar에 CurrentDateTime을 삽입하여 하나로 합침
- MenuBar.jsx : 필요 없는 span, ul, li 삭제 및 MO/Friends/Gruop 생성 (추후 기능 업데이트 예정)
- OptionBar.css : 테스트용 화면 구성
- OptionBar.jsx : 테스트용 화면 구성

# 업데이트 예정 기능
- HOME 화면 새롭게 구성 예정
- friends 테이블, group 관련 컬럼 혹은 테이블 추가
- Notice 기능은 연기
- 소켓을 이용한 친구와 채팅 기능

# 기획 중
- 친구 리스트를 따로 페이지로 뺄지 고민 중
- 친구 리스트 페이지를 따로 만들면 채팅에 대한 화면 구상 필요
- 그룹 페이지에 대한 화면 구성 및 이용 목적 기획

# 삭제 내용
- 일부 필요없는 파일들 삭제

<h2>2024.08.12 - 김평화</h2>

<h5> Main </h5>
- App.js : Route에 Friends 추가 (아마 DirectMessage 창으로 바꿀듯?)

<h5> Components </h5>
- Friends.css : 기본 배경만 만듬 <br>
- Friends.jsx : 기본적인 화면 구성만 제작 <br>
- Home.jsx : 빈 여백에 화면 구성 <br>
- HOME.css : background 연동 해제 및 homeMain 구성 <br>
- MenuBar.css : 코드 일부 수정 <br>
- MenuBar.jsx : Link로 /friends 추가 <br>
- OptionBar.css : 크기 관련된 코드 일부 수정 <br>

<h5> Sever </h5>
- server.js : app.pst(/api/home) 기본 틀 생성