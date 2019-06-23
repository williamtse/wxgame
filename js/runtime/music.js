let instance

/**
 * 统一的音效管理器
 */
export default class Music {
  constructor() {
    if ( instance )
      return instance

    instance = this

    this.successAudio = new Audio()
    this.successAudio.src  = 'audio/success.mp3'

    this.errorAudio     = new Audio()
    this.errorAudio.src = 'audio/error.wav'

  }

  playSuccess() {
    this.successAudio.currentTime = 0
    this.successAudio.play()
  }

  playError() {
    this.errorAudio.currentTime = 0
    this.errorAudio.play()
  }
}
