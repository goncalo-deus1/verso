// src/lib/pixel.ts
declare global {
  interface Window {
    fbq?: (...args: unknown[]) => void;
  }
}

export const trackPixelEvent = (
  eventName: string,
  params?: Record<string, unknown>
) => {
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('track', eventName, params);
};

export const trackCompleteRegistration = (params?: Record<string, unknown>) => {
  trackPixelEvent('CompleteRegistration', params);
};

export const trackQuizCompleted = (params?: Record<string, unknown>) => {
  // Custom event — useful as a mid-funnel signal even if user doesn't register
  if (typeof window === 'undefined' || !window.fbq) return;
  window.fbq('trackCustom', 'QuizCompleted', params);
};

export {};
