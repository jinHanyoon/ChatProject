import dayjs from 'dayjs';
import 'dayjs/locale/ko.js';
import relativeTime from 'dayjs/plugin/relativeTime.js';
   // 1. 년-월-일 시:분:초
  // const messageTime = dayjs().format('YYYY-MM-DD HH:mm:ss');
  // 2. 시:분 (24시간)
  // const messageTime = dayjs().format('HH:mm');  // 14:30

  // 3. 시:분 (12시간) + AM/PM
  // const messageTime = dayjs().format('hh:mm A');  // 02:30 PM

  // 4. 월일 시:분
  // const messageTime = dayjs().format('MM/DD HH:mm');  // 03/21 14:30

  // 5. 요일 시:분
  // const messageTime = dayjs().format('ddd HH:mm');  // 목 14:30

dayjs.extend(relativeTime);
dayjs.locale('ko');

export default dayjs;