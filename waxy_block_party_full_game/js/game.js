
let currentLevel = 1;

class WaxyScene extends Phaser.Scene {
    constructor() {
        super('WaxyScene');
        this.health = 100;
        this.score = 0;
    }

    preload() {
        this.load.image('waxy', 'assets/waxy.png');
        this.load.image('waxpack', 'assets/waxpack.png');
        this.load.image('bubble', 'assets/bubble.png');
        this.load.image('bully', 'assets/bully.png');
        this.load.audio('bgm', 'assets/bgm.mp3');
        this.load.audio('pop', 'assets/pop.wav');
        this.load.audio('collect', 'assets/collect.wav');

        this.load.image('bg1', 'assets/background1.png');
        this.load.image('bg2', 'assets/background2.png');
        this.load.image('bg3', 'assets/background3.png');
        this.load.image('bg4', 'assets/background4.png');
        this.load.image('bg5', 'assets/background5.png');
    }

    create() {
        this.music = this.sound.add('bgm', { loop: true });
        this.music.play();

        this.popSound = this.sound.add('pop');
        this.collectSound = this.sound.add('collect');

        const bgKey = 'bg' + currentLevel;
        this.add.image(400, 300, bgKey).setScale(1.5);

        this.player = this.physics.add.sprite(100, 450, 'waxy');
        this.player.setCollideWorldBounds(true);

        this.waxPacks = this.physics.add.group({ key: 'waxpack', repeat: 4, setXY: { x: 120, y: 0, stepX: 140 } });
        this.bubbles = this.physics.add.group();
        this.bullies = this.physics.add.group({ key: 'bully', repeat: 2, setXY: { x: 300, y: 0, stepX: 200 } });

        this.physics.add.overlap(this.player, this.waxPacks, this.collectWaxPack, null, this);
        this.physics.add.overlap(this.bubbles, this.bullies, this.hitBully, null, this);
        this.physics.add.overlap(this.player, this.bullies, this.bullyHitsWaxy, null, this);

        this.cursors = this.input.keyboard.createCursorKeys();
        this.spaceBar = this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE);

        this.healthText = this.add.text(16, 16, 'Health: 100', { fontSize: '20px', fill: '#fff' });
        this.scoreText = this.add.text(16, 40, 'Score: 0', { fontSize: '20px', fill: '#fff' });
    }

    update() {
        if (this.cursors.left.isDown) {
            this.player.setVelocityX(-160);
        } else if (this.cursors.right.isDown) {
            this.player.setVelocityX(160);
        } else {
            this.player.setVelocityX(0);
        }

        if (this.cursors.up.isDown && this.player.body.touching.down) {
            this.player.setVelocityY(-330);
        }

        if (Phaser.Input.Keyboard.JustDown(this.spaceBar)) {
            const bubble = this.bubbles.create(this.player.x + 20, this.player.y, 'bubble');
            bubble.setVelocityX(300);
            this.popSound.play();
        }
    }

    collectWaxPack(player, waxpack) {
        waxpack.disableBody(true, true);
        this.score += 10;
        this.scoreText.setText('Score: ' + this.score);
        this.collectSound.play();

        if (this.waxPacks.countActive(true) === 0) {
            currentLevel++;
            if (currentLevel > 5) {
                alert("You win the 1/1 Limited WAXPAX Card!");
                currentLevel = 1;
            }
            this.scene.restart();
        }
    }

    hitBully(bubble, bully) {
        bubble.destroy();
        bully.destroy();
        this.score += 20;
        this.scoreText.setText('Score: ' + this.score);
    }

    bullyHitsWaxy(player, bully) {
        this.health -= 10;
        this.healthText.setText('Health: ' + this.health);
        if (this.health <= 0) {
            alert("Game Over! Try again.");
            currentLevel = 1;
            this.scene.restart();
        }
    }
}

const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 500 },
            debug: false
        }
    },
    scene: WaxyScene
};

const game = new Phaser.Game(config);
