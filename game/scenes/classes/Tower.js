import Bullet from './Bullet';

export default class Tower extends Phaser.GameObjects.Sprite {
    constructor(config) {
        super(
            config.scene,
            config.x,
            config.y,
            config.key
        );
        this.scene = config.scene
        this.scene.add.existing(this);
    }

    checkForEnemies() {
        let enemy = this.scene.enemies.getFirst(true);
        if (!this.disabled) {
            let posY = this.y - enemy.y;
            let posX = this.x - enemy.x;
            if (posY < 100 && posY > -100 && posX < 100 && posX > -100) {
                this.shoot(this, enemy);
            } 
        }
    }

    shoot(tower, monster) {
		tower.disabled = true;
        let bullet = new Bullet({
            scene: this.scene,
            x: tower.x,
            y: tower.y - 12,
            key: 'bullet'
        });
        // console.log(bullet);
		let tween = this.scene.tweens.add({
			targets: bullet,
			x: monster.x,
			y: monster.y,
			duration: 300,
			ease: "Linear",
			// easeParams: [1.5, 0.5],
			onComplete: function() {
				// monster.life--;
				setTimeout(() => {
					bullet.destroy();
					// if (monster.life === 0) {
					monster.destroy();
					// }
				}, 10);
			}
		});
		
		setTimeout(() => {
			tower.disabled = false;
		}, 2000);
	}
    
}