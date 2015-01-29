/**
 * Created by Zack on 1/28/2015.
 */
//---------------
//Frame Animation
//---------------
window.requestAnimFrame = (function(){
    return  window.requestAnimationFrame       ||
        window.webkitRequestAnimationFrame ||
        window.mozRequestAnimationFrame    ||
        function( callback ){
            window.setTimeout(callback, 1000 / 60);
        };
})();

function animloop(){
    requestAnimFrame(animloop);
    update();
}

var bricks;
var NROWS;
var NCOLS;
var BLOCKWIDTH = CHAR_WIDTH*2;
var BLOCKHEIGHT = CHAR_HEIGHT*2;

var MONSTER_X = new Array(5);
var MONSTER_Y = new Array(5);

function init(){
    initBlocks();
    randomMonsterPos();
}

function initBlocks()
{
    NROWS = Math.floor(STAGE_HEIGHT/(CHAR_HEIGHT*2));
    NCOLS = Math.floor(STAGE_WIDTH/(CHAR_WIDTH*2));

    bricks = new Array(NROWS);
    for (i=0; i < NROWS; i++)
    {
        bricks[i] = new Array(NCOLS);
        for (j=0; j < NCOLS; j++)
        {
            bricks[i][j] = 1;
        }
    }
}

function randomMonsterPos(){
    for(i = 0; i < 5; i++){
        MONSTER_X[i] = Math.floor(Math.random()*(STAGE_WIDTH-MONSTER_WIDTH));
        MONSTER_Y[i] = Math.floor(Math.random()*STAGE_HEIGHT);
        if(MONSTER_Y[i] <= STAGE_HEIGHT/4)
            MONSTER_Y[i] += STAGE_HEIGHT/4;
    }
}

function rect(x,y,w,h)
{
    ctx.beginPath();
    ctx.rect(x,y,w,h);
    ctx.closePath();
    ctx.fill();
}

//------------
//System Vars
//------------
var stage = document.getElementById("gameCanvas");
stage.width = STAGE_WIDTH;
stage.height = STAGE_HEIGHT;
var ctx = stage.getContext("2d");
ctx.fillStyle = "grey";
ctx.font = GAME_FONTS;

//---------------
//Preloading ...
//---------------
//Preload Art Assets
// - Sprite Sheet: Image API:
// http://www.html5canvastutorials.com/tutorials/html5-canvas-images/
var charImage = new Image();
charImage.ready = false;
charImage.happy = true;
charImage.onload = setAssetReady;
charImage.src = PATH_CHAR;  // source image location set in constants.js

function setAssetReady()
{
    this.ready = true;
}

//Display Preloading
ctx.fillRect(0,0,stage.width,stage.height);
ctx.fillStyle = "#000";
ctx.fillText(TEXT_PRELOADING, TEXT_PRELOADING_X, TEXT_PRELOADING_Y);
var preloader = setInterval(preloading, TIME_PER_FRAME);
var gameloop, currX, currY;

function preloading()
{
    if (charImage.ready)
    {
        init();
        clearInterval(preloader);

        //gameloop = setInterval(update, TIME_PER_FRAME);
        gameloop = animloop();
    }
}

//------------
//Game Loop
//------------
//Charater Start Position
var charX = CHAR_START_X;
var charY = CHAR_START_Y;
var movingLeft = true, movingRight = false, movingUp = false, movingDown = false;

function update()
{
    //Draw Image
    drawMap();

    //Draw the character on screen
    if(movingLeft){
        ctx.drawImage(charImage, IMAGE_START_X_LEFT, IMAGE_START_Y_LEFT, CHAR_WIDTH, CHAR_HEIGHT,
            charX, charY, CHAR_WIDTH*2,CHAR_HEIGHT*2);
    }
    else if(movingRight){
        ctx.drawImage(charImage, IMAGE_START_X_RIGHT, IMAGE_START_Y_RIGHT, CHAR_WIDTH, CHAR_HEIGHT,
            charX, charY, CHAR_WIDTH*2,CHAR_HEIGHT*2);
    }
    else if(movingUp){
        ctx.drawImage(charImage, IMAGE_START_X_UP, IMAGE_START_Y_UP, CHAR_WIDTH, CHAR_HEIGHT,
            charX, charY, CHAR_WIDTH*2,CHAR_HEIGHT*2);
    }
    else{
        ctx.drawImage(charImage, IMAGE_START_X_DOWN, IMAGE_START_Y_DOWN, CHAR_WIDTH, CHAR_HEIGHT,
            charX, charY, CHAR_WIDTH*2,CHAR_HEIGHT*2);
    }


    //Capture keyboard presses
    document.onkeydown=function(e){
        switch(e.keyCode){
            case 37:
                moveLeft();
                break;
            case 38:
                moveUp();
                break;
            case 39:
                moveRight();
                break;
            case 40:
                moveDown();
                break;
        }
    };
}


