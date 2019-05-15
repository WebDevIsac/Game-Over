import Bullet from './Bullet';

export default class Tower extends Phaser.GameObjects.Image {
    constructor(scene, x, y, texture, frame) {
        super(scene, x, y, texture, frame);
        scene.add.existing(this);
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
		console.log(monster);
        let bullet = new Bullet({
            scene: this.scene,
            x: tower.x,
            y: tower.y,
            key: 'bullet'
        });
        // console.log(bullet);
		let tween = this.scene.tweens.add({
			targets: bullet,
			x: monster.x,
			y: monster.y,
			duration: 150,
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
				console.log(monster);
			}
		});
		
		setTimeout(() => {
			tower.disabled = false;
		}, 2000);
	}
    
}