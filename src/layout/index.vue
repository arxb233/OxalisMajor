<script setup lang="ts">
import { ref, reactive, toRefs } from "vue";

//底部tab栏相关
const useTabBar = () => {
  const state = reactive({
    tabBar: [
      {
        title: "首页",
        to: {
          name: "Home",
        },
        icon: "home-o",
      },
      {
        title: "志愿",
        to: {
          name: "Major",
        },
        icon: "user-o",
      },
      {
        title: "招生",
        to: {
          name: "Plan",
        },
        icon: "user-o",
      },
      {
        title: "关于",
        to: {
          name: "About",
        },
        icon: "user-o",
      },
    ],
  });
  return toRefs(state);
};
const { tabBar } = useTabBar();

const handleChange = (value) => {
  // console.log(value,'valueeeeeee');
};
</script>

<template>
  <div class="app-container">
    <div class="layout-content">
      <keep-alive v-if="$route.meta.keepAlive">
        <router-view></router-view>
      </keep-alive>
      <router-view v-else></router-view>
      <RequestLoading></RequestLoading>
    </div>
    <div class="layout-footer">
      <TabBar :data="tabBar" @chang="handleChange"></TabBar>
    </div>
  </div>
</template>

<style lang="scss" scoped>
</style>