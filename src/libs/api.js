import {request} from './request'

/**
 * Session api
 */

// get session info
export async function sessionGet(args){
    return await request('session-get',args)
}

// set session info
export async function sessionSet(args){
    return await request('session-set',args)
}

// get session stats
export async function sessionStats(args){
    return await request('session-stats',args)
}

// close session
export async function sessionClose(args){
    return await request('sessionClose',args)
}

/**
 * Torrent api
 */

// start torrent
export async function torrentStart(args){
    return await request('torrent-start',args)
}

// start torrent now
export async function torrentStartNow(args){
    return await request('torrent-start-now',args)
}

// torrent stop
export async function torrentStop(args){
    return await request('torrent-stop',args)
}

// torrent verify
export async function torrentVerify(args){
    return await request('torrent-verify',args)
}

// ask tracker for more peer
export async function torrentReannounce(args){
    return await request('torrent-reannounce',args)
}

// set torrent info
export async function torrentSet(args){
    return await request('torrent-set',args)
}

// get torrent info
export async function torrentGet(args){
    return await request('torrent-get',args)
}

// add torrent
export async function torrentAdd(args){
    return await request('torrent-add',args)
}

// remove torrent
export async function torrentRemove(args){
    return await request('torrent-remove',args)
}

// move torrent
export async function torrentSetLocation(args){
    return await request('torrent-set-location',args)
}

// rename a torrent's path
export async function torrentRenamePath(args){
    return await request('torrent-rename-path',args)
}

/**
 * Queue api
 */

// move to top of queue
export async function queueMoveTop(args){
    return await request('queue-move-top',args)
}

// move up
export async function queueMoveUp(args){
    return await request('queue-move-up',args)
}

// move down
export async function queueMoveDown(args){
    return await request('queue-move-down',args)
}

// move to bottom of queue
export async function queueMoveBottom(args){
    return await request('queue-move-bottom',args)
}

/**
 * Group api
 */

// group set
export async function groupSet(args){
    return await request('group-set',args)
}

// group get
export async function groupGet(args){
    return await request('group-get',args)
}

/**
 * Other api
 */

// block list update
export async function blockListUpdate(args){
    return await request('blocklist-update',args)
}

// port test
export async function portTest(args){
    return await request('port-test',args)
}

// query free space
export async function freeSpace(args){
    return await request('free-space',args)
}