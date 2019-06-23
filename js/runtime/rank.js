import Page from '../base/page'
import {ListView, FontText, Line, Button, ImageElement} from "../base/ui";
import Config from "../config";

const config = new Config()

export default class Rank extends Page {
    constructor(app, ctx, options) {
        super(app, ctx, options)

    }

    init() {
        super.init()

        this.createRankPageTitle()

        wx.showShareMenu({
            withShareTicket: true
        })

        let that = this
        let x = this.screenWidth * 0.1
        let w = this.screenWidth * 0.8
        this.createElement('ranks title', new FontText({
            text: '好友排行榜',
            font: 'bold 20',
            color: '#ffffff',
            x: this.screenWidth / 2,
            y: 90
        }))

        this.createElement('ranbox title', new Button({
            textAlign: 'left',
            x: x,
            y: 120,
            w: w,
            h: 30 + this.screenWidth / 2,
            font: '12',
            fontColor: "#ddd",
            background: '#5A5A5A',
            textBaseline: 'top',
            text: '历史最快游戏时间记录',
            textTop: 5,
            textLeft: 5
        }))

        let group = new ImageElement({
            x: this.screenWidth * 0.9 - 185 * 35 / 47,
            y: this.screenHeight - 80,
            src: 'images/lookgroup.png',
            width: 185,
            height: 47,
            w: 185 * 35 / 47,
            h: 35,
            sx: 0,
            sy: 0
        })

        group.onClick = () => {
            wx.shareAppMessage({
                title   : config.get('GROUP_SHARE_TITLE'),
                imageUrl: config.get('GROUP_SHARE_IMAGE'),
                query:'mode='+that.datas.mode+'&level='+that.datas.level
            })
            if (this.shareTicket !== undefined) {
                that.app.navigateTo(that, {url: 'group'})
            }
        }

        this.createElement('group ranks', group)

    }

    onShow() {
        this.openDataContext.postMessage({
            scene: 'all ranks',
            openid: this.app.openid,
            mode: this.datas.mode,
            level: this.datas.level,
            screenWidth: this.screenWidth
        })
    }

    onUpdate() {
        if (this.show) {
            this.render(this.ctx)
        }
    }

    onRender(ctx) {
        let screenWidth = window.innerWidth
        let screenHeight = window.innerHeight
        this.ctx.drawImage(this.sharedCanvas, this.screenWidth * 0.1, 150, screenWidth * 0.8, screenHeight*0.8)
    }
}