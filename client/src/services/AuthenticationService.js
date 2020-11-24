
import Axios from 'axios';

const AuthenticationService = {
    isAuthenticated: false,

    verifyToken: () => {
        var promise = new Promise((resolve, reject) => {

            let token = localStorage.getItem('token');
            if (!token) {
                reject(Error("No token"));
                return;
            }

            Axios.get('/user/verify', {
                headers: {
                    'token': token
                }
            })
            .then(() => resolve("Token is valid"))
            .catch(() => reject(Error("Token is not valid")))
                
        });
        return promise;
    },
    
};

export default AuthenticationService;