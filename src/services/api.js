// Legacy alias – uses shared axios client
import apiClient, { setAuthToken } from './apiClient';

export { setAuthToken };
export default apiClient;
