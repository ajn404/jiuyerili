<template>
    <view>
        <view class="uni-padding-wrap">
            <view class="page-section swiper">
                <view class="page-section-spacing">
                    <swiper class="swiper"
                            :indicator-dots="indicatorDots"
                            :autoplay="autoplay"
                            :interval="interval"
                            :duration="duration">
                        <swiper-item>
                            <view class="swiper-item uni-bg-red">
                                <img src="https://91.usst.edu.cn/images/lbbjt.png" alt="" class="swiper-img">
                            </view>
                        </swiper-item>
                        <swiper-item>
                            <img src="https://91.usst.edu.cn/images/lbbjt.png" alt="" class="swiper-img">
                        </swiper-item>
                        <swiper-item>
                            <img src="https://91.usst.edu.cn/images/lbbjt.png" alt="" class="swiper-img">
                        </swiper-item>
                    </swiper>
                </view>
            </view>
        </view>
    </view>
</template>
<script>
    export default {
        data() {
            return {
                autoplay: true,
                interval: 2000,
                duration: 500
            }
        },
        methods: {
        }
    }
</script>
<style>
    .swiper-img{
        width: 750upx;
        height: 90.625upx;
    }
</style>
