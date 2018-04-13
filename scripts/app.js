/***************************************************************************************************************
****************************************************************************************************************
****************************************************************************************************************
******************************************CONSTANTS & VARIABLES & OBJECTS***************************************
****************************************************************************************************************
****************************************************************************************************************
***************************************************************************************************************/

//Defining constant necessary later

const range2 = 440 // range of seller 1
const range1 = 220 //range of seller 2
const addSeller1Price = 200 // price to buy seller 1
const addSeller2Price = 500 //price to buy seller 2
const speedReference = 1 // reference of speed for all the mobs
const heroDamage = 20 //damages made by a shoot

//Defining the list of possible mean mobs with their features

let mobVariants = [
mob1 = {
	speed : 3,
	damages : 30,
	health : 30,
	reward : 15
},
mob2 = {
	speed : 1.8,
	damages : 80,
	health : 100,
	reward : 25
},
mob3 = {
	speed : 2.5,
	damages : 100,
	health : 120,
	reward : 40
},
boss = {
	speed : 0.8,
	damages : 200,
	health : 300,
	reward : 200,
}
]

//Defining the two types of towers that can help the heros in killing the mean mobs with their features

let seller1 = {
	damages : 2,
	range : 2,
	price : 200,
	level : 0
}

let seller2 = {
	damages : 5,
	range : 1,
	price : 200,
	level : 0
}

//Amount of both tower types on the spots
let tower1 = 0
let tower2 = 0

let spots = document.querySelectorAll('.spot') // 4 spaces in order to put the towers
let freeSpots = 4 //Free spots for tower

let levelSeller1 = document.querySelector('.seller1 .level').innerHTML = seller1.level //div containing level of the the seller type 1 (smartphone launcheur)
let levelSeller2 = document.querySelector('.seller2 .level').innerHTML = seller2.level //div containing level of the the seller type 2 (computer launcheur)
// div containing price to upgrade
let priceSeller2 = document.querySelector('.seller2 .upgrade .price').innerHTML = seller2.price
let priceSeller1 = document.querySelector('.seller1 .upgrade .price').innerHTML = seller1.price

//Variable necessary to define before to start initiating the game
let money = 0 //money of the player (at 0 in the beginnning)
let level = 1 // the wave
let wall = 1000 // vie du mur
let wallLife = document.querySelector('.wallLife p').innerHTML = "Vie du mur : " + wall // displaying the wall life in the menu
let bestScore = 0

//Defining the 4 horizontal axis where the mob can pop on the game surface
let variousSpawn = ['20px', '120px','220px','320px']

//The spawn interval when the game start
let timeInterval = 5000


let heros // creating the variable that will contin the div of the heros
let margin = 20 // place of the heris when spawning
let amountShoot = 0 // amount of shot on the map
let mobs = [] //containing mobs left to kill
let mobKilled = 0
let mobSpawned = [] //containing mobs that have spawned






//Initiating the various functions that run the games
generateHeros()
let amountMob = 0
let intervalSpawn = setInterval(spawn, 3000)
stopSpawn()





/***************************************************************************************************************
****************************************************************************************************************
****************************************************************************************************************
*********************************************FUNCTIONS**********************************************************
****************************************************************************************************************
****************************************************************************************************************
***************************************************************************************************************/




//This function will check each 3 second if the the loser has not loose, which means that is wall still has life and act if the player loose
function defeat(inter){
		 //checking if wall life is superior to 0
			if (bestScore < level){ //checking if the last level of the current party is better than the best score and if it is refreshing the best score
				bestScore = level
			}
			let retry = document.createElement('button') //creating the button to restart the game
			retry.classList.add('retry') //giving this button a class to put styles in css
			retry.innerHTML ='Rejouez'
			document.querySelector('.game').appendChild(retry)
			let bestScoreDisp = document.createElement('div') // creating the div with the best score
			bestScoreDisp.classList.add('dispbest')
			bestScoreDisp.innerHTML = 'Votre meilleur score : ' + bestScore
			document.querySelector('.game').appendChild(bestScoreDisp)
			clearInterval(inter)

			retry.addEventListener( //this event permits to reload the page to restart the game
				'click',
				function(e){
					e.preventDefault()
					location.reload()
				})
			clearInterval(wall)


		}

