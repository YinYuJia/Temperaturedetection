<template>
  <el-dialog width="80%" :visible.sync="visible" title="采购信息详细" top="5vh"  :close-on-click-modal="false" z-index="10000">
    <el-tabs v-model="activeName">
      <el-tab-pane label="基本信息" name="info">
        <detail-info ref="detailInfo"></detail-info>
      </el-tab-pane>
      <el-tab-pane label="交流记录" name="record">
        <detail-record ref="detailRecord"></detail-record>
      </el-tab-pane>
      <el-tab-pane label="@事项" name="matter">
        <detail-assign ref="detailAssign"></detail-assign>
      </el-tab-pane>
      <el-tab-pane label="我的待办" name="myMatter">
        <detail-deal ref="detailDeal"></detail-deal>
      </el-tab-pane>
      <el-tab-pane label="附件列表" name="file">
        <detail-file ref="detailFile"></detail-file>
      </el-tab-pane>
    </el-tabs>
  </el-dialog>
</template>
<script>
  import detailInfo from './purchase-acceptance-detail'
  import detailRecord from './talkAbout'
  import detailFile from './purchase-file'
  import detailAssign from './purchase-assign'
  import detailDeal from './purchase-deal'
  export default {
    components:{
      detailInfo,
      detailRecord,
      detailFile,
      detailDeal,
      detailAssign
    },
    data() {
      return {
        visible:false,
        activeName:''
      }
    },
    mounted() {
    },
    created() {

    },
    methods: {
      init(id){
        this.activeName = 'info'
        this.visible = true
        this.$nextTick(() => {
          this.$refs.detailInfo.init(id)
          this.$refs.detailRecord.init(id)
          this.$refs.detailFile.init(id)
          this.$refs.detailAssign.init(id)
          this.$refs.detailDeal.init(id)
        })
      },
    }
  }
</script>
<style>
  #detailForm .el-form-item {
    margin-bottom: 5px
  }
</style>
