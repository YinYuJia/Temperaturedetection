<template>
  <nav class="site-navbar" :class="'site-navbar--' + navbarLayoutType">
    <!--<logo></logo>-->
    <div class="site-navbar__header " style="z-index:2147483647;">
      <h1 class="site-navbar__brand" @click="$router.push({ name: 'home' })">
        <a class="site-navbar__brand-lg " style="z-index:2147483647;"  href="javascript:;">体温检测管理系统</a>
      </h1>
    </div>
    
    <div class="site-navbar__body clearfix">
        <el-menu
          :default-active="menuActiveName || 'home'"
          :collapse="sidebarFold"
          :collapseTransition="false"
          class="site-navbar__menu"  mode="horizontal" text-color="#ffffff" background-color="#232629"
          active-text-color="#2ab3a5">
          <el-menu-item class="site-navbar__avatar" index="3">
            <el-dropdown :show-timeout="0" placement="bottom">
            <span class="el-dropdown-link">
              <img src="~@/assets/img/avatar.png" :alt="name"><font style="color: #ffffff">{{ name }}</font>
            </span>
              <el-dropdown-menu slot="dropdown">
                <el-dropdown-item @click.native="updatePasswordHandle()">修改密码</el-dropdown-item>
                <el-dropdown-item @click.native="logoutHandle()">退出</el-dropdown-item>
              </el-dropdown-menu>
            </el-dropdown>
          </el-menu-item>
          <el-menu-item index="time">
            <div class="right-menu-text-div">
              <div class="right-menu-time">{{ time }}</div>
              <div class="right-menu-date">{{ date }}&nbsp;&nbsp;{{ weekday }}</div>
            </div>
          </el-menu-item>
        </el-menu>
        
    </div>
    <!-- 弹窗, 修改密码 -->
    <update-password v-if="updatePassowrdVisible" ref="updatePassowrd"></update-password>
  </nav>
</template>

<script>
  import UpdatePassword from './main-navbar-update-password'
  import SubMenu from './main-sidebar-sub-menu'
  import { isURL } from '@/utils/validate'
  import logo from './common/Logo'

  export default {
    data () {
      return {
        updatePassowrdVisible: false,
        dynamicMenuRoutes: [],
        time:'',
        date:'',
        weekday:''
      }
    },
    components: {
      UpdatePassword,
      SubMenu,
      logo
    },
    computed: {
      navbarLayoutType: {
        get () { return this.$store.state.common.navbarLayoutType }
      },
      sidebarFold: {
        get () { return this.$store.state.common.sidebarFold },
        set (val) { this.$store.commit('common/updateSidebarFold', val) }
      },
      mainTabs: {
        get () { return this.$store.state.common.mainTabs },
        set (val) { this.$store.commit('common/updateMainTabs', val) }
      },
      name: {
        get () { return this.$store.state.user.name }
      },
      userName: {
        get () { return this.$store.state.user.userName }
      },
      sidebarLayoutSkin: {
        get () { return this.$store.state.common.sidebarLayoutSkin }
      },
      menuList: {
        get () { return this.$store.state.common.menuList },
        set (val) { this.$store.commit('common/updateMenuList', val) }
      },
      menuActiveName: {
        get () { return this.$store.state.common.menuActiveName },
        set (val) { this.$store.commit('common/updateMenuActiveName', val) }
      },
      mainTabsActiveName: {
        get () { return this.$store.state.common.mainTabsActiveName },
        set (val) { this.$store.commit('common/updateMainTabsActiveName', val) }
      }
    },
    mounted() {
      this.updateTime();
      setInterval(this.updateTime, 1000)
     
    },
    methods: {
      updateTime(){
        let cd = new Date();
        let weekdays=["周日","周一","周二","周三","周四","周五","周六"];
        this.time = this.zeroPadding(cd.getHours(), 2) + ':' + this.zeroPadding(cd.getMinutes(), 2) + ':' + this.zeroPadding(cd.getSeconds(), 2);
        this.date = this.zeroPadding(cd.getFullYear(), 4) + '-' + this.zeroPadding(cd.getMonth()+1, 2) + '-' + this.zeroPadding(cd.getDate(), 2)+' ';
        this.weekday = weekdays[cd.getDay()];
      },
      zeroPadding(num, digit) {
        let zero = '';
        for(let i = 0; i < digit; i++) {
          zero += '0';
        }
        return (zero + num).slice(-digit);
      },
      // 修改密码
      updatePasswordHandle () {
        this.updatePassowrdVisible = true
        this.$nextTick(() => {
          this.$refs.updatePassowrd.init()
        })
      },
      // 退出
      logoutHandle () {
        this.$confirm(`确定进行[退出]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.$http({
            url: this.$http.adornUrl('/sys/logout'),
            method: 'post',
            data: this.$http.adornData()
          }).then(({data}) => {
            if (data && data.code === 0) {
              this.$cookie.delete('tunnel_token')
              this.$router.push({ name: 'login' }, () => {
                location.reload() // 刷新页面, 清空整站临时存储数据
              })
            }
          })
        }).catch(() => {})
      },
      // 路由操作
      routeHandle (route) {
        if (route.meta.isTab) {
          // tab选中, 不存在先添加
          var tab = this.mainTabs.filter(item => item.name === route.name)[0]
          if (!tab) {
            if (route.meta.isDynamic) {
              route = this.dynamicMenuRoutes.filter(item => item.name === route.name)[0]
              if (!route) {
                return console.error('未能找到可用标签页!')
              }
            }
            tab = {
              menuId: route.meta.menuId || route.name,
              name: route.name,
              title: route.meta.title,
              type: isURL(route.meta.iframeUrl) ? 'iframe' : 'module',
              iframeUrl: route.meta.iframeUrl || ''
            }
            this.mainTabs = this.mainTabs.concat(tab)
          }
          this.menuActiveName = tab.menuId + ''
          this.mainTabsActiveName = tab.name
        }
      }
    },
    watch: {
      $route: 'routeHandle'
    },
    created () {
      this.menuList = JSON.parse(sessionStorage.getItem('menuList') || '[]')
      this.dynamicMenuRoutes = JSON.parse(sessionStorage.getItem('dynamicMenuRoutes') || '[]')
      this.routeHandle(this.$route)
      }
    }
</script>
