<h1>MoToDo</h1>
<h4>directed by 김평화, 이준서, 최정인 (R.I.P 노성민) </h4>

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
<h2>2024.07.10 - 김평화</h2> 

Database - motodo bug (버그 수정 완료) <br>
LoginForm/Register - css 버그 (버그 수정 완료) <br>

<h3> Components </h3>
- LoginForm : 뒷배경 버그 -> 버그 해결 (20240814 / 10:57 am) <br>
- Register : 뒷배경 버그 -> 버그 해결 (20240814 / 10:57 am) <br>
- Home.jsx : Calendar와 Sticky 정보를 못 가져오는 버그 있음. <br>
- Page(Home,LoginForm,Register, Friends) : css 모듈화 <br>

<h3> Sever </h3>
- server.js : app.post(/api/home) -> 버그 해결 (20240814 / 01:14:38 am) 
<hr>

<h2> Project-Start </h2>
<h2>2024.07.10 - 김평화</h2>

<h3> dependency 설치 </h3>
npm install [dependency 이름] <br>
- express : 백엔드 프레임워크 <br>
- cors : cors 설정 <br>
- json : json 파싱 <br>
- body-parser : 요청 body 받기 <br>
- nodemon : index.js 저장시 서버 새로고침<br>
<hr>

<h2>2024.07.16 - 김평화</h2>

<h3> npm install </h3>
- npm install react-icons --save <br>
- npm install react-router-dom <br>
- npm install axios <br>
- npm install express mysql2 bcrypt cors <br><br>

<h3> Components </h3>
- Assets <br>
 1. LoginForm_background.png : 로그인 화면 배경화면 <br><br>
- LoginForm <br>
 1. LoginForm.css : 로그인 폼 css<br>
 2. LoginForm.jsx : 로그인 폼 jsx <br><br>
- Register <br>
 1. Register.css : 회원가입 css <br>
 2. Register.jsx : 회원가입 jsx<br>

<h3> server </h3>
- server.js : 서버 관련 js 파일 <br>

<h3> 추가 정보 </h3>
- 테스트 시 node server.js를 실행하고 npm start <br>
- 만일 테스트 시 필요하면 App.js에 Router 부분을 주석 후 필요한 화면을 호출하여 실행할 것! <br>
<hr>

<h2>2024.07.24 - 김평화</h2>
홈 화면 구성 전 버전 <br>

<h3> npm install </h3>
npm install jsonwebtoken <br>

<h3> Components </h3> 
- Home <br>
1. Home.css : 홈 화면 css <br>
2. Home.jsx : 홈 화면 jsx <br><br>
- MenuBar <br>
1. MenuBar.css : 왼쪽 메뉴바 css <br>
2. MenuBar.jsx : 왼쪽 메뉴바 jsx <br><br>

아직 홈 화면을 다 구성한 버전이 아님 주의!! <br>
<hr>

<h2>2024.07.25 - 김평화</h2>
홈 화면 구성 버전 2 <br>

<h3> 주요 구성 바꿈</h3>
- MenuBar.css <br>
1. 왼쪽 바에 Menu / Home / Calendar / Sticky 아이콘 추가 <br>
2. Collapse에 아이콘을 상황에 맞게 바뀌게 설정 <br>
3. 코드 전체적인 수정 <br>
<hr>

<h2>2024.07.27 - 김평화</h2>>
MySQL - MariaDB -> Cloudtype 연동 완료 <br>

근데 나중에 다른 사람들도 가능한지는 테스트 해야 할듯 ㅠㅠ
<hr>

<h2>2024.07.28 - 김평화</h2>

<h3> npm install </h3>
npm install express-validator <br>
npm install date-fns <br>

<h3> Components </h3>
- CurrentDateTime <br>
1. CurrentDateTime.css : 메인 시간 css <br>
2. CurrentDateTime.jsx : 메인 시간 jsx <br>

CurrentDateTime은 MoToDo에 필요한 시간을 표시하는 UI <br>

