import './base/weapp-adapter'
import App from './base/app.js'
import GameOver from './scenes/gameover.js'
import GameOverRank from './scenes/gameoverrank.js'
import AllRanks from './scenes/allranks.js'
import GroupRanks from './scenes/groupranks.js'
import Loading from "./scenes/loading";
const app = new App()
const sharedCanvas = wx.getSharedCanvas()
const context = sharedCanvas.getContext('2d')
context.scale(window.devicePixelRatio, window.devicePixelRatio)


wx.onMessage(data => {

  if(data.command==='loading'){
    console.log('接收到指令')
    const loading = new Loading(data.openid)
    loading.preload()
  }

  app.init(data)
  app.addScene('game over', new GameOver(data, sharedCanvas, context))
  app.addScene('game over rank', new GameOverRank(data, sharedCanvas, context))
  app.addScene('all ranks', new AllRanks(data, sharedCanvas, context))
  app.addScene('group ranks', new GroupRanks(data, sharedCanvas, context))
  app.changeScene(data.scene)
  app.run()

})


