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
