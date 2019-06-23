import Pool from './base/pool'

let instance
const screenWidth  = window.innerWidth
const screenHeight = window.innerHeight
/**
 * 全局状态管理器
 */
export default class DataBus {
  constructor() {
    if ( instance )
      return instance

    instance = this
    this.page = 'home'
    this.prevPage = ''
    this.pool = new Pool()
    this.showBackArrow = false
    this.race       = undefined
    this.reset()
    this.oc = 1
  }
  shuffleNumbers(grids){
    let arr = []
    for(let j=0;j<grids[0]*grids[1];j++){
      arr.push(j+1);
    }
    let len = arr.length;
    for(let i = 0; i < len - 1; i++){
      let idx = Math.floor(Math.random() * (len - i));
      let temp = arr[idx];
      arr[idx] = arr[len - i - 1];
      arr[len - i -1] = temp;
    }
    return arr;
  }
  reset() {
    this.top        = 60
    this.numbers    = []
    this.frame      = 0
    this.curNum     = 1
    this.gameStartTime = new Date().getTime()
    this.bullets    = []
    this.enemys     = []
    this.animations = []
    this.gameOver   = false
    this.gameTimeUse = 0
    this.rank       = 0

  }


  /**
   * 回收敌人，进入对象池
   * 此后不进入帧循环
   */
  removeEnemey(enemy) {
    let temp = this.enemys.shift()

    temp.visible = false

    this.pool.recover('enemy', enemy)
  }

  /**
   * 回收子弹，进入对象池
   * 此后不进入帧循环
   */
  removeBullets(bullet) {
    let temp = this.bullets.shift()

    temp.visible = false

    this.pool.recover('bullet', bullet)
  }
}
