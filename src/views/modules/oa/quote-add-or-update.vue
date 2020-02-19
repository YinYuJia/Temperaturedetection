<template>
  <el-dialog
    width="80%"
    top="5vh"
    :title="!dataForm.id ? '新增' : '修改'"
    :visible.sync="visible"
    :close-on-click-modal="false"
    >
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
      <el-form-item label="甲方" prop="partya">
        <el-input v-model="dataForm.partya" placeholder="甲方"></el-input>
      </el-form-item>
      <el-form-item label="乙方" prop="partyb">
        <el-input :disabled="true" v-model="dataForm.partyb" placeholder="乙方"></el-input>
      </el-form-item>
      <el-form-item label="项目名称" prop="quoteName">
        <el-input v-model="dataForm.quoteName" placeholder="项目名称" maxlength="50"></el-input>
      </el-form-item>
      <el-form-item label="项目要求与功能" prop="quoteRequire">
        <el-input v-model="dataForm.quoteRequire" placeholder="项目要求与功能" maxlength="100" :show-word-limit="true"></el-input>
      </el-form-item>
      <el-form-item label="利润率" prop="rate">
        <el-input v-model="dataForm.rate" @input="getTimes" type="number" step="10" placeholder="请输入利润率" :show-word-limit="true"></el-input>
      </el-form-item>
      <el-row>
        <el-col :span="12">
          <el-form-item label="预计开始时间" prop="startTime">
            <el-date-picker
              style="width: 100%"
              v-model="dataForm.startTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择预计开始时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
        <el-col :span="12">
          <el-form-item label="预计截至时间" prop="endTime">
            <el-date-picker
              style="width: 100%"
              v-model="dataForm.endTime"
              type="date"
              value-format="yyyy-MM-dd"
              placeholder="选择预计截至时间">
            </el-date-picker>
          </el-form-item>
        </el-col>
      </el-row>
      <el-form-item label="详细信息" prop="detailData">
        <el-table
          :data="dataForm.detailData"
          border
        >
          <el-table-column type="index" width="50"
                           label="序号" header-align="center" align="center">
          </el-table-column>
          <el-table-column prop="mainFunc" header-align="center" align="center" label="主要功能">
            <template slot-scope="scope">
              <el-input size="small" placeholder="请输入主要功能" v-model="scope.row.mainFunc" :show-word-limit="true" maxlength="100">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="funcAnaly" header-align="center" align="center" label="功能分析">
            <template slot-scope="scope">
              <el-input size="small" placeholder="请输入功能分析" v-model="scope.row.funcAnaly" :show-word-limit="true" maxlength="100">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="engineerConf" header-align="center" align="center" label="工程师配置">
            <template slot-scope="scope">
              <el-select v-model="scope.row.engineerConf" placeholder="请选择工程师配置">
                <el-option v-for="item in engineerConfOptions" :key="item.dmId" :label="item.dmsm" :value="item.dmz"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="unitPrice" header-align="center" align="center" label="单价">
            <template slot-scope="scope">
              <el-select @change="computed" v-model="scope.row.unitPrice" placeholder="请选择单价">
                <el-option v-for="item in unitPriceTypeOptions" :key="item.dmId" :label="item.dmsm" :value="item.dmz"/>
              </el-select>
            </template>
          </el-table-column>
          <el-table-column prop="actualWorkload" header-align="center" align="center" label="实际工作量">
            <template slot-scope="scope">
              <el-input size="small" @input="computed" placeholder="请输入实际工作量" v-model="scope.row.actualWorkload">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="actualAmount" header-align="center" align="center" label="实际金额">
            <template slot-scope="scope">
              <el-input disabled size="small" placeholder="请输入实际金额" v-model="scope.row.actualAmount">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="workload" header-align="center" align="center" label="报价工作量">
            <template slot-scope="scope">
              <el-input disabled size="small" placeholder="请输入报价工作量" v-model="scope.row.workload">
              </el-input>
            </template>
          </el-table-column>
          <el-table-column prop="amount" header-align="center" align="center" label="报价金额">
            <template slot-scope="scope">
              <el-input disabled size="small" placeholder="请输入报价金额" v-model="scope.row.amount">
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
  import {getOptions} from '@/utils/options.js'
  export default {
    data () {
      return {
        visible: false,
        dataForm: {
          rate:undefined,
          quoteId: 0,
          partya: '',
          partyb: '杭州旦电科技有限公司',
          quoteName: '',
          quoteRequire: '',
          startTime: '',
          endTime: '',
          creator: '',
          createTime: '',
          detailData:[],
          isDisabled: false,
          unitPriceTypeOptions:[]
        },
        times:undefined,
        dataRule: {
          partya: [
            { required: true, message: '甲方不能为空', trigger: 'blur' }
          ],
          quoteName: [
            { required: true, message: '项目名称不能为空', trigger: 'blur' }
          ],
          quoteRequire: [
            { required: true, message: '项目要求与功能不能为空', trigger: 'blur' }
          ],
          startTime: [
            { required: true, message: '预计开始时间不能为空', trigger: 'blur' }
          ],
          endTime: [
            { required: true, message: '预计截至时间不能为空', trigger: 'blur' }
          ],
          creator: [
            { required: true, message: '创建人不能为空', trigger: 'blur' }
          ],
          createTime: [
            { required: true, message: '创建时间不能为空', trigger: 'blur' }
          ],
          detailData: [
            { required: true, message: '详细信息不能为空', trigger: 'blur' }
          ],
          rate: [
            { required: true, message: '利润率不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      computed(){
        const times = this.times
        this.dataForm.detailData.map((item,index)=>{
          item.actualAmount = item.actualWorkload*item.unitPrice
          item.workload = Math.round(item.actualWorkload*times)
          item.amount = item.workload*item.unitPrice
        })
      },
      getTimes(){
        const rate = this.dataForm.rate
        if(rate!=null&&rate!=''){
          const times = 1/(1-rate/100-(6/100*0.97/100)-18/100)
          this.times = times
        }
      },
      init (id) {
        this.dataForm.quoteId = id || 0
        this.visible = true
        // getOptions('BJDJ').then(({data})=>{
        //   this.unitPriceTypeOptions = data.dmlxList
        // })
        // getOptions('GCSLX').then(({data})=>{
        //   this.engineerConfOptions = data.dmlxList
        // })
        this.unitPriceTypeOptions = this.$store.state.options.options['BJDJ']
        this.engineerConfOptions = this.$store.state.options.options['GCSLX']
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.quoteId) {
            API.oaquote.info(this.dataForm.quoteId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.partya = data.oaQuote.partya
                this.dataForm.partyb = data.oaQuote.partyb
                this.dataForm.quoteName = data.oaQuote.quoteName
                this.dataForm.quoteRequire = data.oaQuote.quoteRequire
                this.dataForm.startTime = data.oaQuote.startTime
                this.dataForm.endTime = data.oaQuote.endTime
                this.dataForm.rate = data.oaQuote.rate
                this.dataForm.detailData = data.oaQuote.detailData
                this.getTimes()
              }
            })
          }
        })
      },
      addDomains() {
        this.dataForm.detailData.push({
          unitPrice:'600'
        })
      },
      removeDomain(index) {
        this.dataForm.detailData.splice(index, 1)
      },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
        this.isDisabled=true
            var params = {
              'quoteId': this.dataForm.quoteId || undefined,
              'partya': this.dataForm.partya,
              'partyb': this.dataForm.partyb,
              'quoteName': this.dataForm.quoteName,
              'quoteRequire': this.dataForm.quoteRequire,
              'startTime': this.dataForm.startTime,
              'endTime': this.dataForm.endTime,
              'rate':this.dataForm.rate,
              'times':this.times,
              'detailData':this.dataForm.detailData,
            }
            var tick = !this.dataForm.quoteId ? API.oaquote.add(params) : API.oaquote.update(params)
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
      }
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
