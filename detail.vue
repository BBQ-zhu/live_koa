<template>
  <view>
    <view style="padding:0;background-color: #FFFFFF">
      <view class="content">
        <view class="listDetail">
          <label>企业名称：</label>
          <input v-model="listDetail.company_name" class="uni-input" placeholder="请输入企业名称" />
        </view>
        <view class="listDetail">
          <label>活动地点：</label>
          <input v-model="listDetail.active_place" class="uni-input" placeholder="请输入活动地点" />
        </view>
        <view class="listDetail">
          <label>活动时间：</label>
          <view
            style="border-bottom:1px solid #333;width:74.4%;height:30px;line-height: 30px; "
          >
		  <!-- border-bottom: 1px dashed #F1F1F1; -->
            <e-picker @change="change">{{listDetail.active_time.substring(0,10)||'选择生日'}}</e-picker>
          </view>
        </view>

        <label style="font-weight: 600;">备注信息：</label>
        <textarea
          rows="3"
          v-model="listDetail.remarks"
          auto-height
          class="deltail_textarea"
          placeholder="请输入备注信息"
        />
      </view>
    </view>

    <view style="background-color: #FFFFFF">
      <button
	  v-if="!changeShow"
        size="mini"
        @click="changeShow = true"
        class="newBgColor blackColor"
        style="float:right;margin: 8px 10px 5px 0px;"
      >编辑</button>
      <view v-if="changeShow">
        <view style="color:#d81e06; font-size: 18px; float: left;width: 35%;margin:0 0 0 16px;">
          <label style="float: left;line-height: 40px;">￥:</label>
          <input
		  @click="changeShow = false"
            disabled
            class="nav-input"
            :value="listDetail.active_all_price"
            type="number"
            placeholder="请输入价格"
          />
        </view>
        <lb-picker
          @confirm="deviceChange"
          :list="deviceList"
          :value="checkDevice"
          :props="myProps"
          :level="level"
          mode="multiSelector"
        >
          <button
            size="mini"
            class="newBgColor blackColor"
            style="float:right;margin: 8px 10px 5px 0px;"
          >新增</button>
        </lb-picker>
        <button
          size="mini"
          @click="onConfirmClick(0);"
          class="newBgColor blackColor"
          style="float:right;margin: 8px 10px 5px 0px;"
        >保存</button>
        <button
          size="mini"
          @click="onConfirmClick(1);"
          class="newBgColor blackColor"
          style="float:right;margin: 8px 10px 5px 0px;"
        >删除</button>
      </view>
      <uni-collapse v-for="(item,index) in listDetail.task_medium_tables" :key="index">
        <view class="red_border"></view>
        <uni-collapse-item :title="item.device_one_name" thumb="true">
          <view class="devies_counts" v-for="(ite,ind) in item.device_two_name" :key="ind">
            <view class="devies_text">{{ite.device_name}}</view>
            <input
              disabled
              :value="ite.devices_two_num"
              class="uni-input devies_input"
              type="number"
              placeholder="数量"
            />
            <view class="controlDevies">
              <view class="Devies" @click="delateDevice(ite.devices_two_id,index,ind)">-</view>
            </view>
          </view>
        </uni-collapse-item>
      </uni-collapse>

      <uni-collapse>
        <view class="red_border"></view>
        <uni-collapse-item title="图片" thumb="true">
          <!-- 上传图片 -->
          <g-upload
            ref="gUpload"
            :mode="imgList"
            @chooseFile="chooseFile"
            @imgDelete="imgDelete"
            :control="control"
            :columnNum="columnNum"
            :maxCount="maxCount"
          ></g-upload>
        </uni-collapse-item>
      </uni-collapse>
    </view>

    <wyb-modal
      ref="modal"
      title="提示"
      :content="cancelText"
      cancel-text="取消"
      confirm-text="确定"
      @cancel="onConCancel"
      @confirm="onConfirm"
    />
  </view>
</template>

