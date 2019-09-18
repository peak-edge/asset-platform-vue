<template>
    <div class="flowmonitor2-container">
        <div class="table-section" v-if="showTable">
            <div style="margin-top:4px;margin-bottom:7px">
                <el-button icon="el-icon-check" size="mini">审核</el-button>
                <el-button icon="el-icon-refresh-left" size="mini">返回</el-button>
                <el-input placeholder="请输入检索信息..." style="float:right;width:200px" size="mini"></el-input>
                <div style="float:right;margin-right:25px">
                    <el-button size="mini" type="text">待审</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="mini" type="text">已审</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button size="mini" type="text">历史</el-button>
                </div>
            </div>
            <el-table 
                id="tableData"
                :data="tableData" 
                :header-cell-style="tableHeaderColor"
                ref="multipleTable"
                style="width: 100%;height:86vh" 
                size="mini"
                @selection-change="handleSelectionChange"
                row-key="id"
                :tree-props="{children: 'children', hasChildren: 'hasChildren'}">
                <el-table-column type="selection" width="30" align="center"></el-table-column>
                <el-table-column label="操作" align="center" min-width="200">
                    <template slot-scope="scope">
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleCheck(scope.$index, scope.row)">审核</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleBack(scope.$index, scope.row)">退回</el-button>
                    <el-divider direction="vertical"></el-divider>
                    <el-button
                        size="mini"
                        type="text"
                        @click="handleSee(scope.$index, scope.row)">查看审核流程</el-button>
                    </template>
                </el-table-column>
                <el-table-column prop="budgetCode" label="预算代码" align="center" min-width="100"></el-table-column>
                <el-table-column prop="founders" label="发起单位" align="center" min-width="160"></el-table-column>
                <el-table-column prop="organCode" label="组织机构代码" align="center" min-width="130"></el-table-column>
                <el-table-column prop="docuNumber" label="单据号" align="center" min-width="200"></el-table-column>
                <el-table-column prop="abstract" label="摘要" min-width="370"></el-table-column>
                <el-table-column prop="businessType" label="业务类型" align="center" min-width="130"></el-table-column>
                <el-table-column prop="initiator" label="发起人" align="center" min-width="100"></el-table-column>
                <el-table-column prop="startTime" label="发起时间" align="center" min-width="130"></el-table-column>
                <el-table-column 
                    prop="status" 
                    label="状态" 
                    width="100"
                    align="center"
                    :filters="[{ text: '运行', value: '运行' }, { text: '结束', value: '结束' }, { text: '暂停', value: '暂停' }]"
                    :filter-method="filterTag"
                    filter-placement="bottom-end">
                    <template slot-scope="scope">
                        <el-tag
                            :type="chooseType(scope)"
                            disable-transitions>{{scope.row.status}}
                        </el-tag>
                    </template>
                </el-table-column>
            </el-table>
            <el-pagination
                @size-change="handleSizeChange"
                @current-change="handleCurrentChange"
                :current-page="currentPage"
                :page-sizes="[8, 15, 20, 30]"
                :page-size="pageSize"
                layout="total, sizes, prev, pager, next, jumper"
                :total="roleTotal"
                style="text-align:right;margin-top:10px;">
            </el-pagination>
        </div>
        <div class="picture-section" v-if="showPicture">
            <div style="margin-top:4px;margin-bottom:7px">
                <el-button icon="el-icon-refresh-left" size="mini" @click="toBack()" style="float:left">返回</el-button>
                <div style="text-align:center;font-size:18px;font-family:sans-serif">审核流程</div>
            </div>
            <div class="mainPicture">
                <span>单据号：2018400000000000374</span>
                <el-divider direction="vertical"></el-divider>
                <span>发起人：潘朝晖</span>
                <el-divider direction="vertical"></el-divider>
                <span>发起单位：省级测试单位基层</span>
                <el-divider direction="vertical"></el-divider>
                <span>发起时间：2018-11-19</span>
                <el-divider direction="vertical"></el-divider>
                <span>业务类型：归还（个人）</span>
                <div><img :src="imgUrl" alt="场景图片"/></div>
            </div>
            <div>
                <div style="text-align:center;font-size:18px;font-family:sans-serif;padding:8px">各岗审核情况列表</div>
                <el-table 
                    :data="tableData2" 
                    :header-cell-style="tableHeaderColor"
                    style="width: 100%;min-height:59vh" 
                    size="mini">
                    <el-table-column prop="approvalNode" label="审核节点" align="center" min-width="120"></el-table-column>
                    <el-table-column prop="approvalMen" label="审核人" align="center" min-width="120"></el-table-column>
                    <el-table-column 
                        prop="status" 
                        label="审核状态" 
                        width="120"
                        align="center"
                        :filters="[{ text: '待审核', value: '待审核' }, { text: '结束', value: '结束' }]"
                        :filter-method="filterTag"
                        filter-placement="bottom-end">
                        <template slot-scope="scope">
                            <el-tag
                                :type="scope.row.status === '待审核' ? 'primary' : 'success'"
                                disable-transitions>{{scope.row.status}}
                            </el-tag>
                        </template>
                    </el-table-column>
                    <el-table-column prop="approvalOpinion" label="审核意见" align="center" min-width="160"></el-table-column>
                    <el-table-column prop="approvalTime" label="审核时间" align="center" min-width="160"></el-table-column>
                    <el-table-column prop="phone" label="联系方式" align="center" min-width="300"></el-table-column>
                </el-table>
            </div>
        </div>
    </div>
