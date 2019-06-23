import Page from "../base/page";
import {ListView, FontText, Line, Button, ImageElement} from "../base/ui";

const RANK_BOX_BOTTOM_HEIGHT = 30
const RANK_BOX_HEIGHT = 150

let atlas = new Image()
atlas.src = 'images/Common.png'

export default class GameInfo extends Page{
  constructor(app, ctx, datas){
    super(app, ctx, datas)
    this.showBackArrow = true
    this.btnArea = {}
  }

  init(){
    super.init()
    let that=this
    let RANK_BOX_WIDTH = this.screenWidth*0.8
    const RANK_ITEM_WIDTH = RANK_BOX_WIDTH/3
    let thistime = new ImageElement({
      x:(this.screenWidth-75)/2,
      y:60,
      sx:0,
      sy:0,
      width:75,
      height:15,
      w:75,
      h:15,
      src:'images/thistime.png'
    })

    this.createElement('this time', thistime)

    this.thistime = thistime

    let homeBtn = new ImageElement({
      x:this.screenWidth*0.1+10,
      y:(this.screenHeight-150-30)/2+RANK_BOX_HEIGHT+1+50,
      sx:0,
      sy:0,
      width:39,
      height:39,
      w:39,
      h:39,
      src:'images/home.png'
    })
    homeBtn.onClick=()=>{
      that.app.navigateTo(that, {url:'home'})
    }
    this.createElement('home btn', homeBtn)
    this.homeBtn = homeBtn

    let restartBtn = new ImageElement({
      x:this.screenWidth/2+10,
      y:(this.screenHeight-150-30)/2+RANK_BOX_HEIGHT+1+50,
      sx:0,
      sy:0,
      width:142,
      height:42,
      w:142,
      h:42,
      src:'images/restart.png'
    })
    restartBtn.onClick=()=>{
      that.backEventHandler()
    }
    this.createElement('restart btn', restartBtn)
    this.restartBtn=restartBtn
    let timeuse = this.datas.timeuse
    let dw = "秒"
    if(timeuse>60 && timeuse<3600){
      dw = "分"
      timeuse = (timeuse/60).toFixed(2)
    }
    if(timeuse>3600){
      dw = "小时"
      timeuse = (timeuse/3600).toFixed(2)
    }
    this.createElement('timeuse', new FontText({
      text:timeuse, 
      x:this.screenWidth/2,
      y:120,
      font:"bolder 60",
      color:"#ffffff"
    }))
    this.createElement('dw', new FontText({
      text:dw, 
      x:this.screenWidth/2,
      y:160,
      font:"bolder 30",
      color:"#ffffff"
    }))

    
    //分割线
    this.createElement('line1', new Line({
      x: this.screenWidth*0.1,
      y: (this.screenHeight-150-30)/2+RANK_BOX_HEIGHT,
      ex:this.screenWidth*0.1+RANK_BOX_WIDTH,
      ey:(this.screenHeight-150-30)/2+RANK_BOX_HEIGHT,
      line_color:"#666",
      line_width: 1
    }))
    //排名框底部
    this.createElement('rank_bottom', new Button({
      y:(this.screenHeight-150-30)/2+RANK_BOX_HEIGHT+1,
      x:this.screenWidth*0.1,
      w:RANK_BOX_WIDTH,
      h:30,
      background:"#5A5A5A"
    }))
    //所有排名按钮
    let allranksbtn = new FontText({
      text:"查看所有排名",
      x:RANK_BOX_WIDTH-10, 
      y:(this.screenHeight-150-30)/2+RANK_BOX_HEIGHT+15,
      w:RANK_BOX_WIDTH,
      h:RANK_BOX_BOTTOM_HEIGHT,
      font:"12",
      color:"#dedede"
    })

    allranksbtn.onClick=()=>{
      that.app.navigateTo(that, {url:'ranks',datas:that.datas})
    }
    this.createElement('All rank button',allranksbtn)
  }

  createBackButton(){}

  onShow(){
    //render friend ranks
    this.openDataContext.postMessage({
      scene: 'game over rank',
      openid: this.app.openid,
      mode:this.datas.mode,
      level:this.datas.level
    })
  }
  onRender(){
    this.homeBtn.render(this.ctx)
    this.ctx.drawImage(this.sharedCanvas, this.screenWidth*0.1, (this.screenHeight-150-30)/2,
        this.screenWidth, this.screenHeight)
    
  }

}

