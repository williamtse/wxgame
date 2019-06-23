import Scene from '../base/scene.js'
import Rank from './rank.js'
import {Button, FontText, ImageElement} from '../base/ui'
import {RGBToHex} from '../base/util'

const rank = new Rank()

export default class GameOverRank extends Scene {
    constructor(data, canvas, context) {
        super(data, canvas, context)
    }

    init() {
        const RANK_BOX_WIDTH = this.screenWidth*0.8
        const RANK_BOX_HEIGHT = 150
        const RANK_ITEM_WIDTH = RANK_BOX_WIDTH / 3

        console.log(this.scene, this.msg)
        if(this.scene!==this.msg.scene)
            return true
        console.log("I'm GameOverRank.init()")
        let that = this
        this.createSprite('bg', new Button({
            x: 0, y: 0, w: RANK_BOX_WIDTH, h: RANK_BOX_HEIGHT, background: '#5A5A5A'
        }))
        let x = 0, y = 0, h = RANK_ITEM_WIDTH

        let prefix = this.msg.mode+'_'+this.msg.level
        let gameOverRankList = rank.getGameOverRankList(prefix)

        if (gameOverRankList.length === 1) {
            x = RANK_ITEM_WIDTH
        }

        let rgb = [255, 215, 0]
        if (gameOverRankList.length > 0) {

            gameOverRankList.forEach(function (item, idx) {
                console.log('渲染',item)
                let item_x = x + idx * RANK_ITEM_WIDTH

                let bg = idx % 2 === 0 ? '#666' : '#5A5A5A'
                //排名item背景
                that.createSprite('bg' + idx, new Button({
                    x: item_x, y: y, w: RANK_ITEM_WIDTH, h: RANK_BOX_HEIGHT, background: bg
                }))

                //排名
                rgb[1] -= 10
                let color = RGBToHex(rgb)
                that.createSprite('rank' + idx, new FontText({
                    font: "bold italic 18", color: color + "0", text: item.rank, x: item_x + RANK_ITEM_WIDTH / 2,
                    y: 15
                }))

                //头像
                that.createSprite('avatar' + idx, new ImageElement({
                    src: item.img, sx: 0, sy: 0, width: 132, height: 132, x: item_x + (RANK_ITEM_WIDTH - 64) / 2,
                    y: 30, w: 60, h: 60
                }))

                //昵称
                that.createSprite('nickname' + idx, new FontText({
                    font: "16",
                    color: '#ffffff',
                    text: item.nickname,
                    x: item_x + RANK_ITEM_WIDTH / 2,
                    y: (RANK_BOX_HEIGHT - 30 - 64) / 2 + 30 + 64
                }))
            })
        }

    }
}