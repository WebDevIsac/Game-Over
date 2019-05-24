export default class Enemy extends Phaser.GameObjects.Sprite {
	constructor(scene, x, y, key, frame, life) {
		super(scene, x, y, key, frame, life);
		scene.add.existing(this);
	}
}