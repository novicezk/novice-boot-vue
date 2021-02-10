<template>
  <a-row :gutter="15">
    <a-col :span="labelWidth" v-if="label" class="dm-label">
      <span v-if="!allowBlank" style="color: red">*</span>
      {{ label }}
    </a-col>
    <a-col :span="componentWidth" class="dm-component">
      <a-tooltip placement="topLeft" :title="error">
        <a-input-number
          v-model:value="value"
          :precision="field.format ? parseInt(field.format) : 0"
          :disabled="readOnly"
          :class="{ 'dm-verify-error': !verify }"
          @change="validate"
          @blur="validate"
        />
      </a-tooltip>
    </a-col>
  </a-row>
</template>
<script>
import Component from "./Component";
export default {
  extends: Component,
  data() {
    return {
      value: this.defaultValue ? parseFloat(this.defaultValue) : null,
    };
  },
  methods: {
    isNotNull() {
      return typeof this.value === "number";
    },
  },
};
</script>
<style lang="less">
.dm-component {
  .ant-input-number {
    min-width: 150px;
  }
}
</style>