<h3> 나머지 수정 사항 </h3>
1. MenuBar.jsx 수정
2. Register.jsx : Maria DB를 사용하게 수정 및 아이디 영어와 특수기호만 입력하게 수정 <br>
3. Home.css / Home.jsx : CurrentDateTime 추가 <br>
4. index.css : background 이미지 제거 <br>
5. server.js : Maria DB를 사용하게 수정 및 Register 관련 조금 더 디테일하게 수정 <br>

<h3> 추가 변경사항 </h3>
1. client와 server 파일로 나누어 만듬. 나머지 프로젝트에 필요한 파일은 client/src/Components에 만들면 됩니다! <br>
2. 그리고 pull 받고 cmd 창에서 motodo/server에서 npm install 하고 motodo/client에서 npm install 한번 해주시고 웹 실행 부탁드립니당. <br>
3. (무조건 2개의 cmd 활성화 후) 실행할 때 motodo/server에서는 node server.js 먼저 실행하고 motodo/client에서 npm start 해야 정상적으로 서버에 데이터를 전달합니다. <br>
4. 단, github에 올릴 때는 다시 motodo (프로젝트 파일 기준 폴더 위치)에서 git add . 진행 해야 함!! <br>
<hr>

<h2>2024.07.30 - 이준서</h2>

<h3> Components </h3>
- Calender <br>
1. Calender.css : 캘린더 css <br>
2. Calender.jsx : 캘린더 jsx <br>

Calender은 MoToDo에 필요한 캘린더를 표시하는 UI <br>

<h3> 나머지 수정 사항 </h3>
1. App.js 수정 : Calender와 연결되는 라우팅 설정 <br>
2. MenuBar.jsx : Calender링크가 라우터의 경로로 이동하도록 수정 - 아직은 미완성 <br>
<hr>

<h2>2024.07.31 - 김평화</h2>

<h3> Components </h3>
- App.js : Calednar 라우팅 수정 <br>
- MenuBar.jsx : import useNvaigate 추가, HandleHomeClick, HandleCalendarClick 추가 <br>
<hr>

<h2>2024.08.12 - 김평화</h2>

봉사와 힘든 시간을 견디고 오랜만에 돌아왔다... <br>

<h3> Main </h3>
- App.js : 모든 Routes에 동일 된 css 적용을 위한 className 적용 <br>
- App.css : index.css에 있던 내용을 합치고 모든 페이지 구성에 대한 기초적인 코드 구성 <br>
- index.js : index.css 삭제 후 import 삭제 <br>

<h3> Components </h3>
- CurrentDateTime.css : 화면에 위치에 고정 시키고 css 수정 (글자는 뒷 배경 결정되면 수정해야 할듯) <br>
- CurrentDateTime.jsx : 시간 흘러가는 기능 구현 (초 단위는 삭제할지 고려 중) <br>
- Home.css : 미리 화면 구성할 .home 생성 (추후 지울 예정) <br>
- Home.jsx : 불필요한 Collapse 코드 정리 + MenuBar와 OptionBar로 화면 구성 변경 <br>
- LoginForm.css : App.js 화면 구성 변경으로 인한 기본 body 수정 <br>
- MenuBar.css : 가로 폭과 폰트를 수식을 통해 정해진 사이즈에 맞추어 조절 수정 + MenuBar에 CurrentDateTime을 삽입하여 하나로 합침 <br>
- MenuBar.jsx : 필요 없는 span, ul, li 삭제 및 MO/Friends/Gruop 생성 (추후 기능 업데이트 예정) <br>
- OptionBar.css : 테스트용 화면 구성 <br>
- OptionBar.jsx : 테스트용 화면 구성 <br>

<h3> 업데이트 예정 기능 </h3>
- HOME 화면 새롭게 구성 예정 <br>
- friends 테이블, group 관련 컬럼 혹은 테이블 추가 <br>
- Notice 기능은 연기 <br>
- 소켓을 이용한 친구와 채팅 기능 <br>

<h3> 기획 중 </h3>
- 친구 리스트를 따로 페이지로 뺄지 고민 중 <br>
- 친구 리스트 페이지를 따로 만들면 채팅에 대한 화면 구상 필요 <br>
- 그룹 페이지에 대한 화면 구성 및 이용 목적 기획 <br>

<h3> 삭제 내용 </h3>
- 일부 필요없는 파일들 삭제 <br>
<hr>

