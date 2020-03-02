<template>
  <el-dialog width="70%" title="信用分详情" :close-on-click-modal="false" :visible.sync="visible">
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="80px"
    >
      <el-row>
        <el-col :span="12">
          <el-form-item label="用户名" prop="userName" >
            <el-input v-model="dataForm.userName" placeholder="请输入用户名" :disabled="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="信用分值" prop="scoreValue">
            <el-input v-model="dataForm.scoreValue" placeholder :disabled="true"></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="信用详情" prop="scoreValue">
          <el-table
            :data="dataList"
            border
            row-key="matterId"
            v-loading="dataListLoading"
            style="width: 100%;"
          >
            <el-table-column
              prop="index"
              header-align="center"
              align="center"
              label="序号"
              width="80"
            >
              <template slot-scope="scope">
                <span>{{(pageIndex - 1) * pageSize + scope.$index + 1}}</span>
              </template>
            </el-table-column>
            <el-table-column
              prop="scoreDetailTypeName"
              header-align="center"
              align="center"
              label="类型"
            ></el-table-column>
            <el-table-column
              prop="operate"
              header-align="center"
              align="center"
              label="操作"
              ></el-table-column>
            <el-table-column 
              prop="value" 
              header-align="center" 
              align="center" 
              label="剩余分"
              ></el-table-column>
            <el-table-column 
              prop="createTime" 
              header-align="center" 
              align="center" 
              label="创建时间"
              width="200"
              ></el-table-column>
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
        </el-col>
      </el-row>
    </el-form>
  </el-dialog>
</template>

<script>
import http from "@/utils/httpRequest.js";
export default {
  data() {
    return {
      pageIndex : 1,
      pageSize :10,
      tableData : [],
      visible : false,
      userOptions : [],
      selectData : [],
      totalCount : 0,
      dataList:[],
      dataListLoading: false,
      dataForm: {
        scoreId: 0,
        scoreValue: "",
        userId: "",
        userName: "",
        detailList: []
      },
      dataRule: {
        scoreId: [{ required: true /* message: '', trigger: 'blur' */ }],
        scoreValue: [{ required: true /* message: '', trigger: 'blur' */ }],
        userId: [{ required: true /* message: '', trigger: 'blur' */ }],
        userName: [{ required: true /* message: '', trigger: 'blur' */ }]
      }
    };
  },
  created() {
  },
  methods: {
    init(scoreId) {
      this.dataForm.scoreId = scoreId;
      this.visible = true;
      // this.$nextTick(() => {
      //   this.$refs['dataForm'].resetFields()
      //   if (this.dataForm.scoreId) {
      //     API.oascore.list(this.dataForm.scoreId).then(({data}) => {
      //       if (data && data.code === 0) {
      //         this.dataForm.scoreId = data.oaScore.scoreId
      //         this.dataForm.userName = data.oaScore.userName
      //         this.dataForm.userId = data.oaScore.userId
      //         this.dataForm.scoreId = data.oaScore.scoreId
      //       }
      //     })
      //   }
      // })
      http({
        url: http.adornUrl("/oa/oascore/info/" + scoreId),
        method: "get"
      }).then(({ data }) => {
        if (data && data.code === 0) {
          this.dataForm = data.oaScore;
          this.getDataList()
        }
      });
    },
    getDataList () {
        this.dataListLoading = true
        var params = {
          page: this.pageIndex,
          limit: this.pageSize,
          user_id: this.dataForm.userId,
        }
        http({
        url: http.adornUrl("/oa/oascoredetail/list"),
        method: "get",
        params: http.adornParams(params, 'get')
      }).then(({ data }) => {
        if (data && data.code === 0) {
            this.dataList = data.page.list
            this.totalCount = data.page.totalCount
          } else {
            this.$message.error(data.msg)
          }
          this.dataListLoading = false
      });
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
    // 表单提交
  }
};
</script>
