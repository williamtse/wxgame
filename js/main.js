import Music from './runtime/music'
import Rank from './runtime/rank'
import Group from './runtime/group'
import Home from './runtime/home'
import Login from './runtime/login'
import Grids from "./runtime/grids";
import App from "./base/app";
import GameInfo from "./runtime/gameinfo";
import Levels from './runtime/levels'
import Loading from './runtime/loading'
import Config from "./config";
const config = new Config()
/**
 * 游戏主函数
 */
export default class Main extends App {
    constructor(ctx) {
        super(ctx)
        this.userInfo = wx.getStorageSync('userInfo')
        this.loaded = false
    }

    registerPages() {
        this.registerPage("login", new Login(this, this.ctx))
        this.registerPage("home", new Home(this, this.ctx))
        this.registerPage("levels", new Levels(this, this.ctx))
        this.registerPage("grids", new Grids(this, this.ctx, {grids: [0, 0]}))
        this.registerPage("gameinfo", new GameInfo(this, this.ctx))
        this.registerPage("ranks", new Rank(this, this.ctx))
        this.registerPage("group", new Group(this, this.ctx))
    }

    beforeNavigation() {
        if(!wx.getStorageSync('openid')) {
            this.login()
        }else{
            this.openid = wx.getStorageSync('openid')
        }
    }

    login(){
        let that = this
        wx.login({
            success (res) {
                if (res.code) {
                    //发起网络请求
                    wx.request({
                        url: config.get('API_LOGIN'),
                        method:'post',
                        data: {
                            code: res.code,
                            userInfo:wx.getStorageSync('userInfo'),
                            from: 'game'
                        },
                        success:res=>{
                            let data = res.data.data
                            that.isLogined = true
                            that.openid = data.openid
                            wx.setStorageSync('openid', data.openid)
                            wx.setStorageSync('3rd_session', data['3rd_session'])
                        }
                    })
                } else {
                    console.log('登录失败！' + res.errMsg)
                }
            }
        })
    }

    init() {
        super.init()
        this.databus.reset()

        this.registerPages()

        this.music = new Music()
        this.hasEventBind = false

        const loading = new Loading(this, this.ctx)
        this.registerPage("loading", loading)

        if (!wx.getStorageSync('userInfo')) {
            this.navigateTo(undefined, {url: 'login'})
        } else {
            let that = this
            wx.onShow(function (res) {
                console.log(res)
                if (!this.loaded) {
                    console.log('预加载朋友排行榜数据')
                    loading.openDataContext.postMessage({
                        command: 'loading',
                        openid: wx.getStorageSync('openid')
                    })
                    this.loaded = false
                }

                if (res.scene === 1044) {
                    this.shareTicket = res.shareTicket
                    if (this.shareTicket !== undefined && res.query.mode !== undefined && res.query.level !== undefined) {
                        that.navigateTo(undefined,
                            {
                                url: 'group',
                                datas: {shareTicket: this.shareTicket, mode: res.query.mode, level: res.query.level}
                            })
                    }
                }
            })

            this.navigateTo(undefined, {url:'home'})
        }


    }
}
