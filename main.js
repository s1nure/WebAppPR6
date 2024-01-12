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

function generateRandomHarm(maxValue) {
	return Math.ceil(Math.random() * maxValue)
}

function disableActionButtons() {
	Array.from(document.querySelectorAll('.action-button')).forEach(
		button => (button.disabled = true)
	)
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

	const specialAttackButton = document.getElementById('btn-ls')
	specialAttackButton.addEventListener('click', () => {
		villain.inflictDamage(generateRandomHarm(30))
	})

	hero.displayVitality()
	villain.displayVitality()
}

document.addEventListener('DOMContentLoaded', commenceAdventure)
