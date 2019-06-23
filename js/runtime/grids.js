import Page from "../base/page";
import {Button, FontText, ImageElement} from "../base/ui";
import Music from "./music";
import NumberGridOriginal from '../base/number'
const music = new Music()
const numberGridOriginal = new NumberGridOriginal()

const screenWidth  = window.innerWidth
const TOOL_ITEM_WIDTH = 26
const WRONG_COLOR = "red", NPC_COLOR="#dedede", INPUT_COLOR='green', 
EMPTY_COLOR='#ffffff',HINT_COLOR='yellow',NUMBER_COLOR='orange'
let padding=5,top=80,border=1,gap=1
const shuffle = (arr) => {
    for (let i = 0; i < arr.length; i++) {
        const randomIndex = Math.round(Math.random() * (arr.length - 1 - i)) + i;
        [arr[i], arr[randomIndex]] = [arr[randomIndex], arr[i]]
    }
    return arr
}


export default class Grids extends Page{
    constructor(app, ctx,options){
        super(app, ctx,options)
        this.timeuse = 0
        this.music = new Music()
        this.showBackArrow = true
        this.grids=[0,0]
        this.operations = []
    }

    init(){
        super.init()
        
        this.grids = this.datas.grids
        this.colStep = this.datas.colStep //每个宫中有几列
        this.rowStep = this.datas.rowStep //每个宫中有几行
        this.colGrids = this.datas.colGrids //一共几个列宫
        this.rowGrids = this.datas.rowGrids //一个几个横宫
        this.score = 1
        this.correct = true
        this.mode = this.datas.mode

        this.createTitle(this.datas.levelTitle).render(this.ctx)

        this.create_timecount()
        
        this.create_background()

        this.create_toolBar()

        this.create_inputButtons()

        
        this.numberGenerate(this.grids)
    }

    create_timecount(){
        this.ctx.clearRect(screenWidth*0.9-70,50,60,20)
        let scoreText = new FontText({
            text: '开始计时',
            x:screenWidth*0.9-40,
            y:60,
            color:"#ffffff",
            font:"12"
        })

        scoreText.onUpdate=()=>{
            let now = new Date().getTime()
            let timeuse = parseInt((now-this.app.databus.gameStartTime)/1000)
            let s = timeuse%60
            let h = parseInt(timeuse/3600)
            let m = parseInt((timeuse - h*3600)/60)
            if(h>0){
                if(h<10) h='0'+h+':'
            }else{
                h=''
            }
            if(m<10){
                m = '0'+m
            }
            if(s<10) { s='0'+s }
            scoreText.text = h+m+':'+s
        }
        this.createElement('time count', scoreText)
    }

    create_background(){
        this.ctx.clearRect(padding,top,screenWidth-2*padding,screenWidth-2*padding)
        this.createElement('bg', new Button({
            text:'', 
            x:padding, 
            y:top,
            w:screenWidth-2*padding,
            h:screenWidth-2*padding,
            background:'#666'
        }))
    }

    //底部工具栏
    create_toolBar(){
        //撤销
        this.create_undoButton()
        //清除
        this.create_clearButton()
        //标记
        this.create_markButton()
    }

    create_clearButton(){
        let btn = new ImageElement({
            width:72,src:'images/clear.png',
            height:69,x:this.screenWidth/2-TOOL_ITEM_WIDTH/2,
            sx:0,sy:0,y:top+screenWidth-padding+10,w:TOOL_ITEM_WIDTH,h:TOOL_ITEM_WIDTH
        })
        btn.onClick=()=>{
            this.Click_clearBtn()
        }
        this.createElement('btn clear', btn)
        this.createElement('btn clear text', new FontText({
            text:'清除',x:(TOOL_ITEM_WIDTH)/2+btn.x,y:btn.y+TOOL_ITEM_WIDTH+10,font:"15",color:"#ffffff"
        }))
    }

    Click_clearBtn(){
        if(this.waitInput!==undefined){
            this.waitInput.text = ''
            this.backgroundRecover()
        }
        this.reDrawGrids()
    }

    create_undoButton(){
        let btn = new ImageElement({
            width:80,src:'images/undo.png',
            height:84,x:this.screenWidth*0.1,
            sx:0,sy:0,y:top+screenWidth-padding+10,w:TOOL_ITEM_WIDTH,h:TOOL_ITEM_WIDTH
        })
        btn.onClick=()=>{
            this.Click_undoBtn()
        }
        this.createElement('btn undo', btn)
        this.createElement('btn undo text', new FontText({
            text:'撤销',x:(TOOL_ITEM_WIDTH-5)/2+btn.x,y:btn.y+TOOL_ITEM_WIDTH+10,font:"15",color:"#ffffff"
        }))
    }

