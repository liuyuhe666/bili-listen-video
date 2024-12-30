<script setup lang="ts">
import { ref } from 'vue'

const bvid = ref('')
const audioUrl = ref('')
const picUrl = ref('')
const showControlPanel = ref(false)

function toggleControlPanel() {
  showControlPanel.value = !showControlPanel.value
}

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
    const { cid = '', pic = '' } = videoInfo
    picUrl.value = pic
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
      <input v-model="bvid" type="text" placeholder="请输入视频 bvid" class="bili-listen-video-input">
      <button type="button" class="bili-listen-video-button" @click="handleClick">
        听视频
      </button>
    </div>
    <div v-if="audioUrl.length" class="video-container" @click="toggleControlPanel">
      <video :controls="showControlPanel" autoplay loop :src="audioUrl" :poster="picUrl" />
    </div>
  </div>
</template>

<style scoped>
.bili-listen-video-container {
  display: flex;
  gap: 20px;
  flex-direction: column;
  align-items: center;
  justify-content: center;
}
.bili-listen-video-container h2 {
  color: #fff;
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
.video-container {
  width: 960px;
  height: 540px;
}

.video-container video {
  width: 100%;
  height: 100%;
  object-fit: fill;
}
</style>
