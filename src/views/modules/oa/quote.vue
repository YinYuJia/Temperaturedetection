<template>
  <div class="mod-config">
    <el-form :inline="true" :model="dataForm" @keyup.enter.native="getDataList()">
      <el-form-item>
        <el-input v-model="dataForm.quoteName" placeholder="请输入项目名称" clearable></el-input>
      </el-form-item>
      <el-form-item>
        <el-button @click="query">查询</el-button>
        <el-button v-if="isAuth('oa:oaquote:save')" type="primary" @click="addOrUpdateHandle()">新增</el-button>
        <el-button type="primary" @click="exportHandle()" :disabled="dataListSelections.length != 1">导出</el-button>
      </el-form-item>
    </el-form>
    <el-table
      :data="dataList"
      border
      v-loading="dataListLoading"
      @selection-change="selectionChangeHandle"
      @row-dblclick="tableDbClickHandle"
      style="width: 100%;">
      <el-table-column
        type="selection"
        header-align="center"
        align="center"
        width="50">
      </el-table-column>
      <el-table-column prop="index"
                       header-align="center"
                       align="center" label="序号" width="80">
        <template slot-scope="scope">
          <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
        </template>
      </el-table-column>
      <el-table-column
        prop="partya"
        header-align="center"
        align="center"
        label="甲方">
      </el-table-column>
      <el-table-column
        prop="partyb"
        header-align="center"
        align="center"
        label="乙方">
      </el-table-column>
      <el-table-column
        prop="quoteName"
        header-align="center"
        align="center"
        label="项目名称">
      </el-table-column>
      <el-table-column
        prop="quoteRequire"
        header-align="center"
        align="center"
        label="项目要求与功能">
      </el-table-column>
      <el-table-column
        prop="startTime"
        header-align="center"
        align="center"
        label="预计开始时间">
      </el-table-column>
      <el-table-column
        prop="endTime"
        header-align="center"
        align="center"
        label="预计截至时间">
      </el-table-column>
      <el-table-column
        prop="creatorName"
        header-align="center"
        align="center"
        label="创建人">
      </el-table-column>
      <el-table-column
        fixed="right"
        header-align="center"
        align="center"
        width="150"
        label="操作">
        <template slot-scope="scope">
          <el-button type="text" size="small" @click="addOrUpdateHandle(scope.row.quoteId)">修改</el-button>
          <el-button type="text" size="small" @click="deleteHandle(scope.row.quoteId)">删除</el-button>
        </template>
      </el-table-column>
    </el-table>
    <el-pagination
      @size-change="sizeChangeHandle"
      @current-change="currentChangeHandle"
      :current-page="pageIndex"
      :page-sizes="[10, 20, 50, 100]"
      :page-size="pageSize"
      :total="totalPage"
      layout="total, sizes, prev, pager, next, jumper">
    </el-pagination>
    <!-- 弹窗, 新增 / 修改 -->
    <add-or-update v-if="addOrUpdateVisible" ref="addOrUpdate" @refreshDataList="getDataList" z-index="10000"></add-or-update>
    <quote-info v-if="detailVisible"  ref="quoteInfo" z-index="10000"></quote-info>
  </div>
</template>

<script>
  import API from '@/api'
  import AddOrUpdate from './quote-add-or-update'
  import isInteger from 'lodash/isInteger'
  import quoteInfo from './quote-info'
  export default {
    data () {
      return {
        dataForm: {
          quoteName: ''
        },
        dataList: [],
        pageIndex: 1,
        pageSize: 10,
        totalPage: 0,
        dataListLoading: false,
        dataListSelections: [],
        addOrUpdateVisible: false,
        detailVisible: false
      }
    },
    components: {
      AddOrUpdate,
      quoteInfo
    },
    activated () {
      this.getDataList()
    },
    methods: {
        tableDbClickHandle(oaQuote){
        this.handleDetailClick(oaQuote.quoteId)
        
      },
      handleDetailClick(quoteId) {
        this.detailVisible = true;
        this.$nextTick(()=>{
          this.$refs.quoteInfo.init(quoteId);
        })
      },
      // 获取数据列表
      getDataList () {
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          quoteName: this.dataForm.quoteName
        }
        API.oaquote.list(params).then(({data}) => {
          if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalPage = data.page.totalCount
          } else {
            this.dataList = []
            this.totalPage = 0
          }
          this.dataListLoading = false
        })
      },
      query(){
        this.pageIndex = 1
        this.getDataList()
      },
      // 每页数
      sizeChangeHandle (val) {
        this.pageSize = val
        this.pageIndex = 1
        this.getDataList()
      },
      // 当前页
      currentChangeHandle (val) {
        this.pageIndex = val
        this.getDataList()
      },
      // 多选
      selectionChangeHandle (val) {
        this.dataListSelections = val
      },
      exportHandle(){
        const id = this.dataListSelections[0].quoteId
        if(id==null||id==''){
          return this.$message.warning("请选择一条数据导出")
        }
        const that = this
        const xhr = new XMLHttpRequest();
        const formData = new FormData();
        xhr.open('get',window.SITE_CONFIG['baseUrl']+'/oa/oaquote/export' + (isInteger(id) ? `/${id}` : ''));  //url填写后台的接口地址，如果是post，在formData append参数（参考原文地址）
        xhr.setRequestHeader("tunnel_token", this.$cookie.get("tunnel_token"));
        xhr.responseType = 'blob';
        xhr.onload = function (e) {
          if (this.status == 200&&this.response!=null&&this.response.size>0) {
            const blob = this.response;
            const filename = that.dataListSelections[0].quoteName+".xlsx";
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
        // http({
        //   url: http.adornUrl('/oa/oaquote/export' + (isInteger(id) ? `/${id}` : '')),
        //   method: 'get',
        //   params: http.adornParams({}, 'get')
        // }).then((res)=>{
        //   const blob = res.data;
        //   const filename = 'test.xlsx';
        //   if (window.navigator.msSaveOrOpenBlob) {
        //     navigator.msSaveBlob(blob, filename);
        //   } else {
        //     const a = document.createElement('a');
        //     const url = URL.createObjectURL(new Blob([blob],{type:'charset=utf-8'}));
        //     a.href = url;
        //     a.download = filename;
        //     document.body.appendChild(a);
        //     a.click();
        //     window.URL.revokeObjectURL(url);
        //   }
        // })
      },
      // 新增 / 修改
      addOrUpdateHandle (id) {
        this.addOrUpdateVisible = true
        this.$nextTick(() => {
          this.$refs.addOrUpdate.init(id)
        })
      },
      // 删除
      deleteHandle (id) {
        var ids = id ? [id] : this.dataListSelections.map(item => {
          return item.quoteId
        })
        this.$confirm(`确定对[id=${ids.join(',')}]进行[${id ? '删除' : '批量删除'}]操作?`, '提示', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          API.oaquote.del(ids).then(({data}) => {
            if (data && data.code === 0) {
              this.$message({
                message: '操作成功',
                type: 'success',
                duration: 1500,
                onClose: () => {
                  this.getDataList()
                }
              })
            } else {
              this.$message.error(data.msg)
            }
          })
        })
      }
    }
  }
</script>
