<template>
  <a-row :gutter="15">
    <a-col :span="labelWidth" v-if="label" class="dm-label">
      <span v-if="!allowBlank" style="color: red">*</span>
      {{ label }}
    </a-col>
    <a-col
      :span="componentWidth"
      class="dm-component"
      :class="{ 'dm-verify-error': !verify }"
    >
      <a-tooltip placement="topLeft" :title="error">
        <a-select
          v-model:value="value"
          :disabled="readOnly"
          allowClear
          @change="validate"
          @blur="validate"
        >
          <a-select-option
            v-for="item in loadValues()"
            :value="item.value"
            :key="item.value"
          >
            {{ item.display }}
          </a-select-option>
        </a-select>
      </a-tooltip>
    </a-col>
  </a-row>
</template>
<script>
import Component from "./Component";
import { mapGetters } from "vuex";
export default {
  extends: Component,
  computed: {
    ...mapGetters(["loadEnum", "loadCategory"]),
  },
  methods: {
    loadValues() {
      if ("919fdbd16c344a2fa092dc90ff98388d" === this.field.dataType) {
        // 数据字典
        return this.loadCategory(this.field.schema);
      }
      // 枚举
      return this.loadEnum(this.field.schema);
    },
  },
};
</script>
<style lang="less">
.dm-component {
  .ant-select {
    min-width: 150px;
  }
}
.dm-verify-error {
  .ant-select-selector {
    border-color: #f56c6c !important;
  }
}
</style>
