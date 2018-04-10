const range2 = 440
const range1 = 220
const addSeller1Price = 200
const addSeller2Price = 500
const speedReference = 1



//Defining the list of possible mean mobs with their features

let mobVariants = [
mob1 = {
	speed : 1.5,
	damages : 100,
	health : 100
},
mob2 = {
	speed : 2,
	damages : 60,
	health : 150
},
	mob3 = {
	speed : 2,
	damages : 100,
	health : 200
},
boss = {
	speed : 0.2,
	damages : 500,
	health : 1000
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
let priceSeller2 = document.querySelector('.seller2 .upgrade .price').innerHTML = seller2.price
let priceSeller1 = document.querySelector('.seller1 .upgrade .price').innerHTML = seller1.price



//Variable necessary to define before to start initiating the game, like the level, the amount of money and the life of the wall

let money = 100000
let level = 1
let wall = 4000

//Defining the 4 horizontal axis where the mob can pop on the game surface

let variousSpawn = ['20px', '120px','220px','320px']

//The spawn interval when the game start
let timeInterval = 5000

//Initiating the various functions that run the games

wallLife()
displayMoney()
levelSellers()

let amountMob = 0
let intervalSpawn = setInterval(spawn, timeInterval)
stopSpawn()
defeat()



function defeat(){
	setInterval(function(){
		if (wall <= 0){
			//window.alert('Défaite')
			clearInterval(wall)
		}
	},50)
}

function spawn() {	
	let mobVariant = mobVariants[Math.floor(Math.random() * 3)]
	if((level % 5) == 0){
		mobVariant = mobVariants[Math.floor(Math.random() * 4)]
	}
	
	function mobAutoRun(mobVariety){
		let mob = document.createElement('div')
		let amountLife = mobVariety.health 
		mob.setAttribute('id', 'mob')
		document.querySelector(".street").appendChild(mob)
		mob.style.top = variousSpawn[Math.floor(Math.random() * 4)] 
		let posX = document.querySelector('.street').offsetWidth
		let mobLife = document.createElement('div')
		mobLife.setAttribute('id', 'mobLife')
		mob.appendChild(mobLife)
		let movement = setInterval(function(){
			mobLife.style.width = amountLife / mobVariety.health * 100 +"%"
			posX -= speedReference * mobVariant.speed	
			if (posX == 0){
				let lifeGestion = setInterval(function(){ 
					wall -= mobVariety.damages
					amountLife -= 10
					if(amountLife <= 0){
						clearInterval(lifeGestion)
					}
				}, 1000)
			}
			if (posX >= 0){
				mob.style.left = posX + 'px'
			}
			
			if (amountLife <= 0){
				mobKilling(mob)
				clearInterval(movement)
			}
		},60)
		setInterval(function(){
				if (posX > range1 && posX <= range2){
					if(tower1 > 0){
						amountLife -= seller1.damages * tower1
					}
				}
				if (posX <= range1 && posX >= 0){
						if((tower1 > 0 || tower2 > 0)){
							amountLife -= seller1.damages * tower1 + seller2.damages * tower2
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
function wallLife(){
	setInterval(function(){
		let wallLife = document.querySelector('.wallLife p').innerHTML = "Vie du mur : " + wall 
	},30)
}
function displayMoney(){
	setInterval(function(){
		document.querySelector('.money p').innerHTML = money
	},30)
}
function levelSellers(){
	setInterval(function(){
		document.querySelector('.seller1 .level').innerHTML = seller1.level
		document.querySelector('.seller2 .level').innerHTML = seller2.level
	},30)
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
		}
	}
)











