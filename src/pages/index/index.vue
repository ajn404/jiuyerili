<template>
  <view class="home content">
    <view class="item">
      <image class="logo" src="/static/jr.png" />
    </view>
    <view class="item swiper-box">
      <view class="uni-padding-wrap">
        <view class="page-section swiper">
          <view class="page-section-spacing">
            <swiper :autoplay="autoplay" :duration="duration" :interval="interval" class="swiper">
              <swiper-item>
                <view class="swiper-item uni-bg-red">
                  <img
                          alt
                          class="swiper-img"
                          src="https://91.usst.edu.cn/UploadFiles/banner/1234.jpg"
                  />
                </view>
              </swiper-item>
              <swiper-item>
                <img
                        alt
                        class="swiper-img"
                        src="https://91.usst.edu.cn/UploadFiles/banner/%E5%AE%A3%E8%AE%B2%E4%BC%9A.jpg"
                />
              </swiper-item>
              <swiper-item>
                <img
                        alt
                        class="swiper-img"
                        src="https://91.usst.edu.cn/UploadFiles/banner/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211018114819.png"
                />
              </swiper-item>
            </swiper>
          </view>
        </view>
      </view>
    </view>
    <view class="item">
      <div class="time" style="display: flex">
        <tui-date-time ref="dateTimeStart" @confirm="startChange" :type="2"></tui-date-time>
        <tui-button
                type="gray-primary"
                @click="$refs.dateTimeStart.show()"
                width="375upx"
                height="84upx"
        >
          <tui-icon name="calendar" class="calendar-icon"></tui-icon>
          {{selectedStartDay}}
        </tui-button>
        <div class="arrow">
          <tui-icon name="arrowright"></tui-icon>
        </div>
        <tui-date-time ref="dateTimeEnd" @confirm="endChange" :type="2"></tui-date-time>
        <tui-button
                type="gray-primary"
                @click="$refs.dateTimeEnd.show()"
                width="375upx"
                height="84upx"
        >
          <tui-icon name="calendar" class="calendar-icon"></tui-icon>
          {{selectedEndDay}}
        </tui-button>
      </div>
    </view>
    <view v-if="CampusRecruList.length===0&&meetTable.length==0&&!loading">
      <tui-no-data>
        <text class="tui-color__black">暂无数据</text>
      </tui-no-data>
    </view>

    <view class="item" style="margin-top: 20upx">
      <view v-for="(item,index) in meetTable.slice(0,4)" class="card-item" :key="index">
        <tui-card :title="{text:'[招聘会]'+item.MeetName}">
          <template v-slot:body>
            <view class="tui-default">
              <p class="card-info">
                <span class="card-info-title">主题：</span>
                {{item.MeetName}}
              </p>
              <p class="card-info">
                <span class="card-info-title">地点：</span>
                {{item.MeetAddress}}
              </p>
              <p class="card-info">
                <span class="card-info-title">开始时间：</span>
                {{moment(item.MeetStart).format('YYYY-MM-DD h:mm')}}
              </p>
              <p class="card-info">
                <span class="card-info-title">结束时间：</span>
                {{moment(item.MeetEnd).format('YYYY-MM-DD h:mm')}}
              </p>
            </view>
          </template>
          <template v-slot:footer>
            <view class="footer">
              <view class="footer-col">
                <span @click="addToCal(item.MeetID,1)" class="footer-button">添加到日程</span>
              </view>
            </view>
          </template>
        </tui-card>
      </view>
    </view>

    <view class="item">
      <view v-for="(item,index) in CampusRecruList" class="card-item" :key="index">
        <tui-card :title="{text:'[宣讲会]'+item.EntName}" @click="goDetail(item.AppID)">
          <template v-slot:body>
            <view class="tui-default card">
              <p class="card-info">
                <span class="card-info-title">招聘单位：</span>
                {{item.EntName}}
              </p>
              <p class="card-info">
                <span class="card-info-title">宣讲会地点：</span>
                {{item.HostVenue}}
              </p>
              <p class="card-info">
                <span class="card-info-title">时间：</span>
                {{moment(item.ScheduledDate).format('YYYY-MM-DD')+' ' +item.ScheduledDateS+'-'+item.ScheduledDateE}}
              </p>
            </view>
          </template>
          <template v-slot:footer>
            <view class="footer">
              <view class="footer-col">
                <span @click="addToCal(item.AppID,0)" class="footer-button">添加到日程</span>
              </view>
              <view class="footer-col">
                <span class="footer-txt footer-button" @click="goDetail(item.AppID)">详情 ></span>
              </view>
            </view>
          </template>
        </tui-card>
      </view>
    </view>

    <view
            class="loadmore"
            v-if="hasMore>0||loading"
            @click="loadData"
    >{{loading ? "加载中..." : "点击加载更多"}}</view>

    <tui-toast ref="toast"></tui-toast>
  </view>
