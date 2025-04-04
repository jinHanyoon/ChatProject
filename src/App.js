import './App.css';
import { Routes, Route, Outlet } from 'react-router-dom';
import Main from './pages/main/ChatList.jsx'
import ChatPage from './pages/about/ChatPage.jsx'
import Login from './auth/login/login.jsx';
import Header from './component/Header.jsx';
import MyList from './pages/my-list/My_list.jsx';
import Option from './component/option.jsx';
import Intro from './pages/intro/intro.jsx';
import RequireAuth from './auth/login/authRoute/AuthRoute.jsx';
import MyPage from './pages/mypage/MyMain.jsx';

// import { response } from 'express'; 


//데이터베이스에서 유저 정보 불러오기 
// socket 으로 유저정보 보내기 
// 채팅 내용 불러오기
// 현재페이지 -> 채팅 목록 페이지 && 메시지 보내는 페이지

function App() {
  return (
    <div className="text-center flex-col content-start  bg-gray-700 h-svh">
      <Routes>
   
    <Route path='/' element={<Intro/>}/>
        <Route path="/login" element={<Login />} />

        <Route element={<RequireAuth />}>
      <Route path="/MyList" element={
          <>
            <Header />
            <Option />
            <MyList/>
          </>
        } />
        <Route path="/Chat_list" element={
          <>
            <Header />
            <Option />
            <Main/>
            <Outlet/>

          </>
        } />
        <Route path="about/:ChatNumber" element={<ChatPage />} />
<Route path="/MyPage" element={
          <>
            <Header />
            <Option />
            <MyPage/>
          </>
        } />

        </Route>


      </Routes>
    </div>
  );
}

export default App;
