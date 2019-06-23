/**
 * 小游戏配置文件
 *
 */
const configs = {
    //分享标题
    SHARE_TITLE         : 'WXGAME-微信小游戏开发框架',
    //分享图片
    SHARE_IMAGE         : 'images/share.jpg',
    //群分享标题
    GROUP_SHARE_TITLE   : 'WXGAME-微信小游戏开发框架',
    //群分享图片
    GROUP_SHARE_IMAGE   : 'images/share.jpg',
    //API接口
    API_LOGIN           : 'https://naojinling.dotadytt.com/api/wxlogin' //登陆接口
}






export default class Config {
    get(key){
        return configs[key]
    }
}