</template>
<script>
  const BASE_URL = "http://cn3.frp.cool:12355/";
  const getAuthCode = struct => {
    return new Promise((resolve, reject) => {
      HWH5.getAuthCode()
              .then(data => {
                resolve(data);
              })
              .catch(data => {
                resolve(data);
              });
    });
  };

  const post = (_url, params) => {
    return new Promise(async (resolve, reject) => {
      let token = await getAuthCode();
      token = token.code;
      if (!token) {
        uni.showToast({
          title: "登录状态失效"
        });
        reject("登录状态失效");
      }
      let _headers = {
        "x-wlk-code": token,
        "Content-Type": "application/x-www-form-urlencoded"
      };
      HWH5.fetchInternet(BASE_URL + _url, {
        method: "post",
        body: params.join("&"),
        headers: _headers
      })
              .then(res => {
                res.json().then(reply => {
                  resolve(reply);
                });
              })
              .catch(error => {
                console.log("请求异常", error);
                reject(error);
              });
    });
  };

  import tuiCard from "thorui-uni/lib/thorui/tui-card/tui-card";
  import tuiDateTime from "thorui-uni/lib/thorui/tui-datetime/tui-datetime";
  import tuiCalendar from "thorui-uni/lib/thorui/tui-calendar/tui-calendar";
  import tuiToast from "thorui-uni/lib/thorui/tui-toast/tui-toast";
  import tuiButton from "thorui-uni/lib/thorui/tui-button/tui-button";
  import tuiIcon from "thorui-uni/lib/thorui/tui-icon/tui-icon.vue";
  import tuiNoData from "thorui-uni/lib/thorui/tui-no-data/tui-no-data";
  import moment from "moment";
  import axios from "axios";
  export default {
    data() {
      return {
        autoplay: true,
        interval: 2000,
        duration: 500,
        parsedData: [],
        data: [],
        moment,
        limit: 20,

        today: "",
        isStartDay: false,
        selectedStartDay: "",
        selectedEndDay: "",
        hasMore: 1,
        loading: true,

        //宣讲会
        CampusRecruList: [],
        //招聘会
        meetTable: [],
        recru_next: "",
        meet_next: ""
      };
    },
    async onLoad() {
      let today = moment(new Date()).format("YYYY-MM-DD");
      let tomorrow = moment(new Date())
              .add(1, "days")
              .format("YYYY-MM-DD");
      this.selectedStartDay = today;
      this.selectedEndDay = tomorrow;
      uni.startPullDownRefresh();
    },
    async onPullDownRefresh() {
      await this.init();
      uni.stopPullDownRefresh();
    },
    onReachBottom() {
      if (this.hasMore > 0) this.loadData();
    },
    methods: {
      async init() {
        this.recru_next = "";
        this.meet_next = "";
        this.CampusRecruList = [];
        this.meetTable = [];
        this.hasMore = 1;
        await this.loadData();
      },

      async loadData() {
        this.loading = true;
        if (this.hasMore === 0) return;
        this.hasMore = 0;
        let params = [];
        params.push("date_start=" + this.selectedStartDay);
        params.push("date_end=" + this.selectedEndDay);
        params.push("limit=" + this.limit);
        await this.getMeetTable(params);
        await this.getCampusRecruList(params);

        this.loading = false;
      },

      async getCampusRecruList(params) {
        if (this.recru_next !== "") params.push("from=" + this.recru_next);
        try {
          let result_data = await post("v1/recruit/query", params);

          if (result_data.code != 0) {
            uni.showToast({
              title: "获取数据失败：" + result_data.msg
            });
            return;
          }
          this.CampusRecruList.push(...result_data.result.data);
          this.recru_next = result_data.result.next;
          this.hasMore += result_data.result.hasMore ? 1 : 0;
        } catch (e) {
          uni.showToast({
            title: `请求失败(${e})`
          });
        }
      },

      async getMeetTable(params) {
        if (this.meet_next !== "") params.push("from=" + this.meet_next);
        try {
          let result_data = await post("v1/meet/query", params);

          if (result_data.code != 0) {
            uni.showToast({
              title: "获取数据失败：" + result_data.msg
            });
            return;
          }
          this.meetTable.push(...result_data.result.data);
          this.meet_next = result_data.result.next;
          this.hasMore += result_data.result.hasMore ? 1 : 0;
        } catch (e) {
          uni.showToast({
            title: `请求失败(${e})`
          });
        }
      },

      startChange(e) {
        this.selectedStartDay = e.result;
        this.hasMore = 1;
        this.init();
      },

      endChange(e) {
        this.selectedEndDay = e.result;
        this.hasMore = 1;
        this.init();
      },

      async addToCal(id, type) {
        uni.showLoading();
        event.stopPropagation();
        let params = [];
        params.push("sub_type=" + type);
        params.push("sub_id=" + id);
        try {
          let result_data = await post("v1/welink/subscription/add", params);
          uni.hideLoading();
          if (result_data.code != 0) {
            uni.showToast({
              title: "添加失败：" + result_data.msg
            });
            return;
          }
          uni.showToast({
            title: "已添加到日程",
            icon: "success"
          });
        } catch (e) {
          uni.showToast({
            title: `请求失败(${e})`
          });
        }
      },

      goDetail(id) {
        HWH5.openWebview({
          uri: "https://91.usst.edu.cn/student/RecruitmentDetail.aspx?id=" + id
        }).catch(error => {
          console.log("打开webview异常", error);
        });
      }
    },
    components: {
      tuiCard,
      tuiDateTime,
      tuiCalendar,
      tuiToast,
      tuiButton,
      tuiIcon,
      tuiNoData
    }
  };
