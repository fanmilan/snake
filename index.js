'use strict';
document.addEventListener("DOMContentLoaded", function(event) {
    const GAME_WIDTH = 25;
    const GAME_HEIGHT = 25;
    let direction = 'right';
    let snakeLength = 5;
    let speed = 1;
    let foodCoordinates = {};
    let snakeArr = [];
    let gameRunInterval;

    window.addEventListener('keydown', e => {
        e.preventDefault();
        switch (true) {
            case (e.key === 'ArrowUp') && (direction !== 'down'):
                direction = 'up';
                break
            case (e.key === 'ArrowDown') && (direction !== 'up'):
                direction = 'down';
                break
            case (e.key === 'ArrowLeft') && (direction !== 'right'):
                direction = 'left';
                break
            case (e.key === 'ArrowRight') && (direction !== 'left'):
                direction = 'right';
                break
        }
    })

    function createGameField(width = 3, height = 3)  {
        let gameFieldEl = document.querySelector('.game-field');
        for (let h=0; h<height; h++) {
            let gameFieldRowEl = document.createElement('div');
            gameFieldRowEl.className = 'game-field__row';
            for (let w=0; w<width; w++) {
                let gameFieldItemEl = document.createElement('div');
                gameFieldItemEl.className = 'game-field__item';
                gameFieldItemEl.setAttribute('data-x', w);
                gameFieldItemEl.setAttribute('data-y', h);
                gameFieldRowEl.append(gameFieldItemEl);
            }
            gameFieldEl.append(gameFieldRowEl);
        }
    }



    function createSnake() {
        let startPosXSnake = getRandomPos(snakeLength, GAME_WIDTH);
        let startPosYSnake = getRandomPos(snakeLength, GAME_HEIGHT);
        for (let i=0; i<snakeLength; i++) {
            let startFieldPosEl = document.querySelector([`.game-field__item[data-x='${startPosXSnake-i}'][data-y='${startPosYSnake}']`]);
            snakeArr.push(startFieldPosEl);
            startFieldPosEl.classList.add('snake');
        }
    }

    function createFood() {
        let foodEl, foodX, foodY;
        removeFoodFromField();
        do {
            foodX = getRandomPos(0, GAME_WIDTH);
            foodY = getRandomPos(0, GAME_HEIGHT);
            foodEl = document.querySelector([`.game-field__item[data-x='${foodX}'][data-y='${foodY}']`]);
        } while (foodEl.classList.contains('snake'));
        foodCoordinates.x = foodX;
        foodCoordinates.y = foodY;
        foodEl.classList.add('food');
    }

    function removeFoodFromField() {
        //if (foodCoordinates.x >=0 && foodCoordinates.y>=0) document.querySelector([`.game-field__item[data-x='${foodCoordinates.x}'][data-y='${foodCoordinates.y}']`]).classList.remove('food');
        if (foodCoordinates.x >=0 && foodCoordinates.y>=0) document.querySelector([`.game-field__item[data-x='${foodCoordinates.x}'][data-y='${foodCoordinates.y}']`]).classList.remove('food');
    }

    function nextMove(dir='right') {
        let x = +snakeArr[0].getAttribute('data-x');
        let y = +snakeArr[0].getAttribute('data-y');
        let nextX = x, nextY = y;
        switch(dir) {
            case "right":
                nextX = (!checkOutBorder(x+1, y)) ? x+1 : 0;
                break;
            case 'left':
                nextX = (!checkOutBorder(x-1, y)) ? x-1 : GAME_WIDTH - 1;
                break;
            case 'up':
                nextY = (!checkOutBorder(x, y-1)) ? y-1 : GAME_HEIGHT - 1;
                break;
            case 'down':
                nextY = (!checkOutBorder(x, y+1)) ? y+1 : 0;
                break;
        }

        if (checkIfSnakeReachSnake(nextX,nextY)) {
            stopGame();
            return;
        }

        if (checkIfSnakeReachFood(nextX, nextY)) {
            ++snakeLength;
            createFood();
        } else {
            snakeArr[snakeLength-1].classList.remove('snake');
            snakeArr.pop();
        }

        let newSnakeHeadEl = document.querySelector([`.game-field__item[data-x='${nextX}'][data-y='${nextY}']`]);
        newSnakeHeadEl.classList.add('snake');
        snakeArr.unshift(newSnakeHeadEl);

    }

    function checkIfSnakeReachFood(x, y) {
        return (x === foodCoordinates.x && y === foodCoordinates.y);
    }

    function checkIfSnakeReachSnake(x, y) {
        return document.querySelector([`.game-field__item[data-x='${x}'][data-y='${y}']`]).classList.contains('snake');
    }

    function checkOutBorder(x, y) {
        return (x >= GAME_WIDTH) || (y >= GAME_HEIGHT) || (x < 0) || (y < 0);
    }


    function gameRun() {
        createGameField(GAME_WIDTH, GAME_HEIGHT);
        createSnake();
        createFood();
        gameRunInterval = setInterval(function(){
            nextMove(direction);
        }, Math.floor(200 / speed));
    }

    function stopGame() {
        alert('Game over');
        clearInterval(gameRunInterval);
    }


    function getRandomPos(min, max) {
        /* from 0 to GAME_SIZE */
        return Math.floor(min + Math.random() * (max-min));
    }


    gameRun();


});