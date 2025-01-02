export const apiUrl = import.meta.env.VITE_API_URL

export interface Audio {
  name: string
  bvid: string
  cid: string
  pic: string
}

export async function getVideoInfo(bvid: string) {
  if (bvid) {
    const response = await fetch(`${apiUrl}/api/bili/video/info/${bvid}`)
    const { data = {} } = await response.json()
    return data
  }
}

export async function getVideoStream(bvid: string, cid: string) {
  if (bvid && cid) {
    const response = await fetch(`${apiUrl}/api/bili/video/stream/${bvid}/${cid}`)
    const { data = {} } = await response.json()
    return data
  }
}
