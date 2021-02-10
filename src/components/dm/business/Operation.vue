<template>
  <a-form
    ref="form"
    :model="form"
    :rules="rules"
    :label-col="{ span: 4 }"
    :wrapper-col="{ span: 18 }"
  >
    <a-form-item label="名称" name="name">
      <a-input v-model:value="form.name" />
    </a-form-item>
    <a-form-item label="类型" name="type">
      <a-select v-model:value="form.type" @change="changeOperationType">
        <a-select-option
          :value="item.value"
          v-for="item in loadEnum('com.novice.boot.datamodel.enums.OperationType')"
          :key="item.value"
        >
          {{ item.display }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="target" name="target">
      <a-textarea
        :rows="3"
        v-if="form.type === 'SCRIPT'"
        v-model:value="form.target"
        @change="changeScript"
      />
      <a-select v-else v-model:value="form.target" @change="changeTarget">
        <a-select-option
          :value="item.name"
          v-for="item in targetSelects"
          :key="item.name"
        >
          {{ item.name }} - {{ item.displayAs }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="回调">
      <a-select v-model:value="form.callbackMode">
        <a-select-option
          :value="item.value"
          v-for="item in loadEnum('com.novice.boot.datamodel.enums.CallbackMode')"
          :key="item.value"
        >
          {{ item.display }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="按钮类型">
      <a-select v-model:value="form.buttonType">
        <a-select-option
          :value="item.value"
          v-for="item in loadEnum('com.novice.boot.datamodel.enums.ButtonType')"
          :key="item.value"
        >
          {{ item.display }}
        </a-select-option>
      </a-select>
    </a-form-item>
    <a-form-item label="默认">
      <a-switch v-model:checked="form.defaultOpe" />
    </a-form-item>
  </a-form>
</template>

<script>
import { mapGetters } from "vuex";

export default {
  props: {
    typeId: String,
    form: Object,
  },
  data() {
    return {
      typeTarget: {},
      rules: {
        name: [{ required: true, message: "名称不能为空", trigger: "blur" }],
        target: [{ required: true, message: "执行内容不能为空", trigger: "change" }],
      },
    };
  },
  computed: {
    ...mapGetters(["loadEnum", "enumDisplay", "loadType"]),
    type() {
      return this.loadType(this.typeId);
    },
    targetSelects() {
      if (this.type && this.form) {
        return this.form.type === "ACTION" ? this.type.actions : this.type.businesses;
      }
      return [];
    },
  },
  watch: {
    form() {
      this.fixForm();
    },
  },
  methods: {
    fixForm() {
      this.typeTarget = {};
      if (!this.form.id) {
        if (this.$refs["form"]) {
          this.$refs["form"].resetFields();
        }
      } else {
        this.typeTarget[this.form.type] = this.form.target;
      }
    },
    changeOperationType(val) {
      // eslint-disable-next-line vue/no-mutating-props
      this.form.target = this.typeTarget[val] || "";
    },
    changeTarget(val) {
      this.typeTarget[this.form.type] = val;
    },
    changeScript(e) {
      this.typeTarget[this.form.type] = e.target.value;
    },
    validate() {
      return new Promise((resolve) => {
        this.$refs["form"]
          .validate()
          .then(() => {
            resolve(true);
          })
          .catch(() => {
            resolve(false);
          });
      });
    },
  },
  created() {
    this.fixForm();
  },
};
</script>
