<template>
  <div
    class="site-wrapper"
    :class="{ 'site-sidebar--fold': sidebarFold }"
    v-loading.fullscreen.lock="loading"
    element-loading-text="拼命加载中"
  >
    <template v-if="!loading">
      <el-container :style="{ 'height': (documentClientHeight) + 'px' }" >
        <el-aside  :style="{ 'width': (width)+'px' }" style="margin-top:60px;z-index:1000;overflow-x:hidden;" class="s transtion">
          <div class="side-bg">
            <!--      改变宽度   -->
            <main-side />
          </div>
        </el-aside>
             <img @click="show" src="../../static/img/open-or-close/open-or-close.png" class="closeOrOpen" :style="{ 'left': (width)+'px' }">

        <el-container>
          <el-header style="text-align: right; font-size: 12px">
            <main-navbar />
          </el-header>

          <el-main>
            <!-- class="s" 控制主题内容垂直方向滚动条隐藏-->
            <div
              class="site-content__wrapper__new"
              :style="{ 'min-height': (documentClientHeight-100) + 'px' }"
            >
              <main-content ref="navTopLeft" />
            </div>
          </el-main>
        </el-container>
      </el-container>
    </template>
  </div>
</template>
<script></script>

<style>
/* .el-header {
    background-color: #B3C0D1;
    color: #333;
    line-height: 60px;
  }
   */
.s::-webkit-scrollbar {
  display: none;
}
.side-bg {
  width: 176px;
  height: 100%;
  background-color: #232629;
}
.site-content__wrapper__new {
  position: relative;
  padding-top: -5px !important;
  background: #f1f4f5;
}
.transtion{
  transition: .5s;
}
.closeOrOpen{
  width:5px;
  height:50px;
  position: absolute;
  top:50%;
  z-index:11111;
  background-color: #232629;
  border-top-right-radius: 50%;
  border-bottom-right-radius: 50%;
  transition: .5s;
  cursor: pointer;
}
</style>

<script>
import MainNavbar from "./main-navbar";
import MainContent from "./main-content";
import MainSide from "./main-side";
import { constants } from 'fs';
export default {
  data() {
    return {
      loading: true,
      minLength: '',
      collapsed: false,
      width:175,
    };
  },
  components: {
    MainNavbar,
    MainContent,
    MainSide
  },
  computed: {
    documentClientHeight: {
      get() {
        return this.$store.state.common.documentClientHeight;
      },
      set(val) {
        this.$store.commit("common/updateDocumentClientHeight", val);
      }
    },
    sidebarFold: {
      get() {
        return this.$store.state.common.sidebarFold;
      }
    },
    userId: {
      get() {
        return this.$store.state.user.id;
      },
      set(val) {
        this.$store.commit("user/updateId", val);
      }
    },
    options: {
      get() {
        return this.$store.state.options.options;
      },
      set(val) {
        this.$store.commit("options/updateOptions", val);
      }
    },
    name: {
      get() {
        return this.$store.state.user.name;
      },
      set(val) {
        this.$store.commit("user/updateName", val);
      }
    },
    userName: {
      get() {
        return this.$store.state.user.userName;
      },
      set(val) {
        this.$store.commit("user/updateUserName", val);
      }
    },
    gCode: {
      get() {
        return this.$store.state.user.gCode;
      },
      set(val) {
        this.$store.commit("user/updateGcode", val);
      }
    },
    gName: {
      get() {
        return this.$store.state.user.gName;
      },
      set(val) {
        this.$store.commit("user/updateGname", val);
      }
    },
    scsj: {
      get() {
        return this.$store.state.user.scsj;
      },
      set(val) {
        this.$store.commit("user/updateScsj", val);
      }
    },
    scip: {
      get() {
        return this.$store.state.user.scip;
      },
      set(val) {
        this.$store.commit("user/updateScip", val);
      }
    },
    roleId: {
      get() {
        return this.$store.state.user.roleId;
      },
      set(val) {
        this.$store.commit("user/updateRoleId", val);
      }
    }
  },
  created() {
    this.getUserInfo();
    this.getOptions()
  },
  mounted() {
    this.resetDocumentClientHeight();
  },
  methods: {
    show(){
      this.collapsed=!this.collapsed
      if(this.collapsed==true){
        this.width=0
      }else{
        this.width=175
      }
      console.log(this.width)
      this.$nextTick(()=>{
        this.$refs.navTopLeft.leftWidth()
      })
    },
    // 重置窗口可视高度
    resetDocumentClientHeight() {
      this.documentClientHeight = document.documentElement["clientHeight"];
      window.onresize = () => {
        this.documentClientHeight = document.documentElement["clientHeight"];
        this.minLength= `${document.documentElement["clientHeight"]}px`
      };
    },
    // 获取当前管理员信息
    getUserInfo() {
      this.$http({
        url: this.$http.adornUrl("/sys/user/info"),
        method: "get",
        params: this.$http.adornParams()
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.loading = false;
          this.userId = data.user.userId;
          this.userName = data.user.username;
          this.name = data.user.name;
          this.gCode = data.user.gCode;
          this.gName = data.user.gName;
          this.scsj = data.user.scsj;
          this.scip = data.user.scip;
          this.roleId = data.roleId;
        }
      });
    },
    getOptions() {
      this.$http({
        url: this.$http.adornUrl("/sys/config/allList"),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.options = data.options
        }
      });
    }
  }
};
</script>
