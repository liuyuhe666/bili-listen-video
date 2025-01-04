<script setup lang="ts">
import type { Audio } from '../api/bili'
import { ref } from 'vue'
import { toast } from 'vue3-toastify'
import { apiUrl, getVideoInfo, getVideoStream } from '../api/bili'
import { useAudioListStore } from '../stores/audio'
import 'vue3-toastify/dist/index.css'

const audioListStore = useAudioListStore()
const audioList = audioListStore.getAudioList()
const bvid = ref('')
const audioUrl = ref('')
const currentIndex = ref(0)
const mode = ref('list')

const styleObject = ref({
  backgroundImage: 'url(/bg.webp)',
})

async function getAudioUrl(audio: Audio) {
  const stream = await getVideoStream(audio.bvid, audio.cid)
  const { dash = {} } = stream
  if (dash) {
    const { audio = [] } = dash
    if (audio.length) {
      const { baseUrl = '' } = audio[0]
      return baseUrl
    }
  }
  toast.error('获取音频地址失败')
}

async function handleClick() {
  const videoInfo = await getVideoInfo(bvid.value)
  if (videoInfo) {
    const { pages = [], pic = '', title = '' } = videoInfo
    if (pages.length) {
      if (pages.length === 1) {
        const { cid = '' } = pages[0]
        const audio = {
          name: title,
          cid,
          pic,
          bvid: bvid.value,
          page: 0,
        }
        audioListStore.addAudio(audio)
      }
      else {
        for (let i = 0; i < pages.length; i++) {
          const page = pages[i]
          const { cid = '' } = page
          const audio = {
            name: `${title} P${i + 1}`,
            cid,
            pic,
            bvid: bvid.value,
            page: i + 1,
          }
          audioListStore.addAudio(audio)
        }
      }
    }
    toast.success('获取视频信息成功')
  }
  else {
    toast.error('获取视频信息失败')
  }
}

async function handlePlay(audio: Audio, index: number) {
  audioUrl.value = await getAudioUrl(audio)
  currentIndex.value = index
  const { pic = '' } = audio
  styleObject.value = {
    backgroundImage: `url(${apiUrl}/api/proxy?url=${pic}),url(/bg.webp)`,
  }
}

async function handleDeleteAudio(index: number) {
  if (index >= 0 && index < audioList.length) {
    audioListStore.deleteAudio(index)
    if (index === currentIndex.value) {
      currentIndex.value = (currentIndex.value + 1) % audioList.length
      if (audioList.length === 0) {
        audioUrl.value = ''
        currentIndex.value = 0
      }
      else {
        await handlePlay(audioList[currentIndex.value], currentIndex.value)
      }
    }
    toast.success('删除成功')
  }
}

function handleOpenLink(audio: Audio) {
  if (audio) {
    if (audio.page) {
      window.open(`https://www.bilibili.com/video/${audio.bvid}?p=${audio.page}`)
    }
    else {
      window.open(`https://www.bilibili.com/video/${audio.bvid}`)
    }
  }
}

function toggleMode() {
  mode.value = mode.value === 'single' ? 'list' : 'single'
}

async function handleAudioFinish() {
  let audio: Audio = audioList[currentIndex.value]
  if (mode.value === 'list') {
    currentIndex.value = (currentIndex.value + 1) % audioList.length
    audio = audioList[currentIndex.value]
  }
  await handlePlay(audio, currentIndex.value)
}
</script>

