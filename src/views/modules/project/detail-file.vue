<template>
  <el-form id="fileForm" v-loading="upLoading" :model="fileForm" ref="fileForm" label-width="120px" class="demo-fileForm">
    <el-form-item label="文件类型">
      <el-row>
        <el-col :span="4">
          <el-select style="width: 95%" v-model="fileType" placeholder="请选择文件类型">
            <el-option v-for="item in options" :key="item.dmId" :label="item.dmsm" :value="item.dmz"/>
          </el-select>
        </el-col>
        <el-col :span="12">
          <el-upload
            ref="upload"
            class="upload-demo"
            :before-upload="fileBeforeHandle"
            :http-request="fileUploadHandle"
            :show-file-list="false"
            action=""
            drag
            :auto-upload="true">
            <i class="el-icon-upload"></i>
            <div class="el-upload__text">将文件拖到此处，或<em>点击上传</em></div>
          </el-upload>
        </el-col>
      </el-row>
    </el-form-item>
    <el-form-item label="文件列表" prop="recordList">
      <el-table
        :data="dataList"
        border
        v-loading="dataListLoading"
        style="width: 100%;">
        <el-table-column prop="index" label="序号" width="80">
          <template slot-scope="scope">
            <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
          </template>
        </el-table-column>
        <el-table-column prop="fileName" label="文件名" header-align="center" align="center"/>
        <el-table-column prop="fileTypeName" label="文件类型" header-align="center" align="center" width="180"/>
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
      <el-pagination
        @size-change="sizeChangeHandle"
        @current-change="currentChangeHandle"
        :current-page="pageIndex"
        :page-sizes="[10, 20, 50, 100]"
        :page-size="pageSize"
        :total="totalCount"
        layout="total, sizes, prev, pager, next, jumper">
      </el-pagination>
    </el-form-item>
  </el-form>
</template>
<script>
  import {getOptions} from '@/utils/options.js'
  export default {
    data(){
      return {
        upLoading:false,
        projectId:undefined,
        options:[],
        fileForm:{},
        fileType:undefined,
        pageIndex:1,
        pageSize:10,
        totalCount:0,
        dataList:[],
        dataListLoading:false,
        dataForm:{
          foreignId :'',
          foreignType: ''
        }
      }
    },
    created(){
      // getOptions('WJLX').then(({data})=>{
      //   this.options = data.dmlxList
      // })
    },
    methods:{
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
      init(projectId){
        this.options = this.$store.state.options.options['WJLX']
        this.projectId = projectId
        this.$nextTick(() => {
          this.getFileList(projectId)
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
      getFileList(projectId){
        const param = {
          foreignId:projectId,
          foreignType:'2',
          page: this.pageIndex,
          limit: this.pageSize
        }
        this.$http({
          url: this.$http.adornUrl('/oa/oafile/list'),
          method: 'get',
          params: this.$http.adornParams(param)
        }).then(({data})=>{
          if(data.code == 0){
            this.dataList = data.page.list
            this.totalCount = data.page.totalCount
          }
        })
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getFileList(this.projectId)
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getFileList(this.projectId)
      },
      fileBeforeHandle(file, fileList){
        if(this.fileType==undefined){
          this.$message.warning("请选择文件类型")
          return false
        }else{
          return true
        }
      },
      fileUploadHandle(content) {
        const that = this
        let form = new FormData()
        form.append('file', content.file)
        form.append('foreignId', this.projectId)
        form.append('foreignType', '2')
        form.append('fileType', this.fileType)
        this.upLoading = true
        this.$http({
          url: this.$http.adornUrl('/oa/oafile/upload'),
          method: 'post',
          data: form
        }).then(({data})=>{
          if(data.code == 0){
            this.fileType = undefined
            this.getFileList(that.projectId)
            this.$message.success("文件上传成功")
          }else{
            this.$message.error(data.msg)
          }
          this.upLoading = false
        })
      },
    },
  }
</script>
