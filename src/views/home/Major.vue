<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import logo from '@/assets/logo.png'
import { GetSchool, GetLogoUrl } from '@/api/Major'

const logoList = ref([]);
// 搜索相关
const searchState = () => {
    const state = reactive({
        value: '',
        isSearch: true,
        goodsList: [],
        titleText: '志愿',
        scrollTop: 0,
    })
    return toRefs(state)
}
const { value, isSearch, goodsList, titleText, scrollTop } = searchState()

const active = ref(0)

const cityValue = ref('甘肃')
const subjectValue = ref('物理类')
const yearValue = ref('2024')

const showCityPicker = ref(false)
const showSubjectPicker = ref(false)
const showYearPicker = ref(false)

const cityColumns = ['甘肃']
const subjectColumns = ['物理类', '历史类', '理科', '文科']
const yearColumns = ['2024', '2023', '2022', '2021', '2020']

// 懒加载核心数据
const cardData = ref<any[]>([])        // 全部数据
const visibleList = ref<any[]>([])     // 当前显示数据
const loading = ref(false)
const finished = ref(false)
const chunkSize = 10                   // 每次加载条数
let fullData: any[] = []               // 全部数据缓存
const handleTab = () => {
}
const getList = async () => {
    loading.value = true
    try {
        const res = await GetSchool(yearValue.value, subjectValue.value)
        console.log(res.data.message)
        fullData = res.data.message || []
        cardData.value = fullData
        visibleList.value = fullData.slice(0, chunkSize)
        finished.value = visibleList.value.length >= fullData.length
        await GetLogo();
    } catch (err) {
        console.error('获取数据失败', err)
    } finally {
        loading.value = false
    }
}
const GetLogo = async() => {
    const promises = visibleList.value.map(item =>
        GetLogoUrl(item.学校).then(res => ({
            name: item.学校,
            url: res.data.issuccess ? res.data.message : null
        }))
    );
    const results = await Promise.all(promises);
    logoList.value = results;
}
const onLoad = () => {
    loading.value = true
    setTimeout(async () => {
        const nextLength = visibleList.value.length + chunkSize
        visibleList.value = fullData.slice(0, nextLength)
        finished.value = visibleList.value.length >= fullData.length
        await GetLogo();
        loading.value = false
    }, 300)
}

// 条件切换时重置懒加载
const resetList = () => {
    visibleList.value = []
    fullData = []
    finished.value = false
    getList()
}

const onCityConfirm = (val: string) => {
    cityValue.value = val
    showCityPicker.value = false
    resetList()
}
const onSubjectConfirm = (val: string) => {
    subjectValue.value = val
    showSubjectPicker.value = false
    resetList()
}
const onYearConfirm = (val: string) => {
    yearValue.value = val
    showYearPicker.value = false
    resetList()
}

onMounted(() => {
    getList()
})
</script>

<template>
    <div class="search d-flex flex-column justify-content-start">
        <van-sticky>
            <CustomHeader title="志愿" leftIcon="arrow-left" />
            <div style="display: flex;">
                <van-field v-model="cityValue" is-link readonly label="生源地" placeholder="选择"
                    @click="showCityPicker = true" style="flex: 1" />
                <van-field v-model="subjectValue" is-link readonly label="科类" placeholder="选择"
                    @click="showSubjectPicker = true" style="flex: 1" />
                <van-field v-model="yearValue" is-link readonly label="年份" placeholder="选择"
                    @click="showYearPicker = true" style="flex: 1" />
            </div>
            <form action="javascript:return true">
                <van-search v-model="value" placeholder="请输入分数或分段" shape="round" :autofocus="false">
                    <template #action>
                        <div class="search_Btn">搜索</div>
                    </template>
                </van-search>
                <van-tabs v-model:active="active" @click-tab="handleTab">
                    <van-tab title="学校"></van-tab>
                    <van-tab title="分段"></van-tab>
                    <van-tab title="城市"></van-tab>
                    <van-tab title="专业"></van-tab>
                </van-tabs>
            </form>
        </van-sticky>

        <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
            <div v-for="item in visibleList" :key="item.id" style="padding-bottom: 12px;">
                <van-card :thumb="logoList.find(i => i.name === item.学校)?.url || logo" thumb-link="#">
                    <!-- 学校标题 + 城市 -->
                    <template #title>
                        <div style="display: flex; flex-direction: column; margin-bottom: 6px;">
                            <div style="font-size: 18px; font-weight: bold; color: green; margin-bottom: 4px;">
                                {{ item.学校 }}
                            </div>
                            <div
                                style="font-size: 14px; color: #28a745; display: flex; align-items: center; flex-wrap: wrap; gap: 4px;">
                                城市：<span>{{ item.城市 }}</span>
                                ｜录取批次：
                                <van-tag type="primary" plain>{{ item.录取批次 }}</van-tag>
                            </div>
                        </div>
                    </template>

                    <!-- 标签横向铺满 -->
                    <template #tags>
                        <div style="">
                            <van-tag v-if="item.是否211 === '是'" type="primary" plain
                                style="margin-right: 10px;">211</van-tag>
                            <van-tag v-if="item.是否985 === '是'" type="warning" plain
                                style="margin-right: 10px;">985</van-tag>
                            <van-tag v-if="item.是否双一流 === '是'" type="success" plain
                                style="margin-right: 10px;">双一流</van-tag>
                            <span style="font-size: 14px; color: #28a745; margin: 6px 0; gap: 6px;">最低分数线：</span>
                            <van-tag type="danger" plain style="">{{ item.最低分数线 }}</van-tag>

                        </div>
                    </template>
                    <!-- 底部信息 -->
                    <template #bottom>
                        <div
                            style="display: flex; align-items: center; flex-wrap: wrap; font-size: 14px; color: #28a745; margin-top: 2px ; gap: 6px;">
                            <span> 招生类型：</span>
                            <van-tag type="warning" plain style="">{{ item.招生类型 }}</van-tag>
                        </div>
                        <div style="display: flex; align-items: center; font-size: 14px; color: #28a745; gap: 2px;">
                            <span>选科要求：</span>
                            <span style="flex: 1;">{{ item.选科要求 }}</span>
                        </div>
                    </template>
                </van-card>
            </div>
        </van-list>

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
::v-deep(.van-field) {
    --van-field-label-width: 3.2em;
    --van-cell-vertical-padding: 5px;
    --van-cell-horizontal-padding: 5px;
}

.tag-row {
    display: flex;
    flex-wrap: wrap;
    gap: 8px;
}

.title {
    font-size: 16.5px;
    /* 自定义字体大小 */
    font-weight: 500;
    /* 可选：加粗标题 */
    color: green
        /* 可选：自定义颜色 */
}

.search {
    overflow: hidden;

    .mrn {
        width: 100vw;
        height: 100vh;

        .list_content {
            height: 32vw;
            border-radius: 10px;
            margin: 5px;
            padding: 0 10px;

            .right>div {
                overflow: hidden;
                text-overflow: ellipsis;
                white-space: nowrap;
            }
        }
    }
}
</style>
