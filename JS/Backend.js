let GameBoard = document.getElementById("gameboard");
let Mines = 0;
let GameStarted = false;
let NumberedMineBoard = null;
let Coords
let FlaggedMines =0;
let Mode =0;
let FlagLocations = [];

const MineBlockSides = 40;
//Generate Mineboard
function createMineBoard(){
    if(GameStarted == true) {alert('PLease Refresh Instead');return;}
    //make elements fit into p
    Coords = document.getElementById("InputField");
    Coords = Coords.value.split(','); // split into three
    GameBoard.style.height = toString(40 * parseInt(Coords[1])) + 'px';
    GameBoard.style.width = toString(40 * parseInt(Coords[0])) + 'px';
    console.log(toString(40 * parseInt(Coords[1])) + 'px');
    console.log(Coords);
    //Create MineBoard
    if(Coords.length > 3 || Coords.length < 2) {alert('incorect Input Field');}
    else {
        Mines = Coords[2];
        Coords = [Coords[0],Coords[1]];
        let DivNode;
        for(let x =0;x<Coords[0];x++){
            DivNode = document.createElement('div');
            // Create row Div
            DivNode.id = 'C ' + x;
            DivNode.className = 'MineCol';
            GameBoard.appendChild(DivNode);
            for(let y = 0; y < Coords[1];y++){
                createMineNode(x,y,DivNode);
            }
        }
    }
    // Plant Mines
    let MineX;
    let MineY;
    //Set Mines
    NumberedMineBoard = new Array(Coords[0]-1);
    for(let C = Coords[0]-1; C >= 0; C--){
        NumberedMineBoard[C] = Array(Coords[1]); 
        for(let R = Coords[1]; R >=0 ; R--){
            NumberedMineBoard[C][R] = 0;
        }
    }
    console.log(NumberedMineBoard);
    //Plant Mine
    for(let minenum = Mines; minenum > 0; minenum--){
        MineX = Math.ceil(Math.random() * (Coords[0])-1);
        MineY = Math.ceil(Math.random() * (Coords[1])-1);
        if(NumberedMineBoard[MineX][MineY] == -1){
            minenum++;
            continue;
        }else{
            NumberedMineBoard[MineX][MineY] = -1;
            //Mark Sorroundings of bomb
            MarkSorround(MineX + 1,MineY - 1);
            MarkSorround(MineX + 1,MineY);
            MarkSorround(MineX + 1,MineY + 1);
            MarkSorround(MineX,MineY - 1);
            MarkSorround(MineX,MineY + 1);
            MarkSorround(MineX - 1,MineY - 1);
            MarkSorround(MineX - 1,MineY + 1);
            MarkSorround(MineX - 1,MineY);
            
        }
    }
    GameStarted = true;
    SetMode(0);
}
// increment sorroundings of bomb
function MarkSorround(x,y,boundx,boundy){
    if(!IsOutOfBounds(x,y,boundx,boundy)){
        if(NumberedMineBoard[x][y]!=-1){
            NumberedMineBoard[x][y] +=1;
        }
    }
}

// Check If Out Of Bounds
//x = Col, y = Row
function IsOutOfBounds(x,y){
    return x < 0 || x > (Coords[0]-1) || y < 0 || y > (Coords[1]-1);
}


let MineNode;
function createMineNode(x,y,rowId){
    MineNode = document.createElement('p'); 
    MineNode.id=(x+','+y);
    MineNode.textContent = '';
    MineNode.className = 'Node';
    MineNode.addEventListener('click',implantsetflag(MineNode.id));
    rowId.appendChild(MineNode);    
}


// Function Constructor
function implantsetflag(param){
    return function(){
        setFlag(param);
    };
}

