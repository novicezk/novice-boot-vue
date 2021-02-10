<template>
  <div>Renderer</div>
</template>

<script>
import { mapGetters, mapActions } from "vuex";
import { ExclamationCircleOutlined } from "@ant-design/icons-vue";
import { createVNode } from "vue";
import { Modal } from "ant-design-vue";
export default {
  props: {
    business: Object,
    windows: {
      type: Boolean,
      default: false,
    },
  },
  data() {
    return {
      entity: null,
    };
  },
  computed: {
    ...mapGetters(["loadBusiness", "loadAction", "loadType", "loadField"]),
    isPannel() {
      return !(this.business.view && this.business.view.windows) && !this.windows;
    },
    rendererTitle() {
      return (
        this.business.title ||
        this.business.displayAs + this.loadType(this.business.typeId).displayAs
      );
    },
  },
  watch: {
    business() {
      this.rendererInit();
      this.refresh();
    },
  },
  methods: {
    ...mapActions([
      "executeBusiness",
      "executeAction",
      "backBusiness",
      "removeChildBusiness",
      "syncBusinessParams",
    ]),
    getOperationParams() {},
    rendererInit() {},
    refresh() {},
    close() {
      if (this.isPannel) {
        this.backBusiness();
      } else {
        this.removeChildBusiness(this.business);
        if (this.business.callback) {
          this.business.callback(this);
        }
      }
    },
    cancel() {
      if (this.isPannel) {
        this.backBusiness();
      } else {
        this.removeChildBusiness(this.business);
      }
    },
    getFieldComponents() {
      let dms = [];
      for (const key in this.$refs) {
        if (key.startsWith("dm-")) {
          let dm = this.$refs[key];
          if (dm) dms.push(dm);
        }
      }
      return dms;
    },
    executeInitAction(params = {}, callback) {
      if (!this.business.initAction) return;
      this.executeAction({
        name: this.business.initAction,
        typeId: this.business.typeId,
        params: params,
        callback: callback,
      });
    },
    executeDefaultOperation() {
      let defaultOpe = this.business.operations.find((ope) => ope.defaultOpe);
      if (defaultOpe) this.executeOperation(defaultOpe);
    },
    executeOperation(operation) {
      let page = this;
      let context = {
        name: operation.target,
        typeId: this.business.typeId,
        callback: () => {
          switch (operation.callbackMode) {
            case "CLOSE":
              page.close();
              break;
            case "REFRESH":
              page.refresh();
              break;
          }
        },
      };
      if (!this.targetModeIsCollection(operation)) {
        try {
          context.params = this.getOperationParams();
        } catch (error) {
          console.error(error);
          return;
        }
      }
      if (operation.type === "BUSINESS") {
        this.executeBusiness(context);
      } else if (operation.type === "ACTION") {
        this.executeAction(context);
      } else {
        eval(operation.target);
      }
    },
    confirm(title) {
      return new Promise((resolve) => {
        Modal.confirm({
          title: title,
          icon: createVNode(ExclamationCircleOutlined),
          onOk() {
            resolve();
          },
        });
      });
    },
    operationAvailable(operation, entity) {
      return entity || this.targetModeIsCollection(operation);
    },
    targetModeIsCollection(operation) {
      let target =
        operation.type === "ACTION"
          ? this.loadAction(this.business.typeId, operation.target)
          : this.loadBusiness(this.business.typeId, operation.target);
      return target && target.mode === "COLLECTION";
    },
  },
  created() {
    this.rendererInit();
    this.refresh();
  },
};
</script>
