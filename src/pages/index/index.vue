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
                  <img alt class="swiper-img" src="https://91.usst.edu.cn/UploadFiles/banner/1234.jpg" />
                </view>
              </swiper-item>
              <swiper-item>
                <img alt class="swiper-img" src="https://91.usst.edu.cn/UploadFiles/banner/%E5%AE%A3%E8%AE%B2%E4%BC%9A.jpg" />
              </swiper-item>
              <swiper-item>
                <img alt class="swiper-img" src="https://91.usst.edu.cn/UploadFiles/banner/%E5%BE%AE%E4%BF%A1%E5%9B%BE%E7%89%87_20211018114819.png" />
              </swiper-item>
            </swiper>
          </view>
        </view>
      </view>
    </view>
    <view class="item">
      <div class="time" style="display: flex">
        <tui-button type="gray-primary" @click="showStart" width="375upx" height="84upx">
          <tui-icon name="calendar" class="calendar-icon"></tui-icon>
          {{selectedStartDay}}
        </tui-button>
        <div class="arrow">
          <tui-icon name="arrowright"></tui-icon>
        </div>
        <tui-button type="gray-primary" @click="show" width="375upx" height="84upx">
          <tui-icon name="calendar" class="calendar-icon"></tui-icon>
          {{selectedEndDay}}
        </tui-button>
      </div>
    </view>
    <tui-date-time ref="dateTime" @confirm="change" :type="2"></tui-date-time>
    <view v-if="CampusRecruList.length===0&&meetTable.length==0">
      <tui-no-data >
        <text class="tui-color__black">暂无数据</text>
        <!--如果需要自定义按钮，可在插槽中自定义，不使用默认按钮-->
      </tui-no-data>
    </view>

    <view class="item" style="margin-top: 20upx">
      <view v-for="(item,index) in meetTable.slice(0,4)" class="card-item" :key="index">
        <tui-card
                :tag="{text:moment(item.MeetStart).format('YYYY-MM-DD h:mm')+'-'+moment(item.MeetEnd).format('YYYY-MM-DD h:mm')}"
                :title="{text:'招聘会'}"
        >
          <template v-slot:body>
            <view class="tui-default">
              <p>{{item.MeetName}}</p>
              <p>地点:{{item.MeetAddress}}</p>
            </view>
          </template>
          <template v-slot:footer>
            <view class="tui-default">
              <footer class="footer">
                <span @click="addToCal(item)">添加到日程</span>
              </footer>
            </view>
          </template>
        </tui-card>
      </view>
    </view>

    <view class="item">
      <view v-for="(item,index) in CampusRecruList" class="card-item" :key="index">
        <tui-card
          :tag="{text:moment(item.ScheduledDate).format('YYYY-MM-DD')+' ' +item.ScheduledDateS+'-'+item.ScheduledDateE}"
          :title="{text:'宣讲会'}"
        >
          <template v-slot:body>
            <view class="tui-default">
              <p class="zhao-pin-dan-wei">招聘单位:{{item.EntName}}</p>
              <p class="xuanjianghuididian">宣讲会地点:{{item.HostVenue}}</p>
            </view>
          </template>
          <template v-slot:footer>
            <view class="tui-default">
              <footer class="footer">
                <span @click="addToCal(item)">添加到日程</span>
                <span @click="goDetail(item.AppID)">详情</span>
              </footer>
            </view>
          </template>
        </tui-card>
      </view>
    </view>


    <view class="page" v-if="next" @click="showMore">
              更多
      </view>

    <tui-toast ref="toast"></tui-toast>

  </view>
