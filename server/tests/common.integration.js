import p from '../../package';
import config from '../../config/config';

const version = p.version.split('.').shift();
export const baseURL = (version > 0 ? `/api/v${version}` : '/api');
export const auth = config.testToken;
export { default as app } from '../../index';
