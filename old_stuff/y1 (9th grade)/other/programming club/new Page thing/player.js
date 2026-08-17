function Player(x,y){
    this.x = x;
    this.y = y;
    this.gravity = 0.06;
    this.gravitySpeed = 0;
    this.doGrav = true;
    this.hasJumped = false;
    this.jumpNum = 0;
    this.jumpSpeed = 0;
    this.airResist =  .08;
    this.friction = 0.1;
    this.moveX = 0;
    this.move = function(direction){
        if(direction == 1){
            //this.x += 20;
            this.moveX = 4;
        }
        else if(direction == 2){
            //this.x -= 20;
            this.moveX = -4;
        }
        else if(direction == 3){
            //this.y -= 20;
            //if(this.jumpNum <= 0){
                this.jumpSpeed = 6;
                this.hasJumped = true;
            //}
            this.jumpNum = 1;
        }
        else if(direction == 4){
            this.y += 20;
        }
        ctx.clearRect(0,0,500,500);
        playerBox = new component(20,20,this.x,this.y,"red")
    }
    this.update = function(){
        this.accelerate = function(){
            if(this.y <  c.height - 20 && this.doGrav){
                this.y += this.gravitySpeed;
            }
            else if(!this.doGrav){
                this.y -= this.jumpSpeed
            }
            else if(this.y >= c.height){
                this.jumpNum = 0; 
                this.y = (c.height - 20);
                this.gravitySpeed = 0;
                  
            }
            ctx.clearRect(0,0,500,500);
            playerBox = new component(20,20,this.x,this.y,"red")
        }
        if(Math.abs(this.jumpSpeed) > 0.01){
            this.jumpSpeed -= this.airResist;
        }
        else if(Math.abs(this.jumpSpeed) < 0.01 && this.hasJumped){
            this.gravitySpeed = 0;      
            this.doGrav = true;
            this.hasJumped = false;
        }
        if (this.moveX >= 0.01){
            this.moveX -= this.friction;
            this.x += this.moveX
        }
        else if(this.moveX <= 0.01){
            this.moveX += this.friction;
            this.x += this.moveX
        }
        ctx.clearRect(0,0,500,500);
        playerBox = new component(20,20,this.x,this.y,"red")
        if(this.gravitySpeed <= 25){
            this.gravitySpeed += this.gravity;
        }
        
        this.accelerate();
    }
}