//This function permits to create the mob, giving him the variety and his life in consequence
//The function permits to spawn a mob random type of mob with a random location to spawn
function spawn() {
	let mobVariant = mobVariants[Math.floor(Math.random() * 3)]//Determining the type of the spawned mob
	//giving the possibility to bosses to spawn every 5 waves
	if((level % 5) == 0){
		mobVariant = mobVariants[Math.floor(Math.random() * 4)]
	}

	mobSpawned.push({position : 0, life : mobVariant.health})//putting the life, the position of the mob in an object in an array declared in the variables

	let mobPlace = amountMob // the place of the mob in the wave
	let posX = document.querySelector('.street').offsetWidth // decalring position of the mob when spawning
	let towerDamage

	//this function create the div of the mob, gives him atrribute for styles, create a div that reprsent the life at the top of the mob div
	function mobAutoRun(mobVariety){
		let mob = document.createElement('div')
		mob.setAttribute('id', 'mob')
		document.querySelector(".street").appendChild(mob)
		let mobLife = document.createElement('div')
		mobLife.setAttribute('id','mobLife')
		mob.appendChild(mobLife)
		randomSpawn = Math.floor(Math.random() * 4)//Spawning randomely in one of the 4 axis to spawn
		mob.style.top = variousSpawn[Math.floor(Math.random() * 4)]

		//adding the class according to the type of the mob
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


		mobs.push(mob)//putting the mob in the array that keep the mob left to kill
		let wallAttack
		//this interval makes the div of the mob moving to the left each 50 milliseconds
		let movement = setInterval(function(){
			posX -= speedReference * mobVariant.speed// making the move according to the speed of the mob
			mobSpawned[mobPlace].position = mob.getBoundingClientRect() //putting the object that contain position on x, y the width in the array of the mob Spawned
			if (posX == 0){
				//run the damages on the variable wall which represent the life of the wall if the mob is stick to the wall
				wallAttack = setInterval(function(){
					wall -= mobVariety.damages //applying damages to the wall
					wallLife = document.querySelector('.wallLife p').innerHTML = "Vie du mur : " + wall
					if (wall <= 0){
						defeat(wallAttack)
					} // updating the life in the page
					mobLife.style.width = mobSpawned[mobPlace].life / mobVariant.health * 100 +'%'
				}, 1000)
			}
			if (posX >= 0){
				mob.style.left = posX + 'px'// moving to the left until the mob reach the wall
				mobLife.style.width = mobSpawned[mobPlace].life / mobVariant.health * 100 +'%'// filling the div which represent life remaining
			}
			//killing the mob if he has no more life
			if (mobSpawned[mobPlace].life <= 0){
				mobKilled++
				mobKilling(mob)
				money += mobVariant.reward
				document.querySelector('.money p').innerHTML = money //upadating the money of the player
				clearInterval(movement)
				clearInterval(wallAttack)
				clearInterval(towerDamage)
			}
		},50)

		//remove the life of the mob according to the number of tower in the defense and the position of the mob
		function towerRangeDamage(){
			//if the mob is in the long range he takes hits by the seller 1 tower every second
			if (posX > range1 && posX <= range2){
				if(tower1 > 0){
					mobSpawned[mobPlace].life -= seller1.damages * tower1
				}
			}
			//if the mob is in the short range he takes hits by the seller 1 and seller 2 towers every second
			else if (posX <= range1 ){
				if((tower1 > 0 || tower2 > 0)){
					mobSpawned[mobPlace].life -= seller1.damages * tower1 + seller2.damages * tower2
				}
			}
		}
		towerDamage = setInterval(towerRangeDamage, 2000)
	}

	mobAutoRun(mobVariant)

	amountMob++
	// making a random spawn interval for the next spawn
}

// this function check every 2 second if every mob have spawned and every spawned mob are killed by the player
function stopSpawn(){
	let ending = setInterval(function(){

		if(amountMob >= Math.ceil(level * 1.5)){
			clearInterval(intervalSpawn)//stop the spawning function
			if(mobKilled >= Math.ceil(level * 1.5)){
				amountMob = 0
				clearInterval(ending)
				createButton()//run this function if the wave his finished
			}
		}
	}, 2000)
}

//removing the mob of the page
function mobKilling(thisMob){
	let obj = document.querySelector('.street')
	obj.removeChild(thisMob)
}

//upgrade the seller abilities
function upgrade(sellerType){
	sellerType.damages *= 2
	sellerType.price *= 2
	sellerType.level++
}

//generate a button in the page that will allow to go to the next wave
function createButton(){
	let button =document.createElement('button')//create button
	button.setAttribute('id','nextLevel')
	button.innerHTML = 'Passez au niveau : ' + (level + 1)
	document.querySelector('.game').appendChild(button)

	document.querySelector('#nextLevel').addEventListener(//if the button is clicked all the array containing the mobs positions, life are remade
		'click',
		function(){
			mobSpawned = []
			mobs = []
			mobKilled = 0
			level+=1
			if((level % 10) == 0){ // every 10 waves the mobs get more hard to kill and dangerous
				for(let j = 0; j < mobVariants.length; j++){
					mobVariants[j].health *= 2
					mobVariants[j].damages *= 2
					mobVariants[j].speed += 0.2
				}
			}
			let displayLevel = document.querySelector('.level p').innerHTML = 'Niveau : ' + level //upadating the level on the page
			intervalSpawn = setInterval(spawn, timeInterval)
			ending = setInterval(stopSpawn, 2000) //run the spawning function
			let object = document.querySelector('.game')
			object.removeChild(button)// delete the button after clicking

					})
}

//generate the div of the hero in the defense
function generateHeros(){
	heros = document.createElement('div')
	heros.setAttribute('id', 'heros')
	document.querySelector(".defense").appendChild(heros)
	heros.classList.add('animationHeros')
}

