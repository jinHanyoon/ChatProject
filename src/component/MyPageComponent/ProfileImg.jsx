import React, { useEffect, useState } from 'react'
import useSession from '../../auth/session';
import supabase from '../../api/supabase';

export default function ProfileImg() {
  const { userUUID } = useSession();
  const [avatarUrl, setAvatarUrl] = useState(null);
  const [uploading, setUploading] = useState(false);

  useEffect(() => {
    if (userUUID) {
      getProfile();
    }
  }, [userUUID]);

  async function getProfile() {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('avatar_url')
        .eq('id', userUUID)
        .single();

      if (error) {
        throw error;
      }

      if (data?.avatar_url) {
        setAvatarUrl(data.avatar_url);
      }
    } catch (error) {
      console.error('프로필 이미지 가져오기 오류:', error);
    }
  }

  async function uploadAvatar(event) {
    try {
      setUploading(true);

      if (!event.target.files || event.target.files.length === 0) {
        throw new Error('이미지를 선택해주세요');
      }

      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const filePath = `${userUUID}-${Math.random()}.${fileExt}`;

      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);

      if (uploadError) {
        throw uploadError;
      }

      const { data } = supabase.storage.from('avatars').getPublicUrl(filePath);
      
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar_url: data.publicUrl })
        .eq('id', userUUID);

      if (updateError) {
        throw updateError;
      }

      setAvatarUrl(data.publicUrl);
    } catch (error) {
      console.error('이미지 업로드 오류:', error);
      alert('이미지 업로드에 실패했습니다.');
    } finally {
      setUploading(false);
    }
  }

  return (
    <div className='w-full md:w-1/2 p-6'>
      <div className=' rounded-2xl shadow-md p-6 transition-all hover:shadow-xl'>
        <div className='flex flex-col items-center'>
          <div className='relative mb-6 group'>
            <div className='w-32 h-32 md:w-40 md:h-40 rounded-full overflow-hidden border-4 border-gray-800'>
              {avatarUrl ? (
                <img 
                  src={avatarUrl} 
                  alt='프로필 이미지'
                  className='w-full h-full object-cover'
                />
              ) : (
                <div className='w-full h-full bg-gradient-to-r from-gray-700 to-gray-800 flex items-center justify-center'>
                  <span className='text-2xl text-gray-300'>프로필</span>
                </div>
              )}
            </div>
            <div className='absolute inset-0 bg-black bg-opacity-50 rounded-full opacity-0 group-hover:opacity-100 flex items-center justify-center transition-all cursor-pointer'>
              <span className='text-white text-sm'>변경하기</span>
            </div>
            <input
              type='file'
              accept='image/*'
              onChange={uploadAvatar}
              disabled={uploading}
              className='absolute inset-0 opacity-0 cursor-pointer'
            />
          </div>
          
          {uploading && 
            <div className='text-gray-300 animate-pulse'>업로드 중...</div>
          }
          
          <p className='text-gray-400 mt-2 text-center'>
            프로필 이미지를 클릭하여 변경할 수 있습니다
          </p>
        </div>
      </div>
    </div>
  )
}
