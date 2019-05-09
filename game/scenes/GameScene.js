import map from '../assets/tilemaps/map.json'
import tiles from '../assets/tilemaps/ground-plates.png'

export default class GameScene extends Phaser.Scene {
	constructor() {
		super('Game')
	}

	preload() {
		console.log(map)
		this.load.image('ground-plates', tiles);
		this.load.tilemapTiledJSON('map', map);

	};

	create() {

		this.map = this.make.tilemap({
			key: 'map'
		})

		this.groundtiles = this.map.addTilesetImage('ground-plates')

		this.groundlayer = this.map.createDynamicLayer('top', this.groundtiles, 0, 0)
	}

	update() {

	}
}