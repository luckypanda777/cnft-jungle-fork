// import * as dotenv from 'dotenv';
//
// let path;
// switch (process.env.NODE_ENV) {
//   case 'test':
//     break;
//   case 'development':
//     path = '@root/.env.local';
//     break;
//   case 'production':
//     break;
//   default:
//     path = '@root/.env.local';
// }
// dotenv.config({ path });

const GOOGLE_ANALYTICS_ID =
  process.env.NEXT_PUBLIC_REACT_APP_GOOGLE_ANALYTICS_ID ||
  process.env.REACT_APP_GOOGLE_ANALYTICS_ID ||
  'UA-213380789-3';
const API_URL = process.env.NEXT_PUBLIC_REACT_APP_API_URL || REACT_APP_API_URL;
const HEROKU_URL = process.env.NEXT_PUBLIC_HEROKU_APP_API_URL;
// const API_URL = 'https://cnft-predator-staging-mqorspvwja-lz.a.run.app';
const SNIPE_URL =
  process.env.NEXT_PUBLIC_SNIPE_URL || 'https://29c08bbaf23a.ngrok.io';
// const SNIPE_URL= 'publicapi.cnftpredator.tools
// const JPG_URL = 'https://server.jpgstoreapis.com';
const JPG_URL = 'https://staging.jpgstoreapis.com';

export { API_URL, GOOGLE_ANALYTICS_ID, SNIPE_URL, JPG_URL, HEROKU_URL };
