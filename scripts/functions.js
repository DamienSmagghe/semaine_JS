const range2 = 440
const range1 = 220
const addSeller1Price = 200
const addSeller2Price = 500
const speedReference = 1
const heroDamage = 20



//Defining the list of possible mean mobs with their features

let mobVariants = [
mob1 = {
	speed : 1.5,
	damages : 100,
	health : 50,
	reward : 30
},
mob2 = {
	speed : 2,
	damages : 60,
	health : 50,
	reward : 50
},
mob3 = {
	speed : 2,
	damages : 100,
	health : 50,
	reward : 80
},
boss = {
	speed : 0.2,
	damages : 500,
	health : 1000,
	reward : 200,
}
]

//Defining the two types of towers that can help the heros in killing the mean mobs with their features

let seller1 = {
	damages : 5,
	range : 2,
	price : 200,
	level : 0
}

let seller2 = {
	damages : 10,
	range : 1,
	price : 200,
	level : 0
}

let tower1 = 0
let tower2 = 0
let spots = document.querySelectorAll('.spot')
let freeSpots = 4

let levelSeller1 = document.querySelector('.seller1 .level').innerHTML = seller1.level
let levelSeller2 = document.querySelector('.seller2 .level').innerHTML = seller2.level
let priceSeller2 = document.querySelector('.seller2 .upgrade .price').innerHTML = seller2.price
let priceSeller1 = document.querySelector('.seller1 .upgrade .price').innerHTML = seller1.price



//Variable necessary to define before to start initiating the game, like the level, the amount of money and the life of the wall

let money = 0
let level = 1
let wall = 4000
let wallLife = document.querySelector('.wallLife p').innerHTML = "Vie du mur : " + wall
let bestScore = 0
//Defining the 4 horizontal axis where the mob can pop on the game surface

let variousSpawn = ['20px', '120px','220px','320px']

//The spawn interval when the game start
let timeInterval = 5000

//varaible axel
let heros
let margin = 20
let amountShoot = 0

let mobs = []

let mobSpawned = []

localStorage.setItem('BestScore',bestScore)

//Initiating the various functions that run the games

generateHeros()
let amountMob = 0
let intervalSpawn = setInterval(spawn, timeInterval)
stopSpawn()
defeat()



function defeat(){
	setInterval(function(){
		if (wall <= 0){
			//window.alert('Défaite')
			clearInterval(wall)
			if (bestScore < level){
				bestScore = level
			}
		}
	},50)
}

function spawn() {
	let mobVariant = mobVariants[Math.floor(Math.random() * 3)]
	if((level % 5) == 0){
		mobVariant = mobVariants[Math.floor(Math.random() * 4)]
	}
	mobSpawned.push({position : 0, life : mobVariant.health})
	let mobPlace = amountMob

	function mobAutoRun(mobVariety){
		let mob = document.createElement('div')
		mob.setAttribute('id', 'mob')
		document.querySelector(".street").appendChild(mob)
		let mobLife = document.createElement('div')
		mobLife.setAttribute('id','mobLife')
		mob.appendChild(mobLife)
		randomSpawn = Math.floor(Math.random() * 4)
		mob.style.top = variousSpawn[Math.floor(Math.random() * 4)]
		if (mobVariant == mob1){
			mob.classList.add('mob1')
		}
		else if (mobVariant == mob2){
			mob.classList.add('mob2')
		}
		else if (mobVariant == mob3){
			mob.classList.add('mob3')
		}
		else if (mobVariant == boss){
			mob.classList.add('boss')
		}
		mobs.push(mob)
		let posX = document.querySelector('.street').offsetWidth
		let wallAttack
		let movement = setInterval(function(){
			posX -= speedReference * mobVariant.speed
			mobSpawned[mobPlace].position = mob.getBoundingClientRect()
			if (posX == 0){
					wallAttack = setInterval(function(){
					wall -= mobVariety.damages
					wallLife = document.querySelector('.wallLife p').innerHTML = "Vie du mur : " + wall
					mobLife.style.width = mobSpawned[mobPlace].life / mobVariant.health * 100 +'%'
				}, 1000)
			}
			else if (posX >= 0){
				mob.style.left = posX + 'px'
				mobLife.style.width = mobSpawned[mobPlace].life / mobVariant.health * 100 +'%'	
			}
			if (mobSpawned[mobPlace].life <= 0){
				mobKilling(mob)
				money += mobVariant.reward
				document.querySelector('.money p').innerHTML = money
				clearInterval(movement)
				clearInterval(wallAttack)
			}
		},50)
		setInterval(function(){
				if (posX > range1 && posX <= range2){
					if(tower1 > 0){
						mobSpawned[mobPlace].life -= seller1.damages * tower1
					}
				}
				if (posX <= range1 && posX >= 0){
						if((tower1 > 0 || tower2 > 0)){
							mobSpawned[mobPlace].life -= seller1.damages * tower1 + seller2.damages * tower2
						}
				}
		},2000)
	}
	mobAutoRun(mobVariant)

	amountMob++
	timeInterval = Math.floor(Math.random() * 5000 + 2000)
}

