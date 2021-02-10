<template>
  <a-row :gutter="15">
    <a-col :span="labelWidth" v-if="label" class="dm-label"> {{ label }}</a-col>
    <a-col :span="componentWidth" class="dm-component" style="line-height: 32px">
      <a-image
        v-if="value"
        :width="200"
        :src="fileApi.generateViewUrl(value)"
        :fallback="emptyImg"
      />
    </a-col>
  </a-row>
</template>
<script>
import Component from "./Component";
import fileApi from "../../../api/file";
export default {
  extends: Component,
  data() {
    return {
      fileApi,
    };
  },
};
</script>
