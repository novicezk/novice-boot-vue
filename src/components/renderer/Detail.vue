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
            style="margin-top: 12px"
          >
            <component
              :is="'DM_' + field.editor"
              :label="field.displayAs"
              :name="field.name"
              :allowBlank="field.allowBlank"
              :defaultValue="getFieldDefaultValue(field.name) || field.defaultValue"
              :displayValue="getFieldDisplayValue(field.name)"
              :config="field.config"
              :field="loadField(business.typeId, field.name)"
              :readOnly="field.readOnly"
              :ref="`dm-${field.name}`"
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
      <a-button @click="cancel">取消</a-button>
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
      let entityId = this.business.params.entityId;
      if (entityId) {
        let that = this;
        this.executeInitAction({ entityId: entityId }, (res) => {
          if (res.data) {
            that.entity = res.data;
            that.loading = false;
          } else {
            message.error("数据未找到!");
          }
        });
      } else {
        this.loading = false;
      }
    },
    getOperationParams() {
      let dms = this.getFieldComponents();
      var verify = true;
      const properties = {};
      dms.forEach((dm) => {
        if (!dm.validate()) {
          verify = false;
        } else {
          properties[dm.name] = dm.value;
        }
      });
      if (!verify) throw "校验失败";
      return {
        entityId: this.business.params.entityId,
        properties: properties,
      };
    },
  },
  created() {},
  mounted() {},
};
</script>
