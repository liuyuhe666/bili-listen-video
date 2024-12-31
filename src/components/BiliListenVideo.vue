<script setup lang="ts">
import { ref } from 'vue'

const bvid = ref('')
const audioUrl = ref('')

async function getVideoInfo(bvid: string) {
  if (bvid) {
    const response = await fetch(`https://my-api-by-deno.deno.dev/api/bili/video/info/${bvid}`)
    const { data = {} } = await response.json()
    return data
  }
}

async function getVideoStream(bvid: string, cid: string) {
  if (bvid && cid) {
    const response = await fetch(`https://my-api-by-deno.deno.dev/api/bili/video/stream/${bvid}/${cid}`)
    const { data = {} } = await response.json()
    return data
  }
}

async function handleClick() {
  const videoInfo = await getVideoInfo(bvid.value)
  if (videoInfo) {
    const { cid = '' } = videoInfo
    const videoStream = await getVideoStream(bvid.value, cid)
    const { dash = {} } = videoStream
    if (dash) {
      const { audio = [] } = dash
      if (audio.length) {
        const { baseUrl = '' } = audio[0]
        audioUrl.value = baseUrl
      }
    }
  }
}
</script>

<template>
  <div class="h-full bg-[url('/bg.webp')] bg-cover bg-center">
    <div class="container mx-auto h-full flex items-center justify-center flex-col">
      <div class="p-2">
        <h2 class="text-2xl font-semibold py-4 text-white">
          哔哩哔哩 (゜-゜)つロ 干杯~
        </h2>
        <div class="flex flex-row justify-between items-center">
          <input v-model="bvid" type="text" placeholder="请输入视频的 bvid" class="text-base font-medium rounded-lg p-3 bg-gray-100">
          <button type="button" class="text-base font-medium rounded-lg p-3 bg-sky-500 text-white" @click="handleClick">
            听视频
          </button>
        </div>
      </div>
      <div v-if="audioUrl.length" class="p-2">
        <audio controls autoplay loop :src="audioUrl" />
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
