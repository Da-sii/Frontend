// 길이: 8~20자
export const isLen8to20 = (t: string) => /^.{8,20}$/.test(t);

// 영문 + 숫자 + 특수문자 포함, 공백 없음
export const hasPasswordComposition = (t: string) => {
  const hasLetter = /[A-Za-z]/.test(t);
  const hasNumber = /\d/.test(t);
  const hasSpecial = /[^A-Za-z0-9]/.test(t);
  const noSpace = !/\s/.test(t);

  return hasLetter && hasNumber && hasSpecial && noSpace;
};
// 이메일 형식
export const isEmail = (t: string) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t);

// 비밀번호 일치 확인
export const isSamePassword = (pw: string, confirm: string) => pw === confirm;

// 휴대폰 번호 하이픈 포맷 (숫자만 입력받아 010-0000-0000 형태로)
export const formatPhoneNumber = (phone: string) => {
  const digits = phone.replace(/\D/g, '');

  if (digits.length <= 3) return digits; // 010
  if (digits.length <= 7) return `${digits.slice(0, 3)}-${digits.slice(3)}`; // 010-0000
  return `${digits.slice(0, 3)}-${digits.slice(3, 7)}-${digits.slice(7)}`;
};

// 휴대폰 번호 형식 (010으로 시작하는 11자리 숫자)
export const isValidPhoneNumber = (phone: string) =>
  phone.length === 11 && phone.slice(0, 3) === '010';
