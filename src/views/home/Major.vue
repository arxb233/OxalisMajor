<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'

    // 搜索相关
    const searchState = () => {
        const state = reactive({
            value: '', // 搜索input框的值
            isSearch: true, // 是否显示历史搜索
            goodsList: [], // 根据搜索关键字返回的商品数据
            titleText: '志愿',
            scrollTop: 0 // 获取滚动高度
        })
        return toRefs(state)
    }
    const {value, isSearch, goodsList, titleText, scrollTop} = searchState()    

    const active = ref(0) // tab切换默认值

    let testData = [
        {id:1,title:'北京大学', price: 999},
        {id:2,title:'清华大学', price: 555},
        {id:3,title:'复旦大学', price: 888},
    ]

    // 获取搜索成功的数据
    const getSearchResult = (params) => {
        console.log(params,'params');
        // 接口
    }

    // 点击搜索的回调
    const handleSearch = (e) => {
        getSearchResult(e)
        console.log(e,'eeeeeehandleSearch');
    }
    
    // 切换tab分类标签的回调
    const handleTab = (e) => {
        // getSearchResult({keywords:value.value,searchValue: e.name})
        // console.log(e,'etabs');
        switch (e.name) {
            case 0:
                testData = testData
                console.log(testData,'000000000');
                break;
            case 1:
                testData = testData
                console.log(testData,'111111111');
                break;
            case 2:
                testData = testData.sort((a,b) => a.price - b.price)
                console.log(testData,'222222222');
                break;
            case 3:
                testData = testData.sort((a,b) => b.price - a.price)
                console.log(testData,'33333333333');
                break;
            default:
                break;
        }
    }
</script>

<template>
    <div class="search d-flex flex-column justify-content-start">
        <!-- 头部搜索 -->
            <van-sticky>
                <CustomHeader title="志愿" leftIcon="arrow-left" leftText=""/>
                <form action="javascript:return true">
                    <van-search
                        ref="search"
                        @focus="isSearch = true"
                        placeholder="请输入搜索文字"
                        shape="round"
                        v-model="value"
                        show-action
                        @click="isSearch = true"
                        @search="handleSearch(value)"
                        :autofocus="false"
                    >
                        <template #action>
                            <div class="search_Btn" @click="handleSearch(value)">搜索</div>
                        </template>
                    </van-search>
                </form>
                <van-tabs v-model:active="active" @click-tab="handleTab">
                    <van-tab title="学校"></van-tab>
                    <van-tab title="分段"></van-tab>
                    <van-tab title="城市"></van-tab>
                    <van-tab title="专业"></van-tab>
                </van-tabs>
            </van-sticky>
        <!-- 商品列表展示 -->
        <div class="card_Box mrn d-flex flex-column justify-content-start">
            <div v-for="item in testData" :key="item.id">
                <div class="list_content d-flex justify-content-between align-items-center">
                    <div class="left">
                        <van-image radius="14" width="130" height='120' fit="cover" src="data:image/png;base64,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" >
                            <template v-slot:loading>
                                <van-loading type="spinner" size="20" />
                            </template>
                            <template v-slot:error>
                                <van-image></van-image>
                            </template>
                        </van-image>
                    </div>
                    <div class="right d-flex flex-column justify-content-around w-100 h-100 ps-4 fs-4">
                        <div>{{item.title}}</div>
                        <div style="color:green">分数：{{item.price}}</div>
                        <div>排序：{{item.id}}</div>
                    </div>
                </div>
            </div>
        </div>
    </div>
</template>


<style lang="scss" scoped>
.search {
    overflow: hidden;
    .search_Box {
    padding: 4px 10px;
    position: relative;
    display: flex;
    background-color: white;
    >div:nth-child(1){
        width: 1rem;
        display: flex;
        justify-content: center;
        align-items: center;
        color: #5f656b;
        font-size: 20px;
    }
    >div:nth-child(2) {
        width: calc(100% - 8vw);
        .search_Btn {
            color: #b91c3b;
        }
    }
}
.mrn {
    width: 100vw;
    height: 100vh;
    >div:nth-child(1){
        margin-top: 10px;
    }
    .list_content{
        height: 32vw;
        /* background-color: #f5f5f5; */
        border-radius: 10px;
        margin: 5px;
        padding: 0 10px;
        .left {

        }
        .right {
            overflow: hidden;
            >div{
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
            .price{
                color: red;
            }
            
        }
    }
}
}


</style>