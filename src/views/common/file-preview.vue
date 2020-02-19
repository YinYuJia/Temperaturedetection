<template>
  <el-dialog top="1vh" :visible.sync="dialogVisible" append-to-body>
    <img width="100%" :src="dialogImageUrl" alt="">
  </el-dialog>
</template>
<script>
  export default {
    data(){
      return {
        dialogImageUrl: '',
        dialogVisible: false,
        disabled: false
      }
    },
    methods:{
      init(url){
        this.dialogImageUrl = url
        this.$nextTick(()=>{
          this.dialogVisible = true
        })
      }
    }
  }
</script>
