<template>
  <a-card>
    <div class="table-operate">
      <a-space>
        <a-button type="primary" @click="createForm" size="small">添加</a-button>
        <a-button @click="list" size="small">刷新</a-button>
      </a-space>
    </div>
    <a-table
      :columns="columns"
      :data-source="data"
      :loading="loading"
      :pagination="false"
      size="middle"
      rowKey="id"
      :customRow="
        (record) => {
          return {
            onDblclick: () => {
              editForm(record);
            },
          };
        }
      "
    >
      <template #renderer="{ record }">
        <span>{{
          enumDisplay("com.novice.boot.datamodel.enums.Renderer", record.renderer)
        }}</span>
      </template>
      <template #mode="{ record }">
        <span>{{
          enumDisplay("com.novice.boot.datamodel.enums.Mode", record.mode)
        }}</span>
      </template>
      <template #system="{ record }">
        <span v-show="record.system">✔️</span>
      </template>
      <template #action="{ record }">
        <a-button-group>
          <a-button size="small" type="primary" @click="editForm(record)">编辑</a-button>
          <a-popconfirm title="确认删除该数据?" @confirm="remove(record)">
            <a-button type="danger" size="small">删除</a-button>
          </a-popconfirm>
          <a-button
            size="small"
            :disabled="record.mode === 'ENTITY'"
            @click="execute(record)"
            >执行</a-button
          >
        </a-button-group>
      </template>
    </a-table>
  </a-card>
  <a-modal
    :visible="showModal"
    :title="form.id ? '修改业务' : '创建业务'"
    centered
    @ok="handleOk"
    @cancel="showModal = false"
    :afterClose="modalClose"
  >
    <a-form
      ref="form"
      :model="form"
      :rules="rules"
      :label-col="{ span: 4 }"
      :wrapper-col="{ span: 18 }"
    >
      <a-form-item label="名称" name="name">
        <a-input v-model:value="form.name" :disabled="!!form.id" />
      </a-form-item>
      <a-form-item label="显示名" name="displayAs">
        <a-input v-model:value="form.displayAs" />
      </a-form-item>
      <a-form-item label="标题">
        <a-input v-model:value="form.title" />
      </a-form-item>
      <a-form-item label="模式" name="mode">
        <a-select v-model:value="form.mode">
          <a-select-option
            :value="item.value"
            v-for="item in loadEnum('com.novice.boot.datamodel.enums.Mode')"
            :key="item.value"
          >
            {{ item.display }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="渲染器" name="renderer">
        <a-auto-complete
          v-model:value="form.renderer"
          :options="loadEnum('com.novice.boot.datamodel.enums.Renderer')"
          allowClear
          backfill
        />
      </a-form-item>
      <a-form-item label="视图">
        <a-select v-model:value="form.viewName">
          <a-select-option :value="item.name" v-for="item in viewList" :key="item.name">
            {{ item.name }} - {{ item.displayAs }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="初始动作">
        <a-select v-model:value="form.initAction">
          <a-select-option :value="item.name" v-for="item in actionList" :key="item.name">
            {{ item.name }} - {{ item.displayAs }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="描述">
        <a-input v-model:value="form.description" />
      </a-form-item>
      <a-form-item label="系统">
        <a-switch v-model:checked="form.system" />
      </a-form-item>
      <a-form-item label="操作">
        <a-space class="operation-list">
          <draggable v-model="form.operations" item-key="name">
            <template #item="{ element, index }">
              <a-tag
                closable
                @close="form.operations.splice(index, 1)"
                :color="convertButtonType(element.buttonType)"
                @click="
                  currentOperation = { ...element };
                  showOperationDialog = true;
                "
                ><span v-if="element.defaultOpe">💥</span> {{ element.name }}</a-tag
              >
            </template>
          </draggable>
          <a-button size="small" shape="circle" @click="triggerAddOperation">
            <template #icon><PlusOutlined /></template>
          </a-button>
        </a-space>
      </a-form-item>
    </a-form>
  </a-modal>
  <a-modal
    :visible="showOperationDialog"
    title="操作设置"
    centered
    @ok="createOrUpdateOperation"
    @cancel="showOperationDialog = false"
  >
    <operation :form="currentOperation" :typeId="typeId" ref="operation" />
  </a-modal>
</template>
<script>
import api from "../../../api/business";
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";
import { PlusOutlined } from "@ant-design/icons-vue";
import draggable from "vuedraggable";
import Operation from "./Operation";

export default {
  components: { PlusOutlined, Operation, draggable },
  props: {
    typeId: String,
  },
  data() {
    return {
      data: [],
      loading: false,
      showModal: false,
      form: {},
      currentOperation: {},
      showOperationDialog: false,
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
        displayAs: [{ required: true, message: "请输入显示名", trigger: "blur" }],
        mode: [{ required: true, message: "请选择模式", trigger: "blur" }],
        renderer: [{ required: true, message: "请选择渲染器", trigger: "blur" }],
      },
      columns: [
        {
          title: "名称",
          dataIndex: "name",
        },
        {
          title: "显示名",
          dataIndex: "displayAs",
        },
        {
          title: "渲染器",
          dataIndex: "renderer",
          slots: { customRender: "renderer" },
        },
        {
          title: "模式",
          dataIndex: "mode",
          slots: { customRender: "mode" },
        },
        {
          title: "视图",
          dataIndex: "viewName",
        },
        {
          title: "描述",
          dataIndex: "description",
        },
        {
          title: "系统",
          dataIndex: "system",
          slots: { customRender: "system" },
        },
        {
          title: "操作",
          key: "action",
          slots: { customRender: "action" },
        },
      ],
    };
  },
  computed: {
    ...mapGetters(["loadEnum", "enumDisplay", "loadViews", "loadActions"]),
    viewList() {
      return this.loadViews(this.typeId);
    },
    actionList() {
      return this.loadActions(this.typeId);
    },
  },
  methods: {
    list() {
      this.loading = true;
      api.list(this.typeId).then((res) => {
        this.data = res.data;
        this.loading = false;
      });
    },
    createForm() {
      this.showModal = true;
    },
    editForm(record) {
      this.form = JSON.parse(JSON.stringify(record));
      this.showModal = true;
    },
    handleOk() {
      let that = this;
      this.$refs.form
        .validate()
        .then(() => {
          let id = this.form.id;
          let data = { ...this.form };
          data.typeId = that.typeId;
          var f;
          if (id) {
            delete data.id;
            f = api.update(id, data);
          } else {
            f = api.create(data);
          }
          f.then((res) => {
            if (res.data.code == 1) {
              this.showModal = false;
              this.list();
            } else {
              message.error(res.data.description);
            }
          });
        })
        .catch((error) => {
          console.log("error", error);
        });
    },
    remove(record) {
      api.remove(record.id).then((res) => {
        if (res.data.code == 1) {
          this.list();
        } else {
          message.error(res.data.description);
        }
      });
    },
    modalClose() {
      this.$refs["form"].resetFields();
      this.form = {};
    },
    convertButtonType(buttonType) {
      switch (buttonType) {
        case "PRIMARY":
          return "processing";
        case "DASHED":
          return "blue";
        case "LINK":
          return "cyan";
        case "DANGER":
          return "error";
        default:
          return "default";
      }
    },
    triggerAddOperation() {
      this.currentOperation = {
        type: "ACTION",
        callbackMode: "CLOSE",
        buttonType: "DEFAULT",
      };
      this.showOperationDialog = true;
    },
    createOrUpdateOperation() {
      this.$refs.operation.validate().then((valid) => {
        if (!valid) {
          return;
        }
        let operations = this.form.operations;
        this.currentOperation.id = this.currentOperation.id || Math.random().toString(32);
        let opt = operations.find((tmp) => tmp.id === this.currentOperation.id);
        if (opt) {
          operations.splice(operations.indexOf(opt), 1, this.currentOperation);
        } else {
          operations.push(this.currentOperation);
        }
        if (this.currentOperation.defaultOpe) {
          operations.forEach(
            (o) => o.id !== this.currentOperation.id && (o.defaultOpe = false)
          );
        }
        this.showOperationDialog = false;
      });
    },
  },
  mounted() {
    this.list();
  },
};
</script>
<style lang="less">
.operation-list {
  .ant-tag-cyan {
    border-color: transparent;
    box-shadow: none;
    color: #1890ff;
  }
  .ant-tag-blue {
    color: rgba(0, 0, 0, 0.65);
    background-color: #fff;
    border-color: #d9d9d9;
    border-style: dashed;
  }
}
</style>