    backgroundRecover(){
        this.numbers.forEach(function(n,idx){
            if(n.background===WRONG_COLOR || n.background===HINT_COLOR){
                n.background=n.canInput?EMPTY_COLOR:NPC_COLOR
                n.fontColor = NUMBER_COLOR
            }
        })
    }

    Click_undoBtn(){
        if(this.operations.length>0){
            let lastOp = this.operations.pop()
            lastOp.text = ''
            this.backgroundRecover()
        }
        this.reDrawGrids()
    }

    create_markButton(){
        let btn = new ImageElement({
            width:59,src:'images/mark.png',
            height:59,x:this.screenWidth*0.8,
            sx:0,sy:0,y:top+screenWidth-padding+10,w:TOOL_ITEM_WIDTH,h:TOOL_ITEM_WIDTH
        })
        btn.onClick=()=>{
            this.Click_markBtn()
        }
        this.createElement('btn mark', btn)
        this.createElement('btn mark text', new FontText({
            text:'标记',x:(TOOL_ITEM_WIDTH)/2+btn.x,y:btn.y+TOOL_ITEM_WIDTH+10,font:"15",color:"#ffffff"
        }))
    }

    Click_markBtn(){
        if(this.waitInput!==undefined){
            if(!this.waitInput.marked)
                this.createFlag(this.waitInput)
            else{
                this.removeElement('flag_'+this.waitInput.x+'_'+this.waitInput.y)
            }
        }
        this.reDrawGrids()
    }

    createFlag(numberGrid){
        let flag = new ImageElement({
            src:'images/flag.png',
            width:134,height:232,x:numberGrid.x+TOOL_ITEM_WIDTH-10,y:numberGrid.y+4,w:7,h:232*7/134
        })
        this.createElement('flag_'+numberGrid.x+'_'+numberGrid.y, flag)
        numberGrid.marked = true
        numberGrid.flag = flag
        this.reDrawGrids()
    }

    errorEventHandler(n){
        music.playError()
        n.background=WRONG_COLOR
        n.fontColor=EMPTY_COLOR
        this.correct = false
        this.reDrawGrids()
    }

    rightEventHandler(b){
        let over = true
        this.waitInput.text = b.text
        this.numbers.forEach(function(n,idx){
            if(n.text==""){
                over=false
            }
        })
        if(over){
            this.app.databus.gameTimeUse = (((new Date().getTime())-this.gameStartTime)/1000).toFixed(2)
        }else{
            //进入操作栈
            // this.waitInput.background = EMPTY_COLOR
            this.operations.push(this.waitInput)
        }

        this.gameOver = over
        this.reDrawGrids()
    }

    isNumberWrong(n,b,idx){
        let c = this.waitInput.c
        let r = this.waitInput.r
        //判断当前格子的位置
        let ggc = Math.floor(c/this.colStep)
        let ggr = Math.floor(r/this.rowStep)
        let startC = ggc*this.colStep, endC = startC+this.colStep-1
        let startR = ggr*this.rowStep, endR = startR+this.rowStep-1
        let cc = n.c
        let cr = n.r
        
        if( n.text==b.text 
                && (cc==c || cr==r || 
                (cc>=startC && cc<=endC
                    && cr>=startR && cr<=endR))){
            return true
        }else{
            return false
        }

    }

    Click_inputButton(b){
        let that = this
        if(that.waitInput && b.text!==this.waitInput.text){
            this.backgroundRecover()
            let correct = true
            that.numbers.forEach(function(n,idx){
                if(that.isNumberWrong(n,b,idx)){
                    that.errorEventHandler(n)
                    correct = false
                }
            })
            if(correct){
                this.rightEventHandler(b)
            }
        }
    }

    //底部选择填入数字按钮
    create_inputButtons(){
        for(let i=0;i<this.datas.grids[0];i++){
            let w = (this.screenWidth-20)/this.grids[0]
            let b = new Button({
                x:7+(w+1)*i,
                y:top+screenWidth-padding+80,
                text:i+1,
                w:w,
                h:w,
                font:w*0.9,
                fontColor:NUMBER_COLOR
            })
            b.onClick=()=>{
                this.Click_inputButton(b)
            }
            this.createElement('b'+i,b)
        }
    }

    restart(){
        this.app.databus.reset()
        // this.numberGenerate(this.grids)
        this.gameStartTime = new Date().getTime()
    }

    onShow(){
        this.restart()
    }

    onRender(ctx) {
        // 游戏结束停止帧循环
        if ( this.gameOver ) {
            this._gameOverEventHandler()
            this.app.navigateTo(this, {
                url:'gameinfo',
                datas: {
                    timeuse:this.app.databus.gameTimeUse,
                    score:this.score,
                    mode: this.datas.mode,
                    level:this.datas.level
                }
            })
        }else{
            let now = new Date().getTime()
            this.timeuse = ((now-this.app.databus.gameStartTime)/1000).toFixed(2)
        }
    }


