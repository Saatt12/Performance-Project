const demoWeb = 'https://ecomm.gatling.io';
const demoApi = 'https://api-ecomm.gatling.io';
const publicHost = /^https?:\/\/(?:[^/?#@]+@)?(?:[^./?#:]+\.)*gatling\.io\.?(?=[:/?#]|$)/i;
export const web = (__ENV.WEB_URL || demoWeb).replace(/\/+$/, '');
export const api = (__ENV.API_URL || demoApi).replace(/\/+$/, '');
export const demo = publicHost.test(web) || publicHost.test(api);
