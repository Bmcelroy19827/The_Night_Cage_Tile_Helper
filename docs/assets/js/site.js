// 10 straights
// 12 crossroads
// 30 T-Bends
// 5 Start Tiles
// 4 Gates
// 7 Keys
// 10 Wax Eaters * 2 in Advanced Mode
// 7 keepers (replaces keys)
// 2 pitfiends
// 2 Omens (BOSS)
// 2 Pathless (BOSS)

let gameTiles = [];
let discardedTiles = [];
let playedTiles = [];
let currentTile;
let numberOfPlayers;
let isAdvancedMode;
console.log("Starting Site.js Updated");
SetInitialButtons();
SetEmptyTile();

function SetInitialButtons(){
    document.getElementById("create-game-btn").removeAttribute("disabled");
    document.getElementById("end-game-btn").setAttribute("disabled", true);
    document.getElementById("draw-btn").setAttribute("disabled", true);
    document.getElementById("mark-placed-btn").setAttribute("disabled", true);
    document.getElementById("discard-btn").setAttribute("disabled", true);
    document.getElementById("wax-eater-attack-btn").setAttribute("disabled", true);

    let rangeKeeperBtn = document.getElementById("range-keeper-attack-btn");
    rangeKeeperBtn.setAttribute("hidden", true);
    rangeKeeperBtn.setAttribute("disabled", true);

    let meleeKeeperBtn = document.getElementById("melee-keeper-attack-btn");
    meleeKeeperBtn.setAttribute("hidden", true);
    meleeKeeperBtn.setAttribute("disabled", true); 
}

function StartGame(){
    document.getElementById("create-game-btn").setAttribute("disabled", true);
    document.getElementById("end-game-btn").removeAttribute("disabled");
    document.getElementById("draw-btn").removeAttribute("disabled");
    document.getElementById("mark-placed-btn").removeAttribute("disabled");
    document.getElementById("discard-btn").removeAttribute("disabled");
    document.getElementById("wax-eater-attack-btn").removeAttribute("disabled");
    
    numberOfPlayers = document.querySelector("input[name='player-count']:checked").value
    isAdvancedMode = document.getElementById("use-keeper-and-pitfiend-cbx").checked;
    console.log(`Buttons should be enabled now and game configured for ${numberOfPlayers} players and advanced Mode: ${isAdvancedMode}`);
    
    if(isAdvancedMode == true){
        console.log("Showing and Enabling Keeper buttons since advance mode was checked");
        let rangeKeeperBtn = document.getElementById("range-keeper-attack-btn");
        rangeKeeperBtn.removeAttribute("hidden")
        rangeKeeperBtn.removeAttribute("disabled");

        let meleeKeeperBtn = document.getElementById("melee-keeper-attack-btn");
        meleeKeeperBtn.removeAttribute("hidden")
        meleeKeeperBtn.removeAttribute("disabled");
    }

    CreateAllGameTiles();

    alert("Players will now take turns first each laying one start tile down, then player 1 will start by drawing two tiles to place for the first turn");
}

function EndGame(){
    gameTiles = [];
    discardedTiles = [];
    playedTiles = [];
    currentTile = null;
    numberOfPlayers = null;
    isAdvancedMode = null;

    SetEmptyTile();

    SetInitialButtons();
    alert("All data reset. Choose your configuration and click 'Start Game' when ready to try again");
}

function DrawTile(){
    if(gameTiles.length > 0){
        if(currentTile){
            playedTiles.unshift(currentTile);
        }
        currentTile = gameTiles.shift();
        console.log(`Drew ${currentTile.name}`);
        SetCurrentTile(currentTile);
        return;
    }
    HandleOutOfTiles();
    alert("You have ran out of tiles to Draw => final flicker");
}

function HandleDiscardTile(){
    DiscardTile(true);
}

function DiscardTile(isAttackPossible){
    if(gameTiles.length > 0){
        let tileToDiscard = gameTiles.shift();
        
        if(isAttackPossible == true && tileToDiscard.doesAttackOnDiscard == true){
            if(currentTile){
                playedTiles.unshift(currentTile);
            }
            console.log(`Attempt to discard a ${tileToDiscard.name}, but triggered attack`);
            currentTile = tileToDiscard
            SetCurrentTile(currentTile);
            alert(`You have discarded a ${currentTile.name} which attacks. Handle this action before continuing.`)
            return;
        }
        console.log(`${tileToDiscard.name} discarded`);
        discardedTiles.unshift(tileToDiscard);
        return;
    }
    HandleOutOfTiles();
    alert("You have ran of tiles to Discard => final flicker");
}

function SetCurrentTile(currentTile){
    let imgEle = document.getElementById("current-piece");
    let pieceNameSpan = document.getElementById("current-piece-description");

    imgEle.src = currentTile.src;
    pieceNameSpan.textContent = currentTile.name;
    document.getElementById("mark-placed-btn").removeAttribute("disabled");
}

function SetEmptyTile(){
    document.getElementById("mark-placed-btn").setAttribute("disabled", true);
    let imgEle = document.getElementById("current-piece");
    let pieceNameSpan = document.getElementById("current-piece-description");   
    
    imgEle.src = "./assets/img/nick_cage.jpg";
    pieceNameSpan.textContent = "No Piece Selected";
}

