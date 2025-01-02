import type { Audio } from '../api/bili'
import { defineStore } from 'pinia'
import { ref } from 'vue'

const key = 'bili-listen-video:audioList'

export const useAudioListStore = defineStore('audioList', () => {
  const audioList = ref<Audio[]>([])
  function getAudioList() {
    const data = localStorage.getItem(key)
    if (data) {
      audioList.value = JSON.parse(data)
    }
  }
  function addAudio(audio: Audio) {
    audioList.value.push(audio)
    localStorage.setItem(key, JSON.stringify(audioList.value))
  }
  function deleteAudio(index: number) {
    audioList.value.splice(index, 1)
    localStorage.setItem(key, JSON.stringify(audioList.value))
  }
  return { audioList, getAudioList, addAudio, deleteAudio }
})
