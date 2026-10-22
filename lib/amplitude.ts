import * as amplitude from '@amplitude/analytics-react-native';

type EventProperties = Record<
  string,
  string | number | boolean | null | undefined
>;

export type AuthMethod = 'email' | 'kakao' | 'apple';

export const AMPLITUDE_EVENTS = {
  signupCompleted: 'Signup Completed',
  loginSucceeded: 'Login Succeeded',
  productViewed: 'Product Viewed',
  addToCart: 'Add To Cart',
  checkoutStarted: 'Checkout Started',
  purchaseCompleted: 'Purchase Completed',
} as const;

let initializationPromise: Promise<void> | null = null;
let appOpenedTracked = false;

// Amplitude API keys are public client identifiers. Keep environment variables
// as the first choice, but provide build-mode defaults so that an iOS Archive
// created directly in Xcode does not silently disable analytics.
const DEVELOPMENT_API_KEY = 'b1f1b4ff82698972912b1f2de0613f46';
const PRODUCTION_API_KEY = '281f16334bb8f2773f2d13dab05612d2';

function getAmplitudeApiKey(): string {
  return (
    process.env.EXPO_PUBLIC_AMPLITUDE_API_KEY ||
    (__DEV__ ? DEVELOPMENT_API_KEY : PRODUCTION_API_KEY)
  );
}

function isAmplitudeConfigured(): boolean {
  return Boolean(getAmplitudeApiKey());
}

export function initializeAmplitude(): Promise<void> {
  if (initializationPromise) return initializationPromise;

  const apiKey = getAmplitudeApiKey();

  initializationPromise = amplitude.init(apiKey).promise;
  return initializationPromise;
}

export async function trackEvent(
  eventName: string,
  properties?: EventProperties,
): Promise<void> {
  await initializeAmplitude();
  if (!isAmplitudeConfigured()) return;
  amplitude.track(eventName, properties);
}

export async function trackAppOpened(
  properties?: EventProperties,
): Promise<void> {
  if (appOpenedTracked) return;

  await trackEvent('App Opened', properties);
  appOpenedTracked = true;
}

export function trackSignupCompleted(signupMethod: AuthMethod): Promise<void> {
  return trackEvent(AMPLITUDE_EVENTS.signupCompleted, {
    signup_method: signupMethod,
  });
}

export function trackLoginSucceeded(loginMethod: AuthMethod): Promise<void> {
  return trackEvent(AMPLITUDE_EVENTS.loginSucceeded, {
    login_method: loginMethod,
  });
}

export function trackProductViewed(properties: {
  productId: string | number;
  category: string;
  price: number | null;
}): Promise<void> {
  return trackEvent(AMPLITUDE_EVENTS.productViewed, {
    product_id: properties.productId,
    category: properties.category,
    price: properties.price,
  });
}

export function trackAddToCart(properties: {
  productId: string | number;
  price: number;
  quantity: number;
}): Promise<void> {
  return trackEvent(AMPLITUDE_EVENTS.addToCart, {
    product_id: properties.productId,
    price: properties.price,
    quantity: properties.quantity,
  });
}

export function trackCheckoutStarted(properties: {
  cartValue: number;
  itemCount: number;
}): Promise<void> {
  return trackEvent(AMPLITUDE_EVENTS.checkoutStarted, {
    cart_value: properties.cartValue,
    item_count: properties.itemCount,
  });
}

export function trackPurchaseCompleted(properties: {
  amount: number;
  itemCount: number;
  paymentMethod: string;
}): Promise<void> {
  return trackEvent(AMPLITUDE_EVENTS.purchaseCompleted, {
    amount: properties.amount,
    item_count: properties.itemCount,
    payment_method: properties.paymentMethod,
  });
}

export async function identifyAmplitudeUser(userId: string): Promise<void> {
  await initializeAmplitude();
  if (!isAmplitudeConfigured()) return;
  amplitude.setUserId(userId);
}

export async function setAmplitudeUserProperties(
  properties: EventProperties,
): Promise<void> {
  await initializeAmplitude();
  if (!isAmplitudeConfigured()) return;

  const identify = new amplitude.Identify();
  Object.entries(properties).forEach(([key, value]) => {
    if (value !== undefined && value !== null) identify.set(key, value);
  });
  amplitude.identify(identify);
}

export async function resetAmplitudeUser(): Promise<void> {
  await initializeAmplitude();
  if (!isAmplitudeConfigured()) return;
  amplitude.reset();
}
