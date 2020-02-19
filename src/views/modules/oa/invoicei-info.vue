<template>
  <el-dialog
    width="80%"
    top="10vh"
    title="开票详细"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="110px" >
      <el-row>
        <el-col :span="24">
          <el-form-item label="项目" prop="projectId">
            <el-select filterable style="width: 100%" v-model="dataForm.projectId" placeholder="请选择"   >
              <el-option v-for="item in selectData" :key="item.key" :label="item.label" :value="item.value"/>
            </el-select>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="24">
          <el-form-item label="开票信息" prop="invoiceiInfo">
            <el-input v-model="dataForm.invoiceiInfo" placeholder="请输入开票信息" maxlength="250" :show-word-limit="true" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开票单位" prop="invoiceiUnit">
            <el-input v-model="dataForm.invoiceiUnit" placeholder="请输入开票单位" maxlength="25" :show-word-limit="true"></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="合同金额" prop="contractAmount">
            <el-input v-model="dataForm.contractAmount" placeholder="请输入合同金额" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-row>
        <el-col :span="12">
          <el-form-item label="开票百分比" prop="invoiceiPercent">
            <el-input v-model="dataForm.invoiceiPercent" placeholder="请输入开票百分比" ></el-input>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="开票金额" prop="invoiceiAmount">
            <el-input v-model="dataForm.invoiceiAmount" placeholder="请输入金额" ></el-input>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="详细信息" :required="true" label-width="85px" prop="detailData">
        <el-table
          :data="dataForm.detailData"
          border
        >
          <el-table-column type="index" width="50"
                           label="序号" header-align="center" align="center">
          </el-table-column>
          <el-table-column label="款项名称" header-align="center" align="center" prop="name">
          </el-table-column>
          <el-table-column width="240" label="回款时间" header-align="center" align="center" prop="time">
          </el-table-column>
          <el-table-column width="150" label="百分比" header-align="center" align="center" prop="percent">
          </el-table-column>
          <el-table-column width="150"
                           label="金额" header-align="center" align="center" prop="amount">
          </el-table-column>
          <el-table-column width="150" label="未收款" prop="unpaid" header-align="center" align="center">
          </el-table-column>
        </el-table>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  import {getMatterUserList} from '@/utils/options.js'
  export default {
    data () {
      return {
        visible: false,
        userOptions : [],
        selectData : [],
        dataForm: {
          invoiceiId : 0,
          invoiceiInfo : '',
          invoiceiTime : undefined,
          invoiceiUnit : '',
          invoiceiAmount : '',
          planTime : undefined,
          creator : '',
          createTime : '',
          actualTime : undefined,
          contractAmount : '',
          invoiceiPercent :'',
          projectId : '',
          projectName : ''
        },
        dataRule: {
          invoiceiInfo: [
            { required: true,/* message: '开票信息不能为空', trigger: 'blur' */}
          ],
          invoiceiUnit: [
            { required: true,/* message: '开票单位不能为空', trigger: 'blur'*/ }
          ],
          invoiceiAmount: [
            { required: true,/* message: '金额不能为空', trigger: 'blur' */}
          ],
          invoiceiPercent: [
            { required: true,/* message: '开票百分比不能为空', trigger: 'blur'*/ }
          ],
          contractAmount: [
            { required: true,/* message: '合同金额不能为空', trigger: 'blur'*/ }
          ],
          projectId: [
            { required: true,/* message: '合同金额不能为空', trigger: 'blur'*/ }
          ]
        }
      }
    },
     created() {
      getMatterUserList().then(({data}) => {
        this.userOptions = data.userList
      })
          this.getSelectData()
    },
    
    methods: {
      init (id) {
        this.dataForm.invoiceiId = id || 0
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.invoiceiId) {
            API.oainvoicei.info(this.dataForm.invoiceiId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.invoiceiInfo = data.oaInvoicei.invoiceiInfo
                this.dataForm.invoiceiTime = data.oaInvoicei.invoiceiTime
                this.dataForm.invoiceiUnit = data.oaInvoicei.invoiceiUnit
                this.dataForm.invoiceiAmount = data.oaInvoicei.invoiceiAmount
                this.dataForm.planTime = data.oaInvoicei.planTime
                this.dataForm.contractAmount = data.oaInvoicei.contractAmount
                this.dataForm.invoiceiPercent = data.oaInvoicei.invoiceiPercent
                this.dataForm.actualTime = data.oaInvoicei.actualTime
                this.dataForm.projectId = data.oaInvoicei.projectId
                this.dataForm.detailData = data.oaInvoicei.detailData
              }
            })
          }
        })
      },
      getSelectData() {
          this.$http({
            url: this.$http.adornUrl('/oa/oaproject/list'),
            method: 'get',
            params: this.$http.adornParams({
              'page': 1,
              'limit': 10000,
            })
          }).then(({data}) => {
            if (data && data.code === 0) {
              const selectData = []
              data.page.list.map((item, index) => {
                selectData.push({
                  key: item.projectId,
                  label: item.projectName,
                  value: item.projectId
                })
              })
              this.selectData = selectData
            }
          })
      },
    }
  }
</script>