<script>
//悬浮按钮
import wybModal from "@/components/wyb-modal/wyb-modal.vue";
import LbPicker from "@/components/lb-picker";
import gUpload from "@/components/g-upload/g-upload.vue";
import uniCollapse from "@/components/uni-collapse/uni-collapse.vue";
import uniCollapseItem from "@/components/uni-collapse-item/uni-collapse-item.vue";
export default {
  components: {
    uniCollapse,
    uniCollapseItem,
    gUpload,
    LbPicker,
    wybModal
  },
  data() {
    return {
		changeShow:false,
      cancelText: "",
      contValue: 0,
      // 设备选择器
      myProps: {
        label: "device_name",
        value: "devices_id",
        children: "devices_twos"
      },
      level: 3,
      checkDevice: [],
      deviceList: [],
      control: true,
      columnNum: 3,
      maxCount: 10,
      imgList: [],
      imgListId: [],
      listDetail: {}
    };
  },
  onLoad(option) {
    console.log(option);
    if (option) {
      this.listDetail = JSON.parse(option.data);
      this.listDetail.task_medium_tables =
        this.listDetail.task_medium_tables || [];
      this.findAllDevices();
      var imgArr = this.listDetail.upload_imgs || [];
      for (var i = 0; i < imgArr.length; i++) {
        this.imgList.push(this.$baseUrl + imgArr[i].img_url);
        this.imgListId.push(imgArr[i].id);
      }
    }
    console.log(this.listDetail);
  },

  methods: {
    // uni.showModal({
    //   title: "提示",
    //   content: "这是一个模态弹窗",
    //   success: function(res) {
    //     if (res.confirm) {
    //       console.log("用户点击确定");
    //     } else if (res.cancel) {
    //       console.log("用户点击取消");
    //     }
    //   }
    // });
    //   uni.showToast({ title: "请填写员工工号", icon: "none", duration: 2000 }); //弹出框
    onConfirmClick(value) {
      this.contValue = value;
      if (value == 0) {
        //保存
        this.save(true);
      } else if (value == 1) {
        //删除
        if (this.listDetail.upload_imgs.length > 0) {
          uni.showToast({
            title: "请先删除图片！",
            icon: "none",
            duration: 2000
          }); //弹出框
        } else {
          this.$refs.modal.showModal(); // 显示
          this.cancelText = "确认删除该订单？";
        }
      }
    },
    onConCancel() {
      //取消
      this.$refs.modal.hideModal();
    },
    onConfirm() {
      //确认
      if (this.contValue == 0) {
        //保存
        this.onConCancel();
      } else if (this.contValue == 1) {
        //删除
        if (this.listDetail.upload_imgs.length > 0) {
          this.onConCancel();
        } else {
          this.delate();
        }
      }
    },
    //保存任务
    save(value) {
      console.log(this.listDetail);
      if (!this.listDetail.company_name) {
        uni.showToast({
          title: "请填写公司名称！",
          icon: "none",
          duration: 2000
        }); //弹出框
      } else if (!this.listDetail.active_time) {
        uni.showToast({
          title: "请填写活动时间！",
          icon: "none",
          duration: 2000
        }); //弹出框
      } else if (!this.listDetail.active_place) {
        uni.showToast({
          title: "请填写活动地点！",
          icon: "none",
          duration: 2000
        }); //弹出框
      } else {
        this.$myAjax("/createTask", this.listDetail).then(res => {
          console.log(res);
          if (res.code == 200) {
            if (value) {
              uni.navigateBack({
                delta: 1
              });
            }
          }
        });
      }
    },
    //删除任务
    delate() {
      var arr = {
        task_id: this.listDetail.id
      };
      this.$myAjax("/delateTask", arr).then(res => {
        console.log(res);
        if (res.code == 200) {
          uni.navigateBack({
            delta: 1
          });
        }
      });
    },
    //删除二级设备
    delateDevice(devices_two_id, index, ind) {
      var arr = {
        task_id: this.listDetail.id,
        devices_two_id: devices_two_id
      };
      this.$myAjax("/delateTask/devices_two", arr).then(res => {
        console.log(res);
        if (res.code == 200) {
          var list = this.listDetail.task_medium_tables[index].device_two_name;
          list.splice(ind, 1);
          this.listDetail.task_medium_tables[index].device_two_name = list;
          console.log(list);
          //查询当前任务的价格
          this.checkPrice();
        }
      });
    },
    //设备选择事件后新增
    deviceChange(value) {
      var valueList = value.item;

      var arr1 = {
        task_id: this.listDetail.id,
        device_name: valueList[1].device_name,
        device_price: valueList[2].devices_id,
        devices_one_id: valueList[0].devices_id,
        devices_two_id: valueList[1].devices_id,
        devices_two_num: valueList[2].device_name
      };
      var arr2 = {
        task_id: this.listDetail.id,
        device_one_name: valueList[0].device_name,
        devices_one_id: valueList[0].devices_id,
        devices_two_id: valueList[1].devices_id,
        devices_two_num: valueList[2].device_name,
        device_two_name: [
          {
            device_name: valueList[1].device_name,
            device_price: valueList[2].devices_id,
            devices_one_id: valueList[0].devices_id,
            devices_two_id: valueList[1].devices_id,
            devices_two_num: valueList[2].device_name
          }
        ]
      };

      //添加二级设备
      this.$myAjax("/createTask/devices_two", arr1).then(res => {
        console.log(res);
        if (res.code == 200) {
          var check = false; //已经存在的一级设备增加
          this.listDetail.task_medium_tables.forEach((item, index) => {
            if (item.devices_one_id == valueList[0].devices_id) {
              item.device_two_name.push(arr1);
              check = true;
              return;
            }
          });
          if (!check) {
            //重新创建新的一级分类
            this.listDetail.task_medium_tables.push(arr2);
          }
          //查询当前任务的价格
          this.checkPrice();
        } else {
          // 报错信息
        }
      });
    },
    //获取所有设备
    findAllDevices() {
      this.$myAjax("/devices", {}).then(res => {
        var arrList = res.data;
        arrList.forEach((item, index) => {
          let arr = { device_name: "", devices_id: "", devices_twos: [] };
          arr.device_name = item.device_name;
          arr.devices_id = item.id;
          let list2 = [];
          item.devices_twos.forEach((val, ind) => {
            let arr2 = { device_name: "", devices_id: "", devices_twos: [] };
            arr2.device_name = val.device_name;
            arr2.devices_id = val.id;

            let numList = [];
            for (let i = 1; i < 51; i++) {
              let arr3 = { device_name: "", devices_id: "" };
              arr3.device_name = i;
              arr3.devices_id = val.device_price;
              numList.push(arr3);
            }
            arr2.devices_twos = numList;
            list2.push(arr2);
            // this.$set(list2,'devices_twos',numList)
          });
          arr.devices_twos = list2;
          this.deviceList.push(arr);
        });
      });
    },
    //时间控件
    change(e) {
      this.listDetail.active_time = e;
    },
    //点击上传控件上传
    uploadImg() {
      this.$refs.gUpload.uploadImg();
    },

    chooseFile(list, v) {
      console.log(this.imgList);
      console.log(list, v);
      this.uploadFileToServe(v);
    },
    //查询当前任务id下的所有图片  findImg
    findThisIdImg() {
      var arr = {
        id: this.listDetail.id
      };
      this.$myAjax("/findImg", arr).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.listDetail.upload_imgs = res.data ? res.data : [];
          var imgArr = this.listDetail.upload_imgs;
          this.imgList = [];
          this.imgListId = [];
          for (var i = 0; i < imgArr.length; i++) {
            this.imgList.push(this.$baseUrl + imgArr[i].img_url);
            this.imgListId.push(imgArr[i].id);
          }
        }
        console.log(this.imgList);
        console.log(this.imgListId);
      });
    },
    //图片上传事件
    uploadFileToServe(urlList) {
      console.log(urlList);
      if (!urlList || urlList.length <= 0) {
        return;
      }
      for (let i = 0; i < urlList.length; i++) {
        uni.uploadFile({
          url: this.$baseUrl + "/uploadImg", //仅为示例，非真实的接口地址
          filePath: urlList[i],
          name: "file",
          formData: {
            task_id: this.listDetail.id
          },
          success: res => {
            console.log(JSON.parse(res.data));
            if (JSON.parse(res.data).data.code == 200) {
              this.findThisIdImg();
            }

            // console.log(this.imgList);
          }
        });
      }
    },

    // 删除图片
    imgDelete(list, eq) {
      console.log(list, eq);

      var imgArr = JSON.parse(JSON.stringify(this.listDetail.upload_imgs));
      console.log(imgArr[eq]);
      var arr = {
        fileName: imgArr[eq].img_url,
        img_id: imgArr[eq].id
      };

      this.$myAjax("/delateImg", arr).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.findThisIdImg();
        }
        // this.listDetail.upload_imgs[eq].splice(eq,1)
        // this.imgListId.splice(eq,1)
      });
    },

    //查询当前任务的价格
    checkPrice() {
      var arr = this.listDetail.task_medium_tables;
      var allPrice = 0;
      arr.forEach((item, index) => {
        item.device_two_name.forEach((ite, ind) => {
          allPrice += ite.device_price * ite.devices_two_num;
        });
      });
      this.listDetail.active_all_price = allPrice;
      this.save(false); //在保存
      console.log(allPrice);
    }
  }
};
</script>

