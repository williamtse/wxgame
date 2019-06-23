import Page from '../base/page'
import {ImageElement, FontText} from "../base/ui";
const ICONS = 'images/icons.png'
const GRID = 'images/grid.png'
const icon = new Image()
icon.src = ICONS
let screenWidth = window.innerWidth
let screenHeight = window.innerHeight
let y1 = screenHeight-100+(100-70)/2
/**
 * 主页
 */
export default class Home extends Page {
  constructor(app, ctx, options) {
    super(app, ctx, options)
    this.top = 0
  }

  onRender(){
    // this.bg.y+=1
  }
  init(){
    super.init()
    let logoW = 121
    let logoH = 26

    
    this.create_background()
    // this.create_rankBtn()
    this.create_fourGridBtn()
    this.create_sixGridBtn()
    this.create_nineGridBtn()
    

    this.createElement('Shu', new FontText({
      text:"数",
      x:screenWidth/4,
      y:100+20+screenWidth*0.4*logoH/logoW,
      font:"bolder 60",
      color:"#ffffff"
    }))
    this.createElement('Du', new FontText({
      text:"独",
      x:screenWidth/4,
      y:200+20+screenWidth*0.4*logoH/logoW+60,
      font:"bolder 60",
      color:"#ffffff"
    }))
    
  }

  create_background(){
    this.createElement('bg', new ImageElement({
      width:303,height:185,x:screenWidth/4,y:screenHeight/2-185/2,
      src:'images/bg.png',w:screenWidth*3/4,h:185*screenWidth*3/(4*303)
    }))

  }

  create_fourGridBtn(){
    let fourGrid = new ImageElement({
      src: GRID,
      sx:0,
      sy:0,
      width:52,
      height:52,
      x:screenWidth/4+10,
      y:y1,
      w:46,
      h:46
    })
    let that = this
    fourGrid.onClick=()=>{
      that.app.navigateTo(that, {url:'levels', datas:{mode:'4x4', title:'四宫格'}})
    }
    this.createElement('four grid', fourGrid)
    this.createElement('rank text', new FontText({
      text:'4宫格', color:'#ffffff',font:'bold 13',
      x:fourGrid.x+23, y:y1+46+15
    }))
  }

  create_sixGridBtn(){
    let grid = new ImageElement({
      src: GRID,
      sx:0,
      sy:0,
      width:52,
      height:52,
      x:screenWidth/2+10,
      y:y1,
      w:46,
      h:46
    })
    let that = this
    grid.onClick=()=>{
      that.app.navigateTo(that, {url:'levels', datas:{mode:'6x6', title:'六宫格'}})
    }

    this.createElement('six grid', grid)
    this.createElement('rank text 6', new FontText({
      text:'6宫格', color:'#ffffff',font:'bold 13',
      x:grid.x+23, y:y1+46+15
    }))
  }

  create_nineGridBtn(){
    let that = this
    let grid = new ImageElement({
      src: GRID,
      sx:0,
      sy:0,
      width:52,
      height:52,
      x:screenWidth*3/4+10,
      y:y1,
      w:46,
      h:46
    })
    grid.onClick=()=>{
      that.app.navigateTo(that, {url:'levels', datas:{mode:'9x9', title:'九宫格'}})
    }
    this.createElement('9 grid', grid)
    this.createElement('rank text 9', new FontText({
      text:'9宫格', color:'#ffffff',font:'bold 13',
      x:grid.x+23, y:y1+46+15
    }))
  }

  Touch_BTN_train(){
    this.app.navigateTo({url:"levels", datas:{mode:'train'}})
  }

  Touch_BTN_race(){
    let that = this
    this._getRace(function(race){
      if(race){
        that.app.databus.race = race
        that.app.navigateTo({url:"levels", datas:{mode:'race'}})
      }else{
        wx.showModal({
          title:'提示',
          content:'当前暂无赛事',
          showCancel:false
        })
      }
    })
  }



  // Touch_BTN_rank(){
  //   this.app.navigateTo({url:"rank", datas:{mode:'train'}})
  // }

  onRender(ctx) {
  }

  
  _getRace(callback){
    let that = this
    this.request.get('race', function(res){
      if(res.code===0){
        callback(res.data.race)
      }
    })
  }
}
