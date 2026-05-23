import Player from "./player.js"
import { Enemy } from "./enemy.js"
import { gameLayers } from "./background.js"
import { gameOver } from "./player.js"
import { russianWords } from "./russian-words.js"

export const canvas = document.querySelector('canvas')

canvas.width = 480
canvas.height = 720

export const c = canvas.getContext('2d')

export const words = russianWords

export const player = new Player()
export const enemy = new Enemy(randomInt(0, canvas.width - 100), 0, words[randomInt(0, words.length)])

export const projectils = []
export const shotAudios = []

const bgMusic = new Audio('./folder/sounds/bgmusic.mp3')

const playBtn = new Image()
playBtn.src = './folder/images/icon-play.png'

export let pause = true

canvas.addEventListener('click', () => {
    pause = !pause
})

document.addEventListener('keydown', (e) => {
    if (e.repeat) {
        return
    }

    if (e.code === 'Enter') {
        pause = !pause
        enemy.turnZero()
        player.exitGameOver()
        return
    }

    if (pause || gameOver) {
        return
    }

    enemy.removeLetter(e)
})

export const score = document.querySelector('#score')
export let scoreDiv = document.querySelector('.score-flex')

function game() {
    if (gameOver) {
        scoreDiv.classList.add('gameOver')
        bgMusic.pause()
        gameLayers.forEach((layer) => {
            layer.draw()
        })
    } else if (pause) {
        bgMusic.pause()
        gameLayers.forEach((layer) => {
            layer.draw()
        })
        c.font = '90px Trebuchet MS'
        c.fillStyle = 'white'
        c.textAlign = 'center'
        c.fillText('TYPERS', canvas.width / 2, canvas.height / 2)
        player.draw()
    } else {
        bgMusic.play()

        gameLayers.forEach((layer) => {
            layer.update()
            layer.draw()
        })

        projectils.forEach((projectil) => {
            projectil.drawProjectil()
        })

        enemy.draw()
        player.draw()

        shotAudios.forEach((shot) => {
            shot.play()
        })
    }
}

setInterval(game, 1000 / 60)

export function randomInt(min, max) {
    return Math.floor((Math.random() * max) + min)
}
