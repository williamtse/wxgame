/**
 * APP
 */

export default class App{
	constructor(){
		this.start = false
		this.aniId    = 0
		this.scenes = []
	}

	/**
	 * 初始化
	 * @param msg
	 */
	init(msg){
		this.msg = msg
		this.scene = msg.scene
		this.openid = msg.openid
	}

	/**
	 * 循环
	 */
	loop(){
		this.render()
        this.aniId = requestAnimationFrame(
            this.bindLoop,
            sharedCanvas
        )
	}

	/**
	 * 添加注册场景
	 * @param name
	 * @param scene
	 */
	addScene(name, scene){
		let is_exists = false
		scene.scene = name
		this.scenes.forEach(s=>{
			if(s.name===name){
				is_exists = true
			}
		})
		if(!is_exists){
			this.scenes.push({name:name, scene:scene})
		}
	}

	/**
	 * 切换场景
	 * @param scene
	 */
	changeScene(scene){
		this.scene = scene
		let that = this
		this.scenes.forEach(s=>{
			if(s.name===scene){
				console.log('init scene '+s.name+' ...')
				s.scene.msg = that.msg
				s.scene.app = that
				s.scene.init()
				s.scene.inited=true
				s.scene.show=true
			}
		})
	}

	/**
	 * 运行
	 */
	run(){
		if(!this.start){
			this.start = true
			this.bindLoop     = this.loop.bind(this)
	        this.aniId = requestAnimationFrame(
	            this.bindLoop,
	            sharedCanvas
	        )
		}
		// this.render()
	}

	/**
	 * 渲染当前场景
	 */
	render(){
		for(let i=0;i<this.scenes.length;i++){
			let scene = this.scenes[i]
			if(scene.name===this.scene){
				scene.scene.show = true
				if(!scene.scene.inited){
					scene.scene.init()
					scene.scene.inited = true
				}
				scene.scene.render()
			}else{
				scene.scene.show = false
			}
		}
	}

	
}