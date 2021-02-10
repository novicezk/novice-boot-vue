<template>
  <a-card>
    <div class="table-operate">
      <a-space>
        <a-button size="small" type="primary" @click="create(true)">添加根菜单</a-button>
        <a-button
          size="small"
          type="primary"
          @click="create(false)"
          :disabled="!selectedId"
          >添加子菜单</a-button
        >
        <a-button size="small" @click="update" :disabled="!selectedId">编辑</a-button>
        <a-popconfirm title="确认删除该数据?" @confirm="remove">
          <a-button size="small" type="danger" :disabled="!selectedId">删除</a-button>
        </a-popconfirm>
        <a-button size="small" @click="list">刷新</a-button>
      </a-space>
    </div>
    <div v-if="loading" style="text-align: center">
      <a-spin />
    </div>
    <a-tree
      v-if="!loading"
      showLine
      blockNode
      defaultExpandAll
      v-model:selectedKeys="selectedKeys"
      :tree-data="data"
      :replaceFields="{ children: 'children', title: 'name', key: 'id' }"
    >
    </a-tree>
  </a-card>
  <a-modal
    width="60%"
    centered
    :visible="showModal"
    :title="!form.id ? '创建菜单' : '修改菜单'"
    @ok="createOrUpdateOperation"
    @cancel="showModal = false"
  >
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
      <a-form-item label="类型">
        <a-select v-model:value="form.type">
          <a-select-option
            :value="item.value"
            v-for="item in loadEnum('com.novice.boot.toolkit.enums.MenuType')"
            :key="item.value"
          >
            {{ item.display }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="链接类型" v-show="form.type === 'ITEM'">
        <a-select v-model:value="form.linkType">
          <a-select-option
            :value="item.value"
            v-for="item in loadEnum('com.novice.boot.toolkit.enums.LinkType')"
            :key="item.value"
          >
            {{ item.display }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="执行" v-if="form.type === 'ITEM' && form.linkType !== 'NONE'">
        <a-cascader
          v-if="form.linkType === 'BUSINESS'"
          :fieldNames="{ label: 'label', value: 'id', children: 'children' }"
          v-model:value="form.selectBusinesses"
          :options="businessOptions"
          expand-trigger="hover"
        />
        <a-input v-model:value="form.target" v-else />
      </a-form-item>
      <a-form-item label="角色">
        <a-select mode="multiple" v-model:value="form.roles" style="width: 100%">
          <a-select-option v-for="role in allRoles" :key="role.id">
            {{ role.name }}
          </a-select-option>
        </a-select>
      </a-form-item>
      <a-form-item label="图标">
        <a-input v-model:value="form.icon" />
      </a-form-item>
      <a-form-item label="说明">
        <a-input v-model:value="form.description" />
      </a-form-item>
      <a-form-item label="可见">
        <a-switch v-model:checked="form.visible" />
      </a-form-item>
    </a-form>
  </a-modal>
</template>
<script>
import api from "../../../api/menu";
import roleApi from "../../../api/role";
import utils from "../../../util/tree-data-utils";
import { message } from "ant-design-vue";
import { mapGetters } from "vuex";

export default {
  data() {
    return {
      data: [],
      allRoles: [],
      loading: false,
      showModal: false,
      selectedKeys: [],
      form: {},
      rules: {
        name: [{ required: true, message: "请输入名称", trigger: "blur" }],
      },
    };
  },
  computed: {
    ...mapGetters(["loadEnum", "modules"]),
    selectedId() {
      return this.selectedKeys ? this.selectedKeys[this.selectedKeys.length - 1] : null;
    },
    businessOptions() {
      let options = [];
      this.modules.forEach((m) => {
        let option = {
          id: m.id,
          label: `${m.displayAs}(${m.name})`,
          children: [],
        };
        m.types.forEach((type) => {
          let typeOpt = {
            id: type.id,
            label: `${type.displayAs}(${type.name})`,
            children: [],
          };
          type.businesses.forEach((business) => {
            if (business.mode === "COLLECTION") {
              typeOpt.children.push({
                id: `${type.name}@${business.name}`,
                label: `${business.displayAs}(${business.name})`,
              });
            }
          });
          option.children.push(typeOpt);
        });
        options.push(option);
      });
      return options;
    },
  },
  methods: {
    loadAllRoles() {
      roleApi.list().then((result) => {
        this.allRoles = result.data;
      });
    },
    list() {
      this.loading = true;
      this.selectedKeys = [];
      api.list().then((res) => {
        this.data = res.data;
        this.loading = false;
      });
    },
    create(isRoot) {
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      this.form = {
        linkType: "BUSINESS",
        visible: true,
        type: "ITEM",
        parentId: !isRoot ? this.selectedId : null,
      };
      this.showModal = true;
    },
    update() {
      var menu = api.view(this.selectedId);
      if (!menu) {
        message.error("数据未找到");
      }
      if (this.$refs.form) {
        this.$refs.form.resetFields();
      }
      if (menu.linkType === "BUSINESS" && menu.target) {
        menu.selectBusinesses = utils.findTreePathByArray(
          menu.target,
          this.businessOptions
        );
      }
      this.form = { ...menu };
      this.showModal = true;
    },
    createOrUpdateOperation() {
      this.$refs.form
        .validate()
        .then(() => {
          let id = this.form.id;
          let parentId = this.form.parentId;
          let data = { ...this.form };
          if (data.linkType === "BUSINESS" && data.selectBusinesses) {
            data.target = utils.findLastByArray(data.selectBusinesses);
          }
          delete data.parentId;
          delete data.children;
          var f;
          if (id) {
            delete data.id;
            f = api.update(id, data);
          } else {
            f = api.create(data, parentId);
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
    remove() {
      api.remove(this.selectedId).then((res) => {
        if (res.data.code == 1) {
          this.list();
        } else {
          message.error(res.data.description);
        }
      });
    },
  },
  mounted() {
    this.loadAllRoles();
    this.list();
  },
};
</script>
