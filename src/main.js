import { createApp } from 'vue'
import App from './App.vue'
import router from './router.js'
import store from './store'
import Antd from 'ant-design-vue';
import { Form } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import './assets/main.less';
import { FolderOpenOutlined, BarsOutlined, BookOutlined } from "@ant-design/icons-vue";
import dmRegister from './components/renderer/register';

const app = createApp(App);
app.component(FolderOpenOutlined.displayName, FolderOpenOutlined);
app.component(BarsOutlined.displayName, BarsOutlined);
app.component(BookOutlined.displayName, BookOutlined);

app.use(dmRegister);
app.use(store).use(router).use(Antd).use(Form).mount('#app');