<style scoped>
.nav-list {
  width: 100%;
  height: 40px;
  position: fixed;
  bottom: 0px;
  background-color: #333333;
  /* background-color:rgb(255, 162, 0); */
}
.nav-bottom {
  width: 100%;
  position: flex;
  color: #fff;
  align-items: center;
  justify-content: space-between;
}
.nav_text {
  width: 40px;
  height: 40px;
  line-height: 40px;
  color: #f1f1f1;
  float: left;
  margin-left: 2px;
  text-align: center;
  /* border-radius: 10px; */
  /* background-color: #007AFF; */
}
.nav-input {
  float: left;
  width: 70%;
  font-size: 20px;
  margin-top: 6px;
  margin-left: 4px;
}

.save {
  width: 100px;
  height: 40px;
  line-height: 38px;
  text-align: center;
}
.content {
  width: 98%;
  margin: 0 auto;
  margin: 10px 0 0 15px;
}
.listDetail {
  display: flex;
  justify-content: left;
  align-items: center;
  width: 100%;
}
.listDetail > label {
  font-weight: 600;
}
.uni-input {
  width: 74.4%;
  border-bottom:1px solid #333;
  /* box-shadow: #ff00de 0px 2px, #2addfd 3px 0px; */
}
.deltail_textarea {
  width: 93%;
  height: 40px;
  border: 1px dashed #333;
  font-size: 14px;
   /* border-bottom:1px solid #333; */
  padding: 3px;
  padding-bottom: 10px;
  margin-top: 5px;
}
.goods-nav {
  display: flex;
}
.controlDevies {
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
}
.Devies {
  width: 20px;
  height: 20px;
  border: 1px dashed #999999;
  line-height: 19px;
  text-align: center;
  margin-left: 10px;
}
.devies_counts {
  width: 95%;
  margin: 0 auto;
  display: flex;
  justify-content: space-between;
  align-content: center;
  align-items: center;
  margin-bottom: 10px;
}
.devies_text {
  width: 60%;
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}
.devies_input {
  width: 8%;
  text-align: center;
  height: auto;
  margin-top: -2px;
}
.red_border {
  width: 30%;
  height: 1px;
  background-color: #d81e06;
  position: relative;
  top: 1px;
  z-index: 2;
}
/* .img_bg{
	width: 100%;
	height:30px;
	line-height: 10px;
	margin: 0 auto;
	background-color: #F1F1F1;
	display: flex;
	justify-content: left;
	align-items: center;
}
.img_left{
	width: 3px;
	height: 80%;
	background-color: #333333; 
	display: inline-block;
	border-radius: 50px;
	margin-left: 10px;
	margin-right:5px;
} */
</style>
