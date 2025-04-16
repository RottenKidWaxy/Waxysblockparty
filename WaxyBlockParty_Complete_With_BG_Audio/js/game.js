const config = {
    type: Phaser.AUTO,
    width: 800,
    height: 600,
    physics: {
        default: 'arcade',
        arcade: {
            gravity: { y: 300 },
            debug: false
        }
    },
    scene: {
        preload: preload,
        create: create,
        update: update
    }
};

let player;
let cursors;
let boxes;
let score = 0;
let scoreText;

const game = new Phaser.Game(config);

function preload () {
    this.load.image('background', 'assets/sprites/background.png');
    this.load.image('box', 'assets/sprites/box.png');
    this.load.spritesheet('waxy', 'assets/sprites/waxy.png', { frameWidth: 32, frameHeight: 48 });
}

function create () {
    this.add.image(400, 300, 'background');

    boxes = this.physics.add.group({
        key: 'box',
        repeat: 9,
        setXY: { x: 100, y: 0, stepX: 70 }
    });

    player = this.physics.add.sprite(100, 450, 'waxy');

    player.setBounce(0.2);
    player.setCollideWorldBounds(true);

    this.anims.create({
        key: 'left',
        frames: this.anims.generateFrameNumbers('waxy', { start: 0, end: 3 }),
        frameRate: 10,
        repeat: -1
    });

    this.anims.create({
        key: 'turn',
        frames: [ { key: 'waxy', frame: 4 } ],
        frameRate: 20
    });

    this.anims.create({
        key: 'right',
        frames: this.anims.generateFrameNumbers('waxy', { start: 5, end: 8 }),
        frameRate: 10,
        repeat: -1
    });

    cursors = this.input.keyboard.createCursorKeys();

    scoreText = this.add.text(16, 16, 'Boxes: 0', { fontSize: '32px', fill: '#FFF' });

    this.physics.add.overlap(player, boxes, collectBox, null, this);
}

function update () {
    if (cursors.left.isDown) {
        player.setVelocityX(-160);
        player.anims.play('left', true);
    } else if (cursors.right.isDown) {
        player.setVelocityX(160);
        player.anims.play('right', true);
    } else {
        player.setVelocityX(0);
        player.anims.play('turn');
    }

    if (cursors.up.isDown && player.body.touching.down) {
        player.setVelocityY(-330);
    }
}

function collectBox (player, box) {
    box.disableBody(true, true);
    score += 1;
    scoreText.setText('Boxes: ' + score);
}
