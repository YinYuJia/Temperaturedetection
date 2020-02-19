<template>
  <div style="margin-left:30px;margin-right:30px;">
    <el-steps :active="active" finish-status="success">
      <el-step @click.native="purchaseAdd" title="新增"></el-step>
      <el-step @click.native="purchaseApproval" ref="approvalUserId" title="审批"></el-step>
      <el-step @click.native="purchaseInfo" title="转款"></el-step>
      <el-step @click.native="purchaseConfirm" title="确认"></el-step>
      <el-step @click.native="purchaseAcceptance" title="验收"></el-step>
    </el-steps>
    <purchase-add v-if="isAdd"></purchase-add>
    <purchase-approval v-if="isApproval"></purchase-approval>
    <purchase-confirm v-if="isConfirm"></purchase-confirm>
    <purchase-info v-if="isInfo"></purchase-info>
    <purchase-acceptance v-if="isAcceptance"></purchase-acceptance>
  </div>
</template>

<script>
import API from "@/api";
import { getMatterUserList } from "@/utils/options.js";
import { getOptions } from "@/utils/options.js";
import http from "@/utils/httpRequest.js";
import { connect } from "net";
import purchaseAdd from "../purchase/purchase-add-index";
import purchaseApproval from "../purchase/purchase-approval-index";
import purchaseConfirm from "../purchase/purchase-confirm-index";
import purchaseInfo from "../purchase/purchase-info-index";
import purchaseAcceptance from "../purchase/purchase-acceptance-index";
export default {
  data() {
    return {
      
      isAdd: true,
      isApproval: false,
      isConfirm: false,
      isInfo: false,
      isAcceptance: false,
      active: 1,
      
    };
  },
  components: {
    purchaseAdd,
    purchaseApproval,
    purchaseConfirm,
    purchaseInfo,
    purchaseAcceptance
  },
  methods: {
    purchaseAdd() {
      this.active = 1;
      this.isAdd = true;
      this.isApproval = false;
      this.isConfirm = false;
      this.isInfo = false;
      this.isAcceptance = false;
      console.log("active" + this.active);
    },
    purchaseApproval() {
      this.active = 2;
      this.isAdd = false;
      this.isApproval = true;
      this.isConfirm = false;
      this.isInfo = false;
      this.isAcceptance = false;

      console.log("active" + this.active);
    },
    purchaseInfo() {
        this.active = 3;
        this.isAdd = false;
        this.isApproval = false;
        this.isConfirm = false;
        this.isInfo = true;
        this.isAcceptance = false;

        console.log("active" + this.active);
    },
    purchaseConfirm() {
      this.active = 4;
      this.isAdd = false;
      this.isApproval = false;
      this.isConfirm = true;
      this.isInfo = false;
      this.isAcceptance = false;

      console.log("active" + this.active);
    },
    purchaseAcceptance() {
      this.active = 5;
      this.isAdd = false;
      this.isApproval = false;
      this.isConfirm = false;
      this.isInfo = false;
      this.isAcceptance = true;

      console.log("active" + this.active);
    },

  }
};
</script>
