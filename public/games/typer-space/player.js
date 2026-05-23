import { canvas, c, score, scoreDiv } from "./canvas.js"
import { points } from "./enemy.js"

const player = new Image()

export var gameOver = false

player.src = './folder/images/ship_1.png'
export default class Player {
    constructor(x = canvas.width/2-24, y = canvas.height-68){
        this.x = x,
        this.y = y,
        this.health = 10

        
        this.draw = () => {
            c.drawImage(player, this.x, this.y, 50, 50)
        }

        this.update = () => {
            c.clearRect(0, 0, 600, 600)
            this.draw()
        }
        
        this.life = () => {
            c.beginPath()
            c.fillStyle = '#43d364'
            c.fillRect(0, canvas.height-15, this.health*50, 15)
        }


        this.getHit = () => {
            score.innerHTML = points
            gameOver = true
        }
        this.exitGameOver = () => {
            gameOver = false
            scoreDiv.classList.remove('gameOver')
        }


        // document.addEventListener('keydown', (e) => {
        //     switch(e.code){
        //         case 'KeyA':
        //             this.moveL = true
        //             break
        //         case 'KeyD':
        //             this.moveR = true
        //             break
        //         case 'Space':
        //             console.log('shot')
        //             break
        //     }
        // })

        // document.addEventListener('keyup', (e) => {
        //     switch(e.code){
        //         case 'KeyA':
        //             this.moveL = false
        //             break
        //         case 'KeyD':
        //             this.moveR = false
        //             break
        //     }
        // })

        // this.move = () => {
        //     if(this.moveR && this.x+40 < canvas.width){
        //         this.x += 7
        //     }
        //     if(this.moveL && this.x > 0){
        //         this.x -= 7
        //     }
        // }
        
    }
}
