<template>
  <a-form :model="widget" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
    <a-form-item label="输入控件" name="editor">
      <widget-component
        :dataType="dataType"
        v-model:value="widget.editor"
      ></widget-component>
    </a-form-item>
    <a-form-item label="显示控件" name="displayer">
      <widget-component
        :dataType="dataType"
        v-model:value="widget.displayer"
      ></widget-component>
    </a-form-item>
    <a-form-item label="查询控件" name="searcher">
      <widget-component
        :dataType="dataType"
        v-model:value="widget.searcher"
      ></widget-component>
    </a-form-item>
  </a-form>
</template>

<script>
import WidgetComponent from "./WidgetComponent";
export default {
  components: {
    WidgetComponent,
  },
  props: {
    widget: Object,
    dataType: String,
  },
};
</script>
