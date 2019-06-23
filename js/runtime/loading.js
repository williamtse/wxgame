import {ImageElement, Button, FontText} from '../base/ui'
import Page from '../base/page'
export default class Loading extends Page{
	constructor(app, ctx, options) {
    	super(app, ctx, options)
		this.completed = false
		this.resources = []
		this.init()
		this.loadingFileName = '正在加载资源......'
	}
	onShow() {
		console.log('预加载朋友排行榜数据')
		this.openDataContext.postMessage({
			command: 'loading',
			openid: this.app.openid
		})
	}

	init(){
		super.init()

		console.log('start loading........')
		let that = this
		this.app.pages.forEach(function(page){
			if(page.name!=='loading'){
				page.obj.init()
				page.obj.elements.forEach(function(e){
					if(e.element instanceof ImageElement){
						that.resources.push(e)
					}
				})
			} 
		})
		this.finishCount = 0
		let text = new FontText({
			text:'正在加载资源......',
			x:this.screenWidth/2,
			y:this.screenHeight/2-20,
			font:"15",
			color:'#ffffff',
			textBaseline:'left'
		})
		text.onUpdate=()=>{
			if(this.loadingFileName!==undefined)
			text.text = this.loadingFileName
		}
		this.createElement('loading text', text)

		this.createElement('slider', new Button({
			x:this.screenWidth*0.1,y:this.screenHeight/2,w:this.screenWidth*0.8, h:20,background:'#ffffff'
		}))
		let block = new Button({
			x:this.screenWidth*0.1,y:this.screenHeight/2,w:0, h:20,background:'green'
		})
		block.onUpdate=()=>{
			block.w = this.finishCount*this.screenWidth*0.8/this.resources.length
		}
		this.createElement('block', block)
	}

	onUpdate(){
		if(this.show){
			if(!this.completed){
				// this.render(this.ctx)
				this.progress()
			}else{
				this.app.loaded = true
				this.app.navigateTo(undefined,{url:'home'})
			}
		}
	}

	onRender(){
		let ctx = this.ctx
	}

	progress(pages){

		let that = this
		let ct = 0
		this.resources.forEach(function(res){
			if(res.element.loaded){
				ct++
			}else{
				that.loadingFileName = '正在加载' + res.name
			}
		})
		that.finishCount = ct
		console.log('load '+ct+'/'+this.resources.length)
		if(this.resources.length===that.finishCount){
			this.completed = true
			console.log('loading completed')
		}
	}
}