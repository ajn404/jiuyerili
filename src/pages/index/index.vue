<template>
    <view class="content">
        <view class="item">
            <image class="logo" src="/static/jr.png"/>
        </view>
        <view class="item swiper-box">
            <view class="uni-padding-wrap">
                <view class="page-section swiper">
                    <view class="page-section-spacing">
                        <swiper class="swiper"
                                :autoplay="autoplay"
                                :interval="interval"
                                :duration="duration">
                            <swiper-item>
                                <view class="swiper-item uni-bg-red">
                                    <img src="/static/lbbjt.png" alt="" class="swiper-img">
                                </view>
                            </swiper-item>
                            <swiper-item>
                                <img src="/static/lbbjt.png" alt="" class="swiper-img">
                            </swiper-item>
                            <swiper-item>
                                <img src="/static/lbbjt.png" alt="" class="swiper-img">
                            </swiper-item>
                        </swiper>
                    </view>
                </view>
            </view>
        </view>
        <view class="item">
            <div class="time">
                <router-link to="/pages/index/pickView">{{today}}</router-link>
            </div>
        </view>
        <view class="item list">
            <div  v-for="item in dataList" :key="item.id" class="data-list">
                <span class="title">[宣讲会]</span>
                <span class="companyName">{{item.companyName}}宣讲会</span>
                <br>
                <span class="time-tit">时间:</span>
                <span class="seminarTime">{{item.seminarTime}}</span>
                <br>
                <span class="position-title">地点:</span>
                <span class="seminarPosition">{{item.seminarPosition}}</span>
                <a :href="item.url" class="seminarLink">查看详情</a>
            </div>
        </view>

    </view>
</template>
<script>
    import axios from 'axios'
    import {getXuanJIang} from "../../api";

    export default {
        data() {
            return {
                autoplay: true,
                interval: 2000,
                duration: 500,
                dataList: [
                    {
                        id: "1",
                        companyName: '微软',
                        seminarTime: '2021-11-11 12:00-15:00',
                        seminarPosition: '第五教学楼',
                        url:'https://baidu.com'
                    },
                    {
                        id: "2",
                        companyName: '华为',
                        seminarTime: '2021-11-11 12:00-15:00',
                        seminarPosition: '第五教学楼',
                        url:'https://baidu.com'
                    }, {
                        id: "3",
                        companyName: '谷歌',
                        seminarTime: '2021-11-11 12:00-15:00',
                        seminarPosition: '第五教学楼',
                        url:'https://baidu.com'
                    },{
                        id: "4",
                        companyName: '字节跳动',
                        seminarTime:'2021-11-11 12:00-15:00',
                        seminarPosition:'第五教学楼',
                        url:'https://baidu.com'
                    },
                    {
                        id: "5",
                        companyName: '哔哩哔哩',
                        seminarTime:'2021-11-11 12:00-15:00',
                        seminarPosition:'第五教学楼',
                        url:'https://baidu.com'
                    },
                    {
                        id: "6",
                        companyName: '米哈游',
                        seminarTime:'2021-11-11 12:00-15:00',
                        seminarPosition:'第五教学楼',
                        url:'https://baidu.com'
                    }
                ]
            }
        },
        computed: {
            today() {
                let date = new Date();
                let seperator1 = "-";
                let seperator2 = ":";
                let month = date.getMonth() + 1;
                let strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                let wstr="";
                 let day=date.getDay();
                    if (day==0){wstr="星期日";}
                    else if(day==1){wstr="星期一";}
                    else if(day==2){wstr="星期二";}
                    else if(day==3){wstr="星期三";}
                    else if(day==4){wstr="星期四";}
                    else if(day==5){wstr="星期五";}
                    else if(day==6){wstr="星期六";}

                let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                    + " " +wstr;
                return currentdate;
            }
        },
        created(){
            getXuanJIang().then(res=>{
                if(res.status===200){
                    console.log(res)
                }else{

                }

            })

        },
        methods: {}
    }
</script>

<style scoped>
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
    .swiper-box{
        width: 750upx;
        height: 90.625upx;
        overflow: hidden;
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
    .list .data-list{
            font-size: 20upx;
            border: 1px solid #e0e0e0;
        padding: 1em 1.5em;
  }
    .data-list .title{
        color: #ee8555;
    }

    .data-list .seminarLink{
        padding-left: 50upx;
    }


</style>
