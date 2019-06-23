import Scene from '../base/scene.js'
import Rank from './rank.js'

const rank = new Rank()

export default class GameOver extends Scene {
    constructor(msg, canvas, context) {
        super(msg, canvas, context)
    }

    init() {
        let scene = this
        if (this.msg.scene === 'game over') {
            let prefix = scene.msg.mode + '_' + scene.msg.level
            rank.getUserCloudStorage(prefix,function (KVDataList) {
                let score = parseInt(scene.msg.score)
                let cost_s = parseFloat(scene.msg.timeuse)

                KVDataList.forEach(kv => {
                    if (kv.key === 'score') {
                        let oldScore = parseInt(kv.value)
                        if (oldScore > 0)
                            score += oldScore
                    } else if (kv.key === prefix + '_cost_s') {
                        let oldCostS = parseFloat(kv.value)
                        if (oldCostS < cost_s) {
                            cost_s = oldCostS
                        }
                    }
                })

                let kv = {"key": "score", "value": score.toString()}
                let kv2 = {"key": prefix + '_cost_s', "value": cost_s.toString()}

                wx.setUserCloudStorage({
                    KVDataList: [kv, kv2],
                    success: function (res) {
                        scene.restoreFriendList(prefix, scene.app.openid)
                    },

                    fail: function (res) {
                        console.log(res)
                    }

                })
            })
        }

    }

    restoreFriendList(prefix, myOpenid){
        GameGlobal.friendList = undefined
        rank.getAllRanks(prefix, myOpenid, function (data) {
            GameGlobal[prefix]={friendList: data}
            console.log(GameGlobal)
        })
    }
}