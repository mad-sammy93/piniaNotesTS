import { defineStore } from "pinia";
import axios from 'axios'
import router from '@/router/index'
import { UserInfo, Auth , AuthStoreState} from '@/types';


    // interface AuthState {
    //     id: number,
    //     name: string,
    //     accessToken: string,
    //     isAuthenticated: boolean,
    //     error: string,
    //     user: UserInfo | null
    // }
    
    // type AuthStoreState ={
    //     loading: boolean
    //     accessToken: string
    //     refreshTokenTimeout: number
    //     isAuthenticated: boolean,
    //     error: string
    //     user: UserInfo | null
    // }

// const user = localStorage.getItem('user');
// const userState = user ? { status: { loggedIn: true }, user }
//   : { status: { loggedIn: false }, user: null };
    // interface authState {
    //     id: number,
    //     name: string,
    //     accessToken: string,
    //     isAuthenticated: boolean,
    //     error: string,
    //     user:UserInfo | null
    // }
  
export const useAuthStore = defineStore({ 
    id: 'authStore',
    state: (): AuthStoreState  => ({
        loading: false,
        accessToken: '',
        isAuthenticated: false,
        refreshTokenTimeout: 0,
        error : '',
        user:  null,
    }),

    actions: {
        async login(payload: Auth) {
                let result = await axios.post( '/auth/login' ,payload,{ 
                    withCredentials: true,
                }) .then(response => {

                    // console.log(result.status)
                    // this.startRefreshTokenTimer()        
                    const { accessToken } = response.data;

                    // axios.defaults.headers.common['Authorization'] = `Bearer ${accessToken}`
                    // console.log(axios.defaults.headers.common['Authorization'])
                    // this.user = response
                    this.accessToken = accessToken
                    localStorage.setItem('accessToken', accessToken);
                    // localStorage.setItem('user', JSON.stringify(this.user))
                    this.isAuthenticated = true;
                    // this.user = {name:payload.email};
                    // startRefreshTokenTimer()
                    
                    //Getting info from auth token since we dont have a user endpoint
                    this.getUserInfo()
                    router.push('/')
                })
                .catch(error => {
                    
                    console.warn('Login failed:', error);
                    this.error = error.message || 'Something went wrong'
                })
                .finally(() => this.loading = false)

              
        },
        getUserInfo() {
            // parse json object from base64 encoded jwt token
            const jwtBase64 = this.accessToken.split('.')[1];
            const jwtToken = JSON.parse(atob(jwtBase64));
            // console.log(jwtToken)
    
            // set a timeout to refresh the token a minute before it expires
            const expires = new Date(jwtToken.exp * 1000);
            const timeout = expires.getTime() - Date.now() - (60 * 1000);
            this.refreshTokenTimeout = setTimeout(this.authToken, timeout);

            // console.log(this.refreshTokenTimeout)
            this.user = jwtToken
            localStorage.setItem('user', JSON.stringify(jwtToken));
        },
        async signup(payload: Auth) {
            // console.log(payload.name)
            if(payload.email === '' || !payload.email.includes('@') || payload.password.length < 6){
                this.formIsValid = false
            }
            
                let result = await axios.post("/auth/register", payload ,
                )
                .then(response => {
                    // console.log(response.data)
                    // this.tasks = response.data

                    //TODO implement activation code, verify link
                    // user.sendEmailVerification(actionCodeSettings);
                })
                .catch(error => {
                    console.log(error)
                    this.error = error.message || 'Somethign went wrong'
                    // this.errored = true
                })
                .finally(() => this.loading = false)

                result
                console.debug(result);
        },
        logout() {
            localStorage.removeItem('accessToken')
            localStorage.removeItem('user')

            localStorage.removeItem('authStore')
            localStorage.removeItem('taskStore')
            
            //If there was a logout endpoint
            // axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
            this.accessToken = null
            this.isAuthenticated = false
            this.user = null
            router.push('/login')
            this.error = 'Logged Out'
          },

        hello(name:any){
            console.log(name)
            // refreshToken()
            // return 'hello '+name;
        }
    },

    getters: {
        isLoggedIn: (state) => state.isAuthenticated,
        // currentUser: (state) => state.user,
    },
    mutations:{
        user(state:any,user :UserInfo){
            state.user = user
        }
    }
    // persist: true

})