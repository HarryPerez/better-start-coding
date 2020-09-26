import qs from 'qs';

export const getQueryParams = queryString => qs.parse(queryString, { ignoreQueryPrefix: true });

export const getQueryString = queryObject => qs.stringify(queryObject, { addQueryPrefix: true });

export const stripTrailingSlash = str => (str.endsWith('/') ? str.slice(0, -1) : str);
