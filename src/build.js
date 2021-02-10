import store from './store'
import Antd from 'ant-design-vue';
import { Form } from 'ant-design-vue';
import 'ant-design-vue/dist/antd.less';
import './assets/main.less';
import { FolderOpenOutlined, BarsOutlined, BookOutlined } from "@ant-design/icons-vue";
import dmRegister from './components/renderer/register';

export default {
    install: (app) => {
        app.component(FolderOpenOutlined.displayName, FolderOpenOutlined);
        app.component(BarsOutlined.displayName, BarsOutlined);
        app.component(BookOutlined.displayName, BookOutlined);
        app.use(dmRegister).use(store).use(Antd).use(Form);
    }
}