//--------------
//Character Movement
//--------------
function moveLeft(){
    movingLeft = true;
    movingRight = false;
    movingUp = false;
    movingDown = false;
    row = Math.floor(charY/BLOCKHEIGHT);
    col = Math.floor(charX/BLOCKWIDTH);

    ctx.drawImage(charImage, IMAGE_START_X_LEFT, IMAGE_START_Y_LEFT, CHAR_WIDTH, CHAR_HEIGHT,
        charX, charY, CHAR_WIDTH*2,CHAR_HEIGHT*2);

    if(charY < NROWS*BLOCKHEIGHT && row >= 0 && col >= 0 && bricks[row][col] == 1){
        bricks[row][col] = 2;
    }

    charX -= CHAR_WIDTH;
    IMAGE_START_X_LEFT += CHAR_WIDTH;
    if (IMAGE_START_X_LEFT >= SPRITE_WIDTH_LEFT)
        IMAGE_START_X_LEFT = 64;
}

function moveRight(){
    movingLeft = false;
    movingRight = true;
    movingUp = false;
    movingDown = false;
    row = Math.floor(charY/BLOCKHEIGHT);
    col = Math.floor(charX/BLOCKWIDTH);

    ctx.drawImage(charImage, IMAGE_START_X_RIGHT, IMAGE_START_Y_RIGHT, CHAR_WIDTH, CHAR_HEIGHT,
        charX, charY, CHAR_WIDTH*2,CHAR_HEIGHT*2);

    if(charY < NROWS*BLOCKHEIGHT && row >= 0 && col >= 0 && bricks[row][col] == 1){
        bricks[row][col] = 2;
    }

    charX += CHAR_WIDTH;
    IMAGE_START_X_RIGHT += CHAR_WIDTH;
    if (IMAGE_START_X_RIGHT >= SPRITE_WIDTH_RIGHT)
        IMAGE_START_X_RIGHT = 0;
}

function moveUp(){
    movingLeft = false;
    movingRight = false;
    movingUp = true;
    movingDown = false;
    row = Math.floor(charY/BLOCKHEIGHT);
    col = Math.floor(charX/BLOCKWIDTH);

    ctx.drawImage(charImage, IMAGE_START_X_UP, IMAGE_START_Y_UP, CHAR_WIDTH, CHAR_HEIGHT,
        charX, charY, CHAR_WIDTH*2,CHAR_HEIGHT*2);

    if(charY < NROWS*BLOCKHEIGHT && row >= 0 && col >= 0 && bricks[row][col] == 1){
        bricks[row][col] = 2;
    }

    charY -= CHAR_HEIGHT;
    IMAGE_START_X_UP += CHAR_WIDTH;
    if (IMAGE_START_X_UP >= SPRITE_WIDTH_UP)
        IMAGE_START_X_UP = 32;
}

function moveDown(){
    movingLeft = false;
    movingRight = false;
    movingUp = false;
    movingDown = true;
    row = Math.floor(charY/BLOCKHEIGHT);
    col = Math.floor(charX/BLOCKWIDTH);

    ctx.drawImage(charImage, IMAGE_START_X_DOWN, IMAGE_START_Y_DOWN, CHAR_WIDTH, CHAR_HEIGHT,
        charX, charY, CHAR_WIDTH*2,CHAR_HEIGHT*2);

    if(charY < NROWS*BLOCKHEIGHT && row >= 0 && col >= 0 && bricks[row][col] == 1){
        bricks[row][col] = 2;
    }

    charY += CHAR_HEIGHT;
    IMAGE_START_X_DOWN += CHAR_WIDTH
    if (IMAGE_START_X_DOWN >= SPRITE_WIDTH_DOWN)
        IMAGE_START_X_DOWN = 96 ;
}

//-----------------
//Monster spawning
//-----------------


//-----------------
//Map Drawing
//-----------------
function drawMap(){
    for(i = 0; i < NROWS; i++){
        for(j = 0; j < NCOLS; j++){
            if(bricks[i][j] == 2) {
                ctx.fillStyle = "black";
                rect(j * BLOCKWIDTH, i * BLOCKHEIGHT, BLOCKWIDTH, BLOCKHEIGHT);
            }
            else if(i < NROWS/4) {
                ctx.fillStyle = "#58D3F7";
                rect(j * BLOCKWIDTH, i * BLOCKHEIGHT, BLOCKWIDTH, BLOCKHEIGHT);
                bricks[i][j] = 0;
            }
            else if(i >= NROWS/4 && i < NROWS/2) {
                ctx.fillStyle = "#FFBF00";
                rect(j * BLOCKWIDTH, i * BLOCKHEIGHT, BLOCKWIDTH, BLOCKHEIGHT);
            }
            else if(i >= NROWS/2 && i < (3*NROWS)/4) {
                ctx.fillStyle = "#B43104";
                rect(j * BLOCKWIDTH, i * BLOCKHEIGHT, BLOCKWIDTH, BLOCKHEIGHT);
            }
            else {
                ctx.fillStyle = "#610B0B";
                rect(j * BLOCKWIDTH, i * BLOCKHEIGHT, BLOCKWIDTH, BLOCKHEIGHT);
            }
        }
    }
}