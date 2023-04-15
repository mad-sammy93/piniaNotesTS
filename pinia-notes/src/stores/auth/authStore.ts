import { ref } from 'vue'
import { defineStore } from "pinia";
import axios, {AxiosError} from 'axios'
import router from '@/router/index'
import { UserInfo } from '@/types';


   
  
export const useAuthStore = defineStore('authStore',() =>{ 
    // id: 'authStore',
    // state: (): AuthStoreState  => ({
    //     loading: false,
    //     accessToken: '',
    //     isAuthenticated: false,
    //     refreshTokenTimeout: 0,
    //     error : '',
    //     user:  null,
    // }),

    //state
    const loading = ref<boolean>(false)
    const accessToken = ref<string>('')
    const isAuthenticated = ref<boolean>(false)
    const refreshTokenTimeout = ref<number>(0)
    const error = ref<string>('')
    const user = ref<UserInfo|null>(null)

    const login = async (payload: any) => {
      // Set loading state to true
      loading.value = true;
    
      try {
        // Send login request to API endpoint with `withCredentials` option set to true
        const response = await axios.post('/auth/login', payload, {
          withCredentials: true,
        });
    
        console.log(response);
    
        // Set access token in Vue reactive data and local storage
        accessToken.value = response.data.accessToken;
        localStorage.setItem('accessToken', accessToken.value);
    
        // Set isAuthenticated flag to true
        isAuthenticated.value = true;
    
        // Get user info from auth token
        getUserInfo();
    
        // Redirect user to home page
        router.push('/');
      } catch (error) {
        const err = error as AxiosError
        console.log(err.response?.data)
      } finally {
        // Set loading state to false
        loading.value = false;
      }
    };
        const getUserInfo = () => {
            // parse json object from base64 encoded jwt token
            const jwtBase64 = accessToken.value.split('.')[1];
            const jwtToken = JSON.parse(atob(jwtBase64));
            // console.log(jwtToken)

            // set a timeout to refresh the token a minute before it expires
            const expires = new Date(jwtToken.exp * 1000);
            const timeout = expires.getTime() - Date.now() - (60 * 1000);
            refreshTokenTimeout.value = setTimeout(accessToken.value, timeout);

            // console.log(this.refreshTokenTimeout)
            user.value = jwtToken
            localStorage.setItem('user', JSON.stringify(jwtToken));
        }

        const signup =  async (payload: any) => {
            if(payload.email === '' || !payload.email.includes('@') || payload.password.length < 6){
                // formIsValid.value = false
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
                    error.value = error.message || 'Something went wrong'
                    // this.errored = true
                })
                .finally(() => loading.value = false)

                result
                console.debug(result);
        }

        const logout = () => {
                localStorage.removeItem('accessToken')
                localStorage.removeItem('user')
    
                localStorage.removeItem('authStore')
                localStorage.removeItem('taskStore')
                
                //If there was a logout endpoint
                // axios.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
                accessToken.value = ''
                isAuthenticated.value = false
                user.value = null
                router.push('/login')
                error.value = 'Logged Out'
    
        }

    

    // getters: {
    //     isLoggedIn: (state) => state.isAuthenticated,
    //     // currentUser: (state) => state.user,
    // },
    // mutations:{
    //     user(state:any,user :UserInfo){
    //         state.user = user
    //     }
    // }
    // persist: true
    return {
        loading,
        isAuthenticated,
        accessToken,
        refreshTokenTimeout,
        user,
        login,
        getUserInfo,
        signup,
        logout
      }
})