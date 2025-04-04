import React from 'react'
import ProfileInfo from '../../component/MyPageComponent/ProfileInfo.jsx'
import ProfileImg from '../../component/MyPageComponent/ProfileImg.jsx'
export default function MyMain() {
  return (
    <div className='flex pt-36'>
      <ProfileImg/>
      <ProfileInfo/>
    </div>
  )
}
