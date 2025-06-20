<script setup lang="ts">
import { ref, reactive, toRefs, onMounted } from 'vue'
import logo from '@/assets/logo.png'
import { GetLogoUrl, GetSubject } from '@/api/Major'
import { watch } from 'vue'

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
const yearColumns = ['2025', '2024', '2023', '2022', '2021', '2020']

// 懒加载核心数据
const cardData = ref<any[]>([])        // 全部数据
const visibleList = ref<any[]>([])     // 当前显示数据
const loading = ref(false)
const finished = ref(false)
const chunkSize = 10                   // 每次加载条数
const fullData = ref([])               // 全部数据缓存
const handleTab = () => {
}
const getList = async () => {
  loading.value = true
  try {
    const res = await GetSubject(yearValue.value, subjectValue.value)
    console.log(res.data.message)
    fullData.value = res.data.message || []
    cardData.value = fullData.value
    visibleList.value = fullData.value.slice(0, chunkSize)
    finished.value = visibleList.value.length >= fullData.value.length
    await GetLogo();
  } catch (err) {
    console.error('获取数据失败', err)
  } finally {
    loading.value = false
  }
}
const GetLogo = async () => {
  const existingNames = new Set(logoList.value.map(i => i.name))
  const promises = visibleList.value
    .filter(item => !existingNames.has(item.学校))
    .map(item =>
      GetLogoUrl(item.学校).then(res => ({
        name: item.学校,
        url: res.data.issuccess ? res.data.message : null
      }))
    )
  const newResults = await Promise.all(promises)
  logoList.value = [...logoList.value, ...newResults]
}

const onLoad = () => {
  loading.value = true
  setTimeout(async () => {
    const nextLength = visibleList.value.length + chunkSize
    visibleList.value = fullData.value.slice(0, nextLength)
    finished.value = visibleList.value.length >= fullData.value.length
    await GetLogo();
    loading.value = false
  }, 300)
}

// 条件切换时重置懒加载
const resetList = () => {
  visibleList.value = []
  fullData.value = []
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

watch(value, async (val) => {
  if (!val) {
    getList()
    return
  }
  const numMatch = val.match(/^\d+$/)
  const PnumMatch = val.match(/^(P?\d+)$/i)
  console.log(val)
  if (numMatch) {
    const center = parseInt(val)
    visibleList.value = fullData.value.filter(item => {
      const score = parseInt(item.最低分)
      return !isNaN(score) && score >= center - 50 && score <= center + 50
    })
  } else if (PnumMatch) {
    const center = parseInt(val.replace('P', ''))
    visibleList.value = fullData.value.filter(item => {
      const score = parseInt(item.最低位次)
      return !isNaN(score) && score >= center - 2000 && score <= center + 2000
    })
  } else {
    visibleList.value = fullData.value.filter(item =>
      item.学校.includes(val) ||
      item.专业.includes(val)
    )
  }
  await GetLogo()
  finished.value = true
})

</script>

<template>
  <div class="search d-flex flex-column justify-content-start">
    <van-sticky>
      <CustomHeader title="专业" leftIcon="arrow-left" />
      <div style="display: flex;">
        <van-field v-model="cityValue" is-link readonly label="生源地" placeholder="选择" @click="showCityPicker = true"
          style="flex: 1" />
        <van-field v-model="subjectValue" is-link readonly label="科类" placeholder="选择" @click="showSubjectPicker = true"
          style="flex: 1" />
        <van-field v-model="yearValue" is-link readonly label="年份" placeholder="选择" @click="showYearPicker = true"
          style="flex: 1" />
      </div>
      <form action="javascript:return true">
        <van-search v-model="value" placeholder="请输入学校或专业" shape="round" :autofocus="false">
          <template #action>
            <div class="search_Btn">搜索</div>
          </template>
        </van-search>
      </form>
    </van-sticky>

    <van-list v-model:loading="loading" :finished="finished" finished-text="没有更多了" @load="onLoad">
      <div v-for="item in visibleList" :key="item.id" style="padding-bottom: 12px;">
        <van-card :thumb="logoList.find(i => i.name === item.学校)?.url || logo" thumb-link="#">
          <!-- 学校标题 + 城市 -->
          <template #title>
            <div style="display: flex; flex-direction: column; margin-bottom: 6px;">
              <div style="font-size: 18px; font-weight: bold; color: green; margin-bottom: 4px;">
                {{ item.学校 }} | {{ item.专业 }}
              </div>
              <div
                style="font-size: 14px; color: #28a745; display: flex; align-items: center; flex-wrap: wrap; gap: 4px;">
                录取批次：<van-tag type="primary" plain>{{ item.批次 }}</van-tag> |
                选科要求：<van-tag type="primary" plain>{{ item.选科要求 }}</van-tag>
              </div>
            </div>
          </template>

          <!-- 标签横向铺满 -->
          <template #tags>
            <div style="margin-top: 8px;">
              <span style="font-size: 14px; color: #28a745; margin: 6px 0; gap: 6px;">专业:</span>
              <van-tag type="warning" plain style="">{{ item.专业 }}</van-tag>
              <span
                style="font-size: 14px; color: #28a745; margin: 6px 0; gap: 6px;margin-left: 10px;margin-right: 8px;">专业代码:</span>
              <van-tag type="warning" plain style="">{{ item.专业代码 }}</van-tag>
              <span style="font-size: 14px; color: #28a745; gap: 6px;margin-left: 10px;margin-right: 8px;">所属专业组:</span>
              <van-tag type="warning" plain style="">{{ item.所属专业组 }}</van-tag>
            </div>
            <div style="margin-top: 8px;">
              <span style="font-size: 14px; color: #28a745; margin: 6px 0; gap: 6px;">招生计划：</span>
              <van-tag type="danger" plain style="">{{ item.招生计划 }}</van-tag>
              <span
                style="font-size: 14px; color: #28a745; margin: 6px 0; gap: 6px;margin-left: 10px;margin-right: 8px;">最低分:</span>
              <van-tag type="danger" plain style="">{{ item.最低分 }}</van-tag>
              <span style="font-size: 14px; color: #28a745; gap: 6px;margin-left: 10px;margin-right: 8px;">最低位次:</span>
              <van-tag type="danger" plain style="">{{ item.最低位次 }}</van-tag>
            </div>
          </template>
          <!-- 底部信息 -->
          <template #bottom>
            <span style="font-size: 14px; color: #28a745; margin: 6px 0; gap: 6px;">专业备注：{{ item.专业备注 }}</span>
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
