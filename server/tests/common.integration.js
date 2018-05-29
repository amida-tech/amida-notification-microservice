import p from '../../package';
import config from '../../config/config';

const version = p.version.split('.').shift();
export const baseURL = (version > 0 ? `/api/v${version}` : '/api');
export const auth = config.testToken;
export const auth2 = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VybmFtZSI6InVzZXIyIiwiZW1haWwiOiJ0ZXN0QHRlc3QuY29tIiwiYWRtaW4iOnRydWV9.IXN3UeBdUHLxVLHEk9a7IuY6DVQcnuA8ykxRR6JdC_k';
export { default as app } from '../../index';
