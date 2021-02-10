<template>
  <component :key="menu.id" :is="convertMenuType(menu.type)">
    <template #title v-if="menu.type !== 'ITEM'">
      <component :is="menu.icon || getDefaultIcon(menu.type)" />
      <span> {{ menu.name }}</span>
    </template>
    <component v-if="menu.type === 'ITEM'" :is="menu.icon || getDefaultIcon(menu.type)" />
    <span v-if="menu.type === 'ITEM'">
      {{ menu.name }}
    </span>
    <recursion-menu
      v-for="item in menu.children"
      :key="item.id"
      :menu="item"
    ></recursion-menu>
  </component>
</template>
<script>
export default {
  props: {
    menu: Object,
  },
  data() {
    return {};
  },
  methods: {
    convertMenuType(menuType) {
      switch (menuType) {
        case "GROUP":
          return "a-menu-item-group";
        case "SUB_MENU":
          return "a-sub-menu";
        default:
          return "a-menu-item";
      }
    },
    getDefaultIcon(menuType) {
      switch (menuType) {
        case "GROUP":
          return "BarsOutlined";
        case "SUB_MENU":
          return "FolderOpenOutlined";
        default:
          return "BookOutlined";
      }
    },
  },
};
</script>
