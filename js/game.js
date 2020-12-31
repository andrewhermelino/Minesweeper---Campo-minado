function createGame(){
    const newGame = {}
    newGame.found_bombs = 0
    newGame.setFoundBombs = function(param){this.found_bombs = param}
    newGame.addFoundBomb = function(){this.found_bombs++}
}