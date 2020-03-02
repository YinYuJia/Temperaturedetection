<template>
  <el-dialog
    width="80%"
    top="10vh"
    :title="!dataForm.id ? '新增' : '修改'"
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
          <el-table-column label="款项名称" header-align="center" align="center">
            <template slot-scope="scope">
              <el-input size="small" placeholder="请输入款项名称" v-model="scope.row.name">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column width="240"
                           label="回款时间" header-align="center" align="center">
            <template slot-scope="scope">
                            <span v-if="true">
                                <el-date-picker
                                  style="max-width: 140px"
                                  size="small"
                                  v-model="scope.row.time"
                                  type="date"
                                  value-format="yyyy-MM-dd"
                                  placeholder="选择回款时间">
                                  </el-date-picker>
                            </span>
            </template>
          </el-table-column>
          <el-table-column width="150" label="百分比" header-align="center" align="center">
            <template slot-scope="scope">
              <el-input size="small" placeholder="请输入百分比" v-model="scope.row.percent">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column width="150"
                           label="金额" header-align="center" align="center">
            <template slot-scope="scope">
              <el-input size="small" placeholder="请输入金额" v-model="scope.row.amount">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column width="150" label="未收款" header-align="center" align="center">
            <template slot-scope="scope">
              <el-input size="small" placeholder="请输入未收款" v-model="scope.row.unpaid">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column label="操作" width="80" header-align="center" align="center">
            <template slot-scope="scope">
              <el-button size="small" @click.prevent="removeDomain(scope.$index)">删除</el-button>
            </template>
          </el-table-column>
        </el-table>
        <div class="el-table-add-row" @click="addDomains()"><span>+ 添加</span></div>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isDisabled">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  import {getMatterUserList} from '@/utils/options.js'
  export default {
    data () {
      return {
        selectData: [],
        visible: false,
        userOptions:[],
        isDisabled: false,
        dataForm: {
          invoiceiId: 0,
          invoiceiInfo: undefined,
          invoiceiTime:undefined,
          invoiceiUnit: '',
          invoiceiAmount: '',
          planTime:undefined,
          creator: '',
          createTime: '',
          actualTime: undefined,
          contractAmount: '',
          invoiceiPercent:'',
          projectId: '',
          projectName: '',
          detailData:[],
        },
        dataRule: {
          invoiceiInfo: [
            { required: true, message: '开票信息不能为空', trigger: 'blur' }
          ],
          invoiceiUnit: [
            { required: true, message: '开票单位不能为空', trigger: 'blur' }
          ],
          invoiceiAmount: [
            { required: true, message: '金额不能为空', trigger: 'blur' }
          ],
          invoiceiPercent: [
            { required: true, message: '开票百分比不能为空', trigger: 'blur' }
          ],
          contractAmount: [
            { required: true, message: '合同金额不能为空', trigger: 'blur' }
          ],
          projectId: [
            { required: true, message: '项目不能为空', trigger: 'blur' }
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
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
        this.isDisabled=true
            var params = {
              'invoiceiId': this.dataForm.invoiceiId || undefined,
              'invoiceiInfo': this.dataForm.invoiceiInfo,
              'invoiceiTime': this.dataForm.invoiceiTime,
              'invoiceiUnit': this.dataForm.invoiceiUnit,
              'invoiceiAmount': this.dataForm.invoiceiAmount,
              'planTime': this.dataForm.planTime,
              'actualTime' : this.dataForm.actualTime,
              'invoiceiPercent' : this.dataForm.invoiceiPercent,
              'contractAmount' : this.dataForm.contractAmount,
              'projectId' : this.dataForm.projectId,
              'detailData': this.dataForm.detailData,
            }
            var tick = !this.dataForm.invoiceiId ? API.oainvoicei.add(params) : API.oainvoicei.update(params)
            tick.then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 1500,
                  onClose: () => {
                    this.visible = false
                    this.$nextTick(()=>{
                        this.isDisabled=false
                      })
                    this.$emit('refreshDataList')
                  }
                })
              } else {
                this.$message.error(data.msg)
                 this.$nextTick(()=>{
                        this.isDisabled=false
                      })
              }
            })
          }
        })
      },
      addDomains() {
        this.dataForm.detailData.push({

        })
      },
      removeDomain(index) {
        this.dataForm.detailData.splice(index, 1)
      },
    }
  }
</script>
<style>
  .el-table-add-row {
    margin-top: 10px;
    width: 100%;
    height: 34px;
    border: 1px dashed #c1c1cd;
    border-radius: 3px;
    cursor: pointer;
    justify-content: center;
    display: flex;
    line-height: 34px;
  }
</style>
