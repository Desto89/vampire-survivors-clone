let canvas = document.getElementById("canvas") 
var ctx = document.getElementById("canvas").getContext("2d");
ctx.canvas.width  = window.innerWidth / 2;
ctx.canvas.height = window.innerHeight - 5;

let image = new Image();
image.src = "images/bg.jpg";

//player images

let missleImg = new Image();
missleImg.src = "images/player/missle.png";


let move1left = new Image();
move1left.src = "images/player/walk_1_left.png";
let move1right = new Image();
move1right.src = "images/player/walk_1_right.png";
let move2left = new Image();
move2left.src = "images/player/walk_2_left.png";
let move2right = new Image();
move2right.src = "images/player/walk_2_right.png";
let move3left = new Image();
move3left.src = "images/player/walk_3_left.png";
let move3right = new Image();
move3right.src = "images/player/walk_3_right.png";
let move4left = new Image();
move4left.src = "images/player/walk_4_left.png";
let move4right = new Image();
move4right.src = "images/player/walk_4_right.png";

let enemy1left = new Image();
enemy1left.src = "images/enemy/dwarf1left.png";
let enemy1right = new Image();
enemy1right.src = "images/enemy/dwarf1right.png";
let enemy2left = new Image();
enemy2left.src = "images/enemy/dwarf2left.png";
let enemy2right = new Image();
enemy2right.src = "images/enemy/dwarf2right.png";

let tenAll = new Image();
tenAll.src = "images/skills/10all.png"


class Player {
    constructor() {
        this.level = 1
        this.attack = 20
        this.health = 5
        this.ms = 3
        this.fireRate = 70
        this.skillpoints = 0
        this.gameplayUpgrades = []
        this.tenAllNumber = 0
    }

    availableUpgrades = [
        {
            id: 0,
            name: 'Attack Up + 5',
            function: () => {
                if (!this.gameplayUpgrades.includes("piercingShots")) {
                    this.attack += 5
                } else {
                    this.attack += 0.5
                }
                document.getElementById("attack").textContent = `Attack: ${this.attack}`
                resetGenerated()
            }
        },
        {
            id: 1,
            name: 'Movement Speed Up + 1',
            function: () => {
                this.ms += 1
                document.getElementById("ms").textContent = `Movement: ${this.ms}`
                resetGenerated()
            }
        },{
            id: 2,
            name: 'Fire Rate - 10',
            function: () => {
                if (this.fireRate > 10) {
                    this.fireRate -= 10
                }
                document.getElementById("firerate").textContent = `Fire Rate: ${this.fireRate}`
                resetGenerated()
            }
        },
        {
            id: 3,
            name: "Piercing Shots but -80% Damage",
            function: () => {
                this.gameplayUpgrades.push("piercingShots")
                resetGenerated()
                this.attack = this.attack * 0.2
                document.getElementById("attack").textContent = `Attack: ${this.attack}`
                this.availableUpgrades.splice(3, 1)
            }
        },
        {
            id: 4,
            name:"Deal 5 Damage to ALL enemies every 5 seconds",
            function: () => {
                this.tenAllNumber += 1
                this.gameplayUpgrades.push("10all")
                resetGenerated()
            }
        }

    ]
}

setInterval(()=>{
    enemies.map((enemy, i) => {
        enemy.health -= newPlayer.tenAllNumber * 5
        if (enemy.health <= 0) {
            kills += 1
            document.getElementById("killCount").textContent = `${kills}/${killsForLevelUp}`
            enemies.splice(i,1)
        }
    })
    
    if (newPlayer.tenAllNumber > 0) {
        tenAllDelay = true
        let zap = new Audio;
        zap.src = 'sounds/zap.mp3'
        zap.volume = 0.1
        zap.play()
    }
    
}, 5000)

let tenAllDelay = false
let tenAllCounter = 0



let newPlayer = new Player()

let music = new Audio;
music.src = 'sounds/music.mp3'
music.volume = 0.2



window.requestAnimationFrame(gameLoop)


function generateRandom(min = 0, max = canvas.width) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor( rand * difference);
    rand = rand + min;
    return rand;
}

function generateRandomSkill(min = 0, max = newPlayer.availableUpgrades.length) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor( rand * difference);
    rand = rand + min;
    return rand;
}

