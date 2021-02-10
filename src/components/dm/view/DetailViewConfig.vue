<template>
  <field-set-config
    v-for="(item, index) in view.fieldSets"
    :key="index"
    :typeId="view.typeId"
    :fieldSet="item"
    :waitFields="waitFields"
    @updateFieldSet="updateFieldSet"
    @removeFieldSet="removeFieldSet"
  />
  <a-modal
    :visible="showModal"
    centered
    title="列字段"
    @ok="createOrUpdateAction"
    @cancel="showModal = false"
  >
    <a-form ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="标题">
        <a-input v-model:value="form.title" />
      </a-form-item>
      <a-form-item label="边框">
        <a-switch v-model:checked="form.border" />
      </a-form-item>
      <a-form-item label="列数">
        <a-input-number :min="1" :max="3" v-model:value="form.rowSize" />
      </a-form-item>
    </a-form>
  </a-modal>
  <a-row>
    <a-button type="primary" @click="createFieldSet" size="small">新建区域</a-button>
  </a-row>
</template>
<script>
import FieldSetConfig from "./FieldSetConfig";
import { mapGetters } from "vuex";
export default {
  components: {
    FieldSetConfig,
  },
  props: {
    view: Object,
  },
  data() {
    return {
      form: {
        rowSize: 2,
      },
      showModal: false,
      waitFields: [],
    };
  },
  computed: {
    ...mapGetters(["loadFields"]),
    typeFields() {
      return this.loadFields(this.view.typeId);
    },
    fieldSets() {
      return this.view.fieldSets;
    },
  },
  watch: {
    fieldSets() {
      this.initWaitFields();
    },
  },
  methods: {
    initWaitFields() {
      if (!this.fieldSets) {
        return;
      }
      let selectFieldNames = [];
      this.fieldSets.forEach((set) => {
        set.fields.forEach((field) => selectFieldNames.push(field.name));
      });
      this.waitFields = this.typeFields.filter(
        (field) => selectFieldNames.indexOf(field.name) === -1
      );
    },
    createFieldSet() {
      let formRef = this.$refs["form"];
      if (formRef) formRef.resetFields();
      this.form = { rowSize: 2 };
      this.action = "Create";
      this.showModal = true;
    },
    updateFieldSet(item) {
      this.form = { ...item };
      this.action = "Update";
      this.showModal = true;
    },
    removeFieldSet(item) {
      let index = this.fieldSets.indexOf(item);
      if (index > -1) {
        // eslint-disable-next-line vue/no-mutating-props
        this.view.fieldSets.splice(index, 1);
      }
    },
    createOrUpdateAction() {
      var fieldSets = [...this.fieldSets];
      let tmpData = { ...this.form };
      tmpData.name = this.form.name || Math.random().toString(36);
      if ("Create" === this.action) {
        tmpData.fields = [];
        fieldSets.push(tmpData);
      } else {
        for (const key in fieldSets) {
          const element = fieldSets[key];
          if (element.name === tmpData.name) {
            fieldSets[key] = tmpData;
            break;
          }
        }
      }
      // eslint-disable-next-line vue/no-mutating-props
      this.view.fieldSets = fieldSets;
      this.showModal = false;
    },
  },
  created() {
    this.initWaitFields();
  },
};
</script>
