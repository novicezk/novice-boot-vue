<template>
  <a-row :gutter="15">
    <a-col :span="labelWidth" v-if="label" class="dm-label">
      <span v-if="!allowBlank" style="color: red">*</span>
      {{ label }}
    </a-col>
    <a-col :span="componentWidth" class="dm-component">
      <a-tooltip placement="topLeft" :title="error">
        <a-date-picker
          v-model:value="value"
          :format="momentFormat"
          :disabled="readOnly"
          :class="{ 'dm-verify-error': !verify }"
          @blur="validate"
          @change="validate"
          :showTime="momentFormat.indexOf('H') > -1 || momentFormat.indexOf('h') > -1"
        />
      </a-tooltip>
    </a-col>
  </a-row>
</template>
<script>
import Component from "./Component";
import moment from "moment";
import "moment/dist/locale/zh-cn";
moment.locale("zh-cn");
export default {
  extends: Component,
  data() {
    return {
      value: this.defaultValue ? moment(this.defaultValue) : null,
    };
  },
  computed: {
    momentFormat() {
      let format = this.field.format;
      return format ? format.replace(/y/g, "Y").replace(/d/g, "D") : "YYYY-MM-DD";
    },
  },
};
</script>
<style lang="less">
.dm-verify-error {
  .ant-calendar-picker-input {
    border-color: #f56c6c;
  }
}
</style>
