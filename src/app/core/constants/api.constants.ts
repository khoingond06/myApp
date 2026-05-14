export const API_BASE_URL = 'http://172.16.16.50:8888/api/v1';

export const API_ENDPOINTS = {
  AUTH: {
    SIGN_IN: `${API_BASE_URL}/auth2/signin`,
    SIGN_UP: `${API_BASE_URL}/auth2/signup`,
    REFRESH_TOKEN: `${API_BASE_URL}/auth2/refresh`,  
    LOGOUT: `${API_BASE_URL}/auth2/logout`,
  },
  NOTIFICATION: {
    GET_ALL: `${API_BASE_URL}/notifications`,
  },
  MY_INFO: {
    GET_ALL: `${API_BASE_URL}/chat/conversations`,
  },
  USER: {
    GET_ALL: `${API_BASE_URL}/users`,
  },
  SET: {
    GET_ALL: `${API_BASE_URL}/cms/sets`,
    CREATE: `${API_BASE_URL}/cms/sets`,
    DELETE: (id: number) => `${API_BASE_URL}/cms/sets/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/cms/sets/${id}`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/cms/sets/${id}`,
  },
  ITEMS: {
    GET_ALL: `${API_BASE_URL}/cms/items`,
    CREATE: `${API_BASE_URL}/cms/items`,
    SEARCH: (name: string) => `${API_BASE_URL}/cms/items?name=${name}`,
    DELETE: (id: number) => `${API_BASE_URL}/cms/items/${id}`,  
  },
  TEAM_COMPS: {
    GET_ALL: `${API_BASE_URL}/cms/team-comp`,
  },
} as const;