</template>
<script>
import tuiCard from "thorui-uni/lib/thorui/tui-card/tui-card";
import tuiDateTime from "thorui-uni/lib/thorui/tui-datetime/tui-datetime";
import tuiCalendar from "thorui-uni/lib/thorui/tui-calendar/tui-calendar";
import tuiToast from "thorui-uni/lib/thorui/tui-toast/tui-toast";
import tuiButton from "thorui-uni/lib/thorui/tui-button/tui-button";
import tuiIcon from "thorui-uni/lib/thorui/tui-icon/tui-icon.vue";
import tuiNoData from "thorui-uni/lib/thorui/tui-no-data/tui-no-data"
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
      //宣讲会
      CampusRecruList: [],
      //招聘会
      meetTable: [],
      next:'',
    };
  },
  watch: {
    data: function(value) {
      this.parsedData = value;
    }
  },

  created() {
    this.init();
  },
  methods: {
    init(){
      let date = new Date();
      let monthAgo=moment(new Date()).subtract(1,'months').startOf('month').format('YYYY-MM-DD');
      this.initDate(monthAgo,true)
      this.initDate(date, false);
      // 初始化使用当日时间
      this.parseData(monthAgo,true)
      this.parseData(date,false);
    },
    //初始化选择时间为今日
    initDate(date, type) {
      let currentdate =
        moment(date).year() +
        "-" +
        (moment(date).month() + 1) +
        "-" +
        moment(date).date();
      if (type === "all") {
        this.selectedStartDay = currentdate;
        this.selectedEndDay = currentdate;
      } else if (type) this.selectedStartDay = currentdate;
      else this.selectedEndDay = currentdate;
    },

    parseData(date, type) {
      let date_start, date_end;
      if (type) {
        date_start = moment(date).format("YYYY-MM-DD");
        date_end = moment(this.selectedEndDay).format("YYYY-MM-DD");
      } else {
        date_end = moment(date).format("YYYY-MM-DD");
        date_start = moment(this.selectedStartDay).format("YYYY-MM-DD");
      }
      var params = new URLSearchParams();
      params.append("date_start", date_start);
      params.append("date_end", date_end);
      if(this.next)
      params.append("from", this.next );

      let token = "";
      let that =this;
      HWH5.getAuthCode()
        .then(function(data) {
          token = data.code;
          if(token){
              that.getCampusRecruList(params,token);
              HWH5.getAuthCode()
                  .then(function(data) {
                      token = data.code;
                      if(token){
                          that.getMeetTable(params,token);
                      }

                  })
          }

        })
    },

    getCampusRecruList(params,token){
        axios(
              {
                  method:'POST',
                  url:"http://cn3.frp.cool:12355/v1/recruit/query",
                  data:params,
                  headers:{
                    'x-wlk-code':token
                  }}
                  )
        .then(res => {
          if (res.status === 200) {
            // console.log(this.next)
            // if(this.next){
            //   this.CampusRecruList += res.data.result.data;
            // }else
            this.CampusRecruList = res.data.result.data;
            this.next = res.data.result.next
            this.showSuccess();
          } else {
          }
        });
    },

    getMeetTable(params,token){
        axios(
              {
                  method:'POST',
                  url:"http://cn3.frp.cool:12355/v1/meet/query",
                  data:params,
                  headers:{
                    'x-wlk-code':token
                  }}
                  )
        .then(res => {
          if (res.status === 200) {
                this.meetTable = res.data.result.data;
                this.showSuccess()
          } else {
          }
        });

    },

    //显示时间选择
    show: function(e) {
      this.$refs.dateTime.show();
    },
    showStart() {
      this.$refs.dateTime.show();
      this.isStartDay = true;
    },

    change: function(e) {

      this.next ='';
      if (this.isStartDay) {
        this.selectedStartDay = e.result;
        this.initDate(e.result, true);
        this.parseData(e.result, true);
        this.isStartDay = false;
      } else {
        this.selectedEndDay = e.result;
        this.initDate(e.result, false);
        this.parseData(e.result, false);
      }
    },

    showMore(){
      let distance = document.documentElement.scrollTop || document.body.scrollTop; //获得当前高度
      let step = distance / 2; //每步的距离
      (function jump() {
        if (distance > 0) {
          distance -= step;
          window.scrollTo(0, distance);
          setTimeout(jump, 10);
        }
      })();
      if (this.isStartDay) {
        this.initDate(this.selectedStartDay, true);
        this.parseData(this.selectedStartDay, true);
        this.isStartDay = false;
      } else {
        this.initDate(this.selectedEndDay, false);
        this.parseData(this.selectedEndDay, false);
      }

    },

      addToCal(item){
          // moment(item.MeetStart).format('YYYY-MM-DD h:mm')
          const url = 'https://open.welink.huaweicloud.com/api/calendar/v1/events/add';
        let that =this;


          HWH5.getAuthCode().then(
              function (res) {
                let token =res.code;
                  console.log(res)
                  if(token){
                    let _headers = {
                      'Content-Type': 'application/json',
                      'x-wlk-Authorization': token
                    }

                    const _params = {
                      "content": 'xxx',
                      "startTime": "1606322342000",
                      "endTime": "1606322542000",
                      "receiverUserList":['admin@weer']
                    };
                      HWH5.fetchInternet(url,
                              {
                                method: 'post',
                                headers: _headers,
                                body: JSON.stringify(_params),
                                timeout: 6000 }
                                ).then(res => res.json()).then(
                                        reply => {
                          that.showFail('服务端返回: '+reply.message);

                      }).catch(error => {
                          that.showFail('请求异常')
                      });
                  }
              }
          )
      },

      goDetail(id){
          HWH5.openWebview({
              uri: 'https://91.usst.edu.cn/student/RecruitmentDetail.aspx?id='+id
          }).catch(error => {
              console.log('打开webview异常', error);
          });
      },

    showFail: function(text) {
      let params = {
        title: text
      };
      this.$refs.toast.show(params);
    },
    showSuccess: function(e) {
      let params = {
        title: "获取成功"
      };
      this.$refs.toast.show(params);
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
  /*display: flex;*/
  flex-direction: column;
  justify-content: center;
  align-content: center;
}

.logo {
  height: 88upx;
  width: 534upx;
  margin-top: 0;
}

.swiper-box {
  height: 176upx!important;
  overflow: hidden;
}

.swiper-img {
  height: 176upx!important;
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

.content {
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-content: center;
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

  .page{
    display: flex;
    align-items: center;
    justify-content: center;
    font-size: 1em;
  }
</style>
