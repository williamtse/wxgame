import Page from '../base/page'
const IMG_SRC   = 'images/login.png'
const USER_INFO = wx.getStorageSync('userInfo')
const ICONS = 'images/icons.png'
const icon = new Image()
icon.src = ICONS
/**
 * 主页
 */
export default class Login extends Page {
	constructor(app, ctx, options) {
		super(app, ctx, options)
		this.top = 0
	}

  	init(){
		super.init()  		
	}

	onShow(){
		console.log('start login')
  		let that = this
  		console.log(that.app.isLogined)
    	wx.login({
		  success (res) {
		    if (res.code) {
		      //发起网络请求
				console.log(res.code)
				var button = wx.createUserInfoButton({
					type:'image',
					image:'images/login.png',
					style:{
						left: wx.getSystemInfoSync().windowWidth/2-184/2,
						bottom: wx.getSystemInfoSync().windowHeight/2,
						width: 184,
						height: 64
					}

				})
		      	button.onTap((res) => {
		      		if(res.errMsg=="getUserInfo:ok"){
		      			console.log(res)
		      			wx.setStorageSync('userInfo', res.userInfo)
		      			that.app.isLogined = true
		      			button.destroy()
		      			that.app.navigateTo(undefined, {url:'home'})
		      		}else{
		      			wx.showModal({
		      				content:"需要登陆才能继续游戏！"
		      			})
		      		}
		      	})
		    } else {
		      console.log('登录失败！' + res.errMsg)
		    }
		  }
		})
	}
}