import ListRenderer from "./List";
import SelectRenderer from "./Select";
import DetailRenderer from "./Detail";
import ViewRenderer from "./View";

import Input from "./components/Input";
import Display from "./components/Display";
import TextArea from "./components/TextArea";
import Date from "./components/Date";
import Switch from "./components/Switch";
import InputNumber from "./components/InputNumber";
import Select from "./components/Select";
import ImageUpload from "./components/ImageUpload";
import ImageDisplay from "./components/ImageDisplay";
import MdEditor from "./components/MdEditor";
import MdDisplay from "./components/MdDisplay";
import EntitySelect from "./components/EntitySelect";
import EntityDisplay from "./components/EntityDisplay";

import VMdEditor from '@kangc/v-md-editor';
import '@kangc/v-md-editor/lib/style/base-editor.css';
import githubTheme from '@kangc/v-md-editor/lib/theme/github.js';
import '@kangc/v-md-editor/lib/theme/style/github.css';
VMdEditor.use(githubTheme);

export default {
    install: (app) => {
        app.use(VMdEditor);
        // renderer
        app.component("RE_LIST", ListRenderer);
        app.component("RE_SELECT", SelectRenderer);
        app.component("RE_DETAIL", DetailRenderer);
        app.component("RE_VIEW", ViewRenderer);
        // component
        app.component("DM_INPUT", Input);
        app.component("DM_DISPLAY", Display);
        app.component("DM_TEXT_AREA", TextArea);
        app.component("DM_DATE", Date);
        app.component("DM_SWITCH", Switch);
        app.component("DM_INPUT_NUMBER", InputNumber);
        app.component("DM_SELECT", Select);
        app.component("DM_IMAGE_UPLOAD", ImageUpload);
        app.component("DM_IMAGE_DISPLAY", ImageDisplay);
        app.component("DM_MD_EDITOR", MdEditor);
        app.component("DM_MD_DISPLAY", MdDisplay);
        app.component("DM_ENTITY_SELECT", EntitySelect);
        app.component("DM_ENTITY_DISPLAY", EntityDisplay);
    }
}
