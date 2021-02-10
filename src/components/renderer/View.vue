<template>
  <a-card
    class="renderer-pannel"
    :title="isPannel ? rendererTitle : null"
    :bordered="isPannel"
  >
    <a-card :bordered="false" v-if="loading" size="small">
      <a-spin />
    </a-card>
    <div v-else>
      <a-card
        v-for="(fieldSet, index) in business.view.fieldSets"
        :key="index"
        :bordered="fieldSet.border"
        :title="fieldSet.title"
        size="small"
      >
        <a-row type="flex" justify="space-between">
          <a-col
            v-for="field in fieldSet.fields"
            :key="field.name"
            :span="24 / fieldSet.rowSize"
            style="margin-top: 10px"
          >
            <component
              :is="'DM_' + field.displayer"
              :label="field.displayAs"
              :name="field.name"
              :defaultValue="getFieldDefaultValue(field.name) || field.defaultValue"
              :displayValue="getFieldDisplayValue(field.name)"
              :config="field.config"
              :field="loadField(business.typeId, field.name)"
              :readOnly="field.readOnly"
            ></component>
          </a-col>
        </a-row>
      </a-card>
    </div>
    <a-space style="margin-top: 10px" v-if="isPannel">
      <a-button
        v-for="item in business.operations"
        :type="item.buttonType.toLowerCase()"
        :key="item.id"
        @click="executeOperation(item)"
        >{{ item.name }}</a-button
      >
      <a-button @click="cancel">返回</a-button>
    </a-space>
  </a-card>
</template>
<script>
import Renderer from "./Renderer";
import { message } from "ant-design-vue";
export default {
  extends: Renderer,
  data() {
    return {
      loading: true,
    };
  },
  methods: {
    getFieldDefaultValue(fieldName) {
      if (this.entity) {
        let v = this.entity.properties[fieldName];
        return typeof v === "undefined" ? null : v + "";
      }
      return null;
    },
    getFieldDisplayValue(fieldName) {
      if (this.entity) {
        let v = this.entity.displays[fieldName] || this.entity.properties[fieldName];
        return typeof v === "undefined" ? null : v + "";
      }
      return null;
    },
    refresh() {
      let that = this;
      this.executeInitAction({ entityId: this.business.params.entityId }, (res) => {
        if (res.data) {
          that.entity = res.data;
          that.loading = false;
        } else {
          message.error("数据未找到!");
        }
      });
    },
  },
  created() {},
  mounted() {},
};
</script>
