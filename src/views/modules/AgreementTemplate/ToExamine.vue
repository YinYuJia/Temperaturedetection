<template>
    <div class="toExamine">
        <el-dialog title="用户协议审核" :visible.sync="toExamine" width="70%">
            <el-table :data="gridData" height="400px" ref="multipleTable">
                <el-table-column type="selection" header-align="center"  @selection-change="handleSelectionChange" align="center" width="50">
                </el-table-column>
                <el-table-column property="date" label="名称" width="150"></el-table-column>
                <el-table-column property="name" label="状态" width="200"></el-table-column>
                <el-table-column property="address" label="备注"></el-table-column>
                <el-table-column property="address" label="签约时间"></el-table-column>
                <el-table-column property="address" label="签约时间"></el-table-column>
                <el-table-column property="address" label="操作" width="200px">
                    <template slot-scope="scope">
                        <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="addOrUpdateHandle(scope.row.roleId)">修改</el-button>
                        <el-button v-if="isAuth('sys:role:update')" type="text" size="small" @click="ToExamine(scope.row.roleId)">审核</el-button>
                        <el-button v-if="isAuth('sys:role:delete')" type="text" size="small" @click="deleteHandle(scope.row.roleId)">删除</el-button>
                    </template>
                </el-table-column>
            </el-table>
            <div slot="footer" class="dialog-footer">
                <el-button @click="cancel()">返回</el-button>
                <el-button type="primary" @click="allRight()">批量审核</el-button>
            </div>
        </el-dialog>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                gridData: [{
                    date: '2016-05-02',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-04',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },  {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },  {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },  {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },  {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },  {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },  {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },  {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },  {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },  {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },  {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },  {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                },  {
                    date: '2016-05-01',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }, {
                    date: '2016-05-03',
                    name: '王小虎',
                    address: '上海市普陀区金沙江路 1518 弄'
                }],
                toExamine: true,
                addForm: {
                    name: "",
                    region: ""
                },
                formLabelWidth: '120px',
            }
        },
        methods: {
            allRight() {
                console.log(this.$refs.multipleTable.selection)
                this.$emit("istoExamine", true)
            },
            cancel() {
                this.$emit("istoExamine", true)
            },
            handleSelectionChange(val) {
                console.log(val)
            }
        }
    }
</script>

<style>

</style>