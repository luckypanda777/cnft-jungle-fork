import GoogleAnalytics from 'react-ga';
import { GOOGLE_ANALYTICS_ID } from '.';

function init() {
  // Enable debug mode on the local development environment
  const isDev = !process.env.NODE_ENV || process.env.NODE_ENV === 'development';

  if (isDev) return;

  GoogleAnalytics.initialize(GOOGLE_ANALYTICS_ID, { debug: isDev });
}

function sendEvent(payload) {
  GoogleAnalytics.event(payload);
}

function sendPageview(path) {
  GoogleAnalytics.set({ page: path });
  GoogleAnalytics.pageview(path);
}

const eventTrack = (category, action, label) => {
  try {
    console.log('GA event:', category, ':', action, ':', label);
    GoogleAnalytics.event({ category, action, label });
  } catch (err) {
    console.log('GA event error:', err);
  }
};

export { init, sendEvent, sendPageview, eventTrack };
