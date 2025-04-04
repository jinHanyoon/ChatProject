import { create } from "zustand";

const useRoomIdStore = create((set)=>({
    TargetRoomID:[],
    setTargetRoom:(roomId)=>set({TargetRoomID:roomId}),
    selectedDate:"",
    setSelectedDate:(state)=>set({selectedDate:state}),
    setClearSelected:()=>set({selectedDate:""})

}))


export default useRoomIdStore