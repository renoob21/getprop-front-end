const IS_DEF = location.hostname === "127.0.0.1" || location.hostname === "localhost";

const API_BASE_URL = IS_DEF 
                        ? "http://127.0.0.1:3000"
                        : "https://api.senengoding.com";


window.CONFIG = {
    API_BASE_URL
}