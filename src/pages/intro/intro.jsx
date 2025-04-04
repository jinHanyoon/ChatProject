import React from 'react';
import { Link } from 'react-router-dom';

export default function Intro() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-b from-gray-800 to-gray-900 text-white p-6">
      <div className="max-w-md w-full space-y-8 bg-gray-900/50 backdrop-blur-sm p-8 rounded-xl shadow-xl border border-gray-700">
        <div className="text-center">
          <h1 className="text-3xl font-bold mb-2">
            Welcome to ChatApp
          </h1>
          <p className="text-gray-400 text-lg mb-6">
            실시간으로 소통하는 새로운 방법
          </p>
        </div>

        <div className="space-y-4">
          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              처음 방문하셨나요?
            </h2>
            <p className="text-gray-400">
              ChatApp에서 새로운 대화를 시작해보세요. 실시간 채팅으로 즐거운 소통을 경험하실 수 있습니다.
            </p>
          </div>

          <div className="bg-gray-800/50 p-4 rounded-lg">
            <h2 className="text-xl font-semibold mb-2">
              주요 기능
            </h2>
            <div className="text-gray-400 space-y-2 pl-4">
              <div className="flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                <span>실시간으로 진행되는 채팅 서비스</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                <span>다양한 주제의 채팅방 참여</span>
              </div>
              <div className="flex items-center">
                <span className="w-2 h-2 bg-indigo-500 rounded-full mr-2"></span>
                <span>간편하고 직관적인 인터페이스</span>
              </div>
            </div>
          </div>
        </div>

        <div className="flex flex-col space-y-4 mt-8">
          <Link 
            to="/login" 
            className="w-full px-6 py-3 bg-indigo-600/90 hover:bg-indigo-700/90 text-white rounded-lg text-center transition-colors duration-200"
          >
            로그인하기
          </Link>
        </div>
      </div>
    </div>
  );
}
