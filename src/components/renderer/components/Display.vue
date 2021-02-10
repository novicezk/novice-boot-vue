<template>
  <a-row :gutter="15">
    <a-col :span="labelWidth" v-if="label" class="dm-label"> {{ label }}</a-col>
    <a-col :span="componentWidth" class="dm-component" style="line-height: 32px">
      {{ displayValue }}
    </a-col>
  </a-row>
</template>
<script>
import Component from "./Component";
export default {
  extends: Component,
};
</script>
