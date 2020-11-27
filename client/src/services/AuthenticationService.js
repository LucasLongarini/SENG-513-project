
import Axios from 'axios';

const tokenName = 'token';
const displayName = 'displayName';
const emojiName = 'emojiId';

const AuthenticationService = {

    // Token methods
    isAuthenticated() {
        return localStorage.getItem(tokenName);    
    },

    verifyToken: () => {
        var promise = new Promise((resolve, reject) => {

            let token = localStorage.getItem(tokenName);
            if (!token) {
                reject(Error("No token"));
                return;
            }

            Axios.get('/user/verify', {
                headers: {
                    'token': token
                }
            })
            .then(() => {
                resolve("Token is valid")
            })
            .catch(() => {
                reject(Error("Token is not valid"))
            })
                
        });
        return promise;
    },

    saveToken(token){
        localStorage.setItem(tokenName, token);
    },

    deleteToken() {
        localStorage.removeItem(tokenName);
    },

    getToken() {
        return localStorage.getItem(tokenName);
    },

    // User object methods
    saveDisplayName(name) {
        localStorage.setItem(displayName, name);
    },

    getDisplayName() {
        return localStorage.getItem(displayName);
    },

    deleteDisplayName() {
        localStorage.removeItem(displayName);
    },

    saveEmojiId(id) {
        localStorage.setItem(emojiName, `${id}`);
    },

    getEmojiId() {
        return parseInt(localStorage.getItem(emojiName));
    },

    deleteEmojiId() {
        localStorage.removeItem(emojiName);
    },
    
};

export default AuthenticationService;