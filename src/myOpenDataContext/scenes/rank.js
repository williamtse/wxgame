import {RGBToHex} from '../base/util'
import RankItem from './rankitem'
export default class Rank {
    constructor() {
        this.myKVData = undefined
        this.allRanks = []
    }

    /**
     * 从开放域返回的数据中查询游戏时间
     * @param prefix
     * @param item
     * @returns {number}
     */
    getCostS(prefix, item) {
        let KVDataList = item.KVDataList
        let re = 0
        KVDataList.forEach(function (kv) {
            if (kv.key == prefix+'_cost_s') {
                re = kv.value
            }
        })
        return re
    }

    /**
     * 查询用户开放数据
     * @param prefix
     * @param callback
     */
    getUserCloudStorage(prefix, callback) {
        wx.getUserCloudStorage({
            keyList: ['score', prefix+'_cost_s'],
            success: res => {
                console.log(res)
                if (res.errMsg === 'getUserCloudStorage:ok') {
                    if (res.KVDataList.length > 0 && callback instanceof Function)
                        callback(res.KVDataList)
                }
            }
        })
    }

    /**
     * 将秒格式化成 00:00.00 格式的时间
     * @param timeuse
     * @returns {string}
     * @private
     */
    _formatTime(timeuse){
        let s = timeuse%60
        let h = parseInt(timeuse/3600)
        let m = parseInt((timeuse - h*3600)/60)
        if(h>0){
            if(h<10) h='0'+h+':'
        }else{
            h=''
        }
        if(m<10){
            m = '0'+m
        }
        s = parseFloat(s).toFixed(2)
        if(s<10) { s='0'+s }
        return h+m+':'+s
    }

    /**
     *
     * @param prefix 例子：4x4_0 (4宫格第1关)
     * @param myOpenid
     * @param data 开放域数据
     * @param func 回调函数
     * @private
     */
    _createRankList(prefix, myOpenid, data, func) {
        let that = this
        if(data.length>1){
            console.log(data)
            data.sort(function(item1, item2){
                let cost1 = that.getCostS(prefix, item1)
                let cost2 = that.getCostS(prefix, item2)
                if (cost1 > cost2) {
                    return -1
                } else if (cost1 < cost2) {
                    return 1
                } else {
                    return 0
                }
            })
        }
        console.log(sharedCanvas.width)
        let w = window.innerWidth
        let itemH = 50
        let rgb = [255, 215, 0]
        let allRanks = []
        let ret = {
            list:[],
            myitem: undefined
        }
        data.forEach((item, index) => {
            let background = index % 2 === 0 ? '#666' : '#5A5A5A'
            let y = index * 40
            rgb[1] -= 10
            let rankColor = RGBToHex(rgb)
            let avatar = wx.createImage()
            avatar.src = item.avatarUrl
            let rankItem = new RankItem({
                background: background,
                x: 0,
                y: y,
                w: w,
                h: itemH,
                rankColor: rankColor + "0",
                font: "bold italic 18px sans-serif",
                img: avatar,
                rank: index + 1,
                score: that._formatTime(that.getCostS(prefix, item)),
                nickname: item.nickname,
                openid: item.openid
            })
            allRanks.push(rankItem)
            if(item.openid===myOpenid){
                ret.myitem = rankItem
            }
        })
        ret.list = allRanks
        func(ret)
    }

    /**
     * 查询我的朋友包括自己的排行榜数据
     * @param prefix
     * @param myOpenid
     * @param fnc
     */
    getAllRanks(prefix, myOpenid, fnc) {
        let that = this
        this.getFriendCloudStorage(prefix, myOpenid, function (prefix, data) {
            that._createRankList(prefix, myOpenid, data,  fnc)
        })

    }

    /**
     * 从开放域查询朋友排行榜数据
     * @param prefix
     * @param myOpenid
     * @param fnc
     */
    getFriendCloudStorage(prefix, myOpenid, fnc) {
        if(GameGlobal.friendList!==undefined){
            fnc(prefix, GameGlobal.friendList)
        }else{
            let gs = [4,6,9]
            let ls = [0,1,2,3]
            let prefixs = []
            let keys = []
            for(let i in gs){
                let m = gs[i]
                for(let j in ls){ //关卡
                    let l=ls[j]
                    let prefix = m+'x'+m+'_'+l
                    prefixs.push(prefix)
                    keys.push(prefix+'_cost_s')
                }
            }
            keys.push('score')
            this.start = 0
            console.log('get wx friend cloud storage')
            wx.getFriendCloudStorage({
                keyList: keys,
                success: res => {
                    let data = res.data
                    GameGlobal.friendList = data
                    if(fnc instanceof Function)
                        fnc(prefix, data)
                }
            })
        }
    }

    /**
     * 比赛结果页的排名数据整理
     * @param prefix
     * @returns {*[]|HTMLElement}
     */
    getGameOverRankList(prefix) {
        let list = GameGlobal[prefix].friendList.list
        let myitem = GameGlobal[prefix].friendList.myitem
        let items = []
        if (list.length === 1) {
            items = list
        } else if (list.length <= 3) {
            items = list
        } else {
            if(myitem.rank>3){
                items = [list[0],list[1],myitem]
            }else{
                items = [list[0],list[1],list[2]]
            }
        }
        return items
    }
}