<h2>2024.08.13 - 김평화</h2>

<h3> Main </h3>
- App.js : Route에 Friends 추가 (아마 DirectMessage 창으로 바꿀듯?)

<h3> Components </h3>
- Friends.css : 기본 배경만 만듬 <br>
- Friends.jsx : 기본적인 화면 구성만 제작 <br>
- Home.jsx : 빈 여백에 화면 구성 <br>
- HOME.css : background 연동 해제 및 homeMain 구성 <br>
- MenuBar.css : 코드 일부 수정 <br>
- MenuBar.jsx : Link로 /friends 추가 <br>
- OptionBar.css : 크기 관련된 코드 일부 수정 <br>

<h3> Sever </h3>
- server.js : app.pst(/api/home) 기본 틀 생성

<h2>2024.08.14 - 김평화</h2>

Database - motodo bug (버그 수정 완료) <br>
LoginForm/Register - css 버그 (버그 수정 완료) <br>

<h3> Components </h3>
- LoginForm : 뒷배경 버그 -> 버그 해결 (20240814 / 10:57 am) <br>
- Register : 뒷배경 버그 -> 버그 해결 (20240814 / 10:57 am) <br>
- Home.jsx : Calendar와 Sticky 정보를 못 가져오는 버그 있음. <br>
- Page(Home,LoginForm,Register, Friends) : css 모듈화 <br>

<h3> Sever </h3>
- server.js : app.post(/api/home) -> 버그 해결 (20240814 / 01:14:38 am) <br>
<hr>
<h2>2024.08.16 - 이준서</h2>

<h3> Components </h3>
- Calender.jsx 텍스트필드 추가 및 캘린더 크기 소폭 조절, 뒷배경 버그 및 전체적인 스크롤부여 버그 미해결 <br>
- Calender.module.css : 모듈화 및 스타일 소폭 조정, 캘린더 스타일 직관성부여 및 기능추가에 따른 스타일 변화 미적용 <br>
- 크롬 다크모드 아니면 메뉴바에 시간이 하얀색이라 그런지 안보이는데 색깔 바꿔도 될까요? -> 그래서 준비중인 다크모드 두둥
<hr>

<h2>2024.08.16 - 김평화</h2>

준서를 위한 다크모드 만들기

<h3>Components</h3>
<h4>Context</h4>
- darkmode context 디렉토리 <br>

<h4>Theme</h4>
- 다크모드 테마 관리 디렉토리 <br>

<h4>LoginForm</h4>
- GlobalStyle 변경 후 로그인 폼 깨짐 현상 발생 (버그 이해좀...) <br>

<h4>MenuBar와 OptionBar</h4>
- 편의성을 위해 OptionBar의 기능을 MenuBar로 합침 <br>
- 대신 아직 동시 색상 변환 버그가 있음 -> 버그 해결 (20240817 / 12:56:10 am) <br>
- css 대신 styled-components로 코드 변경 <br>
- 하지만 혹시 몰라서 css 살려둠 <br>
- 오른쪽 상단 젤 끝 버튼 누르면 모드 전환 가능 (라이트모드 밝음 주의!!) <br>

<h4>Calendar, Friends, Home</h4>
- OptionBar 관련 코드를 모두 삭제 <br>

<h4>GlobalStyle, Theme</h4>
- 라이트모드와 다크모드에 통상적인 모습을 위한 코드 수정 <br>

<h4>CurrentDateTime</h4>
- MenuBar와 OptionBar와 동일하게 css 대신 styled-components 사용 <br>
- 하지만 css 살려둠 <br>
<hr>

<h2>2024.08.17 - 이준서</h2>

<h3> Components </h3>
- Calendar.jsx : 캘린더랑 텍스트필드 비율을 맞춰봤는데 창크기 줄였을때 비율 일정하게끔 하는것도 해볼께용, 밑에 스크롤 넣는건 해봤는데 먼가 지금은 불편한거 같아서 나주에 옆에 공간이 더 필요하다 싶으면 넣을께용. 아마 스크롤보단 위에 1, 2 있는걸로 화면 전환하는걸로 할거같음 <br>
- Calendar.module.css : 비율수정 <br>
<hr>

