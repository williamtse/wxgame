import RankList from './ranklist'
import Rank from './rank'

const rank = new Rank()

export default class GroupRanks extends RankList{
	constructor(data, canvas, context){
		super(data, canvas, context)
	}

	getRanks(callback){
		let that = this
		let prefix = this.msg.mode+'_'+this.msg.level
		if(this.msg.scene==='group ranks'){
			wx.getGroupCloudStorage({
				shareTicket: that.msg.shareTicket,
				keyList: ['score', prefix+'_cost_s'],
		        success: res => {
		          let data = res.data
					console.log(data)
		          rank._createRankList(prefix, data, callback)
		        }
			})
		}
	}
}