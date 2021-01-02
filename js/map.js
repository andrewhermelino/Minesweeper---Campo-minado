function createMap(width = 10, height = 10, number_bombs = 10){
    const newMap = {}
    newMap.width = width
    newMap.height = height
    newMap.number_bombs = number_bombs
    newMap.map = document.querySelector('#map')
    newMap.fisical_map = []
    newMap.virtual_map = []
    newMap.reCreateMap = function(width = this.width, height = this.height, number_bombs = this.number_bombs){
        this.width = width
        this.height = height
        this.number_bombs = number_bombs
        this.map.innerHTML = ""
        this.fisical_map = []
        this.virtual_map = []
    }
    newMap.renderMap = function(){
        const grid = []

        //create elements
        for(let row = 0; row < this.height; row++){
            const current_row = document.createElement('tr')
            for(let col = 0; col < this.width; col++){
                const current_col = document.createElement('td')

                const current_btn = document.createElement('button')
                current_btn.setAttribute('type', 'button')
                current_btn.setAttribute('class', 'btn btn-cell')
                current_btn.setAttribute('id', 'btn-'+row+'-'+col)
                current_btn.setAttribute('onclick', 'MAP.clickCell('+row+', '+col+')')
                current_col.appendChild(current_btn)

                current_row.appendChild(current_col)
            }
            grid.push(current_row)
        }

        //append childs
        for(row in grid){
            map.appendChild(grid[row])
        }

        //cria um modelo do mapa dentro do objeto do MAP para facilitar a manipulacao durante o jogo
        for(let row = 0; row < this.height; row++){
            const current_row = []
            for(let col = 0; col < this.width; col++){
                current_row.push(document.querySelector('#btn-'+row+'-'+col))
            }
            this.fisical_map.push(current_row)
        }
    }
    newMap.plantBombs = function(y, x){
        //Inicia o virtual map com celular padroes
        for(let row = 0; row < this.height; row++){
            const current_row = []
            for(let col = 0; col < this.width; col++){
                current_row.push(createCell(row, col))
            }
            this.virtual_map.push(current_row)
        }

        //Marca as celulas iniciais para nao serem bombas
        const initial_cell = createCell(y, x)
        const inicial_cells = initial_cell.getNeighbors()
        inicial_cells.push([y, x])
        for(cell in inicial_cells){
            const current_cell = inicial_cells[cell]
            try{
                this.virtual_map[current_cell[0]][current_cell[1]].toInitialCell()
            } catch(e){}
        }

        //Planta as bombas nas coordenadas geradas
        let cont_bombs = 0
        while(cont_bombs < this.number_bombs){
            const current_coordanates = [randomInt(0, this.height-1), randomInt(0, this.width-1)]
            if(this.virtual_map[current_coordanates[0]][current_coordanates[1]].type != "bomb" && this.virtual_map[current_coordanates[0]][current_coordanates[1]].type != "initial"){
                this.virtual_map[current_coordanates[0]][current_coordanates[1]].toBomb()
                cont_bombs++
            }
        }

        //Enumera as casas com bombas ao redor
        for(let row = 0; row < this.height; row++){
            for(let col = 0; col < this.width; col++){

                const current_cell = this.virtual_map[row][col]
                if(current_cell.type != "bomb"){
                    let bomb_counter = 0
                    const current_neighbors = current_cell.getNeighbors()
                    for(neighbor in current_neighbors){
                        try{
                            if(this.virtual_map[current_neighbors[neighbor][0]][current_neighbors[neighbor][1]].type == "bomb"){
                                bomb_counter++
                            }
                        } catch(e){}
                    }
                    if(bomb_counter > 0){
                        current_cell.content = bomb_counter
                    }
                }

            }
        }


    }
    newMap.revealCells = function(){
        for(let row = 0; row < this.height; row++){
            for(let col = 0; col < this.width; col++){
                if(this.virtual_map[row][col].type == "bomb"){
                    this.fisical_map[row][col].style.background = "#FF0000"
                }
                this.fisical_map[row][col].textContent = this.virtual_map[row][col].content
            }
        }
    }
    newMap.clickCell = function(y=null, x=null){
        if(this.virtual_map.length == 0){
            this.plantBombs(y, x)
        }

        const virtual_cell = this.virtual_map[y][x]
        virtual_cell.nowIsClicked()
        const fisical_cell = this.fisical_map[y][x]
        fisical_cell.classList.add('clicked')
        fisical_cell.textContent = virtual_cell.content
        if(virtual_cell.type == "bomb"){
            fisical_cell.classList.add('with-bomb')
        } else {
            const cell_neighbors = virtual_cell.getNeighbors()
            for(neighbor in cell_neighbors){
                try{
                    const neighbor_y = cell_neighbors[neighbor][0]
                    const neighbor_x = cell_neighbors[neighbor][1]
                    if(this.virtual_map[neighbor_y][neighbor_x].type != "bomb" && this.virtual_map[neighbor_y][neighbor_x].clicked == false && virtual_cell.content == ""){
                        this.clickCell(neighbor_y, neighbor_x)
                    }
                } catch(e){}
            }
        }
    }
    
    return newMap
}

function createCell(y=null, x=null, type="default", content=""){
    const newCell = {}
    newCell.type = type
    newCell.content = content
    newCell.clicked = false
    newCell.x = x
    newCell.y = y
    newCell.toBomb = function(){
        this.type = "bomb"
        this.content = "B"
    }
    newCell.toInitialCell = function(){
        this.type = "initial"
    }
    newCell.getNeighbors = function(){
        const neighbors = []
        for(let x = -1; x <= 1; x++){
            for(let y = -1; y <= 1; y++){
                if(x != 0 || y != 0){
                    neighbors.push([this.y+y, this.x+x])
                }
            }
        }
        return neighbors
    }
    newCell.nowIsClicked = function(){
        this.clicked = true
    }

    return newCell
}