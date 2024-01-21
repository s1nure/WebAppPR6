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
	}

	displayVitality() {
		this.showVitalityInfo()
		this.displayLifeBar()
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


function createButtonClickHandler(adventurer, button, maxClicks) {
	let clickCount = 0

	return function () {
		if (clickCount < maxClicks) {
			adventurer.inflictDamage(generateRandomHarm(20))
			clickCount++

			const remainingClicks = maxClicks - clickCount
			const message = `Button ${button.id} clicked (${clickCount}/${maxClicks}). Remaining clicks: ${remainingClicks}`
			logBattle(message)
			console.log(message)

			if (clickCount === maxClicks) {
				button.disabled = true
				const message = `Button ${button.id} disabled. Maximum clicks reached.`
				logBattle(message)
				console.log(message)
			}
		}
	}
}
function commenceAdventure() {
	console.log('Embarking on a new quest!')

	const hero = new Adventurer(
		'Pikachu',
		'health-character',
		'progressbar-character'
	)
	const villain = new Adventurer(
		'Charmander',
		'health-enemy',
		'progressbar-enemy'
	)

	const attackButton = document.getElementById('btn-kick')
	attackButton.addEventListener('click', () => {
		hero.inflictDamage(generateRandomHarm(20))
		villain.inflictDamage(generateRandomHarm(20))
	})
	attackButton.addEventListener(
		'click',
		createButtonClickHandler(hero, attackButton, 4)
	)
	

	const specialAttackButton = document.getElementById('btn-ls')
	specialAttackButton.addEventListener('click', () => {
		villain.inflictDamage(generateRandomHarm(30))
	})
	specialAttackButton.addEventListener(
		'click',
		createButtonClickHandler(villain, specialAttackButton, 3)
	)

	hero.displayVitality()
	villain.displayVitality()
}

document.addEventListener('DOMContentLoaded', commenceAdventure)
