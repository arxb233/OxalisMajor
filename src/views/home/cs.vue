<template>
  <van-field
    v-model="result"
    is-link
    readonly
    label="城市"
    placeholder="选择城市"
    @click="handleClick"
  />
  <van-popup v-model:show="showPicker" round position="bottom">
    <van-picker
      :columns="columns"
      @cancel="showPicker = false"
      @confirm="onConfirm"
    />
  </van-popup>
</template>

<script setup>
import { ref } from 'vue';

const columns = ['杭州', '宁波', '温州', '绍兴', '湖州', '嘉兴', '金华'];
const result = ref('');
const showPicker = ref(false);

const handleClick = () => {
  console.log('点击了城市字段');
  showPicker.value = true;
};

const onConfirm = (value) => {
  console.log('选择了', value);
  result.value = value;
  showPicker.value = false;
};
</script>
