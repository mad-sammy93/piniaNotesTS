<script setup lang="ts">
// import { storeToRefs } from 'pinia';
import { computed,watch } from 'vue';
import { RouterView } from 'vue-router'
import { useAuthStore } from '@/stores/auth/authStore';
import { ref } from 'vue';

import { AuthStore } from '@/types'
// const { user } = storeToRefs( useAuthStore )

  // interface User {
  //   name: string;
  //   email: string;
  //   // other user properties
  // }
  // interface AuthStore {
  //   isAuthenticated: boolean;
  //   user: User | null;
  //   logout: () => void;
  //   // other auth store methods
  // }
    const authStore: Store  = useAuthStore();
    const handleLogout = (): void  => {
      authStore.logout();
    }
    // const refreshToken = () => {
    //   authStore.refreshToken();
    // }
    const isLoggedIn = computed<boolean>(() => authStore.isAuthenticated);
    // const currentUser = computed(<User | null>() => authStore.user);

    watch(isLoggedIn, (isLoggedIn: boolean) => {
      if (isLoggedIn) {
        console.log('User is logged in.');
      } else {
        console.log('User is logged out.');
      }
    });
    console.log(import.meta.url)

    // return {
    //   // users,
    //   // isModalVisible,
    //   authStore,
    //   isLoggedIn,
    //   // currentUser,
    //   // userState,
    //   // refreshToken,
    //   handleLogout
    // }
</script>

<template>
  <main>
    <header>
      <img src="@/assets/logo.svg" alt="">
      <h1>Pinia Tasks</h1>
      <!-- <button @click="authStore.hello('refresh')" >refresh</button>

      <button @click="authStore.startRefreshTokenTimer()" >refreshTimer</button> -->
      <!-- <base-button @click="authStore.getState()" >get info</base-button> -->
    </header>
    <status-bar v-if="isLoggedIn">Hello {{ authStore.user.name }}
      <base-button class="logout__button" @click="handleLogout" v-show="isLoggedIn">Logout</base-button>
    </status-bar>
    
    <RouterView />
  </main>
</template>