    _gameOverEventHandler(){
        let openDataContext = wx.getOpenDataContext()
        openDataContext.postMessage({
            openid: this.app.openid,
            scene: 'game over',
            score: this.score,
            timeuse: this.app.databus.gameTimeUse,
            level: this.datas.level,
            mode: this.datas.mode
        })
    }
    
    switchNumbers(numbers){
        let colSwitchTime, rowSwitchTime,randomTimesC,randomTimesR
        let level = this.datas.level+1
        this.numberShowCount = this.datas.numberShows
        colSwitchTime=level*this.colStep*2
        rowSwitchTime=level*this.rowStep*2
        this.score = level*this.grids[0]
        
        const rand = (step) =>{ return Math.floor((10*Math.random()))%step}
        //交换列
        for(let i=0;i<colSwitchTime;i++){
            let cs = rand(this.colGrids)*this.colStep //随机宫
            let ca = rand(this.colStep) //随机宫内的列
            let c1 = cs+ca  //随机到的列
            let c2 = ca<this.colStep-1?c1+1:c1-1
            numbers.forEach(function(row){
                let tmp = row[c2]
                row[c2]=row[c1]
                row[c1]=tmp
            })
        }

        //交换行
        for(let i=0;i<rowSwitchTime;i++){
            let rs = rand(this.rowGrids)*this.rowStep
            let ra = rand(this.rowStep)
            let r1 = rs+ra
            let r2 = ra<this.rowStep-1?r1+1:r1-1
            let rt = numbers[r1]
            numbers[r1]=numbers[r2]
            numbers[r2]=rt
        }
    }
    getNumbers(mode){
        let numbers = []
        switch(mode){
            case '4x4':
            numbers = numberGridOriginal.four()
            break;
            case '6x6':
            numbers = numberGridOriginal.six()
            break;
            case '9x9':
            numbers = numberGridOriginal.nine()
            break;
        }
        this.switchNumbers(numbers)
        return numbers
    }

    onUpdate(){

    }

    reDrawGrids(){
        this.render(this.ctx)
    }

    numberGenerate(grids) {
        this.numbers = []
        this.operations = []
        this.gameOver = false
        let max = this.grids[0]*this.grids[1]
        let cols=this.grids[0],rows=this.grids[1],padding=5,top=80,border=1,gap=1
        let gridWidth  = (screenWidth-2*padding-(this.colGrids*this.colStep+1)*border-(this.colGrids+1)*gap)/cols
        let font = gridWidth*0.9
        let numbers = this.getNumbers(this.datas.mode)
        let that = this
        for(let row=0;row<numbers.length;row++){
            for(let col=0;col<numbers[row].length;col++){
                let number=numbers[row][col]
                let x = padding+gap+border+(col)*(gridWidth+border)+Math.floor((col)/this.colStep)*gap
                let y = top+gap+border+(row)*(gridWidth+border)+Math.floor((row)/this.rowStep)*gap
                let numberGrid = new Button({
                    name:'grid button '+number,
                    text:number,
                    x:x,
                    y:y,
                    w:gridWidth,
                    h:gridWidth,
                    font:font,
                    radius:0,
                    background:NPC_COLOR,
                    fontColor:NUMBER_COLOR
                })
                numberGrid.c = col 
                numberGrid.r = row
                numberGrid.onClick =()=>{
                    this.Click_number(numberGrid)
                }

                this.numbers.push(numberGrid)
            }
        }
        this.answer = this.numbers
        if(this.numbers.length>0){
            this.hideNumbers()
            this.createElement('Grid Numbers', this.numbers)
        }
    }

    hideNumbers(){
        let keys = []
        let max = this.grids[0]*this.grids[1]
        for(let i=0;i<max;i++) keys.push(i)
        keys = shuffle(keys)
        for(let i=0;i<max-this.numberShowCount;i++){
            this.numbers[keys[i]].text = ''
            this.numbers[keys[i]].canInput = true
            this.numbers[keys[i]].background=EMPTY_COLOR
        }
    }

    Click_number(numberGrid){
        let curNum = numberGrid.text
        this.numbers.forEach(function(n){
            if(parseInt(n.text)==curNum && n.background!==HINT_COLOR){
                n.background=HINT_COLOR
            }else if(!n.canInput){
                n.background=NPC_COLOR
                n.fontColor=NUMBER_COLOR
            }else{
                n.background=EMPTY_COLOR
                n.fontColor=NUMBER_COLOR
            }
        })
        if(numberGrid.canInput){
            numberGrid.fontColor = EMPTY_COLOR
            numberGrid.background = INPUT_COLOR
            this.waitInput = numberGrid
        }
        this.reDrawGrids()
    }

}