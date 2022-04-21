class gameImage {
    constructor({
        position,
        imageSrc,
        height = null,
        width = null,
    }) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        this.image.height = height
        this.image.width = width
    }
    draw() {
        c.drawImage(
            this.image,
            this.position.x,
            this.position.y,
            this.image.width,
            this.image.height)

    }

    update() {
        this.draw()
    };
};


class Sprite {
    constructor({
        position,
        imageSrc,
        height = null,
        width = null,
        scale = 1,
        framesMax = 1,
        offset = {
            x: 0,
            y: 0
        }
    }) {
        this.position = position
        this.height = 150
        this.width = 50
        this.image = new Image()
        this.image.src = imageSrc
        if (height !== null) this.image.height = height

        if (width !== null) this.image.width = width

        this.scale = scale
        this.framesMax = framesMax
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.offset = offset
    };

    draw() {
        c.drawImage(
            this.image,
            this.framesCurrent * (this.image.width / this.framesMax),
            0,
            this.image.width / this.framesMax,
            this.image.height,
            this.position.x - this.offset.x,
            this.position.y - this.offset.y,
            (this.image.width / this.framesMax) * this.scale,
            this.image.height * this.scale)

    }
    animateFrames() {
        this.framesElapsed += 2
        if (this.framesElapsed % this.framesHold === 0) {
            if (this.framesCurrent < this.framesMax - 1) {
                this.framesCurrent++
            } else {
                this.framesCurrent = 0
            }
        }
    }

    update() {
        this.draw()
        this.animateFrames()
    };
};

class Fighter extends Sprite {
    constructor({
        position,
        velocity,
        color = 'red',
        imageSrc,
        scale = 1,
        framesMax = 1,
        offset = {
            x: 0,
            y: 0
        },
        sprites,
        attackBox = {
            offset: {},
            width: undefined,
            height: undefined
        }
    }) {
        super({
            position,
            imageSrc,
            scale,
            framesMax,
            offset
        })
        this.position = position
        this.velocity = velocity
        this.height = 150
        this.width = 50
        this.lastKey
        this.attackBox = {
            position: {
                x: this.position.x,
                y: this.position.y
            },
            offset: attackBox.offset,
            width: attackBox.width,
            height: attackBox.height
        }
        this.color = color
        this.jumpCount = 0
        this.isAttacking = false
        this.health = 100
        this.framesCurrent = 0
        this.framesElapsed = 0
        this.framesHold = 10
        this.sprites = sprites
        this.dead = false

        for (const sprite in this.sprites) {
            this.sprites[sprite].image = new Image();
            this.sprites[sprite].image.src = this.sprites[sprite].imageSrc
        }
    };


    update() {
        this.draw()
        if (!this.dead){
            this.animateFrames()
        }

        //attackboxes
        this.attackBox.position.x = this.position.x - this.attackBox.offset.x
        this.attackBox.position.y = this.position.y - this.attackBox.offset.y

        //draw the attackbox
        // c.fillRect(this.attackBox.position.x, this.attackBox.position.y, this.attackBox.width, this.attackBox.height)

        this.position.x += this.velocity.x
        this.position.y += this.velocity.y

        if (this.position.y + this.height + this.velocity.y >= canvas.height - 156) {
            this.velocity.y = 0;
            this.jumpCount = 0;
            this.position.y = 623;
        } else this.velocity.y += gravity
    };

    attack() {
        this.switchSprite('attack1');
        this.isAttacking = true
        // setTimeout(() => {
        //     this.isAttacking = false;
        // }, 100)
    }

    takeHit(){
        this.health -= 20;

        if (this.health <= 0){
            this.switchSprite('death');
        } else this.switchSprite('takeHit');
    };

    switchSprite(sprite) {
        //pula toda as animações quando o personagem morre
        if (this.image === this.sprites.death.image){ 
            if(this.framesCurrent === this.sprites.death.framesMax -1){
               this.dead = true 
            };
            
            return
        }

        //pula todas as outras animacoes com a animacao de ataque
        if (this.image === this.sprites.attack1.image && this.framesCurrent < this.sprites.attack1.framesMax - 1) return

        //pula todas as animações com a animação de tomar dano
        if (this.image === this.sprites.takeHit.image && this.framesCurrent < this.sprites.takeHit.framesMax - 1) return

        switch (sprite) {
            case 'idle':
                if (this.image !== this.sprites.idle.image) {
                    this.image = this.sprites.idle.image;
                    this.framesMax = this.sprites.idle.framesMax;
                    this.framesCurrent = 0;
                };
                break;
            case 'run':
                if (this.image !== this.sprites.run.image) {
                    this.image = this.sprites.run.image;
                    this.framesMax = this.sprites.run.framesMax;
                    this.framesCurrent = 0;
                };
                break;
            case 'jump':
                if (this.image !== this.sprites.jump.image) {
                    this.image = this.sprites.jump.image;
                    this.framesMax = this.sprites.jump.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'fall':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.fall.image;
                    this.framesMax = this.sprites.fall.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'attack1':
                if (this.image !== this.sprites.fall.image) {
                    this.image = this.sprites.attack1.image;
                    this.framesMax = this.sprites.attack1.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'takeHit':
                if (this.image !== this.sprites.takeHit.image) {
                    this.image = this.sprites.takeHit.image;
                    this.framesMax = this.sprites.takeHit.framesMax;
                    this.framesCurrent = 0;
                }
                break;
            case 'death':
                if (this.image !== this.sprites.death.image) {
                    this.image = this.sprites.death.image;
                    this.framesMax = this.sprites.death.framesMax;
                    this.framesCurrent = 0;
                }
                break;
        };
    };
};