function HandleKeeperRangeAttack(){
    console.log("Discarding tile for keeper ranged attack");
    DiscardTile(false);
}

function HandleKeeperMeleeAttack(){
    console.log("Discarding three tiles for keeper melee attack");
    for(i = 0; i < 3; i++){
        setTimeout(() => DiscardTile(false), 500);
    }
}

function HandleWaxEaterAttack(){
    console.log("Discarding 3 tiles for Wax Eater Attack");
    for(i = 0; i < 3; i++){
        setTimeout(() => DiscardTile(false), 500);
    }
}

function HandleTilePlaced(){
    console.log(`Moving ${currentTile.name} to played tiles stack`)
    playedTiles.unshift(currentTile);
    SetEmptyTile();
}

function CreateAllGameTiles(){
    console.log("Starting 'CreateAllGameTile()", {numberOfPlayers, isAdvancedMode});
    let topStack = GetStartingTiles(numberOfPlayers);
    console.log("Top Stack Created", topStack);
    topStack = ShuffleStack(topStack);
    console.log("Top Stack Shuffled", topStack);
    let bottomStack = GetRemainingTileStack(numberOfPlayers, isAdvancedMode);
    console.log("Bottom Stack Created", bottomStack);
    bottomStack = ShuffleStack(bottomStack);
    console.log("Bottom Stack Shuffled", bottomStack);

    gameTiles = topStack;
    gameTiles.push(...bottomStack);
}

function GetStartingTiles(){
    let stack = []
    if(numberOfPlayers < 5){
        stack = CreateTileReferences("T-Bend", "./assets/img/T_Bend_aseprite.jpg", 4, stack);
        stack = CreateTileReferences("Crossroads", "./assets/img/Crossroads_aseprite.jpg", 2, stack);
        stack = CreateTileReferences("Straight", "./assets/img/Straight_cropped.jpg", 2, stack);
        ShuffleStack(stack);
        return stack
    }

    stack = CreateTileReferences("T-Bend", "./assets/img/T_Bend_aseprite.jpg", 4, stack);
    stack = CreateTileReferences("Crossroads", "./assets/img/Crossroads_aseprite.jpg", 2, stack);
    stack = CreateTileReferences("Straight", "./assets/img/Straight_cropped.jpg", 2, stack);
    return stack;
}

function GetRemainingTileStack(){
    let stack = [];
    if(isAdvancedMode){
        stack = CreateTileReferences("PitFiend", "./assets/img/Pitfiend_cropped.jpg", 2, stack);
        stack = CreateTileReferences("Keeper", "./assets/img/Keeper_cropped.jpg", 6, stack);   
        stack = CreateTileReferences("Wax Eater", "./assets/img/WaxEater_cropped.jpg", 2, stack, true); 
    }
    else{
        stack = CreateTileReferences("Wax Eater", "./assets/img/WaxEater_cropped.jpg", 10, stack, true);
        stack = CreateTileReferences("Key", "./assets/img/Keys_cropped.jpg", 6, stack);
    }
    
    stack = CreateTileReferences("T-Bend", "./assets/img/T_Bend_aseprite.jpg", 26, stack);
    stack = CreateTileReferences("Crossroads", "./assets/img/Crossroads_aseprite.jpg", 10, stack);
    stack = CreateTileReferences("Straight", "./assets/img/Straight_cropped.jpg", 8, stack);         
    stack = CreateTileReferences("Gate", "./assets/img/Gate_Cropped.jpg", 4, stack);

    return stack;
}

function HandleOutOfTiles(){
    document.getElementById("draw-btn").setAttribute("disabled", true);
    document.getElementById("discard-btn").setAttribute("disabled", true);
    document.getElementById("wax-eater-attack-btn").setAttribute("disabled", true);

    let rangeKeeperBtn = document.getElementById("range-keeper-attack-btn");
    rangeKeeperBtn.setAttribute("hidden", true);
    rangeKeeperBtn.setAttribute("disabled", true);

    let meleeKeeperBtn = document.getElementById("melee-keeper-attack-btn");
    meleeKeeperBtn.setAttribute("hidden", true);
    meleeKeeperBtn.setAttribute("disabled", true);     
}

//Fisher-Yates shuffle compliments of Google search
function ShuffleStack(stack){
    let currentIndex = stack.length;
    let randomIndex;

    while(currentIndex !== 0){
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex--;

        [stack[currentIndex], stack[randomIndex]] = [stack[randomIndex],stack[currentIndex] ];
    }

    return stack;
}

function CreateTileReferences(name, src, count, stack, doesAttackIfDiscarded = false){
    iterator = 1;
    while (iterator <= count){
        let tile = CreateTileReference(iterator, name, src, doesAttackIfDiscarded);
        stack.push(tile);
        iterator++;
    }
    return stack;
}

function CreateTileReference(id, name, src, doesAttackIfDiscarded){
    return {
        "id": `${name}-${id}`,
        "name": name,
        "src": src,
        "doesAttackOnDiscard": doesAttackIfDiscarded
    }
}
