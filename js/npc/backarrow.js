import Sprite   from '../base/sprite'

const BG_IMG_SRC = 'images/back.png'
const BG_WITH = 43
const BG_HEIGHT = 44

export default class BackArrow extends Sprite {
	constructor() {
    	super(BG_IMG_SRC, BG_WITH, BG_HEIGHT)
		this.backArea = {}
	}


	drawToCanvas(ctx) {
		let w = 42
		this.backArea={
			startX : 20,
			startY : window.innerHeight - 30 -w,
			endX   : 20+w,
			endY   : window.innerHeight - 30
		}

		ctx.drawImage(
			this.img,
			0,
			0,
			BG_WITH,
			BG_HEIGHT,
			this.backArea.startX,
			this.backArea.startY,
			w,
			w)

  	}
}