import React from 'react'
import { useEffect,useState } from 'react'
import supabase from '../../api/supabase'
import UserIn from '../../component/userin'
import useSession from '../../auth/session'
export default function My_list() {
    const [UserList, setUserList] = useState()
    const [UserComplete, setUserComplete] = useState(false)
    const [userValue,setUserValue] = useState('')
    const {userUUID} = useSession();


    useEffect(()=>{
        const UserFetch = async () =>{
            const {data, error} = await supabase.from('profiles').select('username, id,avatar_url')
        if(data){
            setUserList(data)
        }else{
            console.log(error)
        }
        }
        UserFetch()
    
      },[])
    

      const UserInformation =  (userValue) =>{
        setUserValue(userValue)
        setUserComplete(true)
    }

  return (
    <>
    <ul className="bg-gray-700">
        {/* 현재 사용자를 상단에 고정 */}
        {UserList?.filter(item => item.id === userUUID).map((item) => (
            <li key={item.id}
                onClick={()=>{UserInformation(item)}}            
                className="h-20 px-4 py-2 flex items-center gap-4"
            >
                <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-500'>
                {item?.avatar_url ? (
                    <img 
                        src={item.avatar_url} 
                        alt={`${item.username}의 프로필`}
                        className='w-full h-full object-cover'
                    />
                ) : (
                    <div className='w-full h-full flex items-center justify-center bg-indigo-600 text-gray-100 text-xl'>
                        {item?.username?.[0]?.toUpperCase()}
                    </div>
                )}
                </div>
                <div className='flex-1 text-left'>
                    <p className='font-semibold text-gray-100'>
                        {item.username}
                    </p>
                    <p className='text-sm text-gray-400 mt-1'>내 프로필</p>
                </div>
            </li>
        ))}

        {/* 구분선과 여백 */}
        <div className="h-3 bg-gray-800 border-y border-gray-600"></div>

        {/* 다른 사용자들 목록 */}
        {UserList?.filter(item => item.id !== userUUID).map((item) => (
            <li key={item.id}
                onClick={()=>{UserInformation(item)}}            
                className="h-20 px-4 py-2 border-b border-gray-600 flex items-center gap-4 hover:bg-gray-600 cursor-pointer"
            >
                <div className='w-12 h-12 rounded-full overflow-hidden bg-gray-500'>
                {item?.avatar_url ? (
                    <img 
                        src={item.avatar_url} 
                        alt={`${item.username}의 프로필`}
                        className='w-full h-full object-cover'
                    />
                ) : (
                    <div className='w-full h-full flex items-center justify-center bg-indigo-600 text-gray-100 text-xl'>
                        {item?.username?.[0]?.toUpperCase()}
                    </div>
                )}
                </div>
                <div className='flex-1 text-left'>
                    <p className='font-semibold text-gray-100'>
                        {item.username}
                    </p>
                </div>
            </li>
        ))}
    </ul>
    {UserComplete && <UserIn userValue={userValue} setUserComplete={setUserComplete}/>}
    </>
  )
}
