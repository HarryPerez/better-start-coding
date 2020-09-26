/* Code source -> https://www.w3schools.com/js/js_cookies.asp */

const dateOnMilliseconds = 86400000;

export const setCookie = (name, value, expireDate) => {
  const date = new Date();

  date.setTime(date.getTime() + expireDate * dateOnMilliseconds);

  const expires = `expires=${date.toUTCString()}`;

  document.cookie = `${name}=${value};${expires}`;
};

export const getCookie = cname => {
  const name = `${cname}=`;
  let decodedCookie = '';

  try {
    decodedCookie = decodeURIComponent(document.cookie);
  } catch {
    return '';
  }

  const ca = decodedCookie.split(';');

  for (let i = 0; i < ca.length; i++) {
    let c = ca[i];

    while (c.charAt(0) === ' ') {
      c = c.substring(1);
    }

    if (c.indexOf(name) === 0) {
      return c.substring(name.length, c.length);
    }
  }

  return '';
};

export const deleteCookie = cname => {
  document.cookie = `${cname}=;expires=Thu, 01 Jan 1970 00:00:01 GMT;`;
};
