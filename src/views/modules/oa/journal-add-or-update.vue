<template>
  <el-dialog
    :title="!dataForm.journalId ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible">
    <el-form :model="dataForm" :rules="dataRule" ref="dataForm" label-width="120px">
            <!-- s -->
      <el-form-item  label="关联内容" prop="foreignType">
        <el-row>
          <el-col :span="6">
            <el-select
              style="width: 100%"
              @change="changTypeHandle"
              v-model="dataForm.foreignType"
              placeholder="请选择"
            >
              <el-option
                v-for="item in aboutTypeOptions"
                :key="item.dmId"
                :label="item.dmsm"
                :value="item.dmz"
              />
            </el-select>
          </el-col>
          <el-col :span="18">
            <el-select
              v-if="!(dataForm.foreignType > 2)"
              filterable
              style="width: 100%"
              v-model="dataForm.foreignId"
              placeholder="请选择"
            >
              <el-option
                v-for="item in selectData"
                :key="item.key"
                :label="item.label"
                :value="item.value"
              />
            </el-select>
            <el-input style="width: 100%" placeholder="请输入内容" v-if="dataForm.foreignType > 2" v-model="dataForm.foreignName"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- e -->
      <el-form-item label="日志内容" prop="journalContent">
        <el-input 
        class="el-textarea1" 
        type="textarea" 
        :rows="4" 
        v-model="dataForm.journalContent" 
        placeholder="日志内容" 
        :show-word-limit="true" 
        maxlength="250"></el-input>
      </el-form-item>
      <el-form-item label="需要协调的内容" prop="coordinate">
        <el-input 
        class="el-textarea1" 
        type="textarea" 
        :rows="4" 
        v-model="dataForm.coordinate" 
        placeholder="需要协调的内容" 
        :show-word-limit="true" 
        maxlength="250"></el-input>
      </el-form-item>
      <el-form-item label="日志时间" prop="journalTime">
        <el-date-picker
          style="min-width: 400px"
          v-model="dataForm.journalTime"
          type="date"
          :disabled="dataForm.journalId!=undefined"
          value-format="yyyy-MM-dd"
          placeholder="日志时间"
          :picker-options="pickerOptions">
        </el-date-picker>
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
  export default {
    data () {
      const valType = (rule, value, callback)=>{
        if(value === ''){
          callback(new Error('请选择类型'));
        }else{
          if(this.dataForm.foreignId===''&&this.dataForm.foreignName===''){
            callback(new Error('内容不能为空'));
          }else {
            callback();
          }
        }
      };
      return {
        visible: false,
        isDisabled: false,
        selectData: [],
        aboutTypeOptions:[],
        dataForm: {
          journalId: undefined,
          journalContent: '',
          coordinate:'',
          journalTime: '',
          foreignType:'',
          foreignId:'',
          foreignName: '',
        },
        pickerOptions:{
          disabledDate(time) {
            let curDate = (new Date()).getTime();
            let one = 2 * 24 * 3600 * 1000;
            let oneDay = curDate - one;
            return time.getTime() > Date.now() - 8.64e6 || time.getTime() < oneDay
          }
        },
        dataRule: {
          foreignType: [
            {required: true,validator:valType, trigger:'change'}
          ],
          journalContent: [
            { required: true, message: '日志内容不能为空', trigger: 'blur' }
          ],
          journalTime: [
            { required: true, message: '日志时间不能为空', trigger: 'blur' }
          ]
        }
      }
    },
    methods: {
      init (id) {
        this.aboutTypeOptions = this.$store.state.options.options["RZGLLX"];
        this.dataForm.journalId = id || undefined
        this.selectData = []
        this.dataForm.foreignId = undefined
        this.dataForm.foreignName = ''
        this.visible = true
        this.$nextTick(() => {
          this.$refs['dataForm'].resetFields()
          if (this.dataForm.journalId) {
            API.oajournal.info(this.dataForm.journalId).then(({data}) => {
              if (data && data.code === 0) {
                this.dataForm.journalContent = data.oaJournal.journalContent
                this.dataForm.journalTime = data.oaJournal.journalTime
                this.dataForm.coordinate = data.oaJournal.coordinate
                this.dataForm.foreignType = data.oaJournal.foreignType
                this.dataForm.foreignId = data.oaJournal.foreignId
                this.dataForm.foreignName = data.oaJournal.foreignName
                this.getSelectData(data.oaJournal.foreignType);
              }
            })
          }
        })
      },
      changTypeHandle(value) {
      this.dataForm.foreignId = "";
      this.dataForm.foreignType = value;
      this.dataForm.foreignName = "";
      this.getSelectData(value);
    },
    getSelectData(value) {
      if (value == 2) {
        this.$http({
          url: this.$http.adornUrl("/oa/oaproject/list"),
          method: "get",
          params: this.$http.adornParams({
            page: 1,
            limit: 10000
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            const selectData = [];
            data.page.list.map((item, index) => {
              selectData.push({
                key: item.projectId,
                label: item.projectName,
                value: item.projectId
              });
            });
            this.selectData = selectData;
          }
        });
      } else if (value == 1) {
        this.$http({
          url: this.$http.adornUrl("/oa/oadialog/list"),
          method: "get",
          params: this.$http.adornParams({
            page: 1,
            limit: 10000
          })
        }).then(({ data }) => {
          if (data && data.code === 0) {
            const selectData = [];
            data.page.list.map((item, index) => {
              selectData.push({
                key: item.dialogId,
                label: item.dialogName,
                value: item.dialogId
              });
            });
            this.selectData = selectData;
          }
        });
      }
    },
      // 表单提交
      dataFormSubmit () {
        this.$refs['dataForm'].validate((valid) => {
          if (valid) {
        this.isDisabled=true
            var params = {
              'journalId': this.dataForm.journalId || undefined,
              'journalContent': this.dataForm.journalContent,
              'coordinate': this.dataForm.coordinate,
              'journalTime': this.dataForm.journalTime,
              'foreignId': this.dataForm.foreignId,
              'foreignType': this.dataForm.foreignType,
              'foreignName': this.dataForm.foreignName,
            }
            var tick = !this.dataForm.journalId ? API.oajournal.add(params) : API.oajournal.update(params)
            tick.then(({data}) => {
              if (data && data.code === 0) {
                this.$message({
                  message: '操作成功',
                  type: 'success',
                  duration: 500,
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
