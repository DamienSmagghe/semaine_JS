let mobVariants = [
mob1 = {
	speed : "1.5",
	damages : "100",
	life : "10"
},
mob2 = {
	speed : "2",
	damages : "60",
	life : "15"
},
	mob3 = {
	speed : "2",
	damages : "100",
	life : "20"
},
boss = {
	speed : "0.8",
	damages : "500",
	life : "100"
}
]

let level = 1

let variousSpawn = ['20px', '120px','220px','320px']
let timeInterval = 5000

let amountMob = 0
let intervalSpawn = setInterval(spawn, timeInterval)
stopSpawn()



function spawn() {	
	let mobVariant = mobVariants[Math.floor(Math.random() * 4)]
	
	function mobAutoRun(mobVariety){
		let mob = document.createElement('div')
		mob.setAttribute('id', 'mob')
		document.querySelector(".street").appendChild(mob)
		mob.style.top = variousSpawn[Math.floor(Math.random() * 4)]
		let posX = document.querySelector('.street').offsetWidth
		let movement = setInterval(function(){
		posX -= 1 * mobVariant.speed
		
		if (posX >= 0){
			mob.style.left = posX + 'px'
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













