import map from '../assets/tilemaps/map.json'
import tiles from '../assets/tilemaps/ground-plates.png'
import tower from '../assets/Tower-32.png'

export default class GameScene extends Phaser.Scene {
	constructor() {
		super('Game')
	}

	preload() {
		this.marker; 

		this.cameras.main.setBounds(0, 0, map.widthInPixels, map.heightInPixels);

		this.load.image('ground-plates', tiles);
		this.load.tilemapTiledJSON('map', map);

		this.load.image('tower', tower);
	};

	create() {
		this.towers = []; 

		this.map = this.make.tilemap({
			key: 'map'
		})

		this.groundtiles = this.map.addTilesetImage('ground-plates')
		this.groundlayer = this.map.createDynamicLayer('top', this.groundtiles, 0, 0)

		this.marker = this.add.graphics();
		this.marker.lineStyle(5, 0xffffff, 1);
		this.marker.strokeRect(0, 0, 32, 32);
		this.marker.lineStyle(3, 0xff4f78, 1);
		this.marker.strokeRect(0, 0, 32, 32);

		// this.groundlayer.putTileAtWorldXY(34, 100, 100);

	}
	
	update() {
		const worldPoint = this.input.activePointer;
		const pointerTileXY = this.groundlayer.worldToTileXY(worldPoint.x, worldPoint.y);
		const snapperWorldPoint = this.groundlayer.tileToWorldXY(pointerTileXY.x, pointerTileXY.y);
		this.marker.setPosition(snapperWorldPoint.x, snapperWorldPoint.y);
		
		if (this.input.manager.activePointer.isDown) {
			console.log('hello');
			this.towers.push(this.add.image(snapperWorldPoint.x + 16, snapperWorldPoint.y + 16, 'tower'));
		}
	}
}