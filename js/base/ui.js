class Element{
    constructor(){
        this.area ={
            startX:0,startY:0,endX:0,endY:0
        }
        this.touched = false
        this.visible = true
        this.hasEventBind = false
    }

    getArea(){
        this.area = {
            startX:this.x,startY:this.y,endX:this.x+this.w,endY:this.y+this.h
        }
        return this.area
    }

    render(ctx){
        if(!this.isVisible()){
            
            return false
        } 
            
        if ( !this.hasEventBind ) {
            this.hasEventBind = true
            this.bindEvent()
        }
        this.onUpdate()
        return true
    }

    onClick(x, y){
    }

    isVisible(){
        return this.visible
    }

    onDrag(x, y){}

    onUpdate(){}

    bindEvent(){
        this.touchStartHandler = this.touchStartEventHandler.bind(this)
        canvas.addEventListener('touchstart', this.touchStartHandler)
        this.touchMoveHandler = this.touchMoveEventHandler.bind(this)
        canvas.addEventListener('touchmove', this.touchMoveHandler)
        this.touchEndHandler = this.touchEndEventHandler.bind(this)
        canvas.addEventListener('touchend', this.touchEndHandler)
    }

    touchStartEventHandler(e){
        e.preventDefault()
        this.drag = false
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY
        if (!this.touched) {
            this.hasClicked = false
            this.touched = true
            this.startx = x
            this.starty = y
            this.endx = x
            this.endy = y

        }
    }

    touchMoveEventHandler(e){
        e.preventDefault()
        let x = e.touches[0].clientX
        let y = e.touches[0].clientY
        this.endx = x
        this.endy = y
        let distx = this.endx-this.startx
        let disty = this.endy-this.starty
        if(distx!==0 || disty!==0){
            this.startx = x
            this.starty = y
        }
        this.hasClicked = true
        if(this.touched && this.visible){
            if(this.isTouchOnArea(this.startx, this.starty,this.getArea())){
                this.onDrag(distx, disty)
            }
        }

    }

    touchEndEventHandler(e){
        e.preventDefault()
        this.touched = false
        if(this.endx==this.startx || this.endy==this.starty){
            this.touched = false
            //调用被点击的元素的onClick方法
            if(!this.hasClicked && this.visible && this.isTouchOnArea(this.startx, this.starty,this.getArea()))
            {
                this.onClick(this.endx, this.endy)
            }
        }
    }

    isTouchOnArea(x, y, area){
        return x > area.startX
            && x < area.endX
            && y > area.startY
            && y < area.endY
    }

    removeTouchListener(){
        canvas.removeEventListener(
            'touchstart',
            this.touchStartEventHandler
        )
        canvas.removeEventListener(
            'touchstart',
            this.touchMoveEventHandler
        )
        canvas.removeEventListener(
            'touchend',
            this.touchEndEventHandler
        )
        this.hasEventBind = false
    }
}

export class ImageElement extends Element{
    /**
     * 绘制图片 options
     * @param src 图片路径
     * @param width 裁剪宽度
     * @param height 裁剪高度
     * @param sx 裁剪起始x
     * @param sy 裁剪起始y
     * @param x 图片在画布上的位置x
     * @param y 图片在画布上的位置y
     * @param w 图片显示的宽度
     * @param h 图片显示的高度
     * @param circle 是否显示成圆形
     * @returns {{endY: number, endX: number, startY: number, startX: number}}
     */
    constructor(options){
        super()
        this.img    = wx.createImage()
        this.src    = options.src
        this.width  = options.width
        this.height = options.height
        this.sx     = options.sx===undefined?0:options.sx
        this.sy     = options.sy===undefined?0:options.sy
        this.x      = options.x
        this.y      = options.y
        this.w      = options.w===undefined?0:options.w
        this.h      = options.h===undefined?0:options.h
        this.circle = options.circle===undefined?false:true
        this.loaded = false
        this.load()
    }

    load(){
        let that = this
        if(typeof(this.src)=='string'){
            this.img.src = this.src
        }else{
            this.img = this.src
        }
        this.img.onload=()=>{
            that.loaded = true
        }
    }

    render(ctx){
        if(!super.render(ctx)) return
            ctx.save()
        if(this.circle){
             //保存上下文
            ctx.beginPath()//开始绘制
            ctx.arc(this.x+this.w/2, this.y+this.h / 2,
            (this.w<=this.h?this.w:this.h)/2, 0, 2 * Math.PI, false)//画一个圆
            ctx.clip()//裁剪这个圆
        }
        ctx.drawImage(
            this.img,
            this.sx,
            this.sy,
            this.width,
            this.height,
            this.x,
            this.y,
            this.w,
            this.h
        )
        ctx.restore()
    }
}

