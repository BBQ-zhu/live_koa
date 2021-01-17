<template>
  <view class="content">
    <carousel :img-list="imgList" url-key="url" @selected="selectedBanner" />
    <view class="nav">
      <view class="nav_title newBgColor" style="background: #333;position: relative;">
        <icon style="position: absolute;right:5px;top:7px;" type="warn" size="16" />
        <view style="padding:5px 0 5px 3px;font-weight: 600;">今日订单</view>
        <view style="padding-left:5px;font-size: 14px;">{{lowestdate}}个</view>
      </view>
      <view class="nav_title newBgColor" style="background: #333;position: relative;">
        <icon style="position: absolute;right:5px;top:7px;" type="waiting" size="16" />
        <view style="padding:5px 0 5px 3px;font-weight: 600;">未完成订单</view>
        <view style="padding-left:5px;font-size: 14px;">{{lowest}}个</view>
      </view>
      <view class="nav_title newBgColor" style="background: #333;position: relative;">
        <icon style="position: absolute;right:5px;top:7px;" type="success" size="16" />
        <view style="padding:5px 0 5px 3px;font-weight: 600;">总订单数</view>
        <view style="padding-left:5px;font-size: 14px;">{{allTaskList2.length}}个</view>
      </view>
    </view>
    <view style="display: flex;width:95%;margin:0 auto;margin-bottom: 10px;">
      <view
        style="width: 70px;height:25px;text-align: center; border-bottom:1px solid #d81e06;"
      >最新订单</view>
      <view
        @click="gotoTitle()"
        style="width: 70px;height:25px;text-align: center; border-bottom:1px solid #ccc;color:#C0C0C0; margin-left: 5px;"
      >公告栏</view>
    </view>
    <navList :navListInfo="allTaskList"></navList>
  </view>
</template>

<script>
import carousel from "@/components/vear-carousel/vear-carousel";
import navList from "@/components/nav-list/nav-list";
export default {
  components: {
    carousel,
    navList
  },
  data() {
    return {
      limit: 5,
      offset: 0,
      allTaskList: [], //所有任务
      allTaskList2: [], //统计
      lowestdate: 0,
      lowest: 0,
      imgList: [
        {
          url:
            "https://ossweb-img.qq.com/images/lol/web201310/skin/big39001.jpg",
          id: 1
        },
        {
          url:
            "https://ossweb-img.qq.com/images/lol/web201310/skin/big39005.jpg",
          id: 2
        },
        {
          url:
            "https://ossweb-img.qq.com/images/lol/web201310/skin/big39003.jpg",
          id: 3
        },
        {
          url:
            "https://ossweb-img.qq.com/images/lol/web201310/skin/big39004.jpg",
          id: 4
        }
      ]
    };
  },
  onLoad() {},
  //拉下刷新监听
  onPullDownRefresh() {
    this.limit = 5;
    this.offset = 0;
    this.allTaskList = []; //所有任务
    this.allTask();
    setTimeout(() => {
      uni.stopPullDownRefresh();
    }, 1500);
  },
  onShow() {
	  console.log('这里是首页')
    this.limit = 5;
    this.offset = 0;
    this.allTaskList = []; //所有任务
    this.allTask();
    this.allTask2();
    // this.allUser()
  },
  onReachBottom() {
    // 触底的时候请求数据，即为上拉加载更多
    this.allTask();
  },
  methods: {
    gotoTitle() {
      uni.showToast({ title: "开发中。。。", icon: "none", duration: 2000 }); //弹出框
    },
    //二级设备增加
    createTaskTwo() {
      var arr = {
        task_id: 2,
        devices_one_id: 1,
        devices_two_id: 1,
        devices_two_num: 10
      };
      this.$myAjax("/createTask/devices_two", arr).then(res => {
        console.log(res);
      });
    },
    //二级设备删除
    delateTaskTwo() {
      this.$myAjax("/delateTask/devices_two", {
        task_id: 3,
        devices_two_id: 1
      }).then(res => {
        console.log(res);
      });
    },
    //删除任务
    delateTask() {
      this.$myAjax("/delateTask", {
        task_id: 1
      }).then(res => {
        console.log(res);
      });
    },
    //添加任务\更新任务（弹出窗内点保存的时候触发）
    createTask() {
      var arr = {
        id: 1, //id不为null时为新增，否则为更新
        active_place: "活动地点",
        active_time: "2020-12-12 10:59:30",
        company_name: "公司名称",
        active_all_price: 0,
        remarks: "备注信息"
      };
      this.$myAjax("/createTask", arr).then(res => {
        console.log(res);
      });
    },
    //查询所有任务 分页
    allTask() {
      let arr = {
        statistics: "0", //是否是统计界面(0:首页分页查询,1:统计页多条件查询,2:下载excel)
        limit: this.limit,
        offset: this.limit * this.offset,
        startTime: "",
        endTime: "",
        company_name: "",
        active_place: ""
      };
      this.$myAjax("/allTask", arr).then(res => {
        console.log(res);
        if (res.code == 200) {
          this.allTaskList = this.allTaskList.concat(res.data);
          this.offset += 1;
          console.log(this.offset);
        }
      });
    },
    //查询所有用户
    allUser() {
      this.$myAjax("/allUser", {}).then(res => {
        console.log(res);
      });
    },
    //查询所有任务统计
    allTask2() {
      var _this = this;
      let arr = {
        statistics: "2", //是否是统计界面(0:首页分页查询,1:统计页多条件查询,2:下载excel)
        limit: _this.limit,
        offset: _this.limit * _this.offset,
        startTime: "",
        endTime: "",
        company_name: "",
        active_place: ""
      };
      _this.$myAjax("/allTask", arr).then(res => {
        console.log(res);
        if (res.code == 200) {
          _this.lowest = 0;
          _this.lowestdate = 0;
          _this.allTaskList2 = res.data;
          _this.allTaskList2.forEach(item => {
            var dateNew = this.timeCheck(item.active_time);
            if (dateNew == 0) {
              _this.lowestdate += 1;
            }
            if (dateNew > 0) {
              _this.lowest += 1;
            }
          });
          // console.log(nowDate)
        }
      });
    },
    timeCheck(newDate) {
      var myDate = new Date();
      var year = myDate.getFullYear();
      var mouth =
        myDate.getMonth() + 1 < 10
          ? "0" + (myDate.getMonth() + 1)
          : myDate.getMonth() + 1;
      var date = myDate.getDate();
      var teDate = year + "-" + mouth + "-" + date;
      var active_time2 = parseInt(newDate.replace(/[^0-9]/gi, ""));
      var nowDate = parseInt(teDate.replace(/[^0-9]/gi, ""));
	  var dateNew = active_time2 - nowDate;
	  console.log(dateNew)
      return dateNew;
    },
    selectedBanner(item, index) {
      console.log("轮播图", item, index);
    }
  }
};
</script>

<style>
.nav_title {
  width: 30%;
  height: 60px;
  color: #ffffff;
  border-radius: 5px;
  /* box-shadow: 2px 2px 4px #ccc; */
}
.nav {
  width: 98%;
  margin: 0 auto;
  display: flex;
  justify-content: space-around;
  margin-bottom: 10px;
}
</style>
