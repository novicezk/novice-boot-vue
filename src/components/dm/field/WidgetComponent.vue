<template>
  <a-auto-complete
    v-model:value="componentValue"
    :options="optionalComponents"
    allowClear
    backfill
  />
</template>
<script>
import { mapGetters } from "vuex";
export default {
  props: {
    dataType: String,
    value: String,
  },
  computed: {
    ...mapGetters(["loadDataType", "enumDisplay"]),
    optionalComponents() {
      let that = this;
      return this.loadDataType(this.dataType).optionalComponents.map((c) => {
        return {
          value: c,
          text: that.enumDisplay("com.novice.boot.datamodel.enums.Component", c),
        };
      });
    },
  },
  data() {
    return {
      componentValue: this.value,
    };
  },
  watch: {
    componentValue() {
      if (this.componentValue !== this.value) {
        this.$emit("update:value", this.componentValue);
      }
    },
    value() {
      this.componentValue = this.value;
    },
  },
};
</script>
