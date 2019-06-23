import RankList from './ranklist'
import Rank from './rank'

const rank = new Rank()

export default class AllRanks extends RankList{
	constructor(data, canvas, context){
		super(data, canvas, context)
	}

	getRanks(callback){
		let mode = this.msg.mode
		let level = this.msg.level
		rank.getAllRanks(mode, level, callback)
	}
}