// Map assets
import map from "../assets/tilemaps/larger-map.json";
import tiles from "../assets/tilemaps/tuxmon-sample-32px.png";

// Sprite and images
import tower from "../assets/towers/stone-tower-64px.png";
import bullet from "../assets/bullets/small-spike.png";
import enemySpriteMonster from "../assets/sprites/monster39x40.png";
import enemySpriteDragon from "../assets/sprites/stormlord-dragon96x64.png";
import enemySpriteBlob from "../assets/sprites/mon3_sprite_base.png";
import enemySpriteBlob2 from "../assets/sprites/mon1_sprite.png";
import enemySpriteMetalFace from "../assets/sprites/metalface78x92.png";
import enemySpriteSkeleton from "../assets/sprites/mon2_sprite_base.png";
import goldImage from "../assets/sprites/gold.png";
import heartImage from "../assets/sprites/heartFull.png";


// Classes
import Enemy from "../classes/Enemy";
import Tower from "../classes/Tower";

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
		this.load.spritesheet("monster", enemySpriteMonster, {
			frameWidth: 39,
			frameHeight: 40
		});
		this.load.spritesheet("dragon", enemySpriteDragon, {
			frameWidth: 96,
			frameHeight: 64
		});
		this.load.spritesheet("blob", enemySpriteBlob, {
			frameWidth: 64,
			frameHeight: 64,
			startFrame: 0,
			endFrame: 4
		});
		this.load.spritesheet("blob2", enemySpriteBlob2, {
			frameWidth: 50,
			frameHeight: 50,
			startFrame: 0,
			endFrame: 4
		});
		this.load.spritesheet("skeleton", enemySpriteSkeleton, {
			frameWidth: 64,
			frameHeight: 64,
			startFrame: 0,
			endFrame: 3
		});
		this.load.spritesheet("metalface", enemySpriteMetalFace, {
			frameWidth: 78,
			frameHeight: 92,
		});
	}

	create() {

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
			key: "blobanim",
			frames: this.anims.generateFrameNumbers("blob"),
			repeat: -1
		});
		this.anims.create({
			key: "blobanim2",
			frames: this.anims.generateFrameNumbers("blob2"),
			repeat: -1
		});
		this.anims.create({
			key: "skeletonanim",
			frames: this.anims.generateFrameNumbers("skeleton"),
			repeat: -1
		});
		this.anims.create({
			key: "metalfaceanim",
			frames: this.anims.generateFrameNumbers("metalface"),
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
		let startingGold = 150;
		let playerLife = 10;
		this.player = {
			gold: startingGold,
			life: playerLife
		};

		let heartIcon = this.add.image(1100, 120, "heart");
		let goldIcon = this.add.image(1100, 50, "gold").setScale(0.15);
		let towerIcon = this.add.image(1100, 340, 'tower');

		let hpText = this.add.text(1130, 100, this.player.life, {
			fontFamily: "Roboto",
			fontSize: 32,
			color: "#FFF"
		});

		let goldText = this.add.text(1125, 35, this.player.gold, {
			fontFamily: "Roboto",
			fontSize: 32,
			color: "#FFF"
		});

		let nextWaveText = this.add.text(1080, 150, "Next Wave", {
			fontFamily: "Roboto",
			fontSize: 32,
			color: "#FFF"
		});
		this.nextWaveText = nextWaveText;

		let towerCost = this.add.text(1086, 280, "75", {
			fontFamily: "Roboto",
			fontSize: 24,
			color: "#FFF"
		});

		nextWaveText.setInteractive().on("pointerdown", () => {
			const currentEnemy = enemiesBeforeSpawn.shift();
			if (this.scene.systems.tweens._active.length > 0) {
				return;
			}
			spawn(currentEnemy, currentEnemy.children.entries[0].animName, this.scene);
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

			// Show tower grid
			this.towerGrid = this.add.grid(32, 32, 64, 64, 32, 32, 0xff4f, 0.5);

			// Show path grid
			// this.pathGrid = this.add.grid()

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

					// Check if tile is allowed to place tower on
					if (!checkForTowers()) return;
					if (this.player.gold < 75) return;
					// Adding tower to towers group
					let tower = new Tower({
						scene: this,
						x: this.snapperWorldPoint.x,
						y: this.snapperWorldPoint.y,
						key: "tower",
					});
					towers.add(tower);

					// Towers cost 75 gold
					this.player.gold -= 75;
					goldText.text = this.player.gold;

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
		let offset;
		this.gameWon;

		const spawn = (enemyObject, animationkey, scene) => {
			speed = 0;
			offset = 0;
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
						if (enemiesBeforeSpawn.length === 0) {
							if (enemyObject.children.entries.length === 0) {
								this.parent.scene.gameWon = true;
								scene.start("EndScene");
							}
						}
						if (enemyObject.children.entries.some(e => e == child)) {
							child.destroy();
							playerLife -= 1;
							hpText.text = playerLife;
							if (playerLife === 0) {
								this.parent.scene.gameWon = false;
								scene.start("EndScene");
							}
						} else {
							child.destroy();
						}
					}
				}, this);
				child.play(animationkey);
			});
		};
		// Enemy Groups
		let monsterGroup = this.add.group();
		let dragonGroup = this.add.group();
		let blobGroup = this.add.group();
		let blobGroup2 = this.add.group();
		let skeletonGroup = this.add.group();
		let metalfaceGroup = this.add.group();

		let enemiesBeforeSpawn = [];
		let enemiesAfterSpawn = [];

		this.enemiesBeforeSpawn = enemiesBeforeSpawn;
		this.enemiesAfterSpawn = enemiesAfterSpawn;

		let startOffset;
		let startPosX = 112;

		const createEnemies = (
			enemyName,
			enemyGroup,
			enemyType,
			animationName,
			groupSpeed,
			enemyLife,
			enemyScale
		) => {
			startOffset = 0;
			for (let i = 0; i < 10; i++) {
				startOffset -= 300;
				enemyName = new Enemy(this, startPosX, startOffset, enemyType);
				enemyName.animName = animationName;
				if (enemyScale) {
					enemyName.setScale(enemyScale)
				}

				enemyName.life = enemyLife;
				enemyGroup.add(enemyName);
				enemyGroup.speed = groupSpeed;
			}
		};

		// Creating and spawning enemies
		createEnemies(enemySpriteMonster, monsterGroup, "monster", "monsteranim", 120, 2, 1.2);
		createEnemies(enemySpriteBlob, blobGroup, "blob", "blobanim", 120, 5, 1.5);
		createEnemies(enemySpriteBlob2, blobGroup2, "blob2", "blobanim2", 20, 5, 1.5);
		createEnemies(enemySpriteSkeleton, skeletonGroup, "skeleton", "skeletonanim", 100, 6, 1.3);
		createEnemies(enemySpriteDragon, dragonGroup, "dragon", "dragonanim", 100, 7);
		createEnemies(enemySpriteMetalFace, metalfaceGroup, "metalface", "metalfaceanim", 200, 10, 0.9);

		enemiesBeforeSpawn.push(monsterGroup);
		enemiesBeforeSpawn.push(blobGroup);
		enemiesBeforeSpawn.push(blobGroup2);
		enemiesBeforeSpawn.push(skeletonGroup)
		enemiesBeforeSpawn.push(dragonGroup);
		enemiesBeforeSpawn.push(metalfaceGroup)

	}

	update() {

		// Update mouse marker
		this.worldPoint = this.input.activePointer;
		this.pointerTileXY = this.groundlayer.worldToTileXY(
			this.worldPoint.x,
			this.worldPoint.y
		);
		this.snapperWorldPoint = this.groundlayer.tileToWorldXY(
			this.pointerTileXY.x,
			this.pointerTileXY.y
		);

		if (this.isMovingTower) {
			this.towerGrid.setPosition(this.snapperWorldPoint.x, this.snapperWorldPoint.y);
			this.towerMouse.setPosition(this.snapperWorldPoint.x, this.snapperWorldPoint.y);
			this.circle.setPosition(this.snapperWorldPoint.x, this.snapperWorldPoint.y);
		}

		if (this.player.gold < 75) {
			this.towerIcon.setAlpha(0.2);
			this.towerIcon.disableInteractive();
		} else {
			this.towerIcon.setAlpha(1);
			this.towerIcon.setInteractive();
		}

		if (this.scene.systems.tweens._active.length > 0) {
			this.nextWaveText.setAlpha(0.2);
			this.nextWaveText.disableInteractive();
		} else {
			this.nextWaveText.setAlpha(1);
			this.nextWaveText.setInteractive();
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