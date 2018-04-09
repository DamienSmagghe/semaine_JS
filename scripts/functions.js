//Defining the list of possible mean mobs with their features

let mobVariants = [
mob1 = {
	speed : 1.5,
	damages : 100,
	health : 10
},
mob2 = {
	speed : 2,
	damages : 60,
	health : 15
},
	mob3 = {
	speed : 2,
	damages : 100,
	health : 20
},
boss = {
	speed : 0.8,
	damages : 500,
	health : 100
}
]

//Defining the two types of towers that can help the heros in killing the mean mobs with their features

let seller1 = {
	damages : 5,
	range : 2,
	rate : 1500,
	price : 200,
	level : 0
}

let seller2 = {
	damages : 10,
	range : 1,
	rate : 2500,
	price : 200,
	level : 0
}

const speedReference = 1

//Variable necessary to define before to start initiating the game, like the level, the amount of money and the life of the wall
let money = 1000
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
	
	function mobAutoRun(mobVariety){
		let mob = document.createElement('div')
		let amountLife = mobVariety.health
		mob.setAttribute('id', 'mob')
		document.querySelector(".street").appendChild(mob)
		mob.style.top = variousSpawn[Math.floor(Math.random() * 4)]
		let posX = document.querySelector('.street').offsetWidth
		let movement = setInterval(function(){
		posX -= speedReference * mobVariant.speed
		if (posX == 0){
			setInterval(function(){
				wall -= mobVariety.damages
				amountLife -= 10
			}, 1000)
		}
		if (posX >= 0){
			mob.style.left = posX + 'px'
		}
		console.log(amountLife)
		if (amountLife <= 0){
			mobKilling(mob)
			clearInterval(movement)
		}
		},60)

	}

	mobAutoRun(mobVariant)	
	amountMob++	
	timeInterval = Math.floor(Math.random() * 5000)
}

function stopSpawn(){
	setInterval(function(){
		if(amountMob >= Math.ceil(level * 1.5)){
			clearInterval(intervalSpawn)
			amountMob = 0
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
	sellerType.rate += 300
	sellerType.level++
}

document.querySelector('.seller1 button').addEventListener(
	'click',
	function(){
		if (money >= seller1.price){
			money -= seller1.price
			upgrade(seller1)
			console.log(seller1)
		}
	}
)

document.querySelector('.seller2 button').addEventListener(
	'click',
	function(){
		if (money >= seller2.price){
			money -= seller2.price
			upgrade(seller2)
			console.log(seller2)
		}
	}
)