function randomPushback(min = -3, max = 3) {
    let difference = max - min;
    let rand = Math.random();
    rand = Math.floor( rand * difference);
    rand = rand + min;
    return rand;
}

function findDistance(missleX, missleY, enemyX, enemyY) {
    let y = missleY - enemyY
    let x = missleX - enemyX

    let distance = Math.sqrt((x * x) + (y * y))
    return distance
}

function findDiff(missleP, enemyP, distance) {
    let difference = (enemyP - missleP) / distance
    return difference
}

let keys = []

function moveLeft() {
    playerPos.x -= newPlayer.ms
}

function moveRight() {
    playerPos.x += newPlayer.ms
}

function moveUp() {
    playerPos.y -= newPlayer.ms
}

function moveDown() {
    playerPos.y += newPlayer.ms
}

document.addEventListener("keydown", (event)=>{
    music.play()
    if (event.keyCode === 65 && !keys.includes(event.keyCode)) {
            keys.push(event.keyCode)
            playerLeft = true
    } else   if (event.keyCode === 68 && !keys.includes(event.keyCode)) {
            keys.push(event.keyCode)
            playerLeft = false
    } else if (event.keyCode === 87 && !keys.includes(event.keyCode)) {
            keys.push(event.keyCode)
    } else if (event.keyCode === 83 && !keys.includes(event.keyCode)) {
            keys.push(event.keyCode)
    }
    })


document.addEventListener("keyup", (event)=>{
    if (event.keyCode === 65) {
        keys.splice(keys.indexOf(event.keyCode), 1)
    } else   if (event.keyCode === 68) {
        keys.splice(keys.indexOf(event.keyCode), 1)
    } else if (event.keyCode === 87) {
        keys.splice(keys.indexOf(event.keyCode), 1)
    } else if (event.keyCode === 83) {
        keys.splice(keys.indexOf(event.keyCode), 1)
    }
})

let playerPos = {
    x: canvas.width / 2,
    y: canvas.height / 2
}

let missles = []
let missleDelay = 0
let enemyDelay = 0

class Enemy {
    constructor(x,y, health) {
        if (x < canvas.width / 2) {
            this.x = x - 700
        } else (
            this.x = x + 700
        )
    this.health = health 
    this.y = y
    this.spriteDelay = enemySpriteDelay
    }
}

let enemies = []

let playerLeft = false
let playerSpriteDelay = 0
let isPlayerInvincible = false
let isPlayerInvincibleTimer = 0
let isPlayerInvincibleConst = 100

let enemySpriteDelay = 0

//time

let minutes = 2
let seconds = 59

setInterval(() => {
    seconds -= 1
    if (seconds < 0) {
        seconds = 59
        minutes -= 1
    }
}, 1000)

let kills = 0
let killsForLevelUp = 2 * newPlayer.level
let isChoosingUpgrade = false


function resetGenerated() {
    for (let i = 0; i < 3; i++) {
        document.getElementsByClassName("upgradeSelect")[0].removeChild(document.getElementsByClassName("upgradeSelect")[0].lastChild)
    }
    isChoosingUpgrade = false
    newPlayer.skillpoints -= 1
}

let playing = true

