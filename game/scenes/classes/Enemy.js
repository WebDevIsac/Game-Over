export default class Enemy extends Phaser.GameObjects.Sprite {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);

        // let path = scene.add.path(180, 0);
        // path.lineTo(176, 208);
        // path.lineTo(496, 208);
        // path.lineTo(496, 368);
        // path.lineTo(304, 368);
        // path.lineTo(304, 624);

        var tween = scene.tweens.add({
            targets: this,
            x: 176,               // '+=100'
            y: 208,               // '+=100'
            ease: 'Linear',       // 'Cubic', 'Elastic', 'Bounce', 'Back'
            duration: 1000,
            repeat: 0,            // -1: infinity
            yoyo: false
        });
    }
}