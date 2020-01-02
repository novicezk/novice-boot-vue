<template>
  <a-card :title="fieldSet.title || '空'" style="margin-bottom: 10px">
    <template #extra>
      <a-button-group>
        <a-button
          type="link"
          size="small"
          :disabled="waitFields.length === 0"
          @click="addFiled"
          >添加字段</a-button
        >
        <a-button type="link" size="small" @click="$emit('updateFieldSet', fieldSet)"
          >编辑</a-button
        >
        <a-button type="link" size="small" @click="$emit('removeFieldSet', fieldSet)"
          >删除</a-button
        >
      </a-button-group>
    </template>
    <draggable
      v-model="fieldSet.fields"
      item-key="name"
      class="ant-row ant-row-space-between"
    >
      <template #item="{ element }">
        <a-col :span="24 / rowSize" class="field-item">
          <a-button type="link" size="small" @click="updateField(element)">
            {{ element.displayAs }}
          </a-button>
          <a-button
            size="small"
            type="dashed"
            @click="removeField(element)"
            shape="circle"
          >
            <template #icon><CloseOutlined /> </template
          ></a-button>
        </a-col>
      </template>
    </draggable>
  </a-card>
  <a-modal
    :visible="showAddFieldModal"
    centered
    title="选择字段"
    @ok="saveField"
    @cancel="showAddFieldModal = false"
  >
    <a-checkbox-group v-model:value="checkList" style="width: 100%">
      <a-row type="flex">
        <a-col :span="6" v-for="(item, index) in waitFields" :key="index">
          <a-checkbox :value="item.name">{{ item.displayAs }}</a-checkbox>
        </a-col>
      </a-row>
    </a-checkbox-group>
  </a-modal>
  <a-modal
    :visible="widgetShow"
    centered
    title="字段设置"
    @ok="doUpdateField"
    @cancel="widgetShow = false"
  >
    <a-form ref="form" :model="form" :label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
      <a-form-item label="输入控件">
        <widget-component
          :dataType="currentField.dataType"
          v-model:value="form.editor"
        ></widget-component>
      </a-form-item>
      <a-form-item label="显示控件">
        <widget-component
          :dataType="currentField.dataType"
          v-model:value="form.displayer"
        ></widget-component>
      </a-form-item>
      <a-form-item label="只读">
        <a-switch v-model:checked="form.readOnly" />
      </a-form-item>
      <a-form-item label="允许为空">
        <a-switch v-model:checked="form.allowBlank" />
      </a-form-item>
      <a-form-item label="默认值">
        <a-input v-model:value="form.defaultValue" />
      </a-form-item>
      <a-form-item label="config">
        <a-input v-model:value="form.config" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import WidgetComponent from "../field/WidgetComponent";
import { CloseOutlined } from "@ant-design/icons-vue";
import draggable from "vuedraggable";
import { mapGetters } from "vuex";
export default {
  components: {
    WidgetComponent,
    CloseOutlined,
    draggable,
  },
  props: {
    typeId: String,
    fieldSet: Object,
    waitFields: Array,
  },
  data() {
    return {
      showAddFieldModal: false,
      checkList: [],
      form: {},
      widgetShow: false,
    };
  },
  computed: {
    ...mapGetters(["loadField"]),
    selectedFields() {
      return this.fieldSet.fields;
    },
    rowSize() {
      return this.fieldSet.rowSize;
    },
  },
  methods: {
    addFiled() {
      this.checkList = [];
      this.showAddFieldModal = true;
    },
    saveField() {
      if (this.checkList.length === 0) return;
      let newSelected = [];
      this.checkList.forEach((name) => {
        let element = this.waitFields.find((field) => field.name === name);
        if (element) {
          this.waitFields.splice(this.waitFields.indexOf(element), 1);
          newSelected.push({ ...element });
        }
      });
      let that = this;
      newSelected.forEach((field) => {
        that.fieldSet.fields.push({
          name: field.name,
          displayAs: field.displayAs,
          displayer: field.widget.displayer,
          editor: field.widget.editor,
          readOnly: false,
          allowBlank: true,
          config: "{}",
          defaultValue: field.defaultValue,
        });
      });
      this.showAddFieldModal = false;
    },
    updateField(item) {
      this.currentField = this.loadField(this.typeId, item.name);
      this.form = { ...item };
      this.widgetShow = true;
    },
    doUpdateField() {
      let field = this.selectedFields.find((field) => field.name === this.form.name);
      // eslint-disable-next-line vue/no-mutating-props
      this.fieldSet.fields.splice(this.selectedFields.indexOf(field), 1, {
        ...this.form,
      });
      this.widgetShow = false;
    },
    removeField(item) {
      let index = this.selectedFields.indexOf(item);
      if (index > -1) {
        // eslint-disable-next-line vue/no-mutating-props
        this.fieldSet.fields.splice(index, 1);
        let field = this.waitFields.find((field) => field.name === item.name);
        // eslint-disable-next-line vue/no-mutating-props
        if (!field) this.waitFields.push(this.loadField(this.typeId, item.name));
      }
    },
  },
};
</script>
<style>
.field-item {
  border-radius: 30px;
  text-align: right;
  cursor: move;
  margin-top: 10px;
  background-color: rgba(24, 144, 255, 0.2);
}
</style>
