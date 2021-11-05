<template>
    <view class="home content">
        <view class="item">
            <image class="logo" src="/static/jr.png"/>
        </view>
        <view class="item swiper-box">
            <view class="uni-padding-wrap">
                <view class="page-section swiper">
                    <view class="page-section-spacing">
                        <swiper :autoplay="autoplay"
                                :duration="duration"
                                :interval="interval"
                                class="swiper">
                            <swiper-item>
                                <view class="swiper-item uni-bg-red">
                                    <img alt="" class="swiper-img" src="/static/lbbjt.png">
                                </view>
                            </swiper-item>
                            <swiper-item>
                                <img alt="" class="swiper-img" src="/static/lbbjt.png">
                            </swiper-item>
                            <swiper-item>
                                <img alt="" class="swiper-img" src="/static/lbbjt.png">
                            </swiper-item>
                        </swiper>
                    </view>
                </view>
            </view>
        </view>
        <view class="item">
            <div class="time">
                <span @click="show">{{selectedDay}}</span>>
            </div>
        </view>
        <tui-date-time ref="dateTime" @confirm="change" :type="2" ></tui-date-time>
        <view class="item">
        <view v-for="item in CampusRecruList.slice(0,10)" class="card-item" >
               <tui-card
                       :tag="{text:item.ScheduleDateS+'-'+item.ScheduleDateE}"
                       :title="{text:'宣讲会'}"
               >
            <template v-slot:body>
                <view class="tui-default">
                        <p>招聘单位:{{item.EntName}}</p>
                        <p>宣讲会地点:{{item.HostVenue}}</p>
                </view>
            </template>
            <template v-slot:footer>
                <view class="tui-default">
                </view>
            </template>
        </tui-card>
        </view>
        </view>


    </view>
</template>
<script>
    import {getCampusRecruList, getMeetTable} from "../../api";
    import tuiCard from 'thorui-uni/lib/thorui/tui-card/tui-card'
    import tuiDateTime from 'thorui-uni/lib/thorui/tui-datetime/tui-datetime'
    import tuiCalendar from "thorui-uni/lib/thorui/tui-calendar/tui-calendar"
    import moment from 'moment'
    export default {
        data() {
            return {
                autoplay: true,
                interval: 2000,
                duration: 500,
                parsedData: [],
                data: [],
                limit: 10,
                today:'',
                selectedDay:'',
                //宣讲会
                CampusRecruList:[],
                //招聘会
                meetTable:[],
                card: {
                    title: {
                        text: 'CSDN云计算'
                    },
                    tag: {
                        text: '1小时前'
                    },
                },
            }
        },
        watch: {
            data: function (value) {
                this.parsedData = value;
            }
        },

        created() {
            getCampusRecruList().then(res => {
                if (res.status === 200) {
                    this.CampusRecruList = res.data.Data;
                } else {
                }
            })
            getMeetTable().then(res=>{
                if (res.status === 200) {
                    this.meetTable = res.data.Data;
                } else {
                }
            })
            let date = new Date();
            this.initDate(date);
        },
        methods: {
            //初始化选择时间为今日
            initDate(date){
                let day = moment(date).weekday();
                let wstr=''
                if (day == 0) {
                    wstr = "星期日";
                } else if (day == 1) {
                    wstr = "星期一";
                } else if (day == 2) {
                    wstr = "星期二";
                } else if (day == 3) {
                    wstr = "星期三";
                } else if (day == 4) {
                    wstr = "星期四";
                } else if (day == 5) {
                    wstr = "星期五";
                } else if (day == 6) {
                    wstr = "星期六";}
                let currentdate = moment(date).year() +"-"+(moment(date).month()+1)+"-"+moment(date).date() + " " + wstr;
                this.selectedDay = currentdate
            },

            //显示时间选择
            show: function(e) {
                this.$refs.dateTime.show();
            },
            change: function(e) {
                this.selectedDay = e.result;
                this.initDate(e.result)
            }
        },
        components: {
            tuiCard,
            tuiDateTime,
            tuiCalendar
        }
    }
</script>

<style scoped>
    .card-item{
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
        height: 90.625upx;
        overflow: hidden;
    }

    .swiper-img {
        height: 90.625upx;
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


</style>
