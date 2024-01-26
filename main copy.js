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
			if (this.identity !== 'Pikachu') {
				NextEnemy()
				this.isAlive = true
				this.heal()
				displayVitality()
			}
			else {
				disableActionButtons()
			}
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
		}
		else {
			this.lifeBarElement.classList.remove('low')
			this.lifeBarElement.classList.remove('critical')
		}
	}

	heal() {
		this.currentVitality = 100;
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

const spiteEnemy = document.getElementById('sprite-enemy')
const nameEnemy = document.getElementById('name-enemy')

function NextEnemy() {
	let imgElement = document.getElementById('sprite-enemy')
	let currentSrc = imgElement.src
	let parts = currentSrc.split('/')
	let lastPart = parts[parts.length - 1]
	let fileParts = lastPart.split('.')
	let number = parseInt(fileParts[0])

	number++

	let newNumber;
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

	ResetButtons(attackButton, 4)
	ResetButtons(specialAttackButton, 3)
}


function ResetButtons(button, maxClicks) {
	button.removeEventListener('click', createButtonClickHandler)

	let newClickHandler = createButtonClickHandler(button, maxClicks)
	button.addEventListener('click', newClickHandler)
	// createButtonClickHandler = newClickHandler
	button.disabled = false

}

function createButtonClickHandler(button, maxClicks) {
	let clickCount = 0
	
	return function () {
		if (clickCount < maxClicks) {

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

const specialAttackButton = document.getElementById('btn-ls')
const attackButton = document.getElementById('btn-kick')

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

	attackButton.addEventListener('click', () => {
		hero.inflictDamage(generateRandomHarm(20))
		villain.inflictDamage(generateRandomHarm(30))
	})
	attackButton.addEventListener(
		'click',
		createButtonClickHandler(attackButton, 4)
	)

	specialAttackButton.addEventListener('click', () => {
		villain.inflictDamage(generateRandomHarm(40))
	})
	specialAttackButton.addEventListener(
		'click',
		createButtonClickHandler(specialAttackButton, 3)
	)


	
	hero.displayVitality()
	villain.displayVitality()
}

document.addEventListener('DOMContentLoaded', commenceAdventure)
