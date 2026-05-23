import { canvas, c, randomInt, words, player, projectils, shotAudios, score } from "./canvas.js"
import { Projectile } from "./shot.js"
import { getDifficultyMultiplier } from "./difficulty.js"

export let points = 0

// Match letters by physical key position so keyboard layout changes do not affect gameplay.
const keyCodeMap = {
    A: 'KeyA',
    B: 'KeyB',
    C: 'KeyC',
    D: 'KeyD',
    E: 'KeyE',
    F: 'KeyF',
    G: 'KeyG',
    H: 'KeyH',
    I: 'KeyI',
    J: 'KeyJ',
    K: 'KeyK',
    L: 'KeyL',
    M: 'KeyM',
    N: 'KeyN',
    O: 'KeyO',
    P: 'KeyP',
    Q: 'KeyQ',
    R: 'KeyR',
    S: 'KeyS',
    T: 'KeyT',
    U: 'KeyU',
    V: 'KeyV',
    W: 'KeyW',
    X: 'KeyX',
    Y: 'KeyY',
    Z: 'KeyZ',
    '\u0410': 'KeyF',
    '\u0411': 'Comma',
    '\u0412': 'KeyD',
    '\u0413': 'KeyU',
    '\u0414': 'KeyL',
    '\u0415': 'KeyT',
    '\u0401': 'Backquote',
    '\u0416': 'Semicolon',
    '\u0417': 'KeyP',
    '\u0418': 'KeyB',
    '\u0419': 'KeyQ',
    '\u041A': 'KeyR',
    '\u041B': 'KeyK',
    '\u041C': 'KeyV',
    '\u041D': 'KeyY',
    '\u041E': 'KeyJ',
    '\u041F': 'KeyG',
    '\u0420': 'KeyH',
    '\u0421': 'KeyC',
    '\u0422': 'KeyN',
    '\u0423': 'KeyE',
    '\u0424': 'KeyA',
    '\u0425': 'BracketLeft',
    '\u0426': 'KeyW',
    '\u0427': 'KeyX',
    '\u0428': 'KeyI',
    '\u0429': 'KeyO',
    '\u042A': 'BracketRight',
    '\u042B': 'KeyS',
    '\u042C': 'KeyM',
    '\u042D': 'Quote',
    '\u042E': 'Period',
    '\u042F': 'KeyZ'
}

function getPhysicalKeyCode(letter) {
    if (!letter) {
        return null
    }

    return keyCodeMap[letter.toUpperCase()]
}

const meteor = new Image()
meteor.src = './folder/images/spaceMeteors_001.png'

export class Enemy {
    constructor(x, y, word) {
        this.x = canvas.width / 2
        this.y = y
        this.speedMultiplyer = 1
        this.arr = word.split('')

        this.draw = () => {
            c.font = "25px Arial"
            c.fillStyle = 'white'
            c.fillText(this.arr.join(''), this.x + 10, this.y - 15)
            c.drawImage(meteor, this.x - 5, this.y, 20, 20)
            this.update()
        }

        this.update = () => {
            const difficulty = getDifficultyMultiplier(points)
            this.y += 1.35 * this.speedMultiplyer * difficulty
            this.getWord()
        }

        this.removeLetter = (e) => {
            const nextLetter = this.arr[0]
            const expectedCode = getPhysicalKeyCode(nextLetter)
            const matchesPhysicalKey = expectedCode && e.code === expectedCode

            if (matchesPhysicalKey) {
                this.arr.shift()
                projectils.push(new Projectile(this.y, this.speedMultiplyer))
                shotAudios.push(new Audio('./folder/sounds/synth_laser_02.ogg'))
            }

            this.getWord()
        }

        this.getWord = () => {
            if (this.y > canvas.height) {
                player.getHit()
                this.speedMultiplyer = 1
            }

            if (this.arr.length == 0 || this.y > canvas.height) {
                points += 100
                score.innerHTML = points
                this.arr = words[randomInt(0, words.length)].split('')
                this.y = -100
                this.speedMultiplyer += 0.1
            }
        }

        this.turnZero = () => {
            points = 0
            score.innerHTML = points
        }
    }
}
