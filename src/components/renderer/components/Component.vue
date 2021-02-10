<template>Component</template>
<script>
export default {
  props: {
    name: String,
    label: String,
    defaultValue: String,
    displayValue: String,
    field: Object,
    config: {
      type: String,
      default: "{}",
    },
    allowBlank: {
      type: Boolean,
      default: true,
    },
    readOnly: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      value: this.defaultValue,
      verify: true,
      error: "",
    };
  },
  computed: {
    labelWidth() {
      return JSON.parse(this.config).labelWidth || 4;
    },
    componentWidth() {
      return JSON.parse(this.config).componentWidth || 23 - this.labelWidth;
    },
  },
  methods: {
    validate() {
      this.verify = this.allowBlank || this.isNotNull();
      if (!this.verify) {
        this.error = `请输入${this.label || "..."}`;
      } else {
        this.error = "";
      }
      return this.verify;
    },
    getOperator() {
      return "EQUALS";
    },
    isNotNull() {
      return this.value;
    },
    setValue(val) {
      this.value = val;
    },
  },
};
</script>
