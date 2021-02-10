<template>
  <a-row :gutter="15">
    <a-col :span="labelWidth" v-if="label" class="dm-label"
      ><span v-if="!allowBlank" style="color: red">*</span> {{ label }}</a-col
    >
    <a-col :span="componentWidth" class="dm-component">
      <a-tooltip placement="topLeft" :title="error">
        <a-textarea
          v-model:value="value"
          :disabled="readOnly"
          :class="{ 'dm-verify-error': !verify }"
          :auto-size="{ minRows: 2, maxRows: 5 }"
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
  methods: {
    getOperator() {
      return "CONTAINS";
    },
  },
};
</script>
