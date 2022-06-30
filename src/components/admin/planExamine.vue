<template>
    <div v-wechat-title="$route.meta.title" class="home" style="padding: 10px">
        <div style="margin: 20px 0 ; margin-left: 20px">
            <span>计划名称：</span>
            <el-input
                    v-model="planName"
                    placeholder="请输入计划名称"
                    style="width: 20%; margin-right: 20px"
                    clearable
            ></el-input>

            <el-button style="margin-left: 10px; margin-right: 10px" @click="reset"
            >重置</el-button>
            <el-button
                    type="primary"
                    style="margin-left: 5px; margin-right: 20px"
                    @click="load"
            >搜索</el-button>
        </div>
<!--表单-->
        <el-table
                :data="tableData"
                stripe
                style="width: 100%; text-align: center"
                border
        >
            <el-table-column prop="examineId" label="序号" sortable />
            <el-table-column label="缩略图" width="130">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-image :preview-src-list="scope.row.programImg"/>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="examineName" label="计划名称" sortable />
            <el-table-column prop="devicesNumber" label="使用设备数" />
            <el-table-column prop="examineAuthor" label="作者" />
            <el-table-column prop="examineUpdate" label="更新时间" />
            <el-table-column label="操作" width="140">
                <template #default="scope">
                    <el-button @click="details">预览</el-button>
                </template>
            </el-table-column>
        </el-table>

        <div style="margin: 10px 0;">
            <!--      分页-->
            <el-pagination
                    v-model:currentPage="currentPage4"
                    v-model:page-size="pageSize4"
                    :page-sizes="[5, 10, 15, 20]"
                    :small="small"
                    :disabled="disabled"
                    :background="background"
                    layout="total, sizes, prev, pager, next, jumper"
                    :total="total"
                    @size-change="handleSizeChange"
                    @current-change="handleCurrentChange"/>

            <!--弹窗-->
            <!--            计划详情-->
            <el-dialog v-model="pl1" title="" width="80%">
                <el-form :model="form" label-width="800px">
                    <el-tabs type="border-card">
                        <el-tab-pane label="计划详情">

                            <el-descriptions title="">
                                <el-descriptions-item label="计划名称">plan0</el-descriptions-item>
                                <el-descriptions-item label="播放日期">2022-06-29</el-descriptions-item>
                                <el-descriptions-item label="发布状态">待发布</el-descriptions-item>
                                <el-descriptions-item label="创建时间">2022-06-29 09:24:26</el-descriptions-item>
                                <el-descriptions-item label="播放时段">
                                    按时段播放<br>
                                    循环类型:每天<br>
                                    循环时间段:8:00-20:00
                                </el-descriptions-item>
                            </el-descriptions>

                        </el-tab-pane>

                        <el-tab-pane label="设备详情">
                            <el-table
                                    :data="deviceData"
                                    stripe
                                    style="width: 100%; text-align: center"
                                    border
                            >
                                <el-table-column prop="deviceName" label="设备名称" sortable />
                                <el-table-column prop="macAddress" label="MAC地址" />
                                <el-table-column prop="resolvingPower" label="分辨率" />
                                <el-table-column prop="deviceMechanism" label="所属机构" />
                                <el-table-column prop="deviceSchedule" label="当前计划" />
                                <el-table-column prop="deviceState" label="设备状态">
                                    <template #default="scope">
                                        <el-tag v-if="scope.row.deviceState==1" type="success">空闲</el-tag>
                                        <el-tag v-if="scope.row.deviceState==2">播放</el-tag>
                                        <el-tag v-if="scope.row.deviceState==0" type="danger">离线</el-tag>
                                    </template>
                                </el-table-column>

                            </el-table>
                            <el-pagination
                                    v-model:currentPage="currentPage4"
                                    v-model:page-size="pageSize4"
                                    :page-sizes="[5, 10, 15, 20]"
                                    :small="small"
                                    :disabled="disabled"
                                    :background="background"
                                    layout="total, sizes, prev, pager, next, jumper"
                                    :total="totalD"
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"/>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="pl1 = false">返回</el-button>
                    </span>
                </template>
            </el-dialog>

        </div>

    </div>
</template>

<script>
    // @ is an alias to /src
    import request from "@/utils/request";
    import { ArrowLeft } from '@element-plus/icons-vue'
    export default {
        name: 'planExamine',
        components: {
            ArrowLeft
        },
        data() {
            return {
                planName:'',
                edit:0,
                currentPage4: 1,
                pageSize4: 10,
                total: 0,
                totalD:0,
                dialogVisible:false,
                //aaa
                pl1:false,
                checkList:[],
                form:{},
                tableData: [],
                deviceData:[]
            }
        },
        created() {
            this.load()
        },
        methods: {
            load(){
                request.get("/schedule-examine", {
                    params:{
                        pageNum:this.currentPage4,
                        pageSize:this.pageSize4,
                        search:this.planName,
                    }
                }).then(res => {
                    console.log(res)
                    this.tableData = res.data.records
                    this.total = res.data.total
                })
            },
            loadDevice(){
                request.get("/device", {
                    params:{
                        pageNum:this.currentPage4,
                        pageSize:this.pageSize4,
                    }
                }).then(res => {
                    console.log(res)
                    this.deviceData = res.data.records
                    this.total = res.data.total
                })
            },
            details(row){
                this.loadDevice()
                this.pl1=true;
                // this.form=JSON.parse(JSON.stringify());
            },
            reset() {
                this.planName = "";
                this.load()
            },
            add(){
                this.dialogVisible = true
                this.form = {}
                this.form.programState = 1
                this.form.programSize = "50.0kb"
                this.form.programAuthor = "yyx"
                // this.form.programAuthor = this.$cookies.get("data").userName
            },

            pub(){

            },
            handlePub(id){

            },
            handleSizeChange(pageSize) {//改变当前每页的个数
                this.pageSize4 = pageSize
                this.load()
            },
            handleCurrentChange(pageNum) {//改变当前页码
                this.currentPage4 = pageNum
                this.load()
            }

        }
    }
</script>

<style scoped>

</style>