</script>

<style scoped>
  .footer-button {
    padding-top: 10rpx;
    padding-bottom: 10rpx;
    padding-left: 30rpx;
    padding-right: 30rpx;
    border-radius: 10rpx;
  }

  .footer-button:active {
    background-color: #f5f5f5;
  }

  .card:active {
    background-color: #f5f5f5 !important;
  }

  .card-info {
    font-size: small;
    color: #424242;
    font-weight: bold;
  }

  .card-info-title {
    font-size: small;
    color: #707070;
    font-weight: normal;
  }

  .logo {
    margin-left: 30rpx;
    padding-top: 20rpx;
    padding-bottom: 10rpx;
  }

  .footer span {
    margin-right: 20upx;
  }
  .tui-default {
    padding: 0.8em;
  }
  .tui-default p {
    font-size: 0.8em;
  }
  .card-item {
    margin-bottom: 20upx;
  }

  .home.content {
    background-color: #fafafa;
    min-height: 100vh;
    padding-bottom: 20rpx;
  }

  .swiper-box {
    height: 176upx !important;
    overflow: hidden;
  }

  .swiper-img {
    height: 176upx !important;
  }

  .item:nth-child(2) {
    height: 90.625upx;
  }

  .time {
    text-align: center;
  }

  .list .data-list {
    font-size: 20upx;
    border: 1px solid #e0e0e0;
    padding: 1em 1.5em;
  }

  .data-list .title {
    color: #ee8555;
  }

  .data-list .seminarLink {
    padding-left: 50upx;
  }

  ::v-deep .time span {
    font-size: 1em;
    color: #007aff;
    text-decoration: none;
  }

  .swiper-box {
    width: 100% !important;
  }

  .swiper-box .swiper-img {
    width: 100%;
  }

  .logo {
    height: 88upx;
    width: 534upx;
    margin-top: 0;
  }

  .swiper-img {
    width: 750upx;
    height: 90.625upx;
  }

  .item:nth-child(2) {
    height: 90.625upx;
  }

  .time {
    text-align: center;
  }

  .calendar-icon {
    font-size: 1em !important;
    padding-right: 10rpx;
  }

  .arrow {
    width: 50upx;
    height: 84upx;
    display: flex;
    align-items: center;
    justify-content: center;
    line-height: 100%;
    background: #f2f2f2 !important;
  }

  ::v-deep .arrow .tui-icon {
    font-size: 1em !important;
  }

  .page {
    font-size: 1em;
  }

  .loadmore {
    text-align: center;
    font-size: small;
    color: #838383;
  }

  .footer {
    border-top: solid 1px #e0e0e0;
    display: flex;
    flex-direction: row;
    justify-content: space-between;
    padding: 10rpx;
  }

  .footer-txt {
    font-size: smaller;
    color: #838383;
  }
</style>
