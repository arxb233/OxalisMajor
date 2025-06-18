<script setup lang="ts">
import { ref, reactive, toRefs } from 'vue'
import logo from '@/assets/logo.png'

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
const { value, isSearch, goodsList, titleText, scrollTop } = searchState()

const active = ref(0) // tab切换默认值

let testData = [
    { id: 1, title: '北京大学', price: 999 },
    { id: 2, title: '清华大学', price: 555 },
    { id: 3, title: '复旦大学', price: 888 },
]

// 获取搜索成功的数据
const getSearchResult = (params) => {
    console.log(params, 'params');
    // 接口
}

// 点击搜索的回调
const handleSearch = (e) => {
    getSearchResult(e)
    console.log(e, 'eeeeeehandleSearch');
}

// 切换tab分类标签的回调
const handleTab = (e) => {
    // getSearchResult({keywords:value.value,searchValue: e.name})
    // console.log(e,'etabs');
    switch (e.name) {
        case 0:
            testData = testData
            console.log(testData, '000000000');
            break;
        case 1:
            testData = testData
            console.log(testData, '111111111');
            break;
        case 2:
            testData = testData.sort((a, b) => a.price - b.price)
            console.log(testData, '222222222');
            break;
        case 3:
            testData = testData.sort((a, b) => b.price - a.price)
            console.log(testData, '33333333333');
            break;
        default:
            break;
    }
}
const cityValue = ref('')
const subjectValue = ref('')
const yearValue = ref('')

const showCityPicker = ref(false)
const showSubjectPicker = ref(false)
const showYearPicker = ref(false)

const cityColumns = ['北京', '上海', '广州']
const subjectColumns = ['理科', '文科']
const yearColumns = ['2023', '2024', '2025']

const onCityConfirm = (val) => {
    cityValue.value = val
    showCityPicker.value = false
}

const onSubjectConfirm = (val) => {
    subjectValue.value = val
    showSubjectPicker.value = false
}

const onYearConfirm = (val) => {
    yearValue.value = val
    showYearPicker.value = false
}
</script>

<template>
  <div class="search d-flex flex-column justify-content-start">
    <!-- 头部搜索 -->
    <van-sticky>
      <CustomHeader title="志愿" leftIcon="arrow-left" leftText="" />
      <div style="display: flex; gap: 8px;">
        <van-field v-model="cityValue" is-link readonly label="生源地" placeholder="选择"
          @click="showCityPicker = true" style="flex: 1" />
        <van-field v-model="subjectValue" is-link readonly label="科类" placeholder="选择"
          @click="showSubjectPicker = true" style="flex: 1" />
        <van-field v-model="yearValue" is-link readonly label="年份" placeholder="选择"
          @click="showYearPicker = true" style="flex: 1" />
      </div>
      <van-tabs v-model:active="active" @click-tab="handleTab">
        <van-tab title="学校"></van-tab>
        <van-tab title="分段"></van-tab>
        <van-tab title="城市"></van-tab>
        <van-tab title="专业"></van-tab>
      </van-tabs>
    </van-sticky>

    <!-- 商品列表 -->
    <div class="card_Box mrn d-flex flex-column justify-content-start">
      <div v-for="item in testData" :key="item.id">
        <div class="list_content d-flex justify-content-between align-items-center">
          <div class="left">
            <van-image radius="14" width="130" height="120" fit="cover" :src="logo">
              <template #loading>
                <van-loading type="spinner" size="20" />
              </template>
              <template #error>
                <van-image />
              </template>
            </van-image>
          </div>
          <div class="right d-flex flex-column justify-content-around w-100 h-100 ps-4 fs-4">
            <div>{{ item.title }}</div>
            <div style="color:green">分数：{{ item.price }}</div>
            <div>排序：{{ item.id }}</div>
          </div>
        </div>
      </div>
    </div>

    <!-- ✅ 把 Popup 移动到页面最外层 -->
    <van-popup v-model:show="showCityPicker" position="bottom" round>
      <van-picker :columns="cityColumns" @confirm="onCityConfirm" @cancel="showCityPicker = false" />
    </van-popup>
    <van-popup v-model:show="showSubjectPicker" position="bottom" round>
      <van-picker :columns="subjectColumns" @confirm="onSubjectConfirm" @cancel="showSubjectPicker = false" />
    </van-popup>
    <van-popup v-model:show="showYearPicker" position="bottom" round>
      <van-picker :columns="yearColumns" @confirm="onYearConfirm" @cancel="showYearPicker = false" />
    </van-popup>
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

        >div:nth-child(1) {
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

        >div:nth-child(1) {
            margin-top: 10px;
        }

        .list_content {
            height: 32vw;
            /* background-color: #f5f5f5; */
            border-radius: 10px;
            margin: 5px;
            padding: 0 10px;

            .left {}

            .right {
                overflow: hidden;

                >div {
                    overflow: hidden;
                    text-overflow: ellipsis;
                    white-space: nowrap;
                }

                .price {
                    color: red;
                }

            }
        }
    }
}
</style>