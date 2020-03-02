<template>
  <el-dialog
    :title="!dataForm.id ? '新增' : '修改'"
    :close-on-click-modal="false"
    :visible.sync="visible"
  >
    <el-form
      :model="dataForm"
      :rules="dataRule"
      ref="dataForm"
      @keyup.enter.native="dataFormSubmit()"
      label-width="150px"
    >
      <el-form-item label="会议纪要内容" prop="content">
        <el-input
          class="el-textarea1"
          type="textarea"
          :rows="4"
          v-model="dataForm.content"
          placeholder="会议纪要内容"
          :show-word-limit="true"
          maxlength="1000"
        ></el-input>
      </el-form-item>
      <el-form-item label="会议类型" prop="type">
        <el-select style="min-width: 400px" v-model="dataForm.type" placeholder="请选择">
          <el-option
            v-for="item in typeOptions"
            :key="item.dmId"
            :label="item.dmsm"
            :value="item.dmz"
          />
        </el-select>
      </el-form-item>
      <el-form-item label="会议时间" prop="time">
        <el-date-picker
          style="min-width: 400px"
          v-model="dataForm.time"
          type="date"
          placeholder="会议时间"
        ></el-date-picker>
      </el-form-item>
    </el-form>
    <span slot="footer" class="dialog-footer">
      <el-button @click="visible = false">取消</el-button>
      <el-button type="primary" @click="dataFormSubmit()" :disabled="isDisabled">确定</el-button>
    </span>
  </el-dialog>
</template>

<script>
import API from "@/api";
import { getOptions } from "@/utils/options.js";
export default {
  data() {
    return {
      visible: false,
      typeOptions: [],
      aboutTypeOptions: [],
      isDisabled: false,
      selectData:[],
      dataForm: {
        id: 0,
        content: "",
        type: "",
        time: "",
      },
      dataRule: {
        content: [
          { required: true, message: "会议纪要内容不能为空", trigger: "blur" }
        ],
        type: [
          { required: true, message: "会议类型不能为空", trigger: "change" }
        ],
        time: [{ required: true, message: "会议时间不能为空", trigger: "blur" }],
        foreignType: [{ required: true, message: "关联目录不能为空", trigger: "change" }]
      }
    };
  },
  methods: {
    init(id) {
      // getOptions('HYLX').then(({data})=>{
      //   this.typeOptions = data.dmlxList
      // })
      this.typeOptions = this.$store.state.options.options["HYLX"];
      this.dataForm.id = id || 0;
      this.visible = true;
      this.$nextTick(() => {
        this.$refs["dataForm"].resetFields();
        if (this.dataForm.id) {
          API.oameetingminute.info(this.dataForm.id).then(({ data }) => {
            if (data && data.code === 0) {
              this.dataForm.content = data.oaMeetingMinute.content;
              this.dataForm.type = data.oaMeetingMinute.type;
              this.dataForm.time = data.oaMeetingMinute.time;
              this.dataForm.foreignType = data.oaMeetingMinute.foreignType;
              this.dataForm.foreignId = data.oaMeetingMinute.foreignId;
              this.dataForm.name = data.oaMeetingMinute.name;
            }
          });
        }
      });
    },
    
    // 表单提交
    dataFormSubmit() {
      this.$refs["dataForm"].validate(valid => {
        if (valid) {
          var params = {
            id: this.dataForm.id || undefined,
            content: this.dataForm.content,
            type: this.dataForm.type,
            time: this.dataForm.time,
            
          };
          this.isDisabled = true;
          var tick = !this.dataForm.id
            ? API.oameetingminute.add(params)
            : API.oameetingminute.update(params);
          tick.then(({ data }) => {
            if (data && data.code === 0) {
              this.$message({
                message: "操作成功",
                type: "success",
                duration: 500,
                onClose: () => {
                  this.visible = false;
                  this.$nextTick(() => {
                    this.isDisabled = false;
                  });
                  this.$emit("refreshDataList");
                }
              });
            } else {
              this.$message.error(data.msg);
              this.$nextTick(() => {
                this.isDisabled = false;
              });
            }
          });
        }
      });
    }
  }
};
</script>
