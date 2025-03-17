import {create} from 'zustand'
import supabase from '../api/supabase.js'

const useSession = create((set) => ({
    // 유저 정보를 저장할 초기 상태값들
    userUUID: null,        // 유저 고유 ID
    userName: '',          // 유저 이름
    avatar_url: '',        // 프로필 이미지 URL
    session: null,         // 세션정보
    isLogin:false,         //로그인 체크
    
    // 세션 체크 함수 - 현재 로그인된 유저 정보를 가져옴
    checkSession: async() => {
        // supabase에서 현재 세션 정보 가져오기
        const response = await supabase.auth.getSession()
        const session = response.data.session
        
        if(session){
            // 세션이 있으면 해당 유저의 프로필 정보를 DB에서 조회
            const profileResponse = await supabase.from('profiles')
                .select('id, username, avatar_url, isLogin')
                .eq('id', session.user.id)
                .single()
            
            const profile = profileResponse.data
            
            await supabase.from('profiles')
            .update({ isLogin: true })
            .eq('id', session.user.id)
        
            // 가져온 프로필 정보로 상태 업데이트
            set({
                userUUID: profile.id,
                userName: profile.username,
                avatar_url: profile.avatar_url,
                session: session ,
                isLogin:true
            })
        }
    },

    logout: async () => {
        const currentSession = useSession.getState().session;
        
        if (currentSession) {
            
            const { data, error } = await supabase.from('profiles')
                .update({ isLogin: false })
                .eq('id', currentSession.user.id);
            if (error) {
                return;
            }
        }
        
        await supabase.auth.signOut()
        alert("로그아웃되었습니다");
        set({
            userUUID: '',
            userName: '',
            avatar_url: '',
            session: null,
            isLogin: false,
        })
    
    }
}))

// 스토어 생성 시 자동으로 세션 체크 실행
useSession.getState().checkSession()
export default useSession