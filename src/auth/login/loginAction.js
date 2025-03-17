import supabase from "../../api/supabase.js";
import useSession from '../session.js'; // useSession import

export const emailLogin = async (email, password) => {
  const { error } = await supabase.auth.signInWithPassword({ 
      email, 
      password 
  });

  if (error) {
      throw error;  // 에러가 있으면 throw
  }

  // 로그인 성공 시 세션 체크 호출
  await useSession.getState().checkSession();
};

//   export const logout = async () => {
//     const { error } = await supabase.auth.signOut();
//     if (!error) {
//       alert("로그아웃 되셨습니다")

//     }else{
//     }
//   };