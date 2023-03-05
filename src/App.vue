<template>
  <v-app>
    <!-- tool bar -->
    <v-toolbar color="primary" density="compact" :elevation="0" :collapse="toolBarCollspse" :absolute="true">
      <template v-slot:prepend>
        <v-app-bar-nav-icon size="small"></v-app-bar-nav-icon>
      </template>
      <v-app-bar-title>Transmission</v-app-bar-title>
      <template v-if="toolBarCollspse">
        <v-btn icon size="small" v-if="toolBarCollspse" @click="toolBarCollspse = false">
          <v-icon :icon="icons.mdiChevronRight"></v-icon>
        </v-btn>
      </template>
      <template v-else>
        <v-btn icon size="small">
          <v-icon :icon="icons.mdiTranslate"></v-icon>
        </v-btn>
        <v-btn icon size="small" @click="toolBarCollspse = true">
          <v-icon :icon="icons.mdiChevronLeft"></v-icon>
        </v-btn>
      </template>
    </v-toolbar>
    <!-- tool bar end -->

    <v-main>
      <v-progress-linear indeterminate :active="listLoading" :absolute="true"></v-progress-linear>

      <v-row :no-gutters="true">
        <v-col 
        cols="12"
        xl="3"
        lg="4"
        md="6"
        sm="12"
        xs="12"
        v-for="item in torrentList" 
        :key="item.id" >
        <div class="torrent">
          {{ (status = TorrentStatus[item.status], void 0) }}
          {{ (downloading = item.percentDone < 1, void 0) }} <div class="progress"
            :style="`width:${item.percentDone * 100}%;background-color:${status.c}66`">
            </div>
            <div class="content">
              <div class="title-line">
                <v-icon :icon="status.i" :color="status.c"></v-icon>
                <div class="title">{{ item.name }}</div>
              </div>
              <div class="info">
                <div class="create-time">{{ new Date(item.addedDate * 1000).toLocaleString().substring(2) }}</div>
                <div class="holder"></div>
                <div class="rate">
                  <span>
                    <template v-if="downloading && item.rateDownload > 0">
                      <v-icon :icon="icons.mdiDownload" :color="TorrentStatus[4].c"></v-icon>{{
                        formatSize(item.rateDownload) }}/s
                    </template>
                  </span>
                  <span>
                    <template v-if="item.rateUpload > 0">
                      <v-icon :icon="icons.mdiUpload" :color="TorrentStatus[6].c"></v-icon>{{ formatSize(item.rateUpload)
                      }}/s
                    </template>
                  </span>
                </div>
                <div class="percent">
                  <span v-if="downloading">{{ (item.percentDone * 100).toFixed(2) }}%</span>
                </div>
                <div class="size">
                  <span class="download-size" v-if="downloading">{{ formatSize(item.sizeWhenDone * item.percentDone) }} /
                  </span>
                  <span class="total-size">{{ formatSize(item.sizeWhenDone) }}</span>
                </div>
              </div>
            </div>
        </div>
         
        </v-col>
      </v-row>

    </v-main>

    <!-- footer -->
    <div class="footer bg-primary">
      <span>
        <v-icon :icon="icons.mdiDownload" size="small" :color="TorrentStatus[4].c"></v-icon>
        <span>{{ downloadSpeed }}</span>
      </span>
      <span>
        <v-icon :icon="icons.mdiUpload" size="small" :color="TorrentStatus[6].c"></v-icon>
        <span>{{ uploadSpeed }}</span>
      </span>
    </div>
    <!-- footer end -->
  </v-app>
</template>

<script setup>
import { mdiTranslate, mdiPlusBox, mdiChevronLeft, mdiChevronRight, mdiDownload, mdiUpload } from '@mdi/js';
import { ref, onMounted } from 'vue'
import { sessionStats, torrentGet } from './libs/api'
import { wait, formatSize } from './libs/utils'
import { TorrentStatus, RollTime } from './libs/constant'
const icons = ref({
  mdiTranslate,
  mdiPlusBox,
  mdiChevronLeft,
  mdiChevronRight,
  mdiDownload,
  mdiUpload
})

const fields = [
  'id',
  'name',
  'error',
  'errorString',
  'eta',
  'status',
  // 'totalSize',
  'sizeWhenDone',
  'percentDone',
  'addedDate',
  'rateDownload',
  'rateUpload'
]

const toolBarCollspse = ref(false)
const uploadSpeed = ref('--')
const downloadSpeed = ref('--')
const listLoading = ref(false)

const torrentList = ref([])

const initTorrentList = async () => {
  listLoading.value = true
  try {
    const res = await torrentGet({
      fields: fields
    })
    res.torrents.sort((a, b) => b.addedDate - a.addedDate)
    torrentList.value = res.torrents
    return true
  } catch (e) {
    return false
  } finally {
    listLoading.value = false
  }
}

const updateTorrentList = async () => {
  listLoading.value = true
  try {
    const res = await torrentGet({
      fields: fields,
      ids: 'recently-active'
    })
    const o = torrentList.value
    //remove
    res.removed.forEach((item) => {
      for (let i = 0; i < o.length; i++) {
        if (o[i].id === item.id) {
          o.splice(i, 1)
          break
        }
      }
    })
    //update
    res.torrents.forEach((item) => {
      let found = false
      for (let i = 0; i < o.length; i++) {
        if (o[i].id === item.id) {
          o[i] = item
          found = true
          break
        }
      }
      if (!found) {
        o.push(item)
      }
    })
    //sort
    o.sort((a, b) => b.addedDate - a.addedDate)
  } catch (e) {
  } finally {
    listLoading.value = false
  }
}

const updateSession = async () => {
  try {
    const res = await sessionStats()
    downloadSpeed.value = formatSize(res.downloadSpeed) + '/s'
    uploadSpeed.value = formatSize(res.uploadSpeed) + '/s'
  } catch (e) {
    console.error(e)
  }
}

onMounted(async () => {
  // get torrent list at first
  while (!await initTorrentList()) {
    await wait(RollTime)
  }
  await updateSession()
  // update it
  while (true) {
    await wait(RollTime)
    await updateTorrentList()
    await updateSession()
  }
})
</script>

<style lang="scss">
html,
body,
#app,
.v-application,
.v-application__wrap {
  height: 100%;
}

.v-toolbar {
  z-index: 99;
}

.v-main {
  flex: 1 !important;
  overflow-y: scroll;
  padding-top: 48px !important;
}

.torrent {
  padding: 5px;
  margin: 3px 5px;
  background-color: #00000030;
  position: relative;

  &>.progress {
    position: absolute;
    left: 0;
    top: 0;
    height: 100%;
    // background-color: #0c2336;
  }

  &>.content {
    position: relative;

    &>.title-line {
      display: flex;
      flex-direction: row;
      align-items: center;
      font-size: 18px;

      &>.title {
        overflow: hidden;
        text-overflow: ellipsis;
        white-space: nowrap;
        margin-left: 5px;
        flex: 1;
      }
    }

    &>.info {
      display: flex;
      flex-direction: row;
      margin-top: 14px;
      font-size: 12px;
      color: #bbb;
      height: 20px;

      .holder {
        flex: 1;
      }

      .size {
        width: 110px;
        text-align: end;
      }

      .percent {
        width: 40px;
        text-align: end;
      }

      .rate {
        &>span {
          display: inline-block;
          width: 70px;
        }
      }
    }
  }
}

.footer {
  padding: 5px;
  font-size: 12px;
  color: #bbb;

  &>span {
    display: inline-block;
    width: 100px;
  }

  i {
    margin-right: 5px;
  }
}</style>
