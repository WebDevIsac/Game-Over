import Phaser from 'phaser';

import constants from './config/constants';
import GameScene from './scenes/GameScene';
import PathFollower from './assets/plugins/rexpathfollowerplugin.min';
import StartScene from './scenes/StartScene';

const config = {
	type: Phaser.AUTO,
	width: constants.WIDTH,
	height: constants.HEIGHT,
	scene: [StartScene, GameScene],
	plugins: {
		global: [{
			key: 'PathFollower',
			plugin: PathFollower,
			start: true
		}, ]
	}
};

let game;

const createGame = () => {
	game = new Phaser.Game(config);
}

export default createGame;