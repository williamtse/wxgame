import Rank from "./rank";
const rank = new Rank()

export default class loading{
    constructor(openid){
        this.openid = openid
        this.prefixs = []
        let gs = [4,6,9]
        let ls = [0,1,2,3]
        for(let i in gs){
            let m = gs[i]
            for(let j in ls){ //关卡
                let l=ls[j]
                let prefix = m+'x'+m+'_'+l
                this.prefixs.push(prefix)
            }
        }
        this.start = 0
        GameGlobal.friendList = undefined
    }

    preload(){
        console.log(this.start, this.prefixs.length)
        if(this.start<this.prefixs.length){
            let prefix = this.prefixs[this.start]
            let that = this
            console.log("预加载"+prefix)
            rank.getAllRanks(prefix,this.openid,function (data) {
                GameGlobal[prefix] = {'friendList': data}
                that.start++
                that.preload()
            })
        }

    }
}