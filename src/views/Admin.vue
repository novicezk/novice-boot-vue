<template>
  <a-layout id="main-layout">
    <a-layout-sider
      v-model:collapsed="collapsed"
      collapsible
      :style="{ 'text-align': 'left' }"
    >
      <div class="favicon-div" :style="`padding-left: ${collapsed ? 26 : 18}px`">
        <a-avatar src="/favicon.ico" :size="28" />
        <span v-if="!collapsed"> Novice Admin </span>
      </div>
      <a-menu
        theme="dark"
        mode="inline"
        :selectedKeys="selectedMenus"
        @click="handleSelect"
      >
        <a-menu-item key="module">
          <RocketOutlined />
          <span>模型设置</span>
        </a-menu-item>
        <a-menu-item key="menu">
          <MenuOutlined />
          <span>菜单管理</span>
        </a-menu-item>
        <a-menu-item key="category">
          <ReadOutlined />
          <span>数据字典</span>
        </a-menu-item>
        <a-menu-item key="listener">
          <SoundOutlined />
          <span>侦听器</span>
        </a-menu-item>
        <a-sub-menu key="usersystem">
          <template #title>
            <TeamOutlined />
            <span>用户管理</span>
          </template>
          <a-menu-item key="user">用户</a-menu-item>
          <a-menu-item key="role">角色</a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="system">
          <template #title>
            <ToolOutlined />
            <span>系统设置</span>
          </template>
          <a-menu-item key="reloadMeta">重新加载</a-menu-item>
          <a-menu-item key="clearCache">重置缓存</a-menu-item>
        </a-sub-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header>
        <main-header />
      </a-layout-header>
      <a-layout-content>
        <a-tabs
          v-model:activeKey="selectTab"
          hide-add
          type="editable-card"
          @edit="removeAdminTab"
          :style="{ 'text-align': 'left' }"
        >
          <a-tab-pane v-for="tab in adminTabs" :key="tab.key" :tab="tab.title">
            <module-list v-if="tab.type === 'module'" />
            <type-list :moduleId="tab.moduleId" v-if="tab.type === 'type'" />
            <type-setting :type="tab.currentType" v-if="tab.type === 'type-setting'" />
            <menu-list v-if="tab.type === 'menu'" />
            <category-list v-if="tab.type === 'category'" />
            <role-list v-if="tab.type === 'role'" />
            <user-list v-if="tab.type === 'user'" />
          </a-tab-pane>
          <template #tabBarExtraContent>
            <a-popconfirm title="关闭所有标签页?" @confirm="setAdminTabs([])">
              <a-button title="关闭所有标签页">
                <template #icon>
                  <MinusOutlined />
                </template>
              </a-button>
            </a-popconfirm>
          </template>
        </a-tabs>
      </a-layout-content>
      <a-layout-footer :style="{ 'text-align': 'center', padding: '10px 50px' }"
        >Copyright © 2020 novicezk</a-layout-footer
      >
    </a-layout>
  </a-layout>
</template>
<script>
import {
  RocketOutlined,
  TeamOutlined,
  ToolOutlined,
  MenuOutlined,
  ReadOutlined,
  SoundOutlined,
  MinusOutlined,
} from "@ant-design/icons-vue";
import { mapGetters, mapActions } from "vuex";
import { message } from "ant-design-vue";
import MainHeader from "../components/MainHeader";
import ModuleList from "../components/dm/ModuleList";
import TypeList from "../components/dm/type/TypeList";
import TypeSetting from "../components/dm/type/TypeSetting";
import MenuList from "../components/tk/menu/MenuList";
import CategoryList from "../components/tk/CategoryList";
import RoleList from "../components/us/RoleList";
import UserList from "../components/us/user/UserList";

export default {
  components: {
    RocketOutlined,
    TeamOutlined,
    MenuOutlined,
    ReadOutlined,
    ToolOutlined,
    SoundOutlined,
    MinusOutlined,
    MainHeader,
    ModuleList,
    TypeList,
    TypeSetting,
    MenuList,
    CategoryList,
    RoleList,
    UserList,
  },
  data() {
    return {
      collapsed: false,
      selectTab: "",
      selectedMenus: [],
      menuMap: {
        module: {
          key: "module",
          title: "模型设置",
        },
        menu: {
          key: "menu",
          title: "菜单管理",
        },
        category: {
          key: "category",
          title: "数据字典",
        },
        listener: {
          key: "listener",
          title: "侦听器",
        },
        user: {
          key: "usersystem-user",
          title: "用户",
        },
        role: {
          key: "usersystem-role",
          title: "角色",
        },
      },
    };
  },
  computed: {
    ...mapGetters(["adminTabs", "adminSelectTab"]),
  },
  watch: {
    selectTab(value) {
      if (value !== this.adminSelectTab) {
        this.changeAdminSelectTab(value);
      }
    },
    adminSelectTab(value) {
      this.selectTab = value;
      this.selectedMenus = value.split("-");
    },
  },
  methods: {
    ...mapActions([
      "pushAdminTab",
      "removeAdminTab",
      "changeAdminSelectTab",
      "setAdminTabs",
      "loadMetaAsync",
    ]),
    handleSelect(item) {
      let key = item.key;
      if (key === "reloadMeta") {
        this.loadMetaAsync().then(() => {
          message.success("重新加载成功");
        });
      } else if (key === "clearCache") {
        message.success("已重置服务端缓存");
      } else {
        let tab = this.adminTabs.find((tab) => tab.key === key);
        if (tab) {
          this.changeAdminSelectTab(tab.key);
        } else {
          let menu = this.menuMap[key];
          this.pushAdminTab({
            key: menu.key,
            title: menu.title,
            type: key,
          });
        }
      }
    },
  },
  created() {
    this.loadMetaAsync();
  },
  mounted() {
    this.selectTab = this.adminSelectTab;
    this.selectedMenus = this.selectTab.split("-");
  },
};
</script>
<style lang="less">

</style>
