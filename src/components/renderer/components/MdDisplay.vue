<template>
  <a-row :gutter="15">
    <a-col :span="labelWidth" v-if="label" class="dm-label">{{ label }}</a-col>
    <a-col :span="componentWidth" class="dm-component">
      <v-md-editor v-model="displayValue" mode="preview"></v-md-editor>
    </a-col>
  </a-row>
</template>
<script>
import Component from "./Component";
export default {
  extends: Component,
};
</script>
<style lang="less">
.v-md-editor-preview {
  padding: 3px !important;
}
</style>
