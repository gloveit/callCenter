<template>
  <div class="allwrap">
    <div class="menu_top">
      <el-input v-model="mevalue" placeholder="请输入菜单名搜索" size="small" style="width:160px"></el-input>
      <el-button type="primary" icon="el-icon-search" size="small" @click="serchMenu">搜索</el-button>
      <el-select v-model="selectvalue" placeholder="请选择" size="small" @change="getSelect" class="select_menu">
        <el-option
          v-for="item in options"
          :key="item.value"
          :label="item.label"
          :value="item.value">
        </el-option>
      </el-select>
      <el-button type="primary"  size="small" style="float:right" @click="openAdd">添加菜单</el-button>
    </div>
    <el-dialog
      title="添加菜单"
      :visible.sync="dialogVisible"
      width="70%">
      <el-form :model="ruleForm" :rules="rules" ref="ruleForm" label-width="100px" inline>
        <el-form-item label="菜单名称" prop="menuname" >
          <el-input v-model="ruleForm.menuname" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="菜单链接" prop="url" >
          <el-input v-model="ruleForm.url" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="菜单路径" prop="path" >
          <el-input v-model="ruleForm.path" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="组件名称" prop="component" >
          <el-input v-model="ruleForm.component" style="width:180px"></el-input>
        </el-form-item>
        <el-form-item label="父菜单名称" prop="parentmenu"  >
            <el-select v-model="addselectMenu" placeholder="请选择" size="small" @change="addgetSelect" class="select_menu03">
            <el-option
              v-for="item in options"
              :key="item.value"
              :label="item.label"
              :value="item.value">
            </el-option>
          </el-select>
      </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="cancleAddMenu">取 消</el-button>
        <el-button type="primary" @click="sureAddMenu(ruleForm)">确 定</el-button>
      </span>
     </el-dialog>
    <div class="userwrap">
      <el-table
      :data="tablepage"
      border 
      style="width: 100%" class="usertable">
        <el-table-column type="index" :index="changeIndex" width="45" ></el-table-column>
        
        <el-table-column
          prop="name"
          label='菜单名称'
          width="180">
        </el-table-column>
        <el-table-column
          prop="url"
          label="组件链接(url)"
          width="180">
        </el-table-column>
        <el-table-column
          prop="path"
          label="组件路径(path)">
        </el-table-column>
        <el-table-column
          prop="component"
          label="组件名称">
        </el-table-column>
        <el-table-column
          prop="iconCls"
          label="Icon">
        </el-table-column>
        <el-table-column
          prop="parentName"
          label="父菜单名称">
        </el-table-column>
        <el-table-column
          prop="seq"
          label="顺序"
          width="60"
          >
        </el-table-column>
        <el-table-column
          prop="action"
          label="操作"
          align='center'
          >
          <template slot-scope="scope">
            <el-button type="primary" size="small"  @click="changeMenu(scope.row,scope.$index)">修改</el-button>
            <el-button type="danger" size="small"  @click="deleteMenu(scope.row,scope.$index)">删除</el-button>
          </template>
        </el-table-column>
      </el-table>
    </div>
    <div class="table_pagintion">
      <el-pagination
      background
      layout="total,prev, pager, next, jumper"
      :total="alltatol"
      :page-size="7"
      @current-change="getCurrenpage"
      :current-page="current"
      >
      </el-pagination>
    </div>
    <!-- 菜单修改 -->
    <el-dialog
      title="菜单修改"
      :visible.sync="changemenuvisible"
      width="70%"
      >
      <el-form :model="changeForm" :rules="rules" ref="changeForm" label-width="100px" inline>
          <el-form-item label="菜单名称" prop="menuname" >
            <el-input v-model="changeForm.menuname" style="width:180px"></el-input>
          </el-form-item>
          <el-form-item label="菜单链接" prop="url" >
            <el-input v-model="changeForm.url" style="width:180px"></el-input>
          </el-form-item>
          <el-form-item label="菜单路径" prop="path" >
            <el-input v-model="changeForm.path" style="width:180px"></el-input>
          </el-form-item>
          <el-form-item label="组件名称" prop="component" >
            <el-input v-model="changeForm.component" style="width:180px"></el-input>
          </el-form-item>
          <el-form-item label="父菜单名称" prop="parentmenu"  v-show="parentSvisible">
              <el-select v-model="changeForm.parentmenu" placeholder="请选择"  @change="addgetSelect" class="select_menu03">
              <el-option
                v-for="item in options"
                :key="item.value"
                :label="item.label"
                :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
      </el-form>
      <span slot="footer" class="dialog-footer">
        <el-button @click="changemenuvisible = false">取 消</el-button>
        <el-button type="primary" @click="surechangeMenu">确 定</el-button>
      </span>
    </el-dialog>
  </div>
