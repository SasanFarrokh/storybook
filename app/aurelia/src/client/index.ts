export * from './preview';

declare const module: any;
if (typeof module !== 'undefined' && module.hot && module.hot.decline) {
  module.hot.decline();
}
