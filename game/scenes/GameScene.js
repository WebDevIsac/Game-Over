// Map assets
import map from "../assets/tilemaps/larger-map.json";
import tiles from "../assets/tilemaps/tuxmon-sample-32px.png";

// Sprite and images
import tower from "../assets/towers/stone-tower-64px.png";
import bullet from "../assets/bullets/small-spike.png";
import monster from "../assets/sprites/monster39x40.png";
import dragon from "../assets/sprites/stormlord-dragon96x64.png";
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
		let heartIcon = this.add.image(1100, 120, "heart");
		let goldIcon = this.add.image(1100, 50, "gold").setScale(0.15);

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

		nextWaveText
			.setInteractive()
			.on("pointerdown", (pointer, localX, localY, event) => {
				if (this.scene.systems.tweens._active.length > 0) {
					console.log("NEJ");
					return;
				}
				const currentEnemy = enemiesBeforeSpawn.shift();
				spawn(currentEnemy, currentEnemy.children.entries[0].animName);
				enemiesAfterSpawn.push(currentEnemy);
			});

		// Set mouse marker
		this.circle = this.add.graphics();
		this.marker.lineStyle(5, 0xffffff, 1);
		this.marker.strokeRect(0, 0, 64, 64);
		this.marker.lineStyle(3, 0xff4f78, 1);
		this.marker.strokeRect(0, 0, 64, 64);

		// Towers group
		let towers = this.add.group();
		this.towers = towers;
		this.arrayOfTowers = towers.getChildren();

		const checkForTowers = () => {
			// Check if current tile is not enemy path

			// let currentTile = this.map.getTileAtWorldXY(this.snapperWorldPoint.x + 32, this.snapperWorldPoint.y + 32);

			let posX = this.snapperWorldPoint.x;
			let posY = this.snapperWorldPoint.y;

			if (this.map.getTileAtWorldXY(posX, posY).properties.collide) return false;
			if (this.map.getTileAtWorldXY(posX + 32, posY + 32).properties.collide) return false;
			if (this.map.getTileAtWorldXY(posX, posY + 32).properties.collide) return false;
			if (this.map.getTileAtWorldXY(posX + 32, posY).properties.collide) return false;

			// Check if tower already exists on pointer position
			if (this.arrayOfTowers.some(t => t.x === posX && t.y === posY + 32)) return false;
			if (this.arrayOfTowers.some(t => t.x === posX && t.y === posY)) return false;
			if (this.arrayOfTowers.some(t => t.x === posX && t.y === posY + 64)) return false;

			if (this.arrayOfTowers.some(t => t.x === posX + 32 && t.y === posY + 32)) return false;
			if (this.arrayOfTowers.some(t => t.x === posX + 32 && t.y === posY)) return false;
			if (this.arrayOfTowers.some(t => t.x === posX + 32 && t.y === posY + 64)) return false;

			if (this.arrayOfTowers.some(t => t.x === posX + 64 && t.y === posY + 32)) return false;
			if (this.arrayOfTowers.some(t => t.x === posX + 64 && t.y === posY)) return false;
			if (this.arrayOfTowers.some(t => t.x === posX + 64 && t.y === posY + 64)) return false;

			return true;
		}

		this.input.on("pointerup", () => {
			// Check if tile is allowed to place tower on
			if (!checkForTowers()) return;
			if (this.player.coins < 75) return;
			// Adding tower to towers group
			let tower = new Tower({
				scene: this,
				x: this.snapperWorldPoint.x + 32,
				y: this.snapperWorldPoint.y + 32,
				key: "tower"
			});
			towers.add(tower);

			// Tower costs 75 coins
			this.player.coins -= 75;
		});

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
				speed = 10000;

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
		let enemiesBeforeSpawn = [];
		let enemiesAfterSpawn = [];

		this.monsters = monsters;
		this.dragons = dragons;
		this.enemiesBeforeSpawn = enemiesBeforeSpawn;
		this.enemiesAfterSpawn = enemiesAfterSpawn;

		let startOffset = 0;
		let startPosX = 112;

		const createEnemies = (enemyName, enemyGroup, enemyType, animationName) => {
			for (let i = 0; i < 10; i++) {
				startOffset -= 300;
				enemyName = new Enemy(this, startPosX, startOffset, enemyType);
				enemyName.animName = animationName;
				enemyGroup.add(enemyName);
			}
		};

		// Creating and spawning enemies
		createEnemies(monster, monsters, "monster", "monsteranim");
		createEnemies(dragon, dragons, "dragon", "dragonanim");

		enemiesBeforeSpawn.push(monsters);
		enemiesBeforeSpawn.push(dragons);
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
		this.marker.setPosition(this.snapperWorldPoint.x, this.snapperWorldPoint.y);

		this.enemiesAfterSpawn.map(group => {
			if (this.towers.getLength() > 0 && group.getLength() > 0) {
				this.arrayOfTowers.map(tower => {
					tower.checkForEnemies(group);
				});
			}
		});
	}
}