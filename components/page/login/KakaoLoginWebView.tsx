// components/KakaoLoginWebView.tsx
import React, { useMemo, useRef, useCallback } from 'react';
import { Modalize } from 'react-native-modalize';
import WebView, { WebViewNavigation } from 'react-native-webview';
import { View } from 'react-native';

type Props = {
  visible: boolean;
  onClose: () => void;
  // code를 부모로 넘겨서 토큰 교환을 하도록
  onAuthCode: (code: string) => void;
};

export default function KakaoLoginWebView({
  visible,
  onClose,
  onAuthCode,
}: Props) {
  const modalRef = useRef<Modalize>(null);

  const REST_KEY = process.env.EXPO_PUBLIC_KAKAO_REST_API_KEY!;
  const REDIRECT_URI = process.env.EXPO_PUBLIC_KAKAO_REDIRECT_URI!;
  const authUrl = useMemo(
    () =>
      `https://kauth.kakao.com/oauth/authorize` +
      `?client_id=${REST_KEY}` +
      `&redirect_uri=${encodeURIComponent(REDIRECT_URI)}` +
      `&response_type=code`,
    [REST_KEY, REDIRECT_URI],
  );

  const extractCode = (url: string) => {
    const u = new URL(url);
    return u.searchParams.get('code');
  };

  // iOS/Android 모두 동작하는 가로채기 포인트
  const onShouldStartLoadWithRequest = useCallback(
    (req: WebViewNavigation) => {
      if (req.url.startsWith(REDIRECT_URI)) {
        const code = extractCode(req.url);
        if (code) {
          onAuthCode(code); // 부모에서 토큰 교환
          onClose(); // 모달 닫기
        }
        return false; // 리다이렉트 페이지를 실제로 로드하지 않음(빈 화면 방지)
      }
      return true;
    },
    [REDIRECT_URI, onAuthCode, onClose],
  );

  // 보조: 일부 환경에서 트리거가 여기로만 오는 경우 대비
  const onNavChange = useCallback(
    (nav: WebViewNavigation) => {
      if (nav.url.startsWith(REDIRECT_URI)) {
        const code = extractCode(nav.url);
        if (code) {
          onAuthCode(code);
          onClose();
        }
      }
    },
    [REDIRECT_URI, onAuthCode, onClose],
  );

  // 모달 표시/숨김
  React.useEffect(() => {
    visible ? modalRef.current?.open() : modalRef.current?.close();
  }, [visible]);

  return (
    <Modalize ref={modalRef} onClosed={onClose} adjustToContentHeight>
      <View style={{ height: 700 }}>
        <WebView
          source={{ uri: authUrl }}
          onNavigationStateChange={onNavChange}
          onShouldStartLoadWithRequest={onShouldStartLoadWithRequest}
          javaScriptEnabled
          originWhitelist={['*']}
        />
      </View>
    </Modalize>
  );
}
