import { ADDON_ID, PANEL_ID } from './events';

export { ADDON_ID, PANEL_ID };

if (typeof module !== 'undefined' && module.hot && module.hot.decline) {
  module.hot.decline();
}
