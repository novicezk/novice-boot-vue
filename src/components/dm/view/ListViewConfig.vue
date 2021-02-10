<template>
  <a-card>
    <h3>查询字段</h3>
    <a-transfer
      :data-source="transferFields"
      :titles="['', '已选']"
      :render="(item) => item.title"
      :target-keys="conditionFieldNames"
      @change="changeTransfer"
    />
  </a-card>
  <a-card>
    <h3>列字段</h3>
    <a-checkbox-group v-model:value="rowFieldNames" style="width: 100%">
      <a-row type="flex">
        <a-col :span="4" v-for="(item, index) in typeFields" :key="index">
          <a-checkbox :value="item.name">{{ item.displayAs }}</a-checkbox>
        </a-col>
      </a-row>
    </a-checkbox-group>

    <div class="item-content">
      <draggable v-model="view.rowFields" group="people" item-key="name">
        <template #item="{ element }">
          <a-tag
            color="processing"
            :style="`width:${element.width}%`"
            @click="updateRowField(element)"
            ><span v-if="element.sort" style="color: red">^</span
            >{{ element.displayAs }}</a-tag
          >
        </template>
      </draggable>
    </div>
  </a-card>
  <a-card>
    <h3>数据设置</h3>
    <a-row style="line-height: 32px; margin-bottom: 10px">
      <a-col :span="3" style="text-align: right">默认排序</a-col>

      <a-col :span="10" :offset="1"><a-input v-model:value="view.sortBy" /></a-col>
      <a-col :span="6" :offset="1">
        <a-switch
          checked-children="升序"
          un-checked-children="降序"
          v-model:checked="view.asc"
      /></a-col>
    </a-row>
    <a-row style="line-height: 32px">
      <a-col :span="3" style="text-align: right">单页行数</a-col>
      <a-col :span="12" :offset="1"
        ><a-input-number :min="-1" :max="100" v-model:value="view.pageSize"
      /></a-col>
    </a-row>
  </a-card>
  <a-modal
    :visible="rowFieldDialogVisible"
    centered
    title="列字段"
    @ok="saveRowField"
    @cancel="rowFieldDialogVisible = false"
  >
    <a-form
      ref="formRowField"
      :model="formRowField"
      :rules="formRowFieldRules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="字段名" name="name">
        <a-input v-model:value="formRowField.name" disabled />
      </a-form-item>
      <a-form-item label="显示名" name="displayAs">
        <a-input v-model:value="formRowField.displayAs" />
      </a-form-item>
      <a-form-item label="动态宽度">
        <a-switch v-model:checked="formRowField.dynamicWidth" />
      </a-form-item>
      <a-form-item label="宽度">
        <a-input-number :min="1" :max="100" v-model:value="formRowField.width" />
      </a-form-item>
      <a-form-item label="支持排序">
        <a-switch v-model:checked="formRowField.sort" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import { mapGetters } from "vuex";
import { message } from "ant-design-vue";
import draggable from "vuedraggable";
export default {
  props: {
    view: Object,
  },
  components: {
    draggable,
  },
  data() {
    return {
      rowFieldNames: [],
      conditionFieldNames: [],
      rowFieldDialogVisible: false,
      formRowField: {},
      formRowFieldRules: {
        displayAs: [{ required: true, message: "显示名不能为空", trigger: "blur" }],
        width: [{ required: true, message: "宽度不能为空", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters(["loadFields", "loadType"]),
    typeFields() {
      return this.loadFields(this.view.typeId);
    },
    transferFields() {
      const array = [];
      this.typeFields.forEach((field) => {
        array.push({
          key: field.name,
          title: field.displayAs,
        });
      });
      return array;
    },
  },
  watch: {
    view() {
      this.init();
    },
    rowFieldNames() {
      this.syncRowFields();
    },
    conditionFieldNames() {
      this.syncConditionFields();
    },
  },
  methods: {
    checkFieldNames(name) {
      if (!this[name] || this[name].length === 0) return;
      let tmpFieldNames = [...this[name]];
      for (var i = 0; i < tmpFieldNames.length; i++) {
        if (!this.getField(tmpFieldNames[i])) {
          message.error(tmpFieldNames[i] + " 未找到");
          tmpFieldNames.splice(i, 1);
          i--;
        }
      }
      if (tmpFieldNames.length !== this[name].length) {
        this[name] = tmpFieldNames;
      }
    },
    getField(name) {
      return this.typeFields.find((field) => field.name === name);
    },
    changeTransfer(targetKeys) {
      this.conditionFieldNames = targetKeys;
    },
    syncRowFields() {
      let newAdd = [...this.rowFieldNames];
      let rowFields = [];
      let width = 100;
      let dynamicCellSize = 0;
      this.view.rowFields.forEach((field) => {
        let index = newAdd.indexOf(field.name);
        if (index !== -1) {
          rowFields.push({ ...field });
          newAdd.splice(index, 1);
          if (!field.dynamicWidth) {
            width -= field.width;
          } else {
            dynamicCellSize++;
          }
        }
      });
      dynamicCellSize += newAdd.length;
      let dynamicCellWidth = parseInt(width / dynamicCellSize);
      rowFields.forEach((field) => {
        if (field.dynamicWidth) field.width = dynamicCellWidth;
      });
      let that = this;
      newAdd.forEach((fieldName) => {
        let field = that.getField(fieldName);
        rowFields.push({
          name: fieldName,
          displayAs: field.displayAs,
          dynamicWidth: true,
          width: dynamicCellWidth,
          sort: false,
        });
      });
      // eslint-disable-next-line vue/no-mutating-props
      this.view.rowFields = rowFields;
    },
    syncConditionFields() {
      let newAdd = [...this.conditionFieldNames];
      let conditionFields = [...this.view.conditionFields];
      for (var i = 0; i < conditionFields.length; i++) {
        let index = newAdd.indexOf(conditionFields[i].name);
        if (index === -1) {
          conditionFields.splice(i, 1);
          i--;
        } else {
          newAdd.splice(index, 1);
        }
      }
      let that = this;
      newAdd.forEach((fieldName) => {
        let field = that.getField(fieldName);
        conditionFields.push({
          name: fieldName,
          schema: field.schema,
          displayAs: field.displayAs,
          searcher: field.widget.searcher,
        });
      });
      // eslint-disable-next-line vue/no-mutating-props
      this.view.conditionFields = conditionFields;
    },
    updateRowField(rowField) {
      this.formRowField = { ...rowField };
      this.rowFieldDialogVisible = true;
    },
    saveRowField() {
      this.$refs.formRowField.validate().then(() => {
        let rowFields = this.view.rowFields;
        for (const key in rowFields) {
          if (rowFields[key].name === this.formRowField.name) {
            this.formRowField.override = true;
            rowFields[key] = this.formRowField;
            break;
          }
        }
        this.syncRowFields();
        this.rowFieldDialogVisible = false;
      });
    },
    init() {
      this.checkFieldNames("rowFieldNames");
      this.checkFieldNames("conditionFieldNames");
      const conditionFieldNames = [];
      const rowFieldNames = [];
      this.view.conditionFields.forEach((field) => {
        conditionFieldNames.push(field.name);
      });
      this.view.rowFields.forEach((field) => {
        rowFieldNames.push(field.name);
      });
      this.conditionFieldNames = conditionFieldNames;
      this.rowFieldNames = rowFieldNames;
    },
  },
  created() {
    this.init();
  },
};
</script>
<style lang="less">
.item-content {
  margin-top: 20px;
  .ant-tag {
    text-align: center;
    margin-right: 0 !important;
    font-size: 15px;
    line-height: 28px;
  }
}
</style>
