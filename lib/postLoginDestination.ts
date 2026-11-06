import AsyncStorage from '@react-native-async-storage/async-storage';

const POST_LOGIN_DESTINATION_KEY = 'postLoginDestination';

type PostLoginDestination = '/recommendation/survey';

/**
 * Stores the in-app destination before showing the login flow. Keeping this
 * outside route params lets Kakao, Apple, and email login share the same
 * behaviour even when their auth flows pass through intermediate screens.
 */
export async function setPostLoginDestination(
  destination: PostLoginDestination,
) {
  await AsyncStorage.setItem(POST_LOGIN_DESTINATION_KEY, destination);
}

/** Returns the saved destination once, and removes it to prevent stale redirects. */
export async function consumePostLoginDestination() {
  const destination = await AsyncStorage.getItem(POST_LOGIN_DESTINATION_KEY);
  await AsyncStorage.removeItem(POST_LOGIN_DESTINATION_KEY);

  return destination === '/recommendation/survey' ? destination : '/home';
}

export async function clearPostLoginDestination() {
  await AsyncStorage.removeItem(POST_LOGIN_DESTINATION_KEY);
}