function setFlag(hisId){
    let TempCoords;
    //Check for Gamestart to prevent being called when being created/constructed;
    if(GameStarted){
        TempCoords = hisId.split(',');
        TempCoords = [parseInt(TempCoords[0]),parseInt(TempCoords[1])];
        switch(Mode){
        case 0:
            MineNode = document.getElementById(hisId);
            if(MineNode.textContent != '' && MineNode.textContent != 'F'){
                //show 8 directions except Flags
                console.log('Radar');
                let Directions = [[TempCoords[0] + 1,TempCoords[1] -1],[TempCoords[0]+1,TempCoords[1]],
                                  [TempCoords[0] + 1,TempCoords[1] +1],[TempCoords[0],TempCoords[1]+1],
                                  [TempCoords[0]-1,TempCoords[1]-1],[TempCoords[0],TempCoords[1]-1],
                                  [TempCoords[0]-1,TempCoords[1]],[TempCoords[0]-1,TempCoords[1]+1]];
                //debugger;
                for(let direction of Directions){
                    //debugger;
                    console.log(FlagLocations.some(e=> e[0] === direction[0] && e[1] === direction[1]));
                    if(!FlagLocations.some(e=> e[0] === direction[0] && e[1] === direction[1]) && !IsOutOfBounds(direction[0],direction[1])){ // not a flagged cube
                        ShowNode(direction[0],direction[1]);
                    }
                    
                }
            }
            else if (MineNode.textContent == 'F'){// undo flag.
                console.log('Undoing ' + TempCoords);
                FlagLocations.splice(FlagLocations.findIndex(e=> e == TempCoords),1);
                MineNode.textContent = '';
                FlaggedMines--;
                MineNode.style.backgroundColor = 'springgreen';
            }
            else{
            FlagLocations.push(TempCoords);
            console.log(FlagLocations);
            MineNode.textContent = 'F';
            MineNode.style.backgroundColor = 'red';
            FlaggedMines++;
            //update Flag Text
            if(FlaggedMines >= Mines){
                let Finish_Button = document.getElementById("Finish-Game");
                Finish_Button.style.display = "block";
            }
        }
            break;
        case 1:
            RevealSorroundings(TempCoords[0],TempCoords[1]);
            break;
        }
    }
}

//Reveal The Mineboard
function RevealMineBoard(){
    let TempElem;
    for(let C = Coords[0]-1; C >= 0; C--){
        for(let R = Coords[1]-1; R >=0 ; R--){
            TempElem = document.getElementById(C+','+R);
            TempElem.textContent = NumberedMineBoard[C][R];
        }
    }
}

//Set Mode For Playing
function SetMode(ChosenMode){
    let Buttons = [];
    Buttons.push(document.getElementById("Flag-Button"));
    Buttons.push(document.getElementById("Reveal-Button"));
    Mode = ChosenMode
    for(let Button of Buttons){
        Button.style.backgroundColor = 'rgb(164, 190, 123)';
    }
    Buttons[ChosenMode].style.backgroundColor = 'rgb(40, 84, 48)';
}


function FinishGame(){
    let ElemChecker;
    for(let FLagloc of FlagLocations){
        if(NumberedMineBoard[FLagloc[0]][FLagloc[1]] != -1){
            alert("Incorrect Something, Game Over");
            return;
        }
    }
    alert("Game Complete");
}

let InfiniteStopper = 0;
let myQueue = [];
function RevealSorroundings(C,R){
    console.log(myQueue.push([C,R]));
    let CurNode;
    let CurrMines;
    while(myQueue.length > 0){
        CurNode = myQueue[myQueue.length-1];
        myQueue.pop();
        CurrMines = ShowNode(CurNode[0],CurNode[1]);
        if(CurrMines == 0){ // Check Sorroundings
            AddToQueue(CurNode[0]+1,CurNode[1]-1);
            AddToQueue(CurNode[0]+1,CurNode[1]);
            AddToQueue(CurNode[0]+1,CurNode[1]+1);
            AddToQueue(CurNode[0],CurNode[1]-1);
            AddToQueue(CurNode[0],CurNode[1]+1);
            AddToQueue(CurNode[0]-1,CurNode[1]-1);
            AddToQueue(CurNode[0]-1,CurNode[1]);
            AddToQueue(CurNode[0]-1,CurNode[1]+1);
        }
    }
}

function ShowNode(C,R){
    //if shown node is bomb then game over;
    if(NumberedMineBoard[C][R] == -1) {
        alert('Game Over');
    }
    //console.log('Showing :' + C + ',' + R);
    let TempElem = document.getElementById(C+','+R);
    TempElem.textContent = NumberedMineBoard[C][R];
    InfiniteStopper++;
    return NumberedMineBoard[C][R];
}

function AddToQueue(x,y){
    if(!IsOutOfBounds(x,y)){
        if(document.getElementById(x+','+y).textContent == ''){
            myQueue.push([x,y]);
        }
    }
}

