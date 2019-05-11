import map from '../assets/tilemaps/map.json'
import tiles from '../assets/tilemaps/ground-plates.png'
import monster from '../assets/sprites/monster39x40.png'
import EasyStar from 'easystarjs'

export default class GameScene extends Phaser.Scene {
	constructor() {
		super('Game')
	}

	preload() {

		this.load.image('ground-plates', tiles);
		this.load.tilemapTiledJSON('map', map);
		this.load.spritesheet('monster', monster, {
			frameWidth: 39,
			frameHeight: 40,
		});
	}

	create() {

		this.finder = new EasyStar.js()


		this.map = this.make.tilemap({
			key: 'map'
		})

		// Walkanimation for sprite
		const monsterAnimation = this.anims.create({
			key: 'walk',
			frames: this.anims.generateFrameNumbers('monster'),
			repeat: -1
		});

		// layers
		this.groundtiles = this.map.addTilesetImage('ground-plates')
		this.groundlayer = this.map.createStaticLayer('top', this.groundtiles, 0, 0)

		let monster = this.add.sprite(180, 0, 'monster');
		var timeline = this.tweens.createTimeline();

		let speed = 2000

		timeline.add({
			targets: monster,
			x: 180,
			y: 200,
			duration: speed
		});

		timeline.add({
			targets: monster,
			x: 500,
			duration: speed
		});

		timeline.add({
			targets: monster,
			y: 360,
			duration: speed
		});

		timeline.add({
			targets: monster,
			x: 310,
			duration: speed
		});
		timeline.add({
			targets: monster,
			y: 660,
			duration: speed
		});
		monster.play('walk')
		timeline.play();

	}
}