<template>
  <div class="h-full bg-cover bg-center flex flex-col justify-center items-center" :style="styleObject">
    <div class="container p-6 border border-gray-200 rounded-lg shadow bg-white">
      <div class="md:flex flex-row justify-between p-2">
        <h2 class="text-2xl font-semibold py-4">
          🎵 哔哩听视频
        </h2>
        <div class="flex flex-row justify-between items-center gap-4">
          <input v-model="bvid" type="text" placeholder="请输入视频的 bvid" class="bg-gray-50 border border-gray-300 text-gray-900 text-sm rounded-lg p-2.5">
          <button type="button" class="text-white bg-blue-700 hover:bg-blue-800 font-medium rounded-lg p-2.5 text-sm" @click="handleClick">
            添加到播放列表
          </button>
        </div>
      </div>
      <div class="flex flex-col p-2 justify-center items-center">
        <audio class="w-full" controls autoplay :src="audioUrl" @ended="handleAudioFinish" />
      </div>
      <div>
        <div class="flex items-center justify-between my-4 p-2">
          <h5 class="text-xl font-bold leading-none text-gray-900">
            播放列表
          </h5>
          <div v-if="audioUrl" class="text-sm truncate">
            {{ `正在播放：${audioList[currentIndex].name}` }}
          </div>
          <button type="button" class="text-gray-500 hover:bg-gray-100 focus:outline-none focus:ring-4 focus:ring-gray-200 rounded-lg text-sm p-2.5" @click="toggleMode">
            <svg v-if="mode === 'single'" t="1735799713785" class="w-6 h-6" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1244" width="200" height="200"><path d="M773.597867 203.776l-0.273067 0.443733a33.621333 33.621333 0 0 0-20.343467-6.485333c-18.978133 0.785067-33.723733 16.725333-32.9728 35.771733a33.826133 33.826133 0 0 0 15.633067 26.794667l-0.1024 0.170667a375.227733 375.227733 0 0 1 166.2976 311.876266c0 207.018667-168.448 375.466667-375.466667 375.466667-27.818667 0-27.818667 0-54.340266-2.901333-90.453333-9.898667-152.610133-58.9824-155.5456-61.201067a375.330133 375.330133 0 0 1-165.5808-311.364267c0-201.4208 159.5392-365.841067 358.843733-374.647466l-41.984 40.823466 0.8192 0.853334a33.860267 33.860267 0 0 0-15.2576 29.218133c0.750933 18.978133 16.725333 33.757867 35.669333 33.041067a33.792 33.792 0 0 0 26.0096-14.472534l0.3072 0.341334 128.648534-124.996267L515.6864 34.0992l-0.4096 0.4096a33.6896 33.6896 0 0 0-26.3168-11.400533c-18.944 0.750933-33.6896 16.725333-32.9728 35.703466a33.8944 33.8944 0 0 0 13.038933 25.156267l45.226667 45.2608C275.182933 135.714133 82.602667 331.741867 82.602667 572.347733c0 147.626667 73.1136 285.149867 193.194666 366.114134 3.072 2.56 77.550933 62.190933 188.757334 74.308266 29.422933 3.208533 31.1296 3.310933 61.781333 3.310934 244.667733 0 443.733333-199.0656 443.733333-443.733334A443.392 443.392 0 0 0 773.597867 203.776" fill="#285085" p-id="1245" /><path d="M542.071467 400.827733a33.28 33.28 0 0 0-17.134934 6.075734l-0.170666-0.3072-106.8032 69.700266 0.170666 0.273067a33.9968 33.9968 0 0 0-15.837866 29.696c0.750933 18.944 16.725333 33.723733 35.669333 32.9728a33.109333 33.109333 0 0 0 17.1008-6.0416l0.2048 0.273067 53.998933-35.259734v249.856h0.034134c0 0.477867-0.238933 0.887467-0.2048 1.365334a34.2016 34.2016 0 1 0 68.4032-1.365334h0.034133v-0.170666c0-0.4096 0.2048-0.750933 0.2048-1.160534 0-0.273067-0.170667-0.477867-0.2048-0.785066V435.2c0-0.477867 0.2048-0.887467 0.2048-1.3312a34.4064 34.4064 0 0 0-35.669333-33.041067" fill="#285085" p-id="1246" /></svg>
            <svg v-if="mode === 'list'" t="1735799632006" class="w-6 h-6" viewBox="0 0 1024 1024" version="1.1" xmlns="http://www.w3.org/2000/svg" p-id="1097" width="200" height="200"><path d="M905.615621 524.965532c0-132.931319-65.364876-256.560237-174.885151-331.940698v-0.031008c-1.24032-0.868224-2.356608-1.922496-3.627936-2.790721l-0.248064 0.403105a30.573893 30.573893 0 0 0-18.480771-5.891522 31.256069 31.256069 0 0 0-29.953734 32.465382 30.635909 30.635909 0 0 0 14.232675 24.341284l-0.124032 0.186049a340.839996 340.839996 0 0 1 151.071002 283.289137c0 185.272833-148.559354 336.188795-332.777914 340.653948l39.194119-39.194119a30.759941 30.759941 0 0 0 11.752034-22.821892 31.225061 31.225061 0 0 0-29.953734-32.465381 30.728933 30.728933 0 0 0-23.876164 10.356673l-0.372096-0.372096-116.5901 116.652117 116.90018 113.582324 0.31008-0.31008a30.697925 30.697925 0 0 0 23.6281 13.147394 31.256069 31.256069 0 0 0 32.403366-30.015749 30.914981 30.914981 0 0 0-13.860578-26.542853l0.744192-0.7752-40.341415-39.225127c218.451398-4.434145 394.855941-183.164288 394.855941-402.669959M487.410652 184.652672l-38.139847 37.085575 0.744192 0.7752a30.759941 30.759941 0 0 0-13.860578 26.542853c0.682176 17.240451 15.162915 30.697925 32.403365 29.984741a30.697925 30.697925 0 0 0 23.628101-13.116386l0.279072 0.31008 116.869172-113.582324-116.528084-116.590101-0.372096 0.31008a30.697925 30.697925 0 0 0-23.907173-10.325665c-17.209443 0.651168-30.604901 15.193923-29.953733 32.434373a30.945989 30.945989 0 0 0 11.876066 22.883908l41.054599 41.085608C274.323638 128.373143 99.407479 306.42111 99.407479 524.99654c0 134.109624 66.450156 259.071886 177.675872 334.266299l34.728966-51.411273a340.964028 340.964028 0 0 1-150.388827-282.855026c0-182.947232 144.931417-332.343802 325.987162-340.343868" fill="#285085" p-id="1098" /></svg>
          </button>
        </div>
        <div v-if="audioList.length === 0" class="text-center text-gray-500 py-4 h-80 items-center justify-center flex">
          空空如也~
        </div>
        <ul v-if="audioList.length !== 0" class="divide-y divide-gray-200 overflow-auto h-80">
          <li v-for="(audio, index) in audioList" :key="audio.cid" class="flex flex-row justify-between items-center p-2 hover:bg-gray-100 rounded-lg">
            <div class="flex flex-row items-center">
              <span v-if="audioUrl && currentIndex === index" class="w-8 block text-center px-2 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded animate-bounce">
                {{ index + 1 }}
              </span>
              <span v-else class="w-8 block text-center px-2 py-1 text-sm font-medium text-blue-800 bg-blue-100 rounded">
                {{ index + 1 }}
              </span>
              <span class="mx-2 text-gray-900 text-sm truncate">{{ audio.name }}</span>
            </div>
            <div class="flex flex-row items-center gap-2">
              <button type="button" class="p-2.5 rounded-full border border-gray-300 hover:bg-gray-200" @click="() => handlePlay(audio, index)">
                <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="currentColor" viewBox="0 0 24 24">
                  <path fill-rule="evenodd" d="M8.6 5.2A1 1 0 0 0 7 6v12a1 1 0 0 0 1.6.8l8-6a1 1 0 0 0 0-1.6l-8-6Z" clip-rule="evenodd" />
                </svg>
              </button>
              <button type="button" class="p-2.5 rounded-full border border-gray-300 hover:bg-gray-200" @click="() => handleOpenLink(audio)">
                <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M13.213 9.787a3.391 3.391 0 0 0-4.795 0l-3.425 3.426a3.39 3.39 0 0 0 4.795 4.794l.321-.304m-.321-4.49a3.39 3.39 0 0 0 4.795 0l3.424-3.426a3.39 3.39 0 0 0-4.794-4.795l-1.028.961" />
                </svg>
              </button>
              <button type="button" class="p-2.5 rounded-full border border-gray-300 hover:bg-gray-200" @click="() => handleDeleteAudio(index)">
                <svg class="w-4 h-4 text-gray-800 dark:text-white" aria-hidden="true" xmlns="http://www.w3.org/2000/svg" width="24" height="24" fill="none" viewBox="0 0 24 24">
                  <path stroke="currentColor" stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M6 18 17.94 6M18 18 6.06 6" />
                </svg>
              </button>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>

<style scoped>
</style>
