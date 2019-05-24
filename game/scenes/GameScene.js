// Map assets
import map from "../assets/tilemaps/larger-map.json";
import tiles from "../assets/tilemaps/tuxmon-sample-32px.png";

// Sprite and images
import tower from "../assets/towers/stone-tower-64px.png";
import bullet from "../assets/bullets/small-spike.png";
import monster from "../assets/sprites/monster39x40.png";
import dragon from "../assets/sprites/stormlord-dragon96x64.png";
import tounge from "../assets/sprites/mon3_sprite_base.png";
import goldImage from "../assets/sprites/gold.png";
import heartImage from "../assets/sprites/heartFull.png";

// Classes
import Enemy from "./classes/Enemy";
import Tower from "./classes/Tower";

export default class GameScene extends Phaser.Scene {
	constructor() {
		super({
			key: "GameScene"
		});
	}

	preload() {
		// Load map
		this.load.image("tuxmon-sample-32px", tiles);
		this.load.tilemapTiledJSON("larger-map", map);
		// Load Image
		this.load.image("heart", heartImage);
		this.load.image("gold", goldImage);
		// Load tower and bullet
		this.load.image("tower", tower);
		this.load.spritesheet("bullet", bullet, {
			frameWidth: 10,
			frameHeight: 10
		});

		// Load monster
		this.load.spritesheet("monster", monster, {
			frameWidth: 39,
			frameHeight: 40
		});
		this.load.spritesheet("dragon", dragon, {
			frameWidth: 96,
			frameHeight: 64
		});
		this.load.spritesheet("tounge", tounge, {
			frameWidth: 64,
			frameHeight: 64,
			startFrame: 0,
			endFrame: 4
		  });
	}

