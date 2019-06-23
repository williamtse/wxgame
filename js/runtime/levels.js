import Page from '../base/page'
import {ImageElement, FontText, Button, ListView, ListItem} from "../base/ui";
let screenWidth = window.innerWidth
let screenHeight = window.innerHeight
export default class Levels extends Page {
    constructor(app, ctx, options) {
        super(app, ctx, options)
        this.top = 0
    }

    init() {
        super.init()

        this.createTitle(this.datas.title !== undefined ? this.datas.title : '' + '关卡')

        let modes = [
            {mode: 'easy', title: '简单的'},
            {mode: 'normal', title: '一般的'},
            {mode: 'defficult', title: '困难的'},
            {mode: 'hard', title: '极难的'}
        ]

        let x = screenWidth / 2
        let y = 20
        let that = this
        for (let i = 0; i < modes.length; i++) {
            let info = modes[i]
            y += 60 + 15
            let modeBtn = new ImageElement({
                src: 'images/start.png',
                sx: 0,
                sy: 0,
                width: 137,
                height: 60,
                x: x,
                y: y,
                w: 137,
                h: 60
            })

            modeBtn.onClick = () => {
                let grids = that.datas.mode.split('x'), colStep, colGrids, rowStep, rowGrids, numberShows
                switch (this.datas.mode) {
                    case '4x4':
                        colStep = 2
                        rowStep = 2
                        colGrids = 2
                        rowGrids = 2
                        numberShows = 16 - 3 * i - 2
                        break;
                    case '6x6':
                        colStep = 3
                        rowStep = 2
                        colGrids = 2
                        rowGrids = 2
                        numberShows = 36 - 5 * i - 6
                        break;
                    case '9x9':
                        colStep = 3
                        rowStep = 3
                        colGrids = 3
                        rowGrids = 3
                        numberShows = 81 - 10 * i - 35
                        break;
                }
                that.app.navigateTo(that, {
                    url: "grids", datas: {
                        mode: that.datas.mode,
                        level: i,
                        levelTitle: info.title,
                        grids: grids,
                        colStep: colStep,
                        colGrids: colGrids,
                        rowStep: rowStep,
                        rowGrids: rowGrids,
                        numberShows: numberShows
                    }
                })
            }

            this.createElement(this.datas.mode + 'level ' + i, modeBtn)
            this.createElement(this.datas.mode + 'level text ' + i, new FontText({
                text: info.title,
                x: modeBtn.x + modeBtn.w / 2 + 20,
                y: modeBtn.y + modeBtn.h / 2 - 3,
                color: '#000000',
                font: 'bold 20'
            }))
            this.createRankButtons(x - 60, y+17, i)

        }
    }

    createRankButtons(x, y, level) {
        let that = this
        let icon_rank = new ImageElement({
            src: 'images/rank.png',
            sx: 0,
            sy: 0,
            width: 136,
            height: 123,
            x: x,
            y: y,
            w: 32,
            h: 32
        })
        icon_rank.onClick = () => {
            that.app.navigateTo(that, {url: 'ranks', datas: {level: level, mode:that.datas.mode}})
        }
        this.createElement(this.datas.mode + '_rank_' + level, icon_rank)
    }
}