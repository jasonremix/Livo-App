import * as WebBrowser from 'expo-web-browser';

export const SITE_URL = 'https://mylivo.app';

export const LINKS = {
  website: `${SITE_URL}/`,
  checkoutPlus: `${SITE_URL}/checkout?plan=plus`,
  credits: `${SITE_URL}/credits`,
  support: `${SITE_URL}/support`,
  impressum: `${SITE_URL}/impressum`,
  datenschutz: `${SITE_URL}/datenschutz`,
  agb: `${SITE_URL}/agb`,
  ersteHilfe: `${SITE_URL}/erste-hilfe`,
} as const;

export function openLink(url: string) {
  return WebBrowser.openBrowserAsync(url).catch(() => undefined);
}
