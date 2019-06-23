import DataBus from "../databus";

/**
 * 主函数基类
 */
let databus = new DataBus()

export default class Base {
    constructor(){
        this.init()
    }

    init(){
        this.ctx = canvas.getContext('2d')
        this.datas = {}
        this.pages = []
        this.pageIndex = 0
        this.homeName = "home"
        this.databus = databus
        // 维护当前requestAnimationFrame的id
        this.aniId    = 0
    }

    render(){
        this.ctx.clearRect(0, 0, canvas.width, canvas.height)
        this.pages[this.pageIndex].obj.render(this.ctx)

        this.onRender()
    }

    // 游戏逻辑更新主函数
    update() {
        if ( this.databus.gameOver ){
            return;
        }
        this.render()
    }

    // 实现游戏帧循环
    loop() {
        this.databus.frame++

        this.update()
        this.render()
        this.aniId = window.requestAnimationFrame(
            this.bindLoop,
            canvas
        )
    }

    registerPage(pageName, pageObject){
        this.pages.push({
            name: pageName,
            obj : pageObject
        })

        
    }

    navigateTo(pageName, options=undefined){

        if(options!=undefined){
            let that = this
            Object.keys(options).forEach(function(key){
                that.databus[key] = options[key]
            });
        }
        let that = this
        this.pages.forEach(function (p, idx) {
            if(p.name == pageName){
                p.obj.show = true
                p.obj.onShow()
                that.pageIndex = idx
            }else{
                that._removePageEventListener(p.obj.onTouch)
                p.obj.show = false
            }
        })
    }

    _removePageEventListener(func){
        canvas.removeEventListener(
            'touchstart',
            func
        )
    }

    onBack(){
        if(this.pageIndex>0){
            let currentPage = this.pages[this.pageIndex].obj
            this._removePageEventListener(currentPage.onTouch)
            currentPage.hasTouchEventBind = false
            currentPage.show = false
            this.pageIndex--
            currentPage = this.pages[this.pageIndex].obj
            currentPage.show = true
            currentPage.hasTouchEventBind = false
        }
    }


}