<h2>2024.08.19 - 김평화</h2>

드가자~

<h2>2024.08.20 - 이준서</h2>
- Calendar.jsx : 캘린더 일정 눌렀을때 수정, 삭제하는 기능 추가(수정기능 아직 미완성), 일정이 있는날은 빨간색으로 강조표시, 특수기념일(생일, 연인, 여행, 술)같은거 표시하는 아이콘기능 구현(술은 한달에 술을 얼마나 먹었나 카운팅하는 사람이 있을까 싶어서 넣음)(아직 아이콘 활성화/비활성화 기능이랑 다른 아이콘이랑 같이 돌아가는 버그는 수정 안됨), 일정 시간순대로 캘린더에 보여질때 정렬되게끔 구현 <br>
- Calendar.module.css : 비율수정
<hr>

<h2>2024.08.20 - 김평화</h2>

<h3>Components</h3>
<h4>MenuBar 버그</h4>
- 현재 MenuBar에 width가 아무리 해도 전처럼 화면 해상도에 맞게 적절하게 변경 불가능
-> 버그 해결 (20240820 / 11:10:20 pm)

<h4>Home 버그</h4>
- container 사이즈 버그
-> 버그 해결 (20240820 / 11:39:20 pm)
<hr>

<h2>2024.08.21 - 김평화</h2>

<h4>LoginForm, Register</h4>
- App.css 변경 후 ui 깨짐 현상 해결
- LoginForm은 화면 배치 변경

<h4>Home</h4>
- 배경 적용 후 메뉴바에 아이콘 이미지, 폰트 크기가 이상해짐
- 유저한테 보여줄 Calendar, Sticky 리스트 css 꾸밈

<h4>MenuBar</h4>
- Home에 영향으로 조금 스타일링 바뀜 (아직은 그대로 둘 예정)
<hr>

<h2>2024.08.28 - 이준서</h2>

<h3> Components </h3>
- Calendar.jsx : 캘린더 배경도 회색으로 보여서 일단 캘린더 내부에서 배경색 고정했어요. 디자인 조금 손보고 일정 수정방식 조금 바꿈  <br>
- Calendar.module.css : 비율수정 <br>

<h2>2024.09.02 - 이준서</h2>

<h3> Components </h3>
- Calendar.jsx : 평화띠가 제안한 색상으로 캘린더 분위기 바꿔봄. 아이콘이랑 빨간점이 같이나오는 버그수정  <br>
- Calendar.module.css : 비율수정 <br>
<hr>

<h2>2024.09.03 - 이준서</h2>

<h3> Components </h3>
- MenuBar.jsx : 로고를 CurrentDateTime이 나오는곳에 넣어보고 CurrentDateTime을 아래로 옮겨보았습니다.  <br>
- MenuBar.css : 위치변경 <br>
<hr>

<h2>2024.09.05 - 이준서</h2>

<h3> Components </h3>
- MenuBar.jsx : 매뉴바 통합했습니다 버튼 위치 변경  <br>
- MenuBar.css : 위치변경 <br>
<hr>

<h2>2024.09.09 - 이준서</h2>

<h3> Components </h3>
- Calendar.jsx : 텍스트 필드대신 캘린더 칸을 클릭했을때 react-modal 라이브러리를 사용해서 모달창으로 구현해봤습니다. 아직 미완성  <br>
- Calendar.module.css : 수정 <br>
<hr>

<h2>2024.09.10 - 이준서</h2>

<h3> Components </h3>
- Calendar.jsx : 세부기능 조정  <br>
- Calendar.module.css : 수정 <br>
<hr>

<h2>2024.10.04 - 김평화</h2>

<h3> App </h3>
- App.js에 sticky 링크 추가 <br>

<h3> Components </h3>
- Assets에 이미지 아이콘 추가 <br>
- Sticky 추가 (정인님 구현) <br>
- LoginForm, MenuBar 일부 수정 <br>
- Menubar 불필요한 것들 제거 후 변경

<h3> 전달사항 </h3>
- 정인님 스티키 css 완전히 변경해야 함
- Calendar 뒷배경이 저게 맞나요? 갈색 느낌이 맞아용?