function gameLoop() {
    //refresh frame
    ctx.clearRect(0, 0, canvas.width, canvas.height)
    
    
 console.log(tenAllCounter)
    ctx.drawImage(image, 0, 0, canvas.width, canvas.height)

    if (newPlayer.tenAllNumber > 0 && tenAllDelay) {
        ctx.drawImage(tenAll, -300, -300, canvas.width * 2, canvas.height * 2)
        tenAllCounter += 1
        if (tenAllCounter === 100) {
            tenAllCounter = 0
            tenAllDelay = false
        }
    }

    ctx.fillStyle = "red";
    ctx.textAlign = "center";
    ctx.font = "50px Comic Sans MS";
    if (seconds < 10) {
        ctx.fillText(`${minutes}:0${seconds}`, canvas.width /2 , 50);
    } else  {
        ctx.fillText(`${minutes}:${seconds}`, canvas.width /2 , 50);
    }
    
    //spawn player
    if (playerPos.x > canvas.width - 50) {
        playerPos.x = canvas.width - 50
    } else if (playerPos.x < 0) {
        playerPos.x = 0
    } else if (playerPos.y > canvas.height - 50) {
        playerPos.y = canvas.height - 50
    } else if (playerPos.y < 0) {
        playerPos.y = 0
    }
    
    if (playerLeft === true) {
        if (playerSpriteDelay <= 10) {
            ctx.drawImage(move1left,playerPos.x, playerPos.y, 70, 70);
        } else if (playerSpriteDelay <= 20 && playerSpriteDelay > 10) {
            ctx.drawImage(move2left,playerPos.x, playerPos.y, 70, 70);
        } else if (playerSpriteDelay <= 31 && playerSpriteDelay > 20) {
            ctx.drawImage(move3left,playerPos.x, playerPos.y, 70, 70);
        } else if (playerSpriteDelay <= 40 && playerSpriteDelay > 30) {
            ctx.drawImage(move4left,playerPos.x, playerPos.y, 70, 70);
        }
    } else if (playerLeft === false) {
        if (playerSpriteDelay <= 10) {
            ctx.drawImage(move1right,playerPos.x, playerPos.y, 70, 70);
        } else if (playerSpriteDelay <= 20 && playerSpriteDelay > 10) {
            ctx.drawImage(move2right,playerPos.x, playerPos.y, 70, 70);
        } else if (playerSpriteDelay <= 31 && playerSpriteDelay > 20) {
            ctx.drawImage(move3right,playerPos.x, playerPos.y, 70, 70);
        } else if (playerSpriteDelay <= 40 && playerSpriteDelay > 30) {
            ctx.drawImage(move4right,playerPos.x, playerPos.y, 70, 70);
        }
    }

    //move player
    keys.map((key) => {
        if (key === 65) {
            moveLeft()
        } else if (key === 68) {
            moveRight()
        } else if (key === 87) {
            moveUp()
        } else if (key === 83) {
            moveDown()
        }
    })

    //spawn missle
        if (missleDelay === 0) {
            if (enemies.length > 0) {
                let closestEnemyDistance = 1000000
                let enemyX = null
                let enemyY = null
                enemies.map((enemy) => {
                    let distance = findDistance(playerPos.x, playerPos.y, enemy.x + 15, enemy.y + 15)
                        if (distance < closestEnemyDistance) {
                        closestEnemyDistance = distance
                        enemyX = enemy.x + 15
                        enemyY = enemy.y + 15
                    }
            })

            let xDiff = findDiff(playerPos.x, enemyX, closestEnemyDistance)
            let yDiff = findDiff(playerPos.y, enemyY, closestEnemyDistance)

            missles.push({x:playerPos.x, y:playerPos.y, xDiff: xDiff, yDiff: yDiff})
            let fire = new Audio;
            fire.src = 'sounds/missle.mp3'
            fire.volume = 0.1
            fire.play()
            }
            
        }
    
    //move missles
    missles.map((missle, i) => {
        missle.x += missle.xDiff * 10
        missle.y += missle.yDiff * 10
        ctx.drawImage(missleImg, missle.x, missle.y, 35, 35);
        if (missle.x > canvas.width || missle.x < 0 || missle.y > canvas.height || missle.y < 0) {
            missles.splice(i, 1)
        }
    })
    
    //check for collision
    missles.map((missle, missleI) => {
        enemies.map((enemy, enemyI) => {
            if (findDistance(missle.x, missle.y, enemy.x + 15, enemy.y + 15) < 25) {
                if (!newPlayer.gameplayUpgrades.includes("piercingShots")) {
                    missles.splice(missleI,1)
                }
                enemy.health -= newPlayer.attack
                if (enemy.health <= 0) {
                    kills += 1
                    document.getElementById("killCount").textContent = `${kills}/${killsForLevelUp}`
                    enemies.splice(enemyI,1)
                }
            }
        })
    })

    //move enemies 

    enemies.map((enemy) => {
        let distance = findDistance(enemy.x, enemy.y, playerPos.x + 25, playerPos.y + 25)
        let xEnemyDiff = findDiff(enemy.x , playerPos.x + 15, distance)
        let yEnemyDiff = findDiff(enemy.y, playerPos.y + 25, distance)
        enemy.x += xEnemyDiff * 2
        enemy.y += yEnemyDiff * 2

        if (findDistance(playerPos.x + 25, playerPos.y + 25, enemy.x, enemy.y) < 25) {
            playerPos.x += randomPushback() + 1
            playerPos.y += randomPushback() + 1
            if (!isPlayerInvincible) {
                newPlayer.health -= 1
                isPlayerInvincible = true
            }
        }
            
            document.getElementById("health").textContent = `Health: ${newPlayer.health}`
            if (newPlayer.health === 0) {
                playing = false
                document.getElementsByClassName("gameCanvas")[0].style.display = "none"
                document.getElementsByClassName("gameInfo")[0].style.display = "none"
                document.getElementsByClassName("endScreenDefeat")[0].style.display = "flex"

            }


        enemies.map((enemy) => {
            if (enemy.spriteDelay >= 0 && enemy.spriteDelay < 5) {
                if (enemy.x > playerPos.x + 25) {
                    ctx.drawImage(enemy1left, enemy.x, enemy.y, 50, 50)
                } else (
                    ctx.drawImage(enemy1right, enemy.x, enemy.y, 50, 50)
                )
            } else {
                if (enemy.x > playerPos.x + 25) {
                    ctx.drawImage(enemy2left, enemy.x, enemy.y, 50, 50)
                } else (
                    ctx.drawImage(enemy2right, enemy.x, enemy.y, 50, 50)
                )
            }
            
        })
    })

    missleDelay += 1
    if (missleDelay > newPlayer.fireRate) {
        missleDelay = 0
    }

    if (enemyDelay === 0 && enemies.length < 70) {
        if (minutes === 2) {
            enemies.push(new Enemy(generateRandom(), generateRandom(), 30))
        } else if (minutes === 1) {
            enemies.push(new Enemy(generateRandom(), generateRandom(), 50))
        }else  if (minutes === 0) {
            enemies.push(new Enemy(generateRandom(), generateRandom(), 65))
        }
        
    }

    enemyDelay += 1
    if (enemyDelay > minutes * 25 + 15) {
        enemyDelay = 0
    }

    playerSpriteDelay += 1
    if (playerSpriteDelay === 41) {
        playerSpriteDelay = 0
    }

    enemies.map((enemy)=>{
        enemy.spriteDelay += 1
        if (enemy.spriteDelay === 11) {
            enemy.spriteDelay = 0
        }
    })

    if (isPlayerInvincible) {
        isPlayerInvincibleTimer += 1
        if (isPlayerInvincibleTimer === isPlayerInvincibleConst) {
            isPlayerInvincibleTimer = 0
            isPlayerInvincible = false
        }
    }

    if (kills >= killsForLevelUp) {
        kills = 0
        newPlayer.level += 1
        killsForLevelUp = 2 * newPlayer.level
        document.getElementById("level").textContent = `Level: ${newPlayer.level}`
        document.getElementById("killCount").textContent = `${kills}/${killsForLevelUp}`
        newPlayer.skillpoints += 1
    }

    if (newPlayer.skillpoints > 0 && isChoosingUpgrade === false) {
        isChoosingUpgrade = true
        for (let i = 0; i < 3; i++) {
            let generatedSkill = generateRandomSkill()
            let skillName = newPlayer.availableUpgrades[generatedSkill].name
            let skillFunc = newPlayer.availableUpgrades[generatedSkill].function
            let skill = document.createElement("h1")
            skill.appendChild(document.createTextNode(skillName))
            skill.style.textAlign = 'center'
            skill.style.padding = '20px'
            skill.style.margin = '10px'
            skill.style.border = '5px solid white'
            skill.onclick = skillFunc
            document.getElementsByClassName("upgradeSelect")[0].appendChild(skill)
        }
    }

    if (minutes === 0 && seconds === 0 ) {
        playing = false
        document.getElementsByClassName("gameCanvas")[0].style.display = "none"
        document.getElementsByClassName("gameInfo")[0].style.display = "none"
        document.getElementsByClassName("endScreenVictory")[0].style.display = "flex"
    }



    if (playing === true) {
        window.requestAnimationFrame(gameLoop)
    }
    
    
    

    }


