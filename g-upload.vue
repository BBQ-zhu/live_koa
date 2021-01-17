<template>
  <view class="imglistbx">
    <view :class="['imglistItem',columnNum==3?'column3':'column4']" v-for="(item,index) in showList" :key='index'>
      <!-- <view :style="{width:'100%;',height:'auto;',background:url()}"></view> -->
      <image :src="item" class="itemImg_zhu" @click="previewImage(index)" mode="aspectFill"></image>
      <icon size="18" type="cancel" class="cancelBtn" @click="deleteImg(index)" v-if="uniId && deleteBtn"></icon>
    </view>
    <!-- 上传控件 -->
    <view :class="['imglistItem',columnNum==3?'column3':'column4']" @click="uploadImg" v-if="uniId && control && showControl">
      <view class="itemImg uploadControl">+</view>
    </view>
    <view class="clear"></view>
  </view>
</template>

<script>
  export default {
    props: {
      //是否显示上传控件
      control: {
        type: Boolean,
        default: true
      },
      //是否显示上删除按钮
      deleteBtn: {
        type: Boolean,
        default: true
      },
      //行数量 
      columnNum: {
        type: [Number, String],
        default: 4
      },
      //上传最大数量
      maxCount: {
        type: Number,
        default: 4
      },
      //服务返回回调的图片数组--回填
      mode: {
        type: Array,
        default: function() {
          return []
        }
      }
    },
    data() {
      return {
        imgList: [],
        showList: [],
        showControl: true,
		uniId:false
      }
    },
    watch: {
      mode(v) {
        this.init(v)
      },
      showList(){
		  
        if (this.showList.length >= this.maxCount) {
          this.showControl = false
          return
        };
         this.showControl = true;
      }
    },
    created() {
      this.init(this.mode)
	  var login = uni.getStorageSync('uniId')
	  if(this.$superBoss.username == login.username && this.$superBoss.password == login.password){
	  	this.uniId = true
	  }else{
	  	this.uniId = false
	  }
    },
    methods: {
      init(v) {
        if (this.mode.length != 0) {
          this.showList = v;
          return
        };
        this.showList = this.imgList;
      },
      // 上传图片
      uploadImg() {
        uni.chooseImage({
          sizeType: ['compressed '],
          count: this.maxCount,
          success: (chooseImageRes) => {
            let tempFilePaths = chooseImageRes.tempFilePaths;
            tempFilePaths=tempFilePaths.slice(0,this.maxCount-this.showList.length);
            tempFilePaths.forEach((item) => {
              this.imgList.push(item);
            })
            this.$emit("chooseFile", this.imgList, tempFilePaths)
          }
        });
      },
      //删除图片
      deleteImg(eq) {
        let deleteImg = this.imgList;
        deleteImg.splice(eq, 1); //删除临时路径
        if (this.mode.length > 0) {
          let deleteImg = this.showList;
          deleteImg.splice(eq, 1); //删除服务那边的路径
        }
        this.$emit("imgDelete", this.handleImg(), eq)
      },
      // 预览图片
      previewImage(eq) {
        let getUrl = this.handleImg();
        uni.previewImage({
          current: getUrl[eq],
          urls: getUrl
        })
      },
      //返回需要操作的图片数组
      //如果是回调了则操作回填后的数组 否则操作临时路径的图片数组
      handleImg() {
        return this.mode.length > 0 ? this.showList : this.imgList
      },
    }
  }
</script>

<style scoped>
  /* 上传  str */
  .imglistbx {
    width: 100%;
    height: auto;
	  margin-top: 20px;
  }
  .imglistItem {
    position: relative;
    float: left;
    margin-bottom: 20rpx;
    border-radius: 10rpx;
  }
  .column3 {
    width: 100%;
    min-height: 100px;
  }
  .column4 {
    width: 25%;
    height: 130rpx;
  }
  .itemImg_zhu {
    width: 700rpx;
    height: 1120rpx;
    margin: 0 auto;
    display: block;
    border-radius: 10rpx;
  }
  .itemImg {
    width: 100px;
    height: 100px;
    margin: 0 auto;
    display: block;
    border-radius: 10rpx;
  }
  .cancelBtn {
    position: absolute;
    top: -18rpx;
    right: 0;
  }
  /* 上传控件 */
  .uploadControl {
    font-size: 50rpx;
    color: #888;
    background-color: #EEEEEE;
    display: flex;
    justify-content: center;
    align-items: center;
  }
  /*  上传  str end*/
  .clear {
    clear: both;
  }
</style>
