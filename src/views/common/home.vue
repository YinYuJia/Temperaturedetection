<template>
  <div class="mod-home">
    <el-row :gutter="80" style="padding-top: 20px">
      <el-col :offset="1" :span="11">
        <el-card body-style="background-color:#f1f3f9" class="box-card" shadow="always">
          <div style="height: 760px;font-size: 26px">动态</div>
        </el-card>
      </el-col>
      <el-col style="padding-bottom: 20px" :offset="-1" :span="11">
        <el-card body-style="background-color:#f1f3f9" class="box-card" shadow="always">
          <div style="font-size: 26px">待办事项</div>
          <div style="height: 295px;overflow:hidden">
            <ul class="new-list" :class="{anim:animate}" @mouseenter="Stop()" @mouseleave="Up()">
              <li v-for="(item,index) in noticeList" :key="index">
                计划完成：{{item.startTime}}-内容：{{item.matterContent}}
              </li>
            </ul>
          </div>
        </el-card>
      </el-col>
      <el-col style="padding-top: 20px" :offset="-1" :span="11">
        <el-card body-style="background-color:#f1f3f9" class="box-card" shadow="always">
          <div style="height: 340px;font-size: 26px">已办事项</div>
        </el-card>
      </el-col>
    </el-row>
  </div>
</template>

<script>
  export default {
    data() {
      return {
        noticeList: [],
        animate: false,
        intNum: undefined,
      }
    },
    created: function () {
      this.getNoticeData();
    },
    methods: {
      getNoticeData() {
        this.$http({
          url: this.$http.adornUrl('/oa/oamatter/listByUser'),
          method: 'get',
          params: this.$http.adornParams({
            'page': 1,
            'limit': 50,
            'user_id':this.$store.state.user.userId ,
            'matterStatus': '0'
          })
        }).then(res => {
          this.noticeList = res.data.page.list;

          this.ScrollUp();

        });
      },
        ScrollUp() {
          if (this.noticeList.length > 20) {
            this.intNum = setInterval(() => {
              this.animate = true;// 向上滚动的时候需要添加css3过渡动画
              setTimeout(() => {
                this.noticeList.push(this.noticeList[0]);// 将数组的第一个元素添加到数组的
                this.noticeList.shift(); //删除数组的第一个元素
                this.animate = false;
              }, 500)
            }, 1000);
          }
        },
        //鼠标移上去停止
        Stop() {
          clearInterval(this.intNum);
        },
        Up() {
          this.ScrollUp();
        },
    }
  }
</script>

<style>
  .mod-home {
    line-height: 1.5;
  }

  .new-list {
    margin: 0;
    line-height: 28px;
    transition: top 0.5s;
  }

  .anim {
    transition: all 0.5s;
    margin-top: -28px;
  }
</style>

