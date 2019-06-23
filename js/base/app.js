import DataBus from "../databus";

/**
 * 主函数基类
 */
let databus = new DataBus()

export default class App {
    constructor(ctx){
        this.ctx = ctx
        this.pages = []
        this.init()
    }

    /**
     * 初始化
     */
    init(){
        this.datas = {}
        this.pageIndex = 0
        this.homeName = "home"
        this.databus = databus
        this.bindLoop     = this.loop.bind(this)
        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
        
    }

    /**
     * 渲染页面
     */
    render(){
        this.ctx.clearRect(0, 0, window.innerWidth, window.innerHeight)
        let page = this.pages[this.pageIndex].obj
        page.render(this.ctx)
    }

    /**
     * 实现游戏帧循环
     */
    loop() {
        this.render()
        this.update()
        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }

    /**
     * 游戏逻辑更新主函数
     */
    update() {
        let page = this.pages[this.pageIndex].obj
        page.onUpdate()
    }

    /**
     * 注册页面
     * @param pageName
     * @param pageObject
     */
    registerPage(pageName, pageObject){
        pageObject.name = pageName
        this.pages.push({
            name: pageName,
            obj : pageObject,
            prev: this.pages.length>0?this.pages[this.pages.length-1]:undefined
        })
    }


    /**
     * 页面跳转之前的处理逻辑
     */
    beforeNavigation(){
        //TODO
    }

    /**
     * 页面跳转
     * @param options { url: 页面名称, datas: 传递参数 }
     */
    navigateTo(prev, options){
        this.beforeNavigation()
        if(options.url!==undefined){
            let name = options.url
            let that = this
            this.pages.forEach(function (p, idx) {
                let pageInstance = p.obj
                let pageName = p.name
                if(pageName == name){
                    
                    if(options.datas!==undefined){
                        pageInstance.datas = options.datas
                    }
                    that.pageIndex = idx
                    if(prev!==undefined)
                    pageInstance.prevPage = prev
                    pageInstance.name = name
                    console.log('navagate to '+name)
                    pageInstance.show = true
                    pageInstance.init()
                    pageInstance.onShow()
                    that.currentpage = pageInstance
                }else{
                    pageInstance.show = false
                    pageInstance.elements.forEach(function(e){
                        if(e.element  instanceof Array){
                            e.element.forEach(function(l){
                                l.visible = false
                                l.removeTouchListener()
                            })
                        }else{
                            e.element.visible = false
                            e.element.removeTouchListener()
                        }
                    })
                }
            })
        }
    }

}