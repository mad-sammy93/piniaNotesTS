import { createPinia,PiniaPluginContext } from 'pinia'
import { createApp, watch, defineAsyncComponent } from 'vue'
import App from '@/App.vue'
import '@/interceptors/axios';
// import { AuthStore } from '@/types'

import router from './router/index';
// import store from './stores/Task/TaskStore.js';

import './assets/main.css'
const TheModal = defineAsyncComponent(() => import('@/components/UI/TheModal.vue'));
const StatusBar = defineAsyncComponent(() => import('@/components/UI/StatusBar.vue'));
const BaseButton = defineAsyncComponent(() => import('@/components/UI/BaseButton.vue'));

const pinia = createPinia()
const app = createApp(App);

// watch(
//   pinia.state,
//   (state) => {
//     localStorage.setItem("user", JSON.stringify(state.user));
//   },
//   { deep: true }
// );


pinia.use((context: PiniaPluginContext)=> {

    const storeId = context.store.$id;

    const serializer = {
        serialize:JSON.stringify,
        deserialize:JSON.parse
    }

    // sync store from local Storage
    const fromStorage:any = serializer.deserialize(window.localStorage.getItem(storeId))

    //BUG fix type
    // console.log(fromStorage);
    if(fromStorage){
        context.store.$patch(fromStorage)

    }

    //listen for changes and updated local storage
    context.store.$subscribe((mutation,state) => {
        console.log(mutation,state)
        window.localStorage.setItem(storeId,serializer.serialize(state))
    })
})

app.use(pinia);
app.use(router);
app.component('the-modal', TheModal);
app.component('status-bar', StatusBar);
app.component('base-button', BaseButton);

// app.use(store);

// register task store

app.mount('#app');

