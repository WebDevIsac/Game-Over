export default class Bullet extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(
            config.scene,
            config.x,
            config.y,
            config.key    
        );
        this.scene = config.scene;
        this.scene.add.existing(this);
        this.anims.play(config.key);
    }
}