function stopSpawn(){
	setInterval(function(){
		if(amountMob >= Math.ceil(level * 1.5)){
			clearInterval(intervalSpawn)
			amountMob = 0
			setTimeout(createButton, 28000)
		}
	},50)
}

function mobKilling(thisMob){
	let obj = document.querySelector('.street')
	obj.removeChild(thisMob)
}


function upgrade(sellerType){
	sellerType.damages *= 2
	sellerType.price *= 2
	sellerType.level++
}

function createButton(){			
				let button =document.createElement('button')
				button.setAttribute('id','nextLevel')
				button.innerHTML = 'Passez au niveau : ' + (level + 1)
				document.querySelector('.game').appendChild(button)
				document.querySelector('#nextLevel').addEventListener(
					'click',
					function(){
						mobSpawned = []
						mobs = []
						level+=1
						let displayLevel = document.querySelector('.level p').innerHTML = 'Niveau : ' + level
						intervalSpawn = setInterval(spawn, timeInterval)
						let object = document.querySelector('.game')
						object.removeChild(button)

					})
				}


function defenseDamagesRange1(life){
	if((tower1 > 0 || tower2 > 0)){
		life -= seller1.damages * tower1 + seller2.damages * tower2
	}
}
function defenseDamagesRange2(life){
	if(tower1 > 0){
		life -= seller1.damages * tower1
	}
}

function generateHeros(){
	heros = document.createElement('div')
	heros.setAttribute('id', 'heros')
	document.querySelector(".defense").appendChild(heros)
}

function generateShoot(){
	let marginTopShoot = margin + 20
	let shoot = document.createElement('div')
	shoot.setAttribute('id', 'shoot')
	shoot.style.opacity = '0'
	setTimeout(function(){
		shoot.style.opacity = '1'
	}, 10)
	amountShoot ++
	document.querySelector('.defense').appendChild(shoot)
	let positionX = 90
	let mouvement = setInterval(function(){
		positionX += speedReference
		if (positionX <= 840){
			shoot.style.left = positionX + 'px'
			shoot.style.top = marginTopShoot + "px"
			for (let j = 0; j < mobSpawned.length; j++){
				let collision = isCollide(shoot, mobs[j])
				if (collision == false){
					mobSpawned[j].life -= heroDamage
					destroyShoot(shoot)
					clearInterval(mouvement)
				}
			}
		}
		if(positionX >= 840){
			destroyShoot(shoot)
			clearInterval(mouvement)
		}
	},5)
}

function destroyShoot(thisShoot){
	let obj = document.querySelector('.defense')
	obj.removeChild(thisShoot)
	amountShoot --
}

function isCollide(a, b) {
    var aRect = a.getBoundingClientRect();
    var bRect = b.getBoundingClientRect();

    return (
        ((aRect.top + aRect.height) < (bRect.top)) ||
        (aRect.top > (bRect.top + bRect.height)) ||
        ((aRect.left + aRect.width) < bRect.left) ||
        (aRect.left > (bRect.left + bRect.width))
    )
}


document.querySelector('.seller1 .buy button').addEventListener(
	'click',
	function(){
		if(money >= addSeller1Price && (freeSpots > 0)){
			let tower = document.createElement('div')
			tower.setAttribute('id', 'tower')
			spots[4 - freeSpots].appendChild(tower)
			freeSpots--
			tower1++
			money -= addSeller1Price
		}
	})

document.querySelector('.seller1 .upgrade button').addEventListener(
	'click',
	function(){
		if (money >= seller1.price){
			money -= seller1.price
			upgrade(seller1)
			priceSeller1 = document.querySelector('.seller1 .upgrade .price').innerHTML = seller1.price
			levelSeller1 = document.querySelector('.seller1 .level').innerHTML = seller1.level
		}
	}
)

document.querySelector('.seller2 .buy button').addEventListener(
	'click',
	function(){
		if(money >= addSeller2Price && (freeSpots > 0)){
			let tower = document.createElement('div')
			tower.setAttribute('id', 'tower2')
			spots[4 - freeSpots].appendChild(tower)
			freeSpots--
			tower2++
			money -= addSeller2Price
		}
	})

document.querySelector('.seller2 .upgrade button').addEventListener(
	'click',
	function(){
		if (money >= seller2.price){
			money -= seller2.price
			upgrade(seller2)
			priceSeller2 = document.querySelector('.seller2 .upgrade .price').innerHTML = seller2.price
			levelSeller2 = document.querySelector('.seller2 .level').innerHTML = seller2.level
		}
	}
)


heros.style.marginTop = margin + 'px'
window.addEventListener('keydown', function(event) {

	if(event.keyCode === 83 && margin < 320 ){
		margin += 6
		heros.style.marginTop = margin + 'px'
	}
	else if (event.keyCode === 90 && margin >20 ){
		margin -= 6
		heros.style.marginTop = margin + 'px'
	}
})

window.addEventListener('keypress', function(e){
	if(e.keyCode === 109){
		if(amountShoot<1){
			generateShoot()
		}
	}
})





















