$(document).ready(function(){

    // canvas variabelen definiëren
    var canvas = $('#gameField')[0];
    var context = canvas.getContext("2d");
    var width = canvas.width;
    var height = canvas.height;
    var celWidth = 15;
    var direction = "right";
    var food;
    var score;
    var color = "#69AE17";
    var speed = 70;/*ms*/
    var game_loop;

    // snake array
    var snakeArray;

    //startGameialize, call other functions
    $('a').on('click',function startGame(){
        $('#overlayStart').fadeOut(200);
        $('#overlayEnd').fadeOut(200);
        direction = "right";
        createSnake();
        createBlock();
        score = 0;
        // make snake move
        if(typeof game_loop != "undefined") clearInterval(game_loop);
        game_loop = setInterval(paint, speed);
    });

    // create snake
    function createSnake(){
        // default length
        var length = 5;
        snakeArray = [];
        for(var i = length - 1; i >= 0; i--){
            snakeArray.push({x: i, y: 0});
        }

    }

    // create food
    function createBlock(){
        // food object, block ergens op canvas plaatsen
        food = {
            x: Math.round(Math.random() * (width-celWidth)/ celWidth),
            y: Math.round(Math.random() * (height-celWidth) / celWidth)

        };


    }


    // paint snake
    function paint(){
        // paint canvas
        context.fillStyle = "black";
        // top hoek
        context.fillRect(0,0, width, height);
        context.strokeStyle = "white";
        context.strokeRect(0,0, width, height);

        // movement snake
        var nx = snakeArray[0].x;
        var ny = snakeArray[0].y;

        if(direction == 'right') nx++;
        else if(direction == 'left') nx--;
        else if(direction == 'up') ny--;
        else if(direction == 'down') ny++;

        // collision detection
        if(nx == -1 || nx == width/celWidth || ny == -1 || ny == height/celWidth || checkCollision(nx, ny, snakeArray)){
            //startGame();
            // final score insert
            $('#final_score').html(score);
            //overlay show
            $('#overlayEnd').fadeIn(200);
            //prevent user from playing further
            clearInterval(game_loop);
            return;
        }

        //add food to snake
        if(nx == food.x && ny == food.y){
            var tail = {
                x: nx,
                y: ny
            };
            score++;

            // nieuwe block op map zetten
            createBlock();
        }else{
            // positie is niet op block
            var tail = snakeArray.pop();
            tail.x = nx;
            tail.y = ny;
        }
        snakeArray.unshift(tail);

        for(var i = 0; i < snakeArray.length; i++){
            var cel = snakeArray[i];
            paintCell(cel.x, cel.y);
        }

        paintCell(food.x, food.y);

        // score check
        checkScore(score);

        //live score
        $('#score').html( 'Jouw score: ' + score);
    }

    function paintCell(x,y){
        context.fillStyle = color;
        // x & y post, w&h dynamisch want slang beweegt
        context.fillRect(x*celWidth, y*celWidth, celWidth, celWidth);

    }

    function checkCollision(x, y, array){
        for(var i = 0 ; i  < array.length; i++ ){
            if(array[i].x == x && array[i].y == y){
                return true;
            }
        }
        return false;
    }

    function checkScore(score){
        // check als er al een highscore is
        if(localStorage.getItem('highscore') === null){
            localStorage.setItem('highscore', score);
        }else{
            if(score > localStorage.getItem('highscore')){
                localStorage.setItem('highscore', score);
            }
        }

        $('#high_score').html('High score: ' + localStorage.highscore);
    }


    // controls
    $(document).keydown(function(e){
        var key = e.which; //indicate specific key that is pressed
        if(key == "37" && direction != "right") direction = "left";
        else if(key == "38" && direction != "down") direction = "up";
        else if(key == "39" && direction != "left") direction = "right";
        else if(key == "40" && direction != "up") direction = "down";

    });


});