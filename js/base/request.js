/**
 * 带3rd_session的安全请求
 */
export default class Request {
	constructor(){
		this.base = 'https://naojinling.dotadytt.com/api/'
		this.data = {from:'game'}
	}
	request(api, method='GET', data={}, success=undefined, error=undefined){
		let sessionkey = wx.getStorageSync('3rd_session')
		wx.request({
			url: this.base+api+'?3rd_session='+sessionkey,
			method:method,
			data:Object.assign(this.data, data),
			success:function(res) {
				success(res.data)
			},
			error:function(e){
				error(e)
			}
		})
	}
	login(code, userInfo, success){
		userInfo['code'] = code
		wx.request({
			url: this.base+'wxlogin',
			method:'POST',
			data:Object.assign(this.data, userInfo),
			success:function(res) {
				success(res.data)
			},
			error:function(e){
				error(e)
			}
		})
	}
	get(api, success, data={}){
		this.request(api, 'GET',data,success)
	}

	post(api,data={},success){
		this.request(api, 'POST', data, success)
	}
}