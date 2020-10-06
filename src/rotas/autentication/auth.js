export const isAuthenticated = (props, origem) => {
  if (origem === 'login') {
    return false;
  } else {
    return props;
  }

};