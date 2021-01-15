<template>
  <view>
    <block v-for="(item,index) in navListInfo" :key="index">
      
      <view class="content_list" @click="detail(index)">
        <view
          class="company_name newBgColor"
          :class="item.company_name.length>2 ? 'lh30' :'lh60' "
        >{{item.company_name}}</view>
        <view class="active ml10 mr10">
          <view class="overflowText active_place">{{item.active_place}}</view>
          <view class="overflowText remarks">{{item.remarks}}</view>
          <view class="overflowText active_time">{{item.active_time.substring(0,10)}}</view>
        </view>
		<icon v-if="timeCheck(item.active_time)" style="position: relative;right:-18px;top:-22px;" type="warn" size="16" />
        <view style="margin-right:5px;">
          <uni-icons type="arrowright" size="20"></uni-icons>
        </view>
      </view>
    </block>
  </view>
</template>

<script>
import uniIcons from "@/components/uni-icons/uni-icons.vue";
export default {
  props: ["navListInfo"],
  components: { uniIcons },
  data() {
    return {};
  },
  methods: {
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
      console.log(dateNew);
      if (dateNew >= 0) {
        return true
      }else{
		return false
	  }
      
      
    },
    detail(index) {
      uni.navigateTo({
        url:
          "/pages/detail/detail?data=" +
          encodeURIComponent(JSON.stringify(this.navListInfo[index]))
      });
      console.log(this.navListInfo[index]);
    }
  }
};
</script>

<style scoped>
/* @import '../../common/css/common.css'; */
.lh30 {
  line-height: 30px;
}
.lh60 {
  line-height: 60px;
}
.content_list {
  width: 96%;
  height: 70px;
  background-color: #ffffff;
  box-shadow: 2px 2px 5px #c8c7cc;
  border-radius: 5px;
  margin: 4px auto;
  display: flex;
  justify-content: space-between;
  align-items: center; /*垂直居中*/
}
.company_name {
  /* 	text-shadow: #ff00de 1px 1px, #2addfd 1px 2px;
	color:#fff; */
  color: #fff;
  background-color: #333;
  width: 60px;
  height: 60px;
  font-family: "楷体";
  margin-left: 5px;
  border-radius: 5px;
  text-align: center;
  font-size: 21px;
  font-weight: 800;
  word-break: break-all;
  word-wrap: break-word;
}
.active {
  width: 50%;
  flex: 1;
}
.active_place {
  font-size: 16px;
  font-weight: 500;
}
.remarks {
  font-size: 14px;
  color: #c0c0c0;
}
.active_time {
  font-size: 14px;
  color: #c0c0c0;
}
</style>
