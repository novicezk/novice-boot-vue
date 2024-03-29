# novice-boot-vue

用于构建基于novice-boot-vue的项目，示例 [https://github.com/novicezk/novice-boot-vue-demo](https://github.com/novicezk/novice-boot-vue-demo)
1. 初始化项目
```shell
# vue cli 4.5+
vue create novice-boot-vue-demo
# select vue3
```
2. 修改 `package.json`
```json
  "dependencies": {
    "novice-boot-vue": "^1.0.7",
    "@kangc/v-md-editor": "^2.2.2",
    "ant-design-vue": "^2.1.0",
    "axios": "^0.21.1",
    "core-js": "^3.9.1",
    "less": "^3.13.0",
    "less-loader": "^7.1.0",
    "vue": "^3.0.7",
    "vue-router": "^4.0.5",
    "vuedraggable": "^4.0.1",
    "vuex": "^4.0.0"
  },
```
3. 修改 `src/App.vue`
```vue
<template>
  <a-config-provider :locale="locale">
    <router-view />
  </a-config-provider>
</template>
<script>
import zhCN from "ant-design-vue/es/locale/zh_CN";
export default {
  data() {
    return {
      locale: zhCN,
      zhCN,
    };
  },
};
</script>
<style>
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  height: 100%;
}
</style>
```
4. 添加 `src/router.js`
```js
import { createRouter, createWebHashHistory } from "vue-router";
import Admin from 'novice-boot-vue/src/views/Admin.vue'
import Home from "novice-boot-vue/src/views/Home.vue";
import Login from "novice-boot-vue/src/views/Login.vue";

const routes = [
    {
        path: '/admin',
        name: 'Admin',
        component: Admin
    },
    {
        path: "/",
        name: "Home",
        component: Home,
    },
    {
        path: "/login",
        name: "Login",
        component: Login,
    },
];

const router = createRouter({
    history: createWebHashHistory(),
    routes,
});

export default router;
```
5. 修改 `src/main.js`
```js
import { createApp } from 'vue'
import App from './App.vue'
import router from "./router";
import Novice from "novice-boot-vue";

createApp(App).use(Novice).use(router).mount('#app');
```
6. 添加 `vue.config.js`
```js
process.env.VUE_APP_BACKEND_URL = "/backend";
module.exports = {
    publicPath: './',
    lintOnSave: 'warning',
    css: {
        loaderOptions: {
            less: {
                lessOptions: {
                    modifyVars: {
                        "tabs-bar-margin": "0",
                        "form-item-margin-bottom": "4px",
                    },
                    javascriptEnabled: true,
                }
            }
        }
    },
    devServer: {
        port: 8200,
        disableHostCheck: true,
        proxy: {
            "/backend": {
                "target": 'http://localhost:9000/'
            }
        }
    }
}
```

7. 构建启动项目
```shell
npm install
npm run serve
```