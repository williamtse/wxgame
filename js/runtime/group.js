import Page from '../base/page'
import {ListView, FontText, Line, Button, ImageElement} from "../base/ui";

export default class Group extends Page{
	constructor(app, ctx, options){
		super(app, ctx, options)
		this.openDataContext = wx.getOpenDataContext()
        this.sharedCanvas = this.openDataContext.canvas
        this.context = canvas.getContext('2d')
	}

	init(){
		super.init()
		// let backButton = this.createBackButton()
	    // backButton.visible = true
		this.createRankPageTitle()
	    let that=this
		let x = canvas.width*0.1
		let w = canvas.width*0.8
		this.createElement('ranks title', new FontText({
			text:'群排行榜',
			font:'bold 20',
			color:'#ffffff',
			x:canvas.width/2,
			y:90
		}))

		this.createElement('ranbox title', new Button({
			textAlign:'left',
			x:x,
			y:120,
			w:w,
			h:30+canvas.width/2,
			font:'12',
			fontColor:"#ddd",
			background:'#5A5A5A',
			textBaseline:'top',
			text:'每周一凌晨刷新',
			textTop:5,
			textLeft:5
		}))

		let group = new ImageElement({
			x:(canvas.width*0.9-117),
			y:canvas.height-90,
			src:'images/meto.png',
			width:117,
			height:50,
			w:117,
			h:50,
			sx:0,
			sy:0
		})

		group.onClick=()=>{
	    	console.log('meto click')
			that.app.navigateTo(undefined, {url:'levels', datas:{mode:that.datas.mode,level:that.datas.level}})
		}

		this.createElement('group ranks', group)


	}

	onShow() {
		this.openDataContext.postMessage({
			scene: 'group ranks',
			openid: wx.getStorageSync('openid'),
			shareTicket: this.datas.shareTicket,
			mode: this.datas.mode,
			level: this.datas.level
		})
	}

	onRender(ctx){
		this.context.drawImage(this.sharedCanvas, canvas.width*0.1, 150)
	}
}