//generate the shot and check collision
function generateShoot(){

	let marginTopShoot = margin + 20 //departure position of the shot according to the position of the hero
	let shoot = document.createElement('div')
	shoot.setAttribute('id', 'shoot')
	shoot.classList.add('animationShoot')
	shoot.style.opacity = '0'
	setTimeout(function(){
		shoot.style.opacity = '1'
	}, 10)
	amountShoot ++
	document.querySelector('.defense').appendChild(shoot)

	let positionX = 90
	let mouvement = setInterval(function(){
		positionX += speedReference*1.5 // moving the shot to the right
		if (positionX <= 840){
			shoot.style.left = positionX + 'px'// applying the move to the style of the div
			shoot.style.top = marginTopShoot + "px"
			//check collision betweeen the shot and the mobspawned in the array
			for (let j = 0; j < mobSpawned.length; j++){
				let collision = isCollide(shoot, mobs[j])
				if (collision == false){
					mobSpawned[j].life -= heroDamage * (1 +( level / 20)) // removing lifeof the mob concerned if collision between the shot and the mob
					destroyShoot(shoot) // destroy the shoot after collision
					clearInterval(mouvement) // stop the mouvement because shot is destroyed
				}
			}
		}
		//destroy shot at the end of the mob
		if(positionX >= 840){
			destroyShoot(shoot)
			clearInterval(mouvement)
		}
	},5)
}

//remove the div of the shot
function destroyShoot(thisShoot){
	let obj = document.querySelector('.defense')
	obj.removeChild(thisShoot)
	amountShoot --
}

//checking collision between an a element and a b element
function isCollide(a, b) {
	var aRect = a.getBoundingClientRect() // this function put x, y, width, height , top, left position in an object
	var bRect = b.getBoundingClientRect()

	return (
		((aRect.top + aRect.height) < (bRect.top)) ||//checking collision if any of these condition is true
		(aRect.top > (bRect.top + bRect.height)) ||
		((aRect.left + aRect.width) < bRect.left) ||
		(aRect.left > (bRect.left + bRect.width))
		)
}





/***************************************************************************************************************
****************************************************************************************************************
****************************************************************************************************************
******************************************EVENTS LISTENERS *****************************************************
****************************************************************************************************************
****************************************************************************************************************
***************************************************************************************************************/



//button to buy a smartphone launcher(seller 1) if the player as enought money, if they are free spots and putting the seller in the dom if clicked
document.querySelector('.seller1 .buy button').addEventListener(
	'click',
	function(){
		if(money >= addSeller1Price && (freeSpots > 0)){
			let tower = document.createElement('div')
			tower.classList.add('animationSeller1')
			tower.setAttribute('id', 'tower')
			spots[4 - freeSpots].appendChild(tower)
			freeSpots--
			tower1++
			money -= addSeller1Price
			document.querySelector('.money p').innerHTML = money
		}
	})
//launch the upgrade function to the seller 1 if the player has enought money
document.querySelector('.seller1 .upgrade button').addEventListener(
	'click',
	function(){
		if (money >= seller1.price){
			money -= seller1.price
			upgrade(seller1)
			priceSeller1 = document.querySelector('.seller1 .upgrade .price').innerHTML = seller1.price //update the new price in the DOM
			levelSeller1 = document.querySelector('.seller1 .level').innerHTML = seller1.level //update level of the seller in the DOM
			document.querySelector('.money p').innerHTML = money // update the money in the DOM
		}
	}
	)
//button to buy a smartphone launcher(seller 2) if the player as enought money, if they are free spots and putting the seller in the dom if clicked
document.querySelector('.seller2 .buy button').addEventListener(
	'click',
	function(){
		if(money >= addSeller2Price && (freeSpots > 0)){
			let tower = document.createElement('div')
			tower.classList.add('animationSeller2')
			tower.setAttribute('id', 'tower2')
			spots[4 - freeSpots].appendChild(tower)
			freeSpots--
			tower2++
			money -= addSeller2Price
			document.querySelector('.money p').innerHTML = money
		}
	})
//launch the upgrade function to the seller 2 if the player has enought money
document.querySelector('.seller2 .upgrade button').addEventListener(
	'click',
	function(){
		if (money >= seller2.price){
			money -= seller2.price
			upgrade(seller2)
			priceSeller2 = document.querySelector('.seller2 .upgrade .price').innerHTML = seller2.price //update the new price in the DOM
			levelSeller2 = document.querySelector('.seller2 .level').innerHTML = seller2.level //update level of the seller in the DOM
			document.querySelector('.money p').innerHTML = money // update the money in the DOM
		}
	}
	)

//check if the player is pressing 'S or 'Z' to move his heros down or up
window.addEventListener('keydown', function(event) {

	if(event.keyCode === 83 && margin < 320 ){ //if 'Z' is pressed the heros moves up
		margin += 7
		heros.style.marginTop = margin + 'px'
	}
	else if (event.keyCode === 90 && margin >20 ){ //if 'S' is pressed the heros moves down
		margin -= 7
		heros.style.marginTop = margin + 'px'
	}
})


// if the player press m and there is not any shoot on the mob : generate the shot
window.addEventListener('keypress', function(e){
	if(e.keyCode === 109){
		if(amountShoot<1){
			generateShoot()
		}
	}
})
