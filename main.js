class Adventurer {
	constructor(identification, vitalityId, lifeBarId) {
		this.identity = identification
		this.maximumVitality = 100
		this.currentVitality = 100
		this.vitalityElement = document.getElementById(vitalityId)
		this.lifeBarElement = document.getElementById(lifeBarId)
		this.isAlive = true
	}

	inflictDamage(damageAmount) {
		if (!this.isAlive) return

		this.currentVitality = Math.max(this.currentVitality - damageAmount, 0)
		this.displayVitality()
		logBattle(`${this.identity} get damage amount ${damageAmount}`)
		if (this.currentVitality === 0) {
			alert(`${this.identity} has fallen in battle!`)
			this.isAlive = false

			disableActionButtons()
		}
	}

	showVitalityInfo() {
		this.vitalityElement.textContent = `${this.currentVitality} / ${this.maximumVitality}`
	}

	displayLifeBar() {
		this.lifeBarElement.style.width = `${this.currentVitality}%`

		if (this.currentVitality < 60 && this.currentVitality > 20) {
			this.lifeBarElement.classList.add('low')
		}
		if (this.currentVitality < 20) {
			this.lifeBarElement.classList.remove('low')
			this.lifeBarElement.classList.add('critical')
		} else {
			this.lifeBarElement.classList.remove('low')
			this.lifeBarElement.classList.remove('critical')
		}
	}
	displayVitality() {
		this.showVitalityInfo()
		this.displayLifeBar()
	}
	heal() {
		this.currentVitality = 100
		this.displayVitality()
	}
}

const logContainer = document.getElementById('logs-cont')
const logs = document.getElementById('logs')
function logBattle(message) {
	if (logContainer.style.display == 'none') {
		logContainer.style.display = 'block'
	}

	const logEntry = document.createElement('div')
	logEntry.textContent = message
	logs.prepend(logEntry)
}

function generateRandomHarm(maxValue) {
	return Math.ceil(Math.random() * maxValue)
}

function disableActionButtons() {
	Array.from(document.querySelectorAll('.action-button')).forEach(
		button => (button.disabled = true)
	)
}

const spiteEnemy = document.getElementById('sprite-enemy')
const nameEnemy = document.getElementById('name-enemy')




class Game {
	constructor() {
		this.hero = null
		this.villain = null
		this.attackButton = document.getElementById('btn-kick')
		this.specialAttackButton = document.getElementById('btn-ls')
		this.clickCount = {
			'btn-kick': 0,
			'btn-ls': 0,
		}
	}

	start() {
		console.log('Embarking on a new quest!')

		this.hero = new Adventurer(
			'Pikachu',
			'health-character',
			'progressbar-character'
		)
		this.villain = new Adventurer(
			'Charmander',
			'health-enemy',
			'progressbar-enemy'
		)

		this.attackButton.addEventListener('click', () => {
			this.handleButtonClick(this.attackButton, 4)
			this.hero.inflictDamage(generateRandomHarm(20))
			this.villain.inflictDamage(generateRandomHarm(30))
			this.checkHealth()
		})


		this.specialAttackButton.addEventListener('click', () => {
			this.handleButtonClick(this.specialAttackButton, 3)
			this.villain.inflictDamage(generateRandomHarm(40))
			this.checkHealth()
		})
		
		this.hero.displayVitality()
		this.villain.displayVitality()
	}

	checkHealth() {
		if (this.villain.currentVitality == 0) {
			logBattle('Villain was killed')
			this.NextEnemy()
		}
		if (this.hero.currentVitality == 0) {
			logBattle('Hero was killed')
		}
	}

	handleButtonClick(button, maxClicks) {
		this.clickCount[button.id]++
		
		const remainingClicks = maxClicks - this.clickCount[button.id]
		const message = `Button ${button.id} clicked (${
			this.clickCount[button.id]
		}/${maxClicks}). Remaining clicks: ${remainingClicks}`
		logBattle(message)
		console.log(message)

		if (this.clickCount[button.id] === maxClicks) {
			button.disabled = true
			const disableMessage = `Button ${button.id} disabled. Maximum clicks reached.`
			logBattle(disableMessage)
			console.log(disableMessage)
		}
	}

	resetClickCount(button) {
		this.clickCount[button.id] = 0
		let resetMessage = 'Abilities have been updated'
		logBattle(resetMessage)
		console.log(resetMessage)

		button.disabled = false
	}
	NextEnemy() {
		let imgElement = document.getElementById('sprite-enemy')
		let currentSrc = imgElement.src
		let parts = currentSrc.split('/')
		let lastPart = parts[parts.length - 1]
		let fileParts = lastPart.split('.')
		let number = parseInt(fileParts[0])

		number++

		let newNumber
		if (number < 10) {
			newNumber = ('00' + number).slice(-3)
		}
		if (number < 100 && number >= 10) {
			newNumber = ('0' + number).slice(-3)
		}
		let newFileName = newNumber + '.png'
		parts[parts.length - 1] = newFileName
		let newSrc = parts.join('/')
		imgElement.src = newSrc


		nameEnemy.textContent = 'Unknown enemy'
		this.villain.identity = 'Unknown enemy'
		this.villain.isAlive = true
		this.villain.heal()
		this.hero.heal()
		this.resetClickCount(this.attackButton, 4)
		this.resetClickCount(this.specialAttackButton, 3)
	
	}

	reset() {
		this.hero = new Adventurer(
			'Pikachu',
			'health-character',
			'progressbar-character'
		)
		this.villain = new Adventurer(
			'Charmander',
			'health-enemy',
			'progressbar-enemy'
		)
		nameEnemy.textContent = 'Charmander'

		this.villain.heal()
		this.hero.heal()
		this.resetClickCount(this.attackButton, 4)
		this.resetClickCount(this.specialAttackButton, 3)
		let imgElement = document.getElementById('sprite-enemy')
		imgElement.src =
			'https://assets.pokemon.com/assets/cms2/img/pokedex/full/004.png'
		logs.innerHTML = ''
		logContainer.style.display = 'none'
	}
}

const game = new Game()

document.addEventListener('DOMContentLoaded', () => {
	game.start()
})
const resetButton = document.getElementById('reset-button')
resetButton.addEventListener('click', () => {
	game.reset()
})
