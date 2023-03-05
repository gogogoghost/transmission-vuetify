
import {mdiStopCircleOutline,mdiHumanQueue,mdiFileCheckOutline,mdiDownload,mdiSprout} from '@mdi/js'

export const TorrentStatus=[
    {
        t:'stopped',
        i:mdiStopCircleOutline,
        c:'#512DA8'
    },
    {
        t:'queued to verify',
        i:mdiHumanQueue,
        c:'#80DEEA'
    },
    {
        t:'verifying',
        i:mdiFileCheckOutline,
        c:'#7986CB'
    },
    {
        t:'queued to download',
        i:mdiHumanQueue,
        c:'#80DEEA'
    },
    {
        t:'downloading',
        i:mdiDownload,
        c:'#0277BD'
    },
    {
        t:'queued to seed',
        i:mdiHumanQueue,
        c:'#80DEEA'
    },
    {
        t:'seeding',
        i:mdiSprout,
        c:'#2E7D32'
    }
]

export const RollTime = 5000