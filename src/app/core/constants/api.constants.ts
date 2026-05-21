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
    CREATE: `${API_BASE_URL}/notifications/test`,
  },
  MY_INFO: {
    GET_ALL: `${API_BASE_URL}/chat/conversations`,
  },
  USER: {
    GET_ALL: `${API_BASE_URL}/users`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/users/${id}`,
    CREATE: `${API_BASE_URL}/users`,
    DELETE: (id: number) => `${API_BASE_URL}/users/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/users/${id}`,
  },
  ROLE: {
    GET_ALL: `${API_BASE_URL}/roles`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/roles/${id}`,
    CREATE: `${API_BASE_URL}/roles`,
    DELETE: (id: number) => `${API_BASE_URL}/roles/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/roles/${id}`,
    UPDATE_PERMISSIONS: (id: number) => `${API_BASE_URL}/roles/${id}/permissions`,
  },
  PERMISSIONS: {
    GET_ALL: `${API_BASE_URL}/permissions`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/permissions/${id}`,
    CREATE: `${API_BASE_URL}/permissions`,
    DELETE: (id: number) => `${API_BASE_URL}/permissions/${id}`,
    UPDATE: (id: number) => `${API_BASE_URL}/permissions/${id}`,
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
    FIND_BY_ID: (id: number) => `${API_BASE_URL}/cms/items/${id}`,
    CREATE: `${API_BASE_URL}/cms/items`,
    SEARCH: (name: string) => `${API_BASE_URL}/cms/items?name=${name}`,
    DELETE: (id: number) => `${API_BASE_URL}/cms/items/${id}`,
  },
  TEAM_COMPS: {
    GET_ALL: `${API_BASE_URL}/cms/team-comp`,
    CREATE: `${API_BASE_URL}/cms/team-comp`,
    DELETE: (id: number) => `${API_BASE_URL}/cms/team-comp/${id}`,
  },
  CHAMPION: {
    GET_ALL: `${API_BASE_URL}/cms/champs/admin/search`,
    GET_BY_ID: (id: number) => `${API_BASE_URL}/cms/champs/${id}`,
    GET_BY_SET: (setId: number) => `${API_BASE_URL}/cms/champs/set/${setId}`,
    DELETE: (id: number) => `${API_BASE_URL}/cms/champs/${id}`,
    BULK_DELETE: `${API_BASE_URL}/cms/champs/bulk`,
  },
  TRAIT: {
    GET_ALL: `${API_BASE_URL}/cms/traits/admin/search`,
    DELETE: (id: number) => `${API_BASE_URL}/cms/traits/${id}`,
    BULK_DELETE: `${API_BASE_URL}/cms/traits/bulk`,
  },

} as const;
