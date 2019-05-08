import Phaser from 'phaser';

import constants from '../src/config/constants';
import GameScene from '../src/scenes/game';

const config = {
	type: Phaser.AUTO,
	width: constants.WIDTH,
	height: constants.HEIGHT,
	scene: [GameScene]
};

new Phaser.Game(config);
console