declare module 'leo-profanity' {
  interface LeoProfanity {
    clean: (text: string) => string;
    check: (text: string) => boolean;
    add: (words: string[] | string) => void;
    clearList: () => void;
    remove: (words: string[] | string) => void;
    list: () => string[];
    loadDictionary: (lang?: string) => void;
  }

  const leoProfanity: LeoProfanity;
  export default leoProfanity;
}
