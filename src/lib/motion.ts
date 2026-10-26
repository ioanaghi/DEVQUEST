import { useSyncExternalStore } from 'react';
const preference = window.matchMedia('(prefers-reduced-motion: reduce)');
export const motionReduced = () => preference.matches;
export function useReducedMotion() {
  return useSyncExternalStore((callback) => {
    preference.addEventListener('change', callback);
    return () => preference.removeEventListener('change', callback);
  }, motionReduced);
}
