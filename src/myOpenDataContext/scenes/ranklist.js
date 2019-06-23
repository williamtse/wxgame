import Scene from '../base/scene'
import {ListItem, ListView} from '../base/ui'
import RankItem from './rankitem'

export default class RankList extends Scene {
    constructor(data, canvas, context) {
        super(data, canvas, context)
    }

    init() {
        if(this.scene!==this.msg.scene)
            return true
        let scene = this
        let prefix = this.msg.mode+'_'+this.msg.level
        console.log(GameGlobal)
        let storeData = GameGlobal[prefix]['friendList']
        if(storeData){
            let ranks = storeData.list
            let ranksListView = new ListView({
                w: scene.screenWidth,
                h: scene.screenWidth,
                x: 0,
                y: 0,
                items: list => {
                    let items = []
                    ranks.forEach((data, idx) => {
                        
                        let item = new ListItem(
                            list,
                            idx,
                            50,
                            ctx => {
                                scene.renderItem(ctx, data)
                            }
                        )
                        items.push(item)
                    })
                    return items
                }
            })
            this.createSprite('rankBox', ranksListView)
            this.drawMyRank(storeData.myitem)
        }
    }

    drawMyRank(item){
        let rankItem = new RankItem({
            background: '#5A5A5A',
            x: 0,
            y: this.screenWidth +10,
            w: this.screenWidth,
            h: 50,
            rankColor: item.rankColor,
            img: item.img,
            rank: item.rank,
            score: item.score,
            nickname: item.nickname
        })
        rankItem.onClick = () => {
        }
        this.createSprite('myitem ', rankItem)
    }

    renderItem(ctx, item) {
        item.render(ctx)
    }

    onRender() {
    }
}