	create() {
		let startingCoins = 450;
		let playerLife = 10;
		this.player = {
			coins: startingCoins,
			life: playerLife
		};

		// Create map
		this.map = this.make.tilemap({
			key: "larger-map"
		});

		// Animations
		this.anims.create({
			key: "monsteranim",
			frames: this.anims.generateFrameNumbers("monster"),
			repeat: -1
		});
		this.anims.create({
			key: "dragonanim",
			frames: this.anims.generateFrameNumbers("dragon"),
			repeat: -1
		});
		this.anims.create({
			key: "toungemonsteranim",
			frames: this.anims.generateFrameNumbers("tounge"),
			repeat: -1
		});
		this.anims.create({
			key: "bullet",
			frames: [{
				key: "bullet",
				frame: 0
			}]
		});

		// Set tiles
		this.groundtiles = this.map.addTilesetImage("tuxmon-sample-32px");

		// Set layer
		this.groundlayer = this.map.createStaticLayer(
			"top",
			this.groundtiles,
			0,
			0
		);

		// Side Menu
		let hp = 10;
		let goldAmount = 100;
		let goldIcon = this.add.image(1100, 50, "gold").setScale(0.15);
		let heartIcon = this.add.image(1100, 120, "heart");
		let towerIcon = this.add.image(1100, 300, 'tower');

		let hpText = this.add.text(1130, 100, hp, {
			fontFamily: "Roboto",
			fontSize: 32,
			color: "#FFF"
		});

		let nextWaveText = this.add.text(1080, 150, "Next Wave", {
			fontFamily: "Roboto",
			fontSize: 32,
			color: "#FFF"
		});

		nextWaveText.setInteractive().on("pointerdown", (pointer, localX, localY, event) => {
			if (this.scene.systems.tweens._active.length > 0) {
				console.log("NEJ");
				return;
			}
			const currentEnemy = enemiesBeforeSpawn.shift();
			spawn(currentEnemy, currentEnemy.children.entries[0].animName);
			enemiesAfterSpawn.push(currentEnemy);
		});

		towerIcon.setInteractive().on("pointerdown", () => {
			moveTower();
		});
		this.towerIcon = towerIcon;

		this.isMovingTower = false;
		const moveTower = () => {
			if (this.isMovingTower) {
				this.isMovingTower = false;
				this.towerGrid.destroy();
				this.grid.destroy();
				this.towerMouse.destroy();
				this.circle.destroy();
				return;
			}
			this.isMovingTower = true;
			this.towerGrid = this.add.grid(32, 32, 64, 64, 32, 32, 0xff4f, 0.5);

			// Show tile grid
			this.grid = this.add.grid(512, 384, 1024, 768, 32, 32, 0xffffff, 0).setOutlineStyle(0xff4f);

			// Show tower image as marker
			this.towerMouse = this.add.image(0, 0, 'tower');


			// Show tower range
			let circle = new Phaser.Geom.Point(0, 0);
			let radius = 128;

			this.circle = this.add.graphics();
			this.circle.lineStyle(4, 0xff4f78, 1);
			this.circle.strokeCircle(circle.x, circle.y, radius);

			this.groundlayer.setInteractive().on("pointerdown", () => {
				if (this.isMovingTower) {
					console.log(this.isMovingTower);
					// Check if tile is allowed to place tower on
					if (!checkForTowers()) return;
					if (this.player.coins < 75) return;
					// Adding tower to towers group
					let tower = new Tower({
						scene: this,
						x: this.snapperWorldPoint.x,
						y: this.snapperWorldPoint.y,
						key: "tower"
					});
					towers.add(tower);

					// Tower costs 75 coins
					this.player.coins -= 75;

					this.isMovingTower = false;
					this.towerGrid.destroy();
					this.grid.destroy();
					this.towerMouse.destroy();
					this.circle.destroy();
				}
			});
		}



		// Towers group
		let towers = this.add.group();
		this.towers = towers;
		this.arrayOfTowers = towers.getChildren();

		const checkForTowers = () => {
			// Check if current tile is not enemy path

			let posX = this.snapperWorldPoint.x;
			let posY = this.snapperWorldPoint.y;

			if (this.map.getTileAtWorldXY(posX, posY).properties.collide) return false;
			if (this.map.getTileAtWorldXY(posX - 32, posY - 32).properties.collide) return false;
			if (this.map.getTileAtWorldXY(posX, posY - 32).properties.collide) return false;
			if (this.map.getTileAtWorldXY(posX - 32, posY).properties.collide) return false;

			// Check if tower already exists on pointer position
			if (this.arrayOfTowers.some(t => t.x === posX && t.y === posY - 32)) return false;
			if (this.arrayOfTowers.some(t => t.x === posX && t.y === posY)) return false;
			if (this.arrayOfTowers.some(t => t.x === posX && t.y === posY + 32)) return false;

			if (this.arrayOfTowers.some(t => t.x === posX - 32 && t.y === posY - 32)) return false;
			if (this.arrayOfTowers.some(t => t.x === posX - 32 && t.y === posY)) return false;
			if (this.arrayOfTowers.some(t => t.x === posX - 32 && t.y === posY + 32)) return false;

			if (this.arrayOfTowers.some(t => t.x === posX + 32 && t.y === posY - 32)) return false;
			if (this.arrayOfTowers.some(t => t.x === posX + 32 && t.y === posY)) return false;
			if (this.arrayOfTowers.some(t => t.x === posX + 32 && t.y === posY + 32)) return false;

			return true;
		}



		let path;
		let speed;
		let offset = 0;

		const spawn = (enemyObject, animationkey) => {
			enemyObject.children.entries.map(child => {
				path = this.add
					.path(child.x, child.y)
					.lineTo(136, 250)
					.lineTo(424, 250)
					.lineTo(424, 120)
					.lineTo(896, 120)
					.lineTo(896, 632)
					.lineTo(616, 632)
					.lineTo(616, 504)
					.lineTo(136, 504)
					.lineTo(136, 784);

				child.pathFollower = this.plugins.get("PathFollower").add(child, {
					path: path,
					t: 0,
					rotateToPath: false
				});
				offset += 1500;
				speed = enemyObject.speed * 100;

				this.tweens.add({
					targets: child.pathFollower,
					t: 1,
					ease: "Linear",
					duration: speed + offset,
					repeat: 0,
					yoyo: false,
					onComplete: function () {
						if (enemyObject.children.entries.some(e => e == child)) {
							child.destroy();
							hp -= 1;
							hpText.text = hp;
						} else {
							child.destroy();
						}
					}
				});
				child.play(animationkey);
			});
		};

		// Enemy Groups
		let monsters = this.add.group();
		let dragons = this.add.group();
		let tounges = this.add.group();
		let enemiesBeforeSpawn = [];
		let enemiesAfterSpawn = [];

		this.monsters = monsters;
		this.dragons = dragons;
		this.tounges = tounges;
		this.enemiesBeforeSpawn = enemiesBeforeSpawn;
		this.enemiesAfterSpawn = enemiesAfterSpawn;

		let startOffset;
		let startPosX = 112;

		const createEnemies = (enemyName, enemyGroup, enemyType, animationName, groupSpeed) => {
			startOffset = 0;
			for (let i = 0; i < 10; i++) {
				startOffset -= 300;
				enemyName = new Enemy(this, startPosX, startOffset, enemyType);
				enemyName.animName = animationName;
				enemyGroup.add(enemyName);
				enemyGroup.speed = groupSpeed;
			}
		};

		// Creating and spawning enemies
		createEnemies(monster, monsters, "monster", "monsteranim", 50);
		createEnemies(dragon, dragons, "dragon", "dragonanim", 100);
		createEnemies(tounge, tounges, "tounge", "toungemonsteranim", 100);
		enemiesBeforeSpawn.push(monsters);
		enemiesBeforeSpawn.push(tounges);
		enemiesBeforeSpawn.push(dragons);
	}

	update() {
		// Update mouse marker
		this.worldPoint = this.input.activePointer;
		this.pointerTileXY = this.groundlayer.worldToTileXY(this.worldPoint.x, this.worldPoint.y);
		this.snapperWorldPoint = this.groundlayer.tileToWorldXY(this.pointerTileXY.x, this.pointerTileXY.y);

		if (this.isMovingTower) {
			this.towerGrid.setPosition(this.snapperWorldPoint.x, this.snapperWorldPoint.y);
			this.towerMouse.setPosition(this.snapperWorldPoint.x, this.snapperWorldPoint.y);
			this.circle.setPosition(this.snapperWorldPoint.x, this.snapperWorldPoint.y);
		}

		if (this.player.coins < 75) {
			this.towerIcon.setAlpha(0.2);
			this.towerIcon.disableInteractive();
		}
		else {
			this.towerIcon.setAlpha(1);
			this.towerIcon.setInteractive();
		}

		this.enemiesAfterSpawn.map(group => {
			if (this.towers.getLength() > 0 && group.getLength() > 0) {
				this.arrayOfTowers.map(tower => {
					tower.checkForEnemies(group);
				});
			}
		});
	}
}
