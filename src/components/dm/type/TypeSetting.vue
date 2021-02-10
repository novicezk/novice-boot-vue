<template>
  <a-card
    class="type-setting"
    :title="type.name + ' (' + type.displayAs + ')  / ' + type.id"
  >
    <a-tabs class="type-setting-tabs">
      <a-tab-pane key="field">
        <template #tab>
          <span><TagsOutlined />字段</span>
        </template>
        <field-list :typeId="type.id" />
      </a-tab-pane>
      <a-tab-pane key="view">
        <template #tab>
          <span><TabletOutlined />视图</span>
        </template>
        <view-list :typeId="type.id" />
      </a-tab-pane>
      <a-tab-pane key="business">
        <template #tab>
          <span><ExperimentOutlined />业务</span>
        </template>
        <business-list :typeId="type.id" />
      </a-tab-pane>
      <a-tab-pane key="action">
        <template #tab>
          <span><FunctionOutlined />动作</span>
        </template>
        <action-list :typeId="type.id" />
      </a-tab-pane>
    </a-tabs>
  </a-card>
</template>
<script>
import {
  TagsOutlined,
  TabletOutlined,
  ExperimentOutlined,
  FunctionOutlined,
} from "@ant-design/icons-vue";
import FieldList from "../field/FieldList";
import ViewList from "../view/ViewList";
import BusinessList from "../business/BusinessList";
import ActionList from "../ActionList";
export default {
  components: {
    TagsOutlined,
    TabletOutlined,
    ExperimentOutlined,
    FunctionOutlined,
    FieldList,
    ViewList,
    BusinessList,
    ActionList,
  },
  props: {
    type: Object,
  },
  data() {
    return {
      selectTab: "field",
    };
  },
};
</script>
<style lang="less">
.type-setting {
  .ant-card-body {
    padding: 0 !important;
  }
  .type-setting-tabs .ant-card-body {
    padding: 24px !important;
  }
}
</style>
