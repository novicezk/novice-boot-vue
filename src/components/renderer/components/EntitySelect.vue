<template>
  <a-row :gutter="15">
    <a-col :span="labelWidth" v-if="label" class="dm-label">
      <span v-if="!allowBlank" style="color: red">*</span>
      {{ label }}
    </a-col>
    <a-col :span="componentWidth" class="dm-component">
      <a-tooltip placement="topLeft" :title="error">
        <a-button :class="{ 'dm-verify-error': !verify }" @click="doSelect">{{
          entityDisplay || "选择"
        }}</a-button>
      </a-tooltip>
      <a-button v-if="value" size="small" type="link" @click="remove">
        <template #icon><CloseOutlined /> </template
      ></a-button>
    </a-col>
  </a-row>
</template>
<script>
import Component from "./Component";
import { mapGetters, mapActions } from "vuex";
import { CloseOutlined } from "@ant-design/icons-vue";
export default {
  extends: Component,
  components: {
    CloseOutlined,
  },
  data() {
    return {
      entityDisplay: this.displayValue,
    };
  },
  computed: {
    ...mapGetters(["loadBusiness", "loadType"]),
  },
  methods: {
    ...mapActions(["executeBusiness", "removeChildBusiness"]),
    remove() {
      this.entityDisplay = null;
      this.value = null;
    },
    doSelect() {
      let selectBusiness = this.loadBusiness(this.field.schema, "select");
      selectBusiness.operations = [
        {
          id: "temp_id",
          name: "选择",
          type: "SCRIPT",
          callbackMode: "NONE",
          buttonType: "PRIMARY",
          target: "if (page.entity) page.close()",
        },
      ];
      let that = this;
      this.executeBusiness({
        name: "select",
        typeId: this.field.schema,
        callback: (page) => {
          let entity = page.entity;
          if (entity) {
            that.value = entity.id;
            that.entityDisplay = entity.display || entity.id;
          }
        },
      });
    },
  },
};
</script>
