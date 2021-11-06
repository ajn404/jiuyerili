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
            <div class="time" style="display: flex">

                <tui-button 
                type="gray-primary"
                 @click="showStart"
                 width="375upx"
                 height="84upx">
                    <tui-icon name="calendar" class="calendar-icon"></tui-icon>
                    {{selectedStartDay}}
                 </tui-button>
                <div class="arrow">
                    <tui-icon name="arrowright" ></tui-icon>
                </div>
                <tui-button
                        type="gray-primary"
                        @click="show"
                        width="375upx"
                        height="84upx">
                    <tui-icon name="calendar" class="calendar-icon"></tui-icon>
                    {{selectedEndDay}}
                </tui-button>


            </div>
        </view>
        <tui-date-time ref="dateTime" @confirm="change" :type="2" ></tui-date-time>
        <view class="item">
        <view v-for="(item,index) in CampusRecruList.slice(0,10)" class="card-item" :key="index">
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
                        <span @click="showFail">添加到日程</span>
                        <span @click="showFail">详情</span>
                    </footer>
                </view>
            </template>
        </tui-card>
        </view>
        </view>

        <view class="item">
            <view v-for="(item,index) in meetTable" class="card-item" :key="index">
                <tui-card
                        :tag="{text:moment(item.MeetStart).format('YYYY-MM-DD h:mm')+'-'+moment(item.MeetEnd).format('YYYY-MM-DD h:mm')}"
                        :title="{text:'招聘会'}"
                >
                    <template v-slot:body>
                        <view class="tui-default">
                            <p >{{item.MeetName}}</p>
                            <p >地点:{{item.MeetAddress}}</p>
                        </view>
                    </template>
                    <template v-slot:footer>
                        <view class="tui-default">
                            <footer class="footer">
                                <span @click="showFail">详情</span>
                                <span @click="showFail">添加到日程</span>
                            </footer>
                        </view>
                    </template>
                </tui-card>
            </view>
        </view>



        <tui-toast ref="toast"></tui-toast>
    </view>
</template>
<script>
    import {getCampusRecruList, getMeetTable} from "../../api";
    import tuiCard from 'thorui-uni/lib/thorui/tui-card/tui-card'
    import tuiDateTime from 'thorui-uni/lib/thorui/tui-datetime/tui-datetime'
    import tuiCalendar from "thorui-uni/lib/thorui/tui-calendar/tui-calendar"
    import tuiToast from "thorui-uni/lib/thorui/tui-toast/tui-toast"
    import tuiButton from "thorui-uni/lib/thorui/tui-button/tui-button"
    import tuiIcon from "thorui-uni/lib/thorui/tui-icon/tui-icon.vue"
    import moment from 'moment'
    export default {
        data() {
            return {
                autoplay: true,
                interval: 2000,
                duration: 500,
                parsedData: [],
                data: [],
                moment,
                limit: 10,
                today:'',
                isStartDay:false,
                selectedStartDay:'',
                selectedEndDay:'',
                //宣讲会
                CampusRecruList:[],
                //招聘会
                meetTable:[],
            }
        },
        watch: {
            data: function (value) {
                this.parsedData = value;
            }
        },

        created() {
            let date = new Date();
            this.initDate(date,'all');
            // 初始化使用当日时间
            this.parseData(date)
        },
        methods: {
            //初始化选择时间为今日
            initDate(date,type){
                let currentdate = moment(date).year() +"-"+(moment(date).month()+1)+"-"+moment(date).date();
                if(type==='all'){
                    this.selectedStartDay = currentdate;
                    this.selectedEndDay =currentdate
                }else if(type)
                this.selectedStartDay = currentdate;
                else this.selectedEndDay =currentdate
            },

            parseData(date,type){

                let date_start,date_end;
                if(type){
                    date_start = moment(date).format("YYYY-MM-DD")
                    date_end =moment(this.selectedEndDay).format("YYYY-MM-DD");
                }

                else{
                    date_end = moment(date).format("YYYY-MM-DD")
                    date_start =moment(this.selectedStartDay).format("YYYY-MM-DD");
                }
                var params = new URLSearchParams();
                params.append('date_start',date_start);
                params.append('date_end',date_end)
                getCampusRecruList(params).then(res => {
                    if (res.status === 200) {
                        this.CampusRecruList = res.data.result.data;
                        this.showSuccess()
                    } else {
                    }
                })
                getMeetTable(params).then(res=>{
                    if (res) {
                        this.meetTable = res.data.result.data;
                        this.showSuccess()
                    } else {
                    }
                })
            },

            //显示时间选择
            show: function(e) {
                this.$refs.dateTime.show();
            },
            showStart(){
                this.$refs.dateTime.show();
                this.isStartDay = true;
            },

            change: function(e) {
                if(this.isStartDay){
                    this.selectedStartDay = e.result;
                    this.initDate(e.result,true);
                    this.parseData(e.result,true);
                    this.isStartDay = false;
                }else{
                    this.selectedEndDay = e.result;
                    this.initDate(e.result,false);
                    this.parseData(e.result,false);
                }


            },

            showFail: function(e) {
                let params = {
                    title: "暂未实现",
                }
                this.$refs.toast.show(params);
            },
            showSuccess: function(e) {
                let params = {
                    title: "获取成功",
                }
                this.$refs.toast.show(params);
            }
        },
        components: {
            tuiCard,
            tuiDateTime,
            tuiCalendar,
            tuiToast,
            tuiButton,
            tuiIcon
        }
    }
</script>

<style scoped>
    .footer span{
        margin-right: 20upx;
    }
    .tui-default{
        padding: .8em;
    }
    .tui-default p{
        font-size: .8em;
    }
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

    .calendar-icon{
        font-size: 1em!important;
    }
    .arrow{
        width: 50upx;
        height: 84upx;
        display: flex;
        align-items: center;
        justify-content: center;
        line-height: 100%;
        background: #f2f2f2 !important;
    }
    ::v-deep  .arrow .tui-icon{
        font-size: 1em!important;
    }

</style>
