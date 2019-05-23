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

    checkForEnemies(group) {
        let towerRange = 100;
        group.children.entries.map(enemy => {
            if (!this.disabled) {
                let posY = this.y - enemy.y;
                let posX = this.x - enemy.x;
                if (posY < towerRange && posY > -towerRange && posX < towerRange && posX > -towerRange) {
                    this.shoot(this, enemy, group);
                }
            }
        });
    }

    shoot(tower, enemy, enemyGroup) {
        tower.disabled = true;

        let bullet = new Bullet({
            scene: this.scene,
            x: tower.x,
            y: tower.y - 12,
            key: 'bullet'
        });

        let tween = this.scene.tweens.add({
            targets: bullet,
            x: enemy.x,
            y: enemy.y,
            duration: 150,
            ease: "Linear",
            // easeParams: [1.5, 0.5],
            onComplete: function () {
                // enemy.life--;
                setTimeout(() => {
                    bullet.destroy();
                    enemyGroup.remove(enemy, true, false);
                    // if (enemy.life === 0) {
                    // }
                }, 10);
            }
        });

        setTimeout(() => {
            tower.disabled = false;
        }, 2000);
    }

}