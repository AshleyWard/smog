/** @type {import("../../typings/phaser")} */




class GameScene extends Phaser.Scene {
    constructor() {
        super( { key: 'GameScene' } );
    }


    preload ()
    {	
        this.load.aseprite('dog', './src/img/dog.png', './src/img/dog.json');
        //this.load.spritesheet('dog', './src/img/dog.png', { frameWidth:30, frameHeight:17 } );  //48 x 48
        //this.load.image('ex', './src/img/ex.png') ;  //48 x 48
    }

    create ()
    {	
        // Controls
        //#region 
        gameState.controls = {
            jump: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.SPACE),
            attack: this.input.keyboard.addKey(Phaser.Input.Keyboard.KeyCodes.Q)
        }

        gameState.keyboard = this.input.keyboard.keys
        gameState.cursors = this.input.keyboard.createCursorKeys(); //  Input Events	
        //#endregion

        //var dog = this.add.sprite(100, 100, 'dog', 0).setScale(4);
        //var dog2 = this.add.sprite(200, 100, 'dog', 0).setScale(4);
        
        this.anims.createFromAseprite('dog');
        gameState.dog = this.physics.add.sprite(200, 200).setScale(8).play({ key: 'stand', repeat: -1 });
        
        gameState.dog.play('stand');
        gameState.dog.speed = 100;

        gameState.dog.setSize(24, 17, true);
        
        
        console.log(gameState.dog);


        gameState.actions.attack = (dog) => {
            dog.anims.play( { key: 'swing', frameRate: 24, repeat: 0 }, true);
            dog.setVelocityX(0);
            dog.setVelocityY(0);
        }


    }

    update ()
    {	
        let left    = gameState.cursors.left.isDown;
        let right   = gameState.cursors.right.isDown;
        let up      = gameState.cursors.up.isDown;
        let down    = gameState.cursors.down.isDown;

        //let jump = gameState.controls.jump.isDown;
        let attack = gameState.controls.attack.isDown;

        let horizontalInput = (left || right);
        let verticalInput = (up || down);
        let anyDirection   = (horizontalInput || verticalInput);

        var dog = gameState.dog;

        // WASD
        //#region 
        if (left)
        {
            dog.setFlipX(false);
            dog.setVelocityX(-dog.speed)
        }
        if (right)
        {
            dog.setFlipX(true);
            dog.setVelocityX(dog.speed)
        }
        if (up)
        {
            dog.setVelocityY(-dog.speed)
        }
        if (down)
        {
            dog.setVelocityY(dog.speed)
        }


        // Action Keys
        //#region 
        if (attack) {
            gameState.actions.attack(gameState.dog);
        }
        //#endregion
        

        if (!horizontalInput) {
            dog.setVelocityX(0)
        }
        if (!verticalInput) {
            dog.setVelocityY(0)
        }

        if (!attack && anyDirection) {
            dog.playAfterRepeat('walk', 1);
        } 
        if (!attack && !anyDirection) {
            dog.playAfterRepeat('stand', 1);
        }
        //#endregion

        // Multiple controls at once...
        //#region
        /*
        if (!left && !right || left && right)
        {
            player.setVelocityX(0);
        }
        if (!up && !down || up && down)
        {
            player.setVelocityY(0);
        }*/
        //#endregion

    }
}


var gameState = {
    player: {},
    actions: {},
    controls: {}
};


var config = {
    type: Phaser.AUTO,
    width: 800,
    height: 650,
	backgroundColor: 0x80AADC,
    physics: {
        default: 'arcade',
        arcade: {
            //gravity:    { y: 500 },
            enableBody: true,
            debug: true
        }
    },
    scene: [GameScene]
};


let game = new Phaser.Game(config);