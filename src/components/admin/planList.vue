<template>
    <div v-wechat-title="$route.meta.title" class="home" style="padding: 10px">
<!--      1、  -->
        <div style="margin: 30px 0 ; margin-left: 80px">
            <span>计划名称：</span>
            <el-input
                v-model="planName"
                placeholder="请输入计划名称"
                style="width: 20%; margin-right: 20px"
                clearable
            ></el-input>
            <span style="margin-left: 70px">计划状态：</span>
            <el-select
                v-model="planStates"
                placeholder="请选择"
                style="width: 20%; margin-right: 20px"
                clearable
            >
                <el-option
                        v-for="item in plan"
                        :key="item.value"
                        :label="item.label"
                        :value="item.value"
                />
            </el-select>

            <el-button style="margin-left: 180px; margin-right: 10px" @click="reset"
            >重置</el-button
            >
            <el-button
                    type="primary"
                    style="margin-left: 5px; margin-right: 20px"
                    @click="load"
            >查询</el-button
            >
        </div>
<!--        新建计划、批量删除-->
        <div style="margin: 20px 0;margin-left: 930px">
            <el-button type="primary" @click="add">新增计划</el-button>
            <el-button type="primary" :disabled="isAll" @click="Delete">批量删除</el-button>
        </div>
<!--        表单-->
        <el-table
                :data="tableData"
                stripe
                style="width: 100%; text-align: center"
                @selection-change="(selections)=>{handleSelectionChange(selections)}"
                border
        >
            <el-table-column type="selection" width="55" />
            <el-table-column label="缩略图" width="130">
                <template #default="scope">
                    <div style="display: flex; align-items: center">
                        <el-image :preview-src-list="scope.row.programImg"/>
                    </div>
                </template>
            </el-table-column>
            <el-table-column prop="planName" label="计划名称" sortable />
            <el-table-column prop="planStates" label="计划状态" />
            <el-table-column prop="planMode" label="播放模式" />
            <el-table-column prop="planTime" label="播放日期" />
            <el-table-column prop="planAuthor" label="作者" />
            <el-table-column prop="planConfirm" label="审核人" />
            <el-table-column prop="planNewtime" label="更新时间" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button @click="details">详情</el-button>
                    <el-button @click="handleEdit(scope.row)">修改</el-button>
                    <el-button @click="handleCopy(scope.row)">复制</el-button>
                    <el-popconfirm
                            title="确认删除?"
                            @confirm="handleDelete(scope.row.deviceId)"
                    >
                        <template #reference>
                            <el-button type="danger">删除</el-button>
                        </template>
                    </el-popconfirm>
                    <el-button @click="downloads">加密下载</el-button>
                    <el-button @click="pushs">发布</el-button>
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
            <el-dialog v-model="pl1" title="" width="30%">
                <el-form :model="form" label-width="120px">
                    <el-tabs type="border-card">
                        <el-tab-pane label="计划详情">
                            <template>
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
                            </template>
                        </el-tab-pane>
                        <el-tab-pane label="设备详情">
                            <el-table
                                    :data="tableData"
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
                                    :total="total"
                                    @size-change="handleSizeChange"
                                    @current-change="handleCurrentChange"/>
                        </el-tab-pane>
                    </el-tabs>
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dv2 = false">返回</el-button>
                    </span>
                </template>
            </el-dialog>

            <!--新建-->
            <el-dialog v-model="dialogVisible" title="新建计划" width="30%">
                <el-form :model="form" label-width="120px">
                    <el-form-item label="计划名称">
                        <el-input v-model="form.planName" />
                    </el-form-item>

                    <el-form-item label="播放模式">
                        <el-radio-group v-model="form.planMode">
                            <el-radio label="时段播放" />
                            <el-radio label="持续播放" />
                        </el-radio-group>
                    </el-form-item>

                    <el-form-item label="播放时段">
                        <el-col :span="11">
                            <el-date-picker
                                    v-model="form.planTime"
                                    type="date"
                                    placeholder="Pick a date"
                                    style="width: 100%"
                            />
                        </el-col>
                        <el-col :span="2" class="text-center">
                            <span class="text-gray-500">-</span>
                        </el-col>
                        <el-col :span="11">
                            <el-date-picker
                                    v-model="form.planTime"
                                    placeholder="Pick a date"
                                    style="width: 100%"
                            />
                        </el-col>
                    </el-form-item>

<!--                    <el-form-item>-->
<!--                        <el-button type="primary" @click="onSubmit">Create</el-button>-->
<!--                        <el-button>Cancel</el-button>-->
<!--                    </el-form-item>-->
                </el-form>
                <template #footer>
                    <span class="dialog-footer">
                        <el-button @click="dialogVisible = false">取消</el-button>
                        <el-button type="primary" @click="save">确认</el-button>
                    </span>
                </template>
            </el-dialog>
        </div>
    </div>
</template>

<script>
    import request from "@/utils/request";

    export default {
        name: "planList",
        data(){
            return{
                searchName:'',
                searchState:'',
                isAll:true,
                //分页
                currentPage4: 1,
                pageSize4: 10,
                total: 0,
                dialogVisible:false,
                form:{},
                tableDate:[],
                plan:[
                    {
                        value:"所有状态",
                        label:"所有状态"
                    },
                    {
                        value:"待发布",
                        label:"待发布"
                    },
                    {
                        value:"发布中",
                        label:"发布中"
                    },
                    {
                        value:"发布成功",
                        label:"发布成功"
                    },
                    {
                        value:"部分成功",
                        label:"部分成功"
                    },
                    {
                        value:"发布失败",
                        label:"发布失败"
                    },
                    {
                        value:"已结束",
                        label:"已结束"
                    },
                    {
                        value:"已失效",
                        label:"已失效"
                    },
                    {
                        value:"审核中",
                        label:"审核中"
                    }
                ]
            }
        },
        created() {
            this.load();
        },
        method:{
            load(){
                request.get("/schedule-list", {
                    params:{
                        pageNum:this.currentPage4,
                        pageSize:this.pageSize4,
                        name:this.searchName,
                        state:this.searchState,
                    }
                }).then(res => {
                    console.log(res)
                    this.tableData = res.data.records
                    this.total = res.data.total
                })
            },


        }
    }

</script>

<style scoped>

</style>