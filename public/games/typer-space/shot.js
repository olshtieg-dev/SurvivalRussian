import { canvas, c } from "./canvas.js"
import { projectils, shotAudios } from "./canvas.js"

const shot = new Image()
shot.src = './folder/images/shot01.png'



export class Projectile {
    constructor(endPoint, multiplyer){
        this.x = canvas.width/2 
        this.y = canvas.height-30
        this.endPoint = endPoint+110
        this.endPointChange = 1 * 1

        this.drawProjectil = () => {
            c.drawImage(shot, canvas.width/2, this.y-60, 4, 12)
            this.update()
        }

        this.update = () => {
            if(this.y > this.endPoint){
                this.y -= 20 
            } else {
                projectils.shift()
                shotAudios.shift()
            }
        }
    }
}