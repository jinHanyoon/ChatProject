import React from 'react'
import { useState, useEffect } from 'react'
import { emailLogin } from './loginAction'
import useSession from '../session.js'
import { useNavigate } from 'react-router-dom' 

export default function Login() {
    const navigate = useNavigate();  
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const isLogin = useSession((state) => state.isLogin);
    

    useEffect(()=>{
        if(isLogin){
            navigate('/MyList');    

        }
    })

    const handleSubmit = async(e) =>{
        e.preventDefault()
        try{
            await emailLogin(email,password);
            alert("로그인에 성공하셨습니다.")
            navigate('/MyList');
        }catch(error){
            alert("로그인에 실패하였습니다..")

        }

    }
    
    return (
        <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center backdrop-blur-sm p-4 z-50">       
            <form onSubmit={handleSubmit} className="w-full max-w-md bg-gradient-to-br from-slate-800 to-slate-900 rounded-2xl shadow-2xl p-8 border border-slate-700/50 transform transition-all hover:scale-[1.01]">
                <h2 className="text-3xl font-bold mb-8 text-center text-transparent bg-clip-text bg-gradient-to-r from-blue-400 to-purple-500">
                    로그인
                </h2>
                
                <div className="space-y-4">
                    <div>
                        <label className="block text-slate-300 mb-2 text-sm">이메일</label>
                        <input
                            id="email"
                            name="email"
                            type="email"
                            autoComplete="email"
                            required
                            className="w-full px-6 py-3 bg-slate-700/50 rounded-lg border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white placeholder-slate-400 text-lg"
                            placeholder="test@test.com"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                        />
                    </div>
                    
                    <div>
                        <label className="block text-slate-300 mb-2 text-sm">비밀번호</label>
                        <input
                            id="password"
                            name="password"
                            type="password"
                            autoComplete="current-password"
                            required
                            className="w-full px-6 py-3 bg-slate-700/50 rounded-lg border border-slate-600 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 outline-none text-white placeholder-slate-400 text-lg"
                            placeholder="123"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                        />
                    </div>
                    
                    <div className="mt-2 text-left">
                        <p className="text-sm text-slate-400 text-center">테스트 계정:</p>
                        <div className='w-72  m-auto text-left'>
                        <p className="text-sm text-slate-400 ml-4 ">- 이메일: test@test.com/ 비밀번호: 123</p>
                        <p className="text-sm text-slate-400 ml-4 ">- 이메일: test02@test.com/ 비밀번호: 123</p>
                    </div>                    
                    
                    </div>
                </div>

                <div className="space-y-4 mt-8">
                    <button type='submit' className="w-full px-8 py-3 bg-gradient-to-r from-blue-500 to-purple-500 rounded-lg text-white font-medium hover:opacity-90 transition-opacity text-lg">
                        로그인
                    </button>
                    <button 
                        onClick={() => navigate('/')} 
                        type="button"
                        className="w-full px-8 py-3 rounded-lg text-slate-300 hover:text-white transition-colors text-lg border border-slate-600"
                    >
                        돌아가기
                    </button>
                </div>
            </form>
        </div>
  )
}
