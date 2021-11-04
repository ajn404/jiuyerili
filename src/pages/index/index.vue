<template>
    <view class="content">
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
                <router-link to="/pages/index/pickView">今日({{today}})</router-link>
            </div>
        </view>

        <tui-card :tag="card.tag" :title="card.title">
            <template v-slot:body>
                <view class="tui-default">
                    默认卡片内容部分 slot=>body
                </view>
            </template>
            <template v-slot:footer>
                <view class="tui-default">
                    默认卡片底部 slot=>footer
                </view>
            </template>
        </tui-card>
    </view>
</template>
<script>
    import {getXuanJIang} from "../../api";
    import tuiCard from 'thorui-uni/lib/thorui/tui-card/tui-card'
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

        computed: {
            today() {
                let date = new Date();
                let seperator1 = "-";
                let month = date.getMonth() + 1;
                let strDate = date.getDate();
                if (month >= 1 && month <= 9) {
                    month = "0" + month;
                }
                if (strDate >= 0 && strDate <= 9) {
                    strDate = "0" + strDate;
                }
                let wstr = "";
                let day = date.getDay();
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
                    wstr = "星期六";
                }

                let currentdate = date.getFullYear() + seperator1 + month + seperator1 + strDate
                    + " " + wstr;
                return currentdate;
            }
        },
        created() {
            getXuanJIang().then(res => {
                if (res.status === 200) {
                    this.data = res.data.Data;
                } else {
                }
            })


            console.log(moment("2021-11-4").year());
            console.log(moment("2021-11-4").month()+1);
            console.log(moment("2021-11-4").date());


        },
        methods: {},
        components: {
            tuiCard
        }
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

    ::v-deep .time a {
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
