//Objeto principal que rege todos os atributos do jogo
const GAME = {
    width: 10,//largura
    height: 10,//altura
    number_bombs: 10,
    bombs_found: 0,
    map_grid: Array(),//guarda os botoes do mapa, responsaveis pela manipulacao dos botoes da tela
    map_virtual: Array(),//guarda os objetos virtuais, responsaveis pela logica do jogo
    setWidth: function(newWidth){this.width = newWidth},
    setHeight: function(newHeight){this.width = newHeight},
    setNumber_Bombs: function(newNumber_bombs){this.width = newNumber_bombs},
    addBomb_found: function(){this.bombs_found++}
}

const map = document.querySelector('#map')

//Cria um mapa de acordo com os atributos atuais do jogo
function createMap(){
    const grid = []

    //create elements
    for(var row = 0; row < GAME.height; row++){
        const current_row = document.createElement('tr')
        for(var col = 0; col < GAME.width; col++){
            const current_col = document.createElement('td')

            const current_btn = document.createElement('button')
            current_btn.setAttribute('type', 'button')
            current_btn.setAttribute('class', 'btn btn-cell')
            current_btn.setAttribute('id', 'btn-'+row+'-'+col)
            current_col.appendChild(current_btn)

            current_row.appendChild(current_col)
        }
        grid.push(current_row)
    }

    //append childs
    for(row in grid){
        map.appendChild(grid[row])
    }

    //cria um modelo do mapa dentro do objeto do GAME para facilitar a manipulacao durante o jogo
    for(var row = 0; row < GAME.height; row++){
        const current_row = []
        for(var col = 0; col < GAME.width; col++){
            current_row.push(document.querySelector('#btn-'+row+'-'+col))
        }
        GAME.map_grid.push(current_row)
    }
}

createMap()