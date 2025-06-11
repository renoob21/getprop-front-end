const IS_DEF = location.hostname === "127.0.0.1" || location.hostname === "localhost";

const API_BASE_URL = IS_DEF 
                        ? "http://127.0.0.1:3000"
                        : "https://api.senengoding.com";


window.CONFIG = {
    API_BASE_URL
}

function debounce(func, delay) {
  let timeoutId;
  return function(...args) {
    clearTimeout(timeoutId);
    timeoutId = setTimeout(() => {
      func.apply(this, args);
    }, delay);
  };
}

function isLeapYear(year) {
    return (year % 4 === 0 && year % 100 !== 0) || (year % 400 === 0);
}