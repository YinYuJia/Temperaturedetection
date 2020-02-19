<template>
  <div>
    <!-- <el-radio-group v-model="isCollapse" style="margin-bottom: 20px;">
      <el-radio-button :label="false">展开</el-radio-button>
      <el-radio-button :label="true">收起</el-radio-button>
    </el-radio-group> -->
    <el-menu
      ref="sideHeight"
      class="side_navbar"
      text-color="#ffffff"
      background-color="#232629"
      mode="vertical"
      :uniqueOpened="true"
    >
    <!-- 首页暂时隐藏 -->
      <!-- <el-menu-item index="home" @click="$router.push({ name: 'home' })">
        <span class="menu-title">首页</span>
      </el-menu-item> -->
      <sub-menu
        v-for="menu in menuList"
        :key="menu.menuId"
        :menu="menu"
        :dynamicMenuRoutes="dynamicMenuRoutes"

      ></sub-menu>
    </el-menu>
  </div>
</template>
<script>
import SubMenu from "./main-sidebar-sub-menu";
import { isURL } from "@/utils/validate";
export default {
  data() {
    return {
      updatePassowrdVisible: false,
      dynamicMenuRoutes: [],
      time: "",
      date: "",
      weekday: "",
      isCollapse:true
    };
  },
  components: {
    SubMenu
  },
  computed: {
    navbarLayoutType: {
      get() {
        return this.$store.state.common.navbarLayoutType;
      }
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      },
      set(val) {
        this.$store.commit("common/updateSidebarFold", val);
      }
    },
    mainTabs: {
      get() {
        return this.$store.state.common.mainTabs;
      },
      set(val) {
        this.$store.commit("common/updateMainTabs", val);
      }
    },
    name: {
      get() {
        return this.$store.state.user.name;
      }
    },
    userName: {
      get() {
        return this.$store.state.user.userName;
      }
    },
    sidebarLayoutSkin: {
      get() {
        return this.$store.state.common.sidebarLayoutSkin;
      }
    },
    menuList: {
      get() {
        return this.$store.state.common.menuList;
      },
      set(val) {
        this.$store.commit("common/updateMenuList", val);
      }
    },
    menuActiveName: {
      get() {
        return this.$store.state.common.menuActiveName;
      },
      set(val) {
        this.$store.commit("common/updateMenuActiveName", val);
      }
    },
    mainTabsActiveName: {
      get() {
        return this.$store.state.common.mainTabsActiveName;
      },
      set(val) {
        this.$store.commit("common/updateMainTabsActiveName", val);
      }
    }
  },

  methods: {
    // ----------------------------------------

    collapse:function(){
    this.collapsed=!this.collapsed;
    var menuWidth = document.getElementById('menuClass');
    if(menuWidth.offsetWidth===0){
      menuWidth.style.width = "230px"
    }
  },

    // ----------------------------------------

    zeroPadding(num, digit) {
      let zero = "";
      for (let i = 0; i < digit; i++) {
        zero += "0";
      }
      return (zero + num).slice(-digit);
    },
    // 路由操作
    routeHandle(route) {
      if (route.meta.isTab) {
        // tab选中, 不存在先添加
        var tab = this.mainTabs.filter(item => item.name === route.name)[0];
        if (!tab) {
          if (route.meta.isDynamic) {
            route = this.dynamicMenuRoutes.filter(
              item => item.name === route.name
            )[0];
            if (!route) {
              return console.error("未能找到可用标签页!");
            }
          }
          tab = {
            menuId: route.meta.menuId || route.name,
            name: route.name,
            title: route.meta.title,
            type: isURL(route.meta.iframeUrl) ? "iframe" : "module",
            iframeUrl: route.meta.iframeUrl || ""
          };
          this.mainTabs = this.mainTabs.concat(tab);
        }
        this.menuActiveName = tab.menuId + "";
        this.mainTabsActiveName = tab.name;
      }
    }
  },
  watch: {
    $route: "routeHandle"
  },
  created() {
    this.menuList = JSON.parse(sessionStorage.getItem("menuList") || "[]");
    this.dynamicMenuRoutes = JSON.parse(
      sessionStorage.getItem("dynamicMenuRoutes") || "[]"
    );
    this.routeHandle(this.$route);
  }
};
</script>
<style scoped>
</style>

