export default class EndScene extends Phaser.Scene {
	constructor() {
		super({
			key: "EndScene"
		});
	}

	preload() {

	}

	create() {
		let gameWon = this.scene.manager.scenes[0].gameWon;
		let posX = this.cameras.main.centerX;
		let posY = this.cameras.main.centerY - 100;
		let textContent = gameWon ? 'GAME WON!' : 'GAME OVER';
		this.make.text({
			x: posX,
			y: posY,
			text: textContent,
			origin: 0.5,
			style: {
				fontSize: '80px',
				fill: 'white',
				align: 'center',
			}
		});
		let text = this.make.text({
			x: posX,
			y: posY + 100,
			text: 'New Game',
			origin: 0.5,
			style: {
				fontSize: '60px',
				fill: 'white',
				align: 'center',
			}
		});

		text.setInteractive().on('pointerup', () => {
			this.scene.start("GameScene");
		});

	}

	update() {}
}