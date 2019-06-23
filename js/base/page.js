import Request   from '../base/request'
import {ImageElement, FontText} from "./ui";
import Config from "../config";

const config = new Config()

/**
 * 游戏页面类
 */
export default class Page {
    /**
     * 构造函数
     * @param options 页面参数
     */
    constructor(app, ctx, options) {
        // 维护当前requestAnimationFrame的id
        this.aniId    = 0
        this.ctx = ctx
        this.request = new Request()
        this.app = app
        this.datas = options===undefined?{}:options
        this.showBackArrow = false
        this.show = false
        this.screenWidth = window.innerWidth
        this.screenHeight = window.innerHeight
        this.elements = []
        this.background = '#8FA09A'
        this.hasEventBind = false
        this.drag = false
        this.tartx= 0
        this.tarty = 0
        this.shareTicket = undefined
        this.prevPage = undefined

        this.openDataContext = wx.getOpenDataContext()
        this.sharedCanvas = this.openDataContext.canvas
        this.sharedCanvas.width = canvas.width
        this.sharedCanvas.height = canvas.height


    }

    /**
     * 页面更新时逻辑处理
     */
    onUpdate(){

    }

    /**
     * 页面初始化，一般做创建元素的逻辑
     */
    init(){
        this.elements = []
        this.createBackButton()
        wx.onShareAppMessage(() => {
            return {
                title: config.get('SHARE_TITLE'),
                imageUrl: config.get('SHARE_IMAGE')
            }
        })
    }

    /**
     * 创建回退按钮
     * @returns {ImageElement}
     */
    createBackButton(){
        if(!this.prevPage || this.name==="home"){
            return
        }else if(this.name!=="home" && !this.prevPage){
            return
        }
        let btn = new ImageElement({
            src:'images/back.png',
            x:20,
            y:43,
            sx:0,
            sy:0,w:30,h:30,
            width:43,height:44
        })
        let that = this
        btn.onClick=()=>{
            that.backEventHandler()
        }
        this.createElement('back 2', btn)
        return btn
    }

    /**
     * 创建页面标题
     * @param text
     * @returns {FontText}
     */
    createTitle(text){
        let title = new FontText({
            text: text,
            x:this.screenWidth/2,
            y:50,
            color:"#ffffff",
            font:"bold 16"
        })
        this.createElement('title_'+text, title)
        return title
    }

    createRankPageTitle(){
        let mode = ''
        let df = ''
        switch (parseInt(this.datas.level)) {
            case 0:
                df='简单的'
                break
            case 1:
                df='一般的'
                break
            case 2:
                df='困难的'
                break
            case 3:
                df='极难的'
                break
        }
        switch (this.datas.mode) {
            case '4x4':
                mode = '四宫格';
                break;
            case '6x6':
                mode = '六宫格';
                break;
            case '9x9':
                mode = '九宫格';
                break;
        }
        let title=mode+df
        console.log('rank title '+title, this.datas)
        return this.createTitle(title)
    }

    /**
     * 当页面回退时做的逻辑处理
     */
    backEventHandler(){
        let prevPage = this.prevPage
        if(prevPage!==undefined){
            this.app.navigateTo(undefined, {
                url:prevPage.name,
                datas:prevPage.datas
            })
        }
    }

    /**
     * 创建元素
     * @param name
     * @param element
     */
    createElement(name, element){
        name = this.name+'_'+name
        let that = this
        let is_exists = false
        this.elements.forEach(function (e, idx) {
            if(e.name===name){
                if(name=="Grid Numbers") console.log('Grid Numbers is exists')
                is_exists = true
            }
        })
        if(!is_exists){
            this.elements.push({name: name, element:element})
        }
        element.show = this.show
    }

    /**
     * 移除元素
     * @param name
     */
    removeElement(name){
        let that = this
        this.elements.forEach(function (e, idx) {
            if(e.name===name){
                delete that.elements[idx]
            }
        })
    }

    /**
     * 页面显示事件处理逻辑
     */
    onShow(){
    }


    /**
     * 页面加载处理逻辑
     */
    onLoad(){}

    /**
     * 页面渲染时的而外处理逻辑
     * @param ctx
     */
    onRender(ctx){}

    /**
     * 页面渲染
     */
    render(ctx){
        // console.log(this)
        ctx.clearRect(0,0,this.screenWidth, this.screenHeight)
        ctx.fillStyle = this.background // 矩形颜色
        ctx.fillRect(0, 0, this.screenWidth, this.screenHeight)
        this.elements.forEach(function(element){
            let e = element.element
            if(e instanceof Array){
                e.forEach(function (s) {
                    s.render(ctx)
                })
            }else{
                e.render(ctx)
            }
        })
        this.onRender(ctx)
    }



}