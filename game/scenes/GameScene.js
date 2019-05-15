// Assets
import map from '../assets/tilemaps/map-updated.json'
import tiles from '../assets/tilemaps/tuxmon-sample-32px.png'
import tower from '../assets/Tower-32.png'
import bullet from '../assets/bullet.png'
import monster from '../assets/sprites/monster39x40.png'

// Classes
import Enemy from './classes/Enemy';
import Tower from './classes/Tower';


export default class GameScene extends Phaser.Scene {
	constructor() {
		super({
			key: 'GameScene',
		});
	}

	preload() {
		// Load map 
		this.load.image('tuxmon-sample-32px', tiles);
		this.load.tilemapTiledJSON('map-updated', map);

		// Load tower and bullet
		this.load.image('tower', tower);
		this.load.spritesheet('bullet', bullet, {
			frameWidth: 10,
			frameHeight: 10
		});

		// Load monster
		this.load.spritesheet('monster', monster, {
			frameWidth: 39,
			frameHeight: 40,
		});
	}
	
	create() {
		// Create map
		this.map = this.make.tilemap({
			key: 'map-updated'
		})

		// Set tiles
		this.groundtiles = this.map.addTilesetImage('tuxmon-sample-32px')

		// Set layer
		this.groundlayer = this.map.createStaticLayer('top', this.groundtiles, 0, 0)

		// Set mouse marker
		this.marker = this.add.graphics();
		this.marker.lineStyle(5, 0xffffff, 1);
		this.marker.strokeRect(0, 0, 32, 32);
		this.marker.lineStyle(3, 0xff4f78, 1);
		this.marker.strokeRect(0, 0, 32, 32);
		
		// Towers group
		let towers = this.add.group();
		this.towers = towers;
		this.arrayOfTowers = towers.getChildren();
		this.input.on('pointerup', () => {
			// Check if tower already exists on pointer position
			if (!this.arrayOfTowers.some(t => t.x === this.snapperWorldPoint.x + 16 && t.y === this.snapperWorldPoint.y + 16)) {
				// Adding tower to towers group
				let tower = new Tower(this, this.snapperWorldPoint.x + 16, this.snapperWorldPoint.y + 16, 'tower');
				towers.add(tower);
			}
		});

		// Enemies group
		let enemies = this.add.group();
		this.enemies = enemies;
		for (let i = 0; i < 10; i++) {
			let enemy = new Enemy(this, 180, 0, 'monster');
			enemies.add(enemy);
		}

		 // BULLET
		 this.anims.create({
			key: 'bullet',
			frames: [{
			  key: 'bullet',
			  frame: 0,
			}],
		  });
	}
	
	update() {
		// Update mouse marker
		this.worldPoint = this.input.activePointer;
		this.pointerTileXY = this.groundlayer.worldToTileXY(this.worldPoint.x, this.worldPoint.y);
		this.snapperWorldPoint = this.groundlayer.tileToWorldXY(this.pointerTileXY.x, this.pointerTileXY.y);
		this.marker.setPosition(this.snapperWorldPoint.x, this.snapperWorldPoint.y);


		if (this.towers.getLength() > 0 && this.enemies.getLength() > 0) {
			this.arrayOfTowers.map(tower => {
				tower.checkForEnemies();
			});
		}

	}
}