<template>
    <el-form id="infoForm" :model="infoForm" ref="infoForm" label-width="180px" class="demo-demandForm"  >
      <el-form-item :required="true" label="现状描述分析" prop="backDescrip">
        <el-input class="el-textarea1" 
        type="textarea" 
        :rows="4" 
        v-model="infoForm.backDescrip" 
        :disabled="true"></el-input>
      </el-form-item>
      <el-form-item :required="true" label="客户的解决方案" prop="solution">
        <el-input class="el-textarea1" type="textarea" :rows="4" v-model="infoForm.solution" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item :required="true" label="技术难点" prop="skill">
        <el-input class="el-textarea1" type="textarea" :rows="4" v-model="infoForm.skill" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item label="其他需求" prop="checkList">
        <el-checkbox-group v-model="infoForm.checkList">
          <el-checkbox label="论文"></el-checkbox>
          <el-checkbox label="专利"></el-checkbox>
          <el-checkbox label="软著"></el-checkbox>
          <el-checkbox label="查新"></el-checkbox>
          <el-checkbox label="第三方测试"></el-checkbox>
          <el-checkbox label="典型性经验"></el-checkbox>
          <el-checkbox label="管理创新"></el-checkbox>
          <el-checkbox label="QC"></el-checkbox>
          <el-checkbox label="报奖汇报PPT"></el-checkbox>
        </el-checkbox-group>
      </el-form-item>
      <el-form-item :required="true" label="已有材料" prop="existData">
        <el-input class="el-textarea1" type="textarea" :rows="3" v-model="infoForm.existData" :disabled="true"></el-input>
      </el-form-item>
      <el-form-item v-if="infoForm.fileList.length!=0" label="已上传文件列表" prop="fileList">
        <el-table
          :data="infoForm.fileList"
          border
          style="width: 100%;">
          <el-table-column prop="index" label="序号" width="80" header-align="center" align="center">
            <template slot-scope="scope">
              <span>{{ scope.$index + 1}}</span>
            </template>
          </el-table-column>
          <el-table-column prop="fileName" label="文件名" header-align="center" align="center"/>
          <el-table-column
            fixed="right"
            header-align="center"
            align="center"
            width="150"
            label="操作">
            <template slot-scope="scope">
              <el-button type="text" @click="downFileHandle(scope.row)">下载</el-button>
              <el-button type="text" @click="deleteFileHandle(scope.row)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
</template>
<script>
  export default {
    data() {
      return {
        infoForm: {
          backDescrip: '',
          solution: '',
          skill: '',
          existData: '',
          checkList: [],
          fileList:[]
        },
      }
    },
    mounted() {
      // this.getRecordData();
    },
    created() {
    },
    methods: {
      init(id){
        this.$http({
          url: this.$http.adornUrl('/oa/oadialog/info/' + id),
          method: 'get'
        }).then(({data}) => {
          if (data && data.code === 0) {
            this.infoForm = data.oaDialog
            const otherRequirement = data.oaDialog.otherRequirement
            const list = otherRequirement == null ? [] : otherRequirement.split(",");
            this.infoForm.checkList = list
            this.infoForm.fileList = data.oaDialog.fileList;
          }
        })
      },
      // 删除文件
      deleteFileHandle(row) {
        this.$http({
          url: this.$http.adornUrl('/oa/oafile/delete/' + row.fileId),
          method: 'get'
        }).then(({data}) => {
          if (data.code == 0) {
            this.$message.success("删除成功")
            this.getFileList(this.projectId)
          } else {
            this.$message.error(data.msg)
          }
        })
      },
      downFileHandle(row){
        const that = this
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        xhr.open('get',window.SITE_CONFIG['baseUrl']+'/oa/oafile/down/'+row.fileId);  //url填写后台的接口地址，如果是post，在formData append参数（参考原文地址）
        xhr.setRequestHeader("tunnel_token", this.$cookie.get("tunnel_token"));
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
          if (this.status == 200&&this.response!=null&&this.response.size>0) {
            const blob = this.response;
            const filename = row.fileName;
            if (window.navigator.msSaveOrOpenBlob) {
              navigator.msSaveBlob(blob, filename);
            } else {
              const a = document.createElement('a');
              const url = URL.createObjectURL(blob);
              a.href = url;
              a.download = filename;
              document.body.appendChild(a);
              a.click();
              window.URL.revokeObjectURL(url);
            }
          }else{
            that.$message.error("下载失败，请联系管理人员")
          }
        };
        xhr.send(formData);
      },
    }
  }
</script>
<style>

</style>