</template>

<script>
export default {
  name: "menuManage",
  data() {
    //添加菜单验证reg
    var validateName = (rule, value, callback) => {
        let reg = /^[a-zA-Z0-9\u4E00-\u9FA5]{2,17}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入最长17为字母数字汉字组合字符'));
        } else {
          callback();
        }
      };
      var validateUrl = (rule, value, callback) => {
        let reg = /^\/+$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的url'));
        } else {
          callback();
        }
      };
      var validatePath = (rule, value, callback) => {
        let reg = /^\/+[a-zA-Z0-9]{1,15}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的path'));
        } else {
          callback();
        }
      };
      var validateComponent = (rule, value, callback) => {
        let reg = /^[a-zA-Z0-9]{1,15}$/;
        if (!reg.test(value)) {
          callback(new Error('请输入正确的组件名称'));
        } else {
          callback();
        }
      };
      return {
        mevalue:'',
        selectvalue: '',
        tablepage:[],
        pagesize:7,
        alltatol:0,
        dialogVisible:false,
        addselectMenu:'',
        // 修改菜单对话框显示隐藏
        changemenuvisible:false,
        // 当前页码
        current:1,
        // 是否显示父菜单
        parentSvisible:'',
        // 菜单id
        menuId:"",
        ruleForm: {
          menuname: '',
          url: '',
          path: '',
          component: '',
          parentmenu: '',
        },
        changeForm: {
          menuname: '',
          url: '',
          path: '',
          component: '',
          parentmenu: '',
        },
        rules: {
           menuname: [{ required: true, validator: validateName, trigger: 'blur' }],
           url: [{ required: true, validator: validateUrl, trigger: 'blur' }],
           path: [{ required: true, validator: validatePath, trigger: 'blur' }],
           component: [{ required: true, validator: validateComponent, trigger: 'blur' }],
           parentmenu: [{ required: true, message: '请输入父菜单名称', trigger: 'change' }],
         },
        ops:{
          bar: {
          background: "rgba(144,147,153,.3)",
          onlyShowBarOnScroll: false,
          }
        },
        tableData: [],
        options: [],
        
      }
  },
  methods:{
    getSelect (selectvalue) {
      // console.log(this.options[0].label);
      let firstId = selectvalue;
      let data = this.tableData;
      this.tablepage = [];
      let menuArr = [];
      for(let i=0;i<data.length;i++){
        if(data[i].parentId === firstId){
          console.log(data[i])
          this.tablepage.push(data[i]);
        }
      }

    },
    getCurrenpage (page) {
      this.current = page;
      let start = this.pagesize*(page-1);
      let end = this.pagesize*(page);
      this.tablepage = this.tableData.slice(start,end)
    },
    openAdd () {
      this.dialogVisible =  true;
    },
    // 取消添加菜单
    cancleAddMenu () {
      this.dialogVisible = false;
       this.$message({
          showClose: true,
          message: '已取消添加菜单'
        });
    },
    // 确定菜单添加
    sureAddMenu () {
      let that = this;
      let {menuname,url,path,component,parentmenu} = this.ruleForm;
      this.$refs['ruleForm'].validate((valid)=>{
         if(valid){
           this.axios({
             method:'post',
             url:"/menu/addMenuOne",
             params:{
               component:component,
               name:menuname,
               parentId:parentmenu,
               url:url,
               path:path
             }
           }).then(res=>{
             let status = res.data.status;
             if(status === 'success'){
               that.dialogVisible = false;
               that.options = [];
               that.tableData = [];
               that.initMenuTable();
               this.$message({
                  showClose: true,
                  message: '添加菜单成功'
                });
             }
           })
         }else{
            console.log("fail")
         }
      })
    },
    //初始化菜单列表
    initMenuTable ()  {
      let that = this;                                                     
      this.axios({
        method:"get",
        url:"/menu/allMenus"
      }).then(res=>{
        let alldata = res.data;
        // console.log(alldata)
        for(let i=0;i<alldata.length;i++){
          let {name,url,path,component,iconCls,seq,id} = alldata[i]
          that.options.push({value:id,label:name})
          that.tableData.push({name:name,url:url,path:path,component:component,iconCls:iconCls,parentName:'-',seq:seq,id:id});
          for(let j=0;j<alldata[i].children.length;j++){
            let {name,url,path,component,iconCls,seq,parentId,id} = alldata[i].children[j];
            let parentName = alldata[i].name
            that.tableData.push({name:name,url:url,path:path,component:component,iconCls:iconCls,parentName:parentName,parentId:parentId,seq:seq,id:id});
          }
        }
        that.tablepage = that.tableData.slice(0,7);
        that.alltatol = that.tableData.length;
      })
    },
    //菜单搜索
    serchMenu () {
      let name = this.mevalue;
      // let inde = this.tableData.findIndex(el=>el.name === name);
      // let id = this.tableData[inde].id;
      // console.log(id)
      this.axios({
        method:'post',
        url:"/menu/findMenuByName",
        params:{
          name:name
        }
      }).then(res=>{
        let data = res.data.date;
        this.tablepage = [];
        data.forEach((el,index)=> {
          let {name,url,path,component,iconCls,seq} = el
          this.tablepage.push({name:name,url:url,path:path,component:component,iconCls:iconCls,seq:seq}) 
        });
        
      })
    },
    addgetSelect (name) {
      // console.log(name)
      this.ruleForm.parentmenu = name
    },
    changeIndex (index) {
         return index + (this.current - 1) * 10 + 1;
    },
    changeMenu (data) {
      let {name,url,path,component,parentName,parentId,id} = data;
      this.menuId = id;
      console.log(data);
      if(parentId && parentName){
        console.log(parentId)
        this.changeForm.menuname = name;
        this.changeForm.url = url;
        this.changeForm.path = path;
        this.changeForm.component = component;
        this.changeForm.parentmenu = parentId;
        this.parentSvisible = true
      }else{
        this.changeForm.menuname = name;
        this.changeForm.url = url;
        this.changeForm.component = component;
        this.changeForm.path = path;
        this.parentSvisible = false
      }
      this.changemenuvisible = true
    },
      // 确认修改菜单
    surechangeMenu () {
      let that = this;
      let name =that.changeForm.menuname;
      let url = that.changeForm.url;
      let path = that.changeForm.path;
      let component = that.changeForm.component;
      let parentId = that.changeForm.parentmenu;
      let id = that.menuId;
      this.axios({
        method:"post",
        url:"/menu/updateMenu",
        params:{
          name:name,
          url:url,
          path:path,
          component:component,
          parentId:parentId,
          id:id
        }
      }).then(res=>{
        console.log(res.data)
        let status = res.data.status;
        let data = res.data.date;
        if(status === 'success'){
          that.changemenuvisible = false;
          that.tableData = [];
          that.options = [];
          that.initMenuTable();
          // let {name,url,path,component,iconCls,seq} = data;
          // let parentName = data.children[0].name;
          // that.tableData.push({name:name,url:url,path:path,component:component,iconCls:iconCls,seq:seq,parentName:parentName})

        }
      })
    },
    // 删除菜单
    deleteMenu (data,index){
      console.log(data);
      let that = this;
      let name = data.name;
      let menuid = data.id;
      this.$confirm('此操作将永久删除"'+name+'"菜单, 是否继续?', '菜单删除', {
          confirmButtonText: '确定',
          cancelButtonText: '取消',
          type: 'warning'
        }).then(() => {
          this.axios({
            method:'post',
            url:"/menu/deleteMenu",
            params:{
              id:menuid
            }
          }).then(res=>{
            console.log(res.data)
            let status = res.data.status;
            if(status === 'success'){
              this.$message({
                type: 'success',
                message: '删除成功!'
              });
              let inde = that.tablepage.findIndex(el=>el.id == menuid);
              that.tablepage.splice(inde,1);
              let inde1 = that.tableData.findIndex(el=>el.id == menuid);
              that.tableData.splice(inde1,1);
              // that.tableData = [];
              // that.initMenuTable();
            }
            else if(status == 'error'){
              this.$message.error("删除失败，请检查用户是否已解绑此菜单!");
            }
          })
          
        }).catch(() => {
          this.$message({
            type: 'info',
            message: '已取消删除'
          });          
        });
    }
  },
  watch:{
    tableData(newvalue,oldvalue){
      this.tableData = newvalue;
    }
  },
  mounted () {
    let that = this;
    that.initMenuTable();
    // that.alltatol = this.tableData.length;
    // that.tablepage = that.tableData.slice(0,7);
    // console.log(that.tablepage)
  }
}
</script>

<style scoped>
.menu_top{
  width: 100%;
  padding: 10px;
}
.table_pagintion{
  height:32px;
  float:right;
  margin-top:10px;
}
.line{
  height:1px;
  width: 100%;
  background: #ccc;
  margin-top: 0px;
}
.label_width{
  display:line-block;
  width: 140px;
  text-align:right
}
.dialog-footer{
  clear:both
}
.select_menu{
  margin-left:30px
}
.select_menu03{
  margin-left:0px
}
.allwrap{
  width: 100%;
  height: 100%;
}
.userwrap{
  height: calc(100% - 94px);
  padding:0px 10px;
  box-sizing: border-box;
  overflow: hidden auto;
}
/* .usertable{
  width:
} */
</style>

