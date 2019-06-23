/**
 * 场景基类
 */
export default class Scene{
	constructor(msg, canvas, context){
		this.sprites = []
		this.msg = msg
		this.canvas = canvas
		this.context = context
		this.inited = false
		this.screenWidth = window.innerWidth
		this.screenHeight = window.innerHeight
	}

	/**
	 * 渲染
	 */
	render(){
		if(!this.show)
			return
		this.context.clearRect(0,0,this.canvas.width,this.canvas.height)
		this.context.fillStyle = '#5A5A5A'
		let that = this
		that.sprites.forEach(function(sprite){
			sprite.sprite.render(that.context)
		})

		this.onRender()
	}

	/**
	 * 渲染时的业务逻辑
	 */
	onRender(){}

	/**
	 * 创建场景中的精灵
	 * @param name
	 * @param sprite
	 */
	createSprite(name, sprite){
		this.sprites.push({name:name, sprite:sprite})
	}
}