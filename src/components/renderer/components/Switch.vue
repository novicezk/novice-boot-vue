<template>
  <a-row :gutter="15">
    <a-col :span="labelWidth" v-if="label" class="dm-label">
      <span v-if="!allowBlank" style="color: red">*</span>
      {{ label }}
    </a-col>
    <a-col :span="componentWidth" class="dm-component">
      <a-switch v-model:checked="value" :disabled="readOnly" />
    </a-col>
  </a-row>
</template>
<script>
import Component from "./Component";
export default {
  extends: Component,
  data() {
    return {
      value: this.defaultValue ? JSON.parse(this.defaultValue) : null,
    };
  },
  methods: {
    validate() {
      return true;
    },
    isNotNull() {
      return typeof this.value === "boolean";
    },
  },
};
</script>
