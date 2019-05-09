import Phaser from 'phaser';

import constants from './config/constants';
import GameScene from './scenes/GameScene';

const config = {
	type: Phaser.AUTO,
	width: constants.WIDTH,
	height: constants.HEIGHT,
	scene: [GameScene]
};
let game;
const createGame = () => {
	game = new Phaser.Game(config);
}
export default createGame;