// message 부분 전역 관리
import {create} from 'zustand'

const useMessageStore = create((set) => ({
  messages: [],
  setMessages: (newMessages) => set({ messages: newMessages }),
  addMessage: (message) => set((state) => ({ 
    messages: [...state.messages, message] 
  })),
  clearMessages: () => set({ messages: [] }),

  DateData:[],
  setDateData:(state)=>set({DateData:state}),
  setDateDataClear:()=>set({DateData:[]})
}))

export default useMessageStore