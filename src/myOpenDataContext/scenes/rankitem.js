/**
 * 排行榜item类
 */
export default class RankItem{
  constructor(options={}){
    this.rankList = options.rankList
    this.img = options.img
    this.x = options.x 
    this.y = options.y 
    this.w = options.w 
    this.h = options.h 
    this.background = options.background //背景颜色
    this.rankColor = options.rankColor //排名颜色
    this.rank = options.rank //排名
    this.nickname = options.nickname //昵称
    this.score = options.score //分数
    this.openid = options.openid //当前用户openid
  }

  getArea(){
    this.area = {
        startX:this.x,startY:this.y,endX:this.x+this.w,endY:this.y+this.h
    }
    return this.area
  }
  render(ctx){
    ctx.fillStyle = this.background
    ctx.fillRect(this.x, this.y, this.w, this.h)

    //排名
    ctx.fillStyle = this.rankColor
    ctx.font    = "bold italic 18px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(this.rank, this.x+this.h/2, this.y+this.h/2)

    //头像
    ctx.drawImage(this.img, 0,0,132,132,this.h+10,(this.h-32)/2+this.y,32,32)

    //昵称
    ctx.fillStyle = '#ffffff'
    ctx.font    = "16px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    ctx.fillText(this.nickname, this.h+10+32+40, this.y+this.h/2)

    //用时
    ctx.fillStyle = '#ffffff'
    ctx.font    = "bold 18px sans-serif"
    ctx.textAlign = "center"
    ctx.textBaseline = "middle"
    let timeuse = this.score
    ctx.fillText(timeuse, this.w*5/6, this.y+this.h/2)
  }

  onClick(){}
}