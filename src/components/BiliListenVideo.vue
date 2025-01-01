<script setup lang="ts">
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import 'vue3-toastify/dist/index.css'

const bvid = ref('')
const audioUrl = ref('')
const styleObject = ref({
  backgroundImage: 'url(/bg.webp)',
})
const apiUrl = import.meta.env.VITE_API_URL

async function getVideoInfo(bvid: string) {
  if (bvid) {
    const response = await fetch(`${apiUrl}/api/bili/video/info/${bvid}`)
    const { data = {} } = await response.json()
    return data
  }
}

async function getVideoStream(bvid: string, cid: string) {
  if (bvid && cid) {
    const response = await fetch(`${apiUrl}/api/bili/video/stream/${bvid}/${cid}`)
    const { data = {} } = await response.json()
    return data
  }
}

async function handleClick() {
  const videoInfo = await getVideoInfo(bvid.value)
  if (videoInfo) {
    const { cid = '', pic = '' } = videoInfo
    styleObject.value = {
      backgroundImage: `url(${apiUrl}/api/proxy?url=${pic}),url(/bg.webp)`,
    }
    const videoStream = await getVideoStream(bvid.value, cid)
    const { dash = {} } = videoStream
    if (dash) {
      const { audio = [] } = dash
      if (audio.length) {
        const { baseUrl = '' } = audio[0]
        audioUrl.value = baseUrl
      }
      toast.success('获取视频信息成功')
    }
    else {
      toast.error('获取视频流失败')
    }
  }
  else {
    toast.error('获取视频信息失败')
  }
}
</script>

<template>
  <div class="h-full bg-cover bg-center" :style="styleObject">
    <div class="w-full h-full flex items-center justify-center flex-col backdrop-blur-sm">
      <div class="p-6 bg-white border border-gray-200 rounded-lg shadow">
        <div class="p-2">
          <h2 class="text-2xl font-semibold py-4">
            哔哩哔哩 (゜-゜)つロ 干杯~
          </h2>
          <div class="flex flex-row justify-between items-center">
            <input v-model="bvid" type="text" placeholder="请输入视频的 bvid" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg w-3/4 p-2.5">
            <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg p-2.5 text-sm" @click="handleClick">
              听视频
            </button>
          </div>
        </div>
        <div v-if="audioUrl.length" class="flex flex-col p-2 justify-center items-center">
          <audio controls autoplay loop :src="audioUrl" />
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
