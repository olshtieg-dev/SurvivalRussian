import { canvas, c, score } from "./canvas.js"
import { getDifficultyMultiplier } from "./difficulty.js"

const backgroundLayer0 = new Image()
backgroundLayer0.src = './folder/images/background0.png'
const backgroundLayer1 = new Image()
backgroundLayer1.src = './folder/images/background1.png'
const backgroundLayer2 = new Image()
backgroundLayer2.src = './folder/images/background2.png'
const backgroundLayer3 = new Image()
backgroundLayer3.src = './folder/images/background3.png'
const backgroundLayer4 = new Image()
backgroundLayer4.src = './folder/images/background4.png'

class Layer {
    constructor(image, speedModifier){
        this.x = 0
        this.y = canvas.height
        this.width = 480
        this.height = -1440
        this.x2 = this.width
        this.image = image
        this.speedModifier = speedModifier
        this.speedModifier = 1 * speedModifier

    }
    update(){
        this.speed = 1 * this.speedModifier
        const difficulty = getDifficultyMultiplier(score.innerHTML)
        if(this.y >= canvas.height-(this.height)){
            this.y = canvas.height
        }
        // this.y = Math.floor(this.y - this.speed)
        this.y += 1 * this.speedModifier * difficulty
    }
    draw(){
        c.drawImage(this.image, this.x, this.y, this.width, this.height)
        c.drawImage(this.image, this.x, this.y-1440, this.width, this.height)
    }
}

const layer0 = new Layer(backgroundLayer0, 0.2)
const layer1 = new Layer(backgroundLayer1, 0.4)
const layer2 = new Layer(backgroundLayer2, 0.6)
const layer3 = new Layer(backgroundLayer3, 0.8)
const layer4 = new Layer(backgroundLayer4, 1)


export const gameLayers = [layer0, layer1, layer2, layer3, layer4]