export class Button extends Element{
    /**
     * 按钮text, x, y, w, h, font=14, radius=10, background='#ffffff', fontColor="#000"
     * @param text
     * @param x
     * @param y
     * @param w
     * @param h
     * @param background
     * @param font
     * @param fontColor
     * @param radius
     */
    constructor(options){
        super()
        this.name       = options.name===undefined?'button':options.button
        this.text       = options.text===undefined?false:options.text
        this.x          = options.x===undefined?0:options.x
        this.y          = options.y===undefined?0:options.y
        this.w          = options.w===undefined?0:options.w
        this.h          = options.h===undefined?0:options.h
        this.font       = options.font===undefined?12:options.font
        this.fontColor  = options.fontColor===undefined?"#000000":options.fontColor
        this.background = options.background===undefined?"#ffffff":options.background
        this.radius     = options.radius===undefined?0:options.radius
        this.textAlign  = options.textAlign===undefined?'center':options.textAlign
        this.textBaseline = options.textBaseline===undefined?'middle':options.textBaseline
        this.textTop = options.textTop===undefined?0:options.textTop
        this.textLeft = options.textLeft===undefined?0:options.textLeft
        
    }

    render(ctx){
        if(!super.render(ctx)) return
        ctx.fillStyle = this.background // 矩形颜色
        ctx.fillRect(this.x, this.y, this.w, this.h)

        if(this.text){
            ctx.fillStyle = this.fontColor
            ctx.font    = this.font + "px Arial"
            ctx.textAlign = this.textAlign
            ctx.textBaseline = this.textBaseline
            ctx.fillText(
                this.text,
                this.x+ (this.textAlign==='center'?this.w/2:0)+this.textLeft,
                this.y+(this.textBaseline==='middle'?this.h/2:0)+this.textTop
            )
        }
    }
}

export class Line extends Element{
    constructor(options){
        super(options)
        this.x=options.x 
        this.y=options.y 
        this.ex=options.ex 
        this.ey=options.ey
        this.line_width = options.line_width
        this.line_color = options.line_color
    }

    render(ctx){
        //分割线
      ctx.beginPath();
      ctx.moveTo(this.x,this.y);
      ctx.lineTo(this.ex,this.ey);
      ctx.lineWidth = this.line_width;
      ctx.strokeStyle = this.line_color;
      ctx.stroke();
    }
}

export class FontText extends Element{
    //text, x, y, font=20, color="#000000", maxWidth=false
    constructor(options){
        super()
        this.text       = options.text===undefined?'text':options.text
        this.x          = options.x===undefined?0:options.x
        this.y          = options.y===undefined?0:options.y
        this.w          = options.w===undefined?0:options.w
        this.h          = options.h===undefined?0:options.h
        this.font       = options.font===undefined?12:options.font
        this.color      = options.color===undefined?"#000000":options.color
        this.maxWidth   = options.maxWidth===undefined?false:true
    }

    render(ctx){
        if(!super.render(ctx)) return
            ctx.save()
        ctx.fillStyle = this.color
        ctx.font    = this.font + "px sans-serif"
        ctx.textAlign = "center"
        ctx.textBaseline = "middle"
        ctx.fillText(
          this.text,
          this.x,
          this.y,
          this.maxWidth?this.maxWidth:undefined
        )
        ctx.restore
    }
}

export class ScrollView extends Element{
    constructor(options){
        super()
    }
}



export class ListItem extends Element{
    constructor(listInstance, rowidx, h, itemRender){
        super()
        this.listInstance = listInstance
        this.x          = listInstance.x
        this.w          = listInstance.w
        this.h          = h
        this.y          = listInstance.y+this.h*rowidx
        this.background = rowidx%2===0?"#5A5A5A":"#666"
        this.itemRender = itemRender
    }

    render(ctx){
        super.render(ctx)
        //矩形下边线
        // ctx.save()
        ctx.fillStyle = this.background // 矩形颜色
        ctx.fillRect(this.x, this.y, this.w, this.h);
        // ctx.restore()
        if(this.itemRender instanceof Function){
            this.itemRender(ctx)
        }
    }
}

export class ListView extends Element{
    /**
     *
     * @param options x y w items rowRender
     */
    constructor(options){
        super()
        this.w          = options.w===undefined?100:options.w
        this.x          = options.x===undefined?(window.innerWidth-this.w)/2:options.x
        this.y          = options.y===undefined?0:options.y
        this.h          = options.h===undefined?false:options.h
        this.background = options.background===undefined?"#5A5A5A":options.background
        this.dragable   = options.dragable===undefined?true:options.dragable

        if(options.items!==undefined){
            if(options.items instanceof Function){
                this.items = options.items(this)
            }
        }else{
            this.items = options.items
        }
    }

    onDrag(x, y) {
        if(this.dragable){
            let lastItem = this.items[this.items.length-1]
            let firstItem = this.items[0]
            if( (this.h+this.y < lastItem.y+lastItem.h+10 && y<0) //向上滑动仍有空间
                ||(this.y > firstItem.y && y>0)  //向下滑动仍有空间
            ){
                this.items.forEach(function (it) {
                    it.y+=y
                })
            }
        }
    }

    onClick(x, y){
        console.log('click list view', x, y)
        this.items.forEach(function(it){
            let area = it.getArea()

            if(area.startX<x && area.startY<y && area.endX>x && area.endY>y){
                console.log(area)
                it.onClick(x,y)
            }
        })
    }

    render(ctx){
        if(!super.render(ctx)) return
        ctx.fillStyle = this.background
        ctx.fillRect(this.x,this.y,this.w,this.h);
        if(this.h){
            //限高
            ctx.save()
            ctx.rect(this.x,this.y,this.w,this.h);
            ctx.clip()//裁剪这个矩形框
        }
        this.items.forEach(function(item, idx){
            item.render(ctx)
        })
        ctx.restore();

       
        
    }
}