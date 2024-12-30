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
  <div class="bili-listen-video-container">
    <h2>哔哩哔哩 (゜-゜)つロ 干杯~</h2>
    <div>
      <input v-model="bvid" type="text" placeholder="请输入视频 bvid" class="bili-listen-video-input" >
      <button type="button" @click="handleClick" class="bili-listen-video-button">
        听视频
      </button>
    </div>
    <video v-if="audioUrl.length" controls autoplay loop :src="audioUrl" />
  </div>
</template>

<style scoped>
.bili-listen-video-container {
  display: flex;
  gap: 8px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.bili-listen-video-input {
  padding: 8px;
  margin-right: 8px;
}
.bili-listen-video-button {
  padding: 8px;
  background-color: #007AFF;
  color: #fff;
}
</style>