</template>

<script>
export default {
    name: 'flowmonitor2',
    data() {
        return {
            showTable: true,
            showPicture: false,
            imgUrl: require("@/assets/123.png"),
            //
            tableData2: [{
                approvalNode: '审批',
                approvalMen: '潘朝晖',
                status: '待审核',
                approvalOpinion: '',
                approvalTime: '2018-11-19 11:45:00',
                phone: '87056559'
           }, {
                approvalNode: '录入',
                approvalMen: '潘朝晖',
                status: '结束',
                approvalOpinion: '同意',
                approvalTime: '2018-11-19 11:45:00',
                phone: '87056559'
            }],
            multipleSelection: [],
            number: 0,
            rowinfo: {
				id: 0
            },
            ids: "",
            dialogTitle: '',
            //分页信息
            currentPage:1,
            roleTotal: 2,
            pageSize: 8,
            //
            tableData: [{
                founders: '省级测试单位基层',
                organCode: '001999998',
                docuNumber: '2018400000000374',
                abstract: '资产编码：2018100000047765，资产名称：复印机，原值：150000.00，数量（面积）：1.0，取得日期：2018-01-01',
                businessType: '归还（个人）',
                initiator: '潘朝晖',
                startTime: '2018-11-19',
                status: '运行'
           }, {
                founders: '省级测试单位基层',
                organCode: '001999998',
                docuNumber: '2018400000000375',
                abstract: '资产编码：2018100000047773，资产名称：台、桌类，原值：16000.00，数量（面积）：1.0，取得日期：2018-01-01',
                businessType: '归还（个人）',
                initiator: '潘朝晖',
                startTime: '2018-11-19',
                status: '运行'
            }],
        }
    },
    mounted() {
        this.$nextTick( function(){
			// this.getFlowMonitorList(1)
        })
    },
    methods: {
        //查看审核流程
        handleSee(index, row) {
            this.showPicture = true
            this.showTable = false
        },
        //从查看审核流程中返回
        toBack() {
            this.showPicture = false
            this.showTable = true
        },
        //table的全选按钮
        handleSelectionChange(val) {
            this.multipleSelection = val;
            this.number = this.multipleSelection.length
        },
        //table的取消选择
        toggleSelection(rows) {
            if (rows) {
                rows.forEach(row => {
                    this.$refs.multipleTable.toggleRowSelection(row);
            });
            } else {
                this.$refs.multipleTable.clearSelection();
            }
        },
        //table的标签
        filterTag(value, row) {
            return row.status === value;
        },
        //el-tag颜色分配
        chooseType(scope) {
            if(scope.row.status === '结束')
                return 'error'
            else if(scope.row.status === '运行')
                return 'success'
            else 
                return 'warning'
        },
        //修改table header的背景色
        tableHeaderColor({ row, column, rowIndex, columnIndex }) {
            if (rowIndex === 0) {
                return 'color:black;text-align:center'
            }
        },
        //table的分页
        handleSizeChange(val) {
            console.log(`每页 ${val} 条`);
            this.pageSize = val
            this.getFlowMonitorList()
        },
        handleCurrentChange(val) {
            console.log(`当前页: ${val}`);
            this.currentPage = val
            this.getFlowMonitorList()
        },
        //计算时间差方法
        timeDifference(date)
        {
            var year = new Date(date)
            var month = year.getMonth()+1
            return year.getFullYear()+'-'+month+'-'+year.getDate()+' '+year.getHours()+':'+year.getMinutes()+':'+year.getSeconds();
        },
    }
}
</script>

<style lang="scss" scoped>
.flowmonitor2-container {
    margin: 0px;
    .picture-section {
        .mainPicture {
            overflow-y: auto; 
            overflow-x: auto;
            background:white;
            width: 100%;
            height: 300px;
            padding: 20px;
        }
    }
}
</style>
<style>
  /* 更改element-UI按钮样式 */
.flowmonitor2-container .el-button--primary{
    color: #fff;
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);
}
.flowmonitor2-container .el-button--primary:hover{
    background-color: rgb(62,149,181);
    border-color: rgb(62,149,181);  
}
.flowmonitor2-container .el-button--primary:focus{
    background-color: rgb(14,122,162);
    border-color: rgb(14,122,162);  
}
</style>
