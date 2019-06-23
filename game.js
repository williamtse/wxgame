import './js/libs/weapp-adapter'
import './js/libs/symbol'
import Main from './js/main'
canvas.width = canvas.width * window.devicePixelRatio
canvas.height = canvas.height * window.devicePixelRatio
console.log(canvas.width,canvas.height)
const ctx = canvas.getContext('2d') // 创建一个 2d context.getContext('2d')
ctx.scale(window.devicePixelRatio, window.devicePixelRatio)
new Main(ctx)
