<template>
  <a-layout id="main-layout">
    <a-layout-sider v-model:collapsed="collapsed" collapsible :style="{ 'text-align': 'left' }">
      <div class="favicon-div" :style="`padding-left: ${collapsed ? 26 : 18}px`">
        <a-avatar :src="`${baseUrl}/favicon.ico`" :size="28" />
        <span v-if="!collapsed">Novice Web</span>
      </div>
      <a-menu theme="dark" mode="inline" v-model:selectedKeys="selectedKeys">
        <recursion-menu v-for="item in menus" :key="item.id" :menu="item" @click="handleSelect"></recursion-menu>
      </a-menu>
    </a-layout-sider>
    <a-layout>
      <a-layout-header>
        <main-header />
      </a-layout-header>
      <a-layout-content>
        <component
          :is="'RE_' + currentBusiness.renderer"
          v-if="currentBusiness"
          :business="currentBusiness"
        />
        <component v-else-if="custom" :is="custom" />
        <a-modal
          v-for="business in childBusinesses"
          :key="business.id"
          :title="
            business.title || business.displayAs + loadType(business.typeId).displayAs
          "
          :width="`calc(${business.view.width}vw)`"
          centered
          v-model:visible="business.show"
          :bodyStyle="{ padding: '0' }"
          @cancel="removeChildBusiness(business)"
        >
          <template #footer>
            <a-space v-if="business.renderer !== 'LIST'">
              <a-button
                v-for="item in business.operations"
                :type="item.buttonType.toLowerCase()"
                :key="item.id"
                @click="$refs['RE_' + business.id].executeOperation(item)"
              >{{ item.name }}</a-button>
              <a-button @click="$refs['RE_' + business.id].cancel()">关闭</a-button>
            </a-space>
            <a-button v-else @click="$refs['RE_' + business.id].cancel()">关闭</a-button>
          </template>
          <component
            :ref="`RE_${business.id}`"
            :is="'RE_' + business.renderer"
            :business="business"
          />
        </a-modal>
      </a-layout-content>
      <a-layout-footer
        :style="{ 'text-align': 'center', padding: '10px 50px' }"
      >Copyright © 2020 novicezk</a-layout-footer>
    </a-layout>
  </a-layout>
</template>
<script>
import RecursionMenu from "../components/tk/menu/RecursionMenu";
import MainHeader from "../components/MainHeader";
import { mapGetters, mapActions } from "vuex";

export default {
  components: {
    RecursionMenu,
    MainHeader
  },
  data() {
    return {
      baseUrl: process.env.BASE_URL,
      collapsed: false,
      selectedKeys: [],
      custom: ""
    };
  },
  computed: {
    ...mapGetters([
      "loadStatus",
      "currentBusiness",
      "childBusinesses",
      "menus",
      "loadMenu",
      "loadType"
    ]),
    businessName() {
      return this.$route.query.business;
    },
    customName() {
      return this.$route.query.custom;
    }
  },
  watch: {
    businessName() {
      this.tryExecute();
    }
  },
  methods: {
    ...mapActions([
      "loadMetaAsync",
      "executeBusiness",
      "getBusinessParams",
      "clearCurrentBusiness",
      "removeChildBusiness",
      "loadMenus"
    ]),
    tryExecute() {
      if (!this.businessName && this.currentBusiness) {
        this.clearCurrentBusiness();
      } else if (
        this.businessName &&
        (!this.currentBusiness ||
          this.businessName !== this.currentBusiness.standardName)
      ) {
        let entityId = this.$route.query.entityId;
        if (entityId) {
          this.executeBusiness({
            name: this.businessName,
            params: { entityId: entityId }
          });
        } else {
          this.getBusinessParams(this.businessName).then(params => {
            this.executeBusiness({
              name: this.businessName,
              params: params
            });
          });
        }
      }
    },
    handleSelect(item) {
      let menu = this.loadMenu(item.key);
      if (menu.linkType === "BUSINESS") {
        this.custom = null;
        location.hash = "#/?business=" + menu.target;
      } else if (menu.linkType === "CUSTOM") {
        this.clearCurrentBusiness();
        location.hash = "#/?custom=" + menu.target;
      }
    }
  },
  created() {
    Promise.all([this.loadMenus(), this.loadMetaAsync()]).then(reses => {
      let menus = reses[0];
      if (menus && menus.length && !this.businessName && !this.customName) {
        this.selectedKeys = [menus[0].id];
        this.handleSelect({ key: menus[0].id });
      } else {
        this.tryExecute();
      }
    });
  }
};
</script>
<style lang="less">
.dm-label {
  text-align: right;
  line-height: 32px;
  font-weight: bold;
}
.dm-component {
  text-align: left;
  line-height: 32px;
  .dm-verify-error {
    border-color: #f56c6c;
  }
}
.renderer-pannel {
  .ant-card-head {
    text-align: left;
  }
  .ant-card-body {
    padding: 12px;
  }
}
</style>
