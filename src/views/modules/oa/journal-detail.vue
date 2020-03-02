<template>
  <el-dialog
    title="详细信息"
    :visible.sync="visible"
    :close-on-click-modal="false"
    >
    <el-form :model="dataForm" disabled ref="dataForm" @keyup.enter.native="dataFormSubmit()" label-width="120px">
                         <!-- s -->
      <el-form-item  label="关联内容" prop="foreignType">
        <el-row>
          <el-col :span="6">
        <el-select
          style="width: 100%"
          :value="dataForm.foreignType"
          placeholder="请选择"
          :disabled="true"
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
          :disabled="true"
        >
          <el-option
            v-for="item in selectData"
            :key="item.key"
            :label="item.label"
            :value="item.value"
          />
        </el-select>
        <el-input style="width: 100%" v-if="dataForm.foreignType > 2" v-model="dataForm.foreignName"></el-input>
          </el-col>
        </el-row>
      </el-form-item>
      <!-- e -->
      <el-form-item label="日志内容" prop="journalContent">
        <el-input class="el-textarea1" type="textarea" :rows="4" v-model="dataForm.journalContent" placeholder="日志内容"></el-input>
      </el-form-item>
      <el-form-item label="需要协调的内容" prop="coordinate">
        <el-input class="el-textarea1" type="textarea" :rows="4" v-model="dataForm.coordinate" placeholder="需要协调的内容"></el-input>
      </el-form-item>
      <el-form-item label="日志时间" prop="journalTime">
        <el-date-picker
          style="min-width: 400px"
          v-model="dataForm.journalTime"
          type="date"
          value-format="yyyy-MM-dd"
          placeholder="日志时间">
        </el-date-picker>
      </el-form-item>
    </el-form>
  </el-dialog>
</template>

<script>
  import API from '@/api'
  export default {
    data () {
      return {
        visible: false,
        selectData: [],
        aboutTypeOptions:[],
        dataForm: {
          journalId: 0,
          journalContent: '',
          coordinate:'',
          journalTime: '',
          foreignId: '',
          foreignType: '',
          foreignName:'',
        },
      }
    },
    methods: {
      init (id) {
        this.aboutTypeOptions = this.$store.state.options.options["RZGLLX"];
        this.dataForm.journalId = id
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
              }
            })
          }
        })
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
    }
  }
</script>
