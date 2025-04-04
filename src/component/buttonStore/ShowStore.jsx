import {create} from 'zustand'

const useShowStore = create((set) => ({
    ShowGPT: false,
    InGPT:() =>set({ShowGPT:true}),
    OutGPT:()=>set({ShowGPT:false})

}))

export default useShowStore