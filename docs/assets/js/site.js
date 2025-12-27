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

/**
 * @typedef GameTile
 * @prop {string} id 
 * @prop {string} name
 * @prop {string} src
 * @prop {boolean} isMonster
 * @prop {string} wav
 */

/**
 * @type {Array<GameTile>}
 */
let gameTiles = [];

/**
 * @type {Array<GameTile>}
 */
let discardedTiles = [];

/**
 * @type {Array<GameTile>}
 */
let playedTiles = [];

/**
 * @type {GameTile}
 */
let currentTile;

/**
 * @type {number}
 */
let numberOfPlayers;

/**
 * @type {boolean}
 */
let isAdvancedMode;

/**
 * @type {Record<string,Audio>}
 */
let soundCache = {};

/**
 * @type {boolean}
 */
let isGameRunning = false;

/**
 * @type {Array<string>}
 */
let emptyTileSoundFiles = ["laugh.mp3", "no.mp3", "no-no-no.mp3", "too-late.mp3", "wow.mp3"];

SetInitialButtons();
SetEmptyTile();

/**
 * Disables all buttons except "Start Game" - advanced monster buttons also hidden
 */
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

/**
 * Starts music, sets up game tiles based on user selections, enables necessary buttons for gameplay
 */
function StartGame(){
    StartGameLoopMusic();
    document.getElementById("create-game-btn").setAttribute("disabled", true);
    document.getElementById("end-game-btn").removeAttribute("disabled");
    document.getElementById("draw-btn").removeAttribute("disabled");
    document.getElementById("mark-placed-btn").removeAttribute("disabled");
    document.getElementById("discard-btn").removeAttribute("disabled");
    document.getElementById("wax-eater-attack-btn").removeAttribute("disabled");
    
    numberOfPlayers = document.querySelector("input[name='player-count']:checked").value
    isAdvancedMode = document.getElementById("use-keeper-and-pitfiend-cbx").checked;
    //console.log(`Buttons should be enabled now and game configured for ${numberOfPlayers} players and advanced Mode: ${isAdvancedMode}`);
    
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
    GetSound("put-the-bunny-back-in-the-box.mp3", false).play();
    isGameRunning = true;
    setTimeout( () => {
        alert("Players will now take turns first each laying one start tile down, then player 1 will start by drawing two tiles to place for the first turn");
    },500);
}

/**
 * Resets all variables and form controls to initial state so a new game can be started
 */
function EndGame(){
    isGameRunning = false;
    gameTiles = [];
    discardedTiles = [];
    playedTiles = [];
    currentTile = null;
    numberOfPlayers = null;
    isAdvancedMode = null;

    let discardedDiv = document.getElementById("discarded-div");
    discardedDiv.textContent = '';
    let playedDiv = document.getElementById("played-div");
    playedDiv.textContent = '';

    GetSound("admiring_your_cage.mp3", false).play();
    SetEmptyTile();
    SetInitialButtons();
    setTimeout(() => {
        alert("All data reset. Choose your configuration and click 'Start Game' when ready to try again");
    }, 500);   
}

/**
 * Draws tile and sets to current tile if tiles remain in the game stack
 * Calls 'HandleOutOftiles' otherwise
 * @returns {void}
 */
function DrawTile(){
    if(gameTiles.length > 0){
        if(currentTile){
            AddTileToPlayedStack(currentTile);
            currentTile = null;
        }
        let newTile = gameTiles.shift();
        console.log(`Drew ${newTile.name}`);
        SetCurrentTile(newTile);
        return;
    }
    HandleOutOfTiles();
    alert("You have ran out of tiles to Draw => final flicker");
}

/**
 * For the Discard button event listener
 */
function HandleDiscardTile(){
    DiscardTile(true);
}

/**
 * Moves Tile to discard pile as long as it doesn't result in a surprise attack
 * Calls 'SetCurrentTile' if surprise attack
 * @param {boolean} isAttackPossible Whether the discarded card can result in a surprise attack
 * @returns {void}
 */
function DiscardTile(isAttackPossible){
    if(gameTiles.length > 0){
        let tileToDiscard = gameTiles.shift();
        
        if(isAttackPossible == true && tileToDiscard.isMonster == true){
            if(currentTile){
                AddTileToPlayedStack(currentTile);
            }
            console.log(`Attempt to discard a ${tileToDiscard.name}, but triggered attack`);
            tileToDiscard
            SetCurrentTile(tileToDiscard, true);
            setTimeout(() => 
                {
                    alert(`You have discarded a ${tileToDiscard.name} which attacks. Handle this action before continuing.`)
                }, 500);
            return;
        }
        GetSound("discard.wav",false).play();
        AddTileToDiscardedStack(tileToDiscard);
        return;
    }
    HandleOutOfTiles();
    alert("You have ran of tiles to Discard => final flicker");
}

/**
 * Sets the image for the current tile along, calls functions to move previuos file if necessary
 * and plays proper sound
 * @param {GameTile} newTile The new tile to display as current
 * @param {boolean} wasDiscardedAttack Was this tile a surprise attack
 */
function SetCurrentTile(newTile, wasDiscardedAttack = false){
    if(currentTile){
        AddTileToPlayedStack(currentTile);
    }
    
    currentTile = newTile;
    let imgEle = document.getElementById("current-piece");
    let pieceNameSpan = document.getElementById("current-piece-description");

    imgEle.src = currentTile.src;
    pieceNameSpan.textContent = currentTile.name;
    GetSound(currentTile.wav, wasDiscardedAttack).play();
    document.getElementById("mark-placed-btn").removeAttribute("disabled");
}

/**
 * Puts the default image when no tile selected and calls 'PlayEmptyTileSound'
 */
function SetEmptyTile(){
    currentTile = null;
    document.getElementById("mark-placed-btn").setAttribute("disabled", true);
    let imgEle = document.getElementById("current-piece");
    let pieceNameSpan = document.getElementById("current-piece-description");   
    
    imgEle.src = "./assets/img/nick_cage.jpg";
    pieceNameSpan.textContent = "Nick";
    PlayEmptyTileSound();
}

/**
 * Plays a random sound from the declared list of file names
 */
function PlayEmptyTileSound(){
    if(isGameRunning == true){
        let soundFileLength = emptyTileSoundFiles.length;
        let randomIndex = Math.floor(Math.random() * soundFileLength);
        if (randomIndex == soundFileLength){
            randomIndex--;
        }

        GetSound(emptyTileSoundFiles[randomIndex], false).play();
    }
}

/**
 * Discards one tile from attack which will not trigger a surprise attack
 */
function HandleKeeperRangeAttack(){
    console.log("Discarding tile for keeper ranged attack");
    DiscardTile(false);
}

/**
 * Discards three tiles from attack which do not trigger surprise attacks
 */
function HandleKeeperMeleeAttack(){
    console.log("Discarding three tiles for keeper melee attack");
    for(i = 0; i < 3; i++){
        setTimeout(() => DiscardTile(false), 500);
    }
}

/**
 * Discards 3 tiles from attack which do not trigger surprise attacks
 */
function HandleWaxEaterAttack(){
    console.log("Discarding 3 tiles for Wax Eater Attack");
    for(i = 0; i < 3; i++){
        setTimeout(() => DiscardTile(false), 500);
    }
}

/**
 * Moves tile to played stack and sets current piece to empty
 */
function HandleTilePlaced(){
    AddTileToPlayedStack(currentTile);  
    SetEmptyTile();
}

/**
 * Allows player to click on an image in the played stack to move it to the discard stack
 * @param {Event} e 
 */
function HandlePlayedOnClick(e){
    let img = e.target;
    let tileId = img.dataset.tileId;
    let foundTile = playedTiles.find(t => t.id == tileId);

    if(confirm(`Move ${foundTile.name} to the discard pile?`)){
        let playedDiv = document.getElementById("played-div");
        playedDiv.removeChild(img);
        img.removeEventListener("click", HandlePlayedOnClick);
        let discardedDiv = document.getElementById("discarded-div");
        discardedDiv.appendChild(img);
    
        let foundIndex = playedTiles.findIndex(t => t.id == tileId);
        playedTiles.splice(foundIndex, 1);
        discardedTiles.unshift(foundTile);
        setTimeout(() => img.scrollIntoView(), 100);
    }
}

/**
 * Moves tile to the played stack
 * @param {GameTile} tile piece to be moved
 */
function AddTileToPlayedStack(tile){
    playedTiles.unshift(currentTile);
    let playedDiv = document.getElementById("played-div");
    let newImage = document.createElement("img");
    newImage.src = tile.src;
    newImage.classList.add("img-fluid", "rounded-5","pb-1");
    newImage.setAttribute("data-tile-id", tile.id);
    newImage.addEventListener("click", HandlePlayedOnClick);
    playedDiv.appendChild(newImage); 
    setTimeout(() => newImage.scrollIntoView(), 100);
    console.log(`${currentTile.name} played`);
}

/**
 * Moves tile to the discard stack
 * @param {GameTile} tile piece to be moved
 */
function AddTileToDiscardedStack(tile){
    discardedTiles.unshift(tile);  
    let discardedDiv = document.getElementById("discarded-div");
    let newImage = document.createElement("img");
    newImage.src = tile.src;
    newImage.classList.add("img-fluid", "rounded-5", "pb-1");
    newImage.setAttribute("data-tile-id", tile.id);
    discardedDiv.appendChild(newImage);
    setTimeout(() => newImage.scrollIntoView(), 100);
    console.log(`${tile.name} discarded`);
}

/**
 * Creates all game tiles and pushes them to the gameTiles variable. 
 */
function CreateAllGameTiles(){
    //console.log("Starting 'CreateAllGameTile()", {numberOfPlayers, isAdvancedMode});
    let topStack = GetStartingTiles();
    topStack = ShuffleStack(topStack);

    let bottomStack = GetRemainingTileStack(topStack);
    bottomStack = ShuffleStack(bottomStack);

    gameTiles = topStack;
    gameTiles.push(...bottomStack);
}

/**
 * Creates and returns the starting (top) tile stack
 * @returns {Array<GameTile>}
 */
function GetStartingTiles(){
    let stack = []
    if(numberOfPlayers < 5){
        stack = CreateTileReferences("T-Bend", "./assets/img/T_Bend2_cropped.png", "safe_tile_draw.wav", 4, stack);
        stack = CreateTileReferences("Crossroads", "./assets/img/Crossroads2_cropped.png", "safe_tile_draw.wav", 2, stack);
        stack = CreateTileReferences("Straight", "./assets/img/Straight3_cropped.png", "crumble_tile.wav", 2, stack);

        stack.forEach(tile => console.log(tile.id));
        return stack
    }

    stack = CreateTileReferences("T-Bend", "./assets/img/T_Bend2_cropped.png", "safe_tile_draw.wav", 5, stack);
    stack = CreateTileReferences("Crossroads", "./assets/img/Crossroads2_cropped.png", "safe_tile_draw.wav", 3, stack);
    stack = CreateTileReferences("Straight", "./assets/img/Straight3_cropped.png", "crumble_tile.wav", 2, stack);
    
    stack.forEach(tile => console.log(tile.id));
    return stack;
}

/**
 * Creates the main game stack (non-starting stack)
 * @param {Array<GameTile>} previousStack All previously created Game Tiles in one stack
 * @returns {Array<GameTile>}
 */
function GetRemainingTileStack(previousStack){
    let stack = [];
    
    if(numberOfPlayers < 5){
        if(isAdvancedMode){
            stack = CreateTileReferences("PitFiend", "./assets/img/Pitfiend2_cropped.png", "pit_fiend.wav", 2, stack, previousStack);
            stack = CreateTileReferences("Keeper", "./assets/img/Keeper2_cropped.png", "keeper.wav", 6, stack, previousStack);   
            stack = CreateTileReferences("Wax Eater", "./assets/img/WaxEaterTile_cropped.png", "wax_eater.wav", 4, stack, previousStack, true); 
        }
        else{
            stack = CreateTileReferences("Wax Eater", "./assets/img/WaxEaterTile_cropped.png", "wax_eater.wav", 12, stack, previousStack, true);
            stack = CreateTileReferences("Key", "./assets/img/KeyTile_cropped.png", "key.wav", 6, stack, previousStack);
        }
        stack = CreateTileReferences("T-Bend", "./assets/img/T_Bend2_cropped.png", "safe_tile_draw.wav", 26, stack, previousStack);
        stack = CreateTileReferences("Crossroads", "./assets/img/Crossroads2_cropped.png", "safe_tile_draw.wav", 10, stack, previousStack);
        stack = CreateTileReferences("Straight", "./assets/img/Straight3_cropped.png", "crumble_tile.wav", 8, stack, previousStack);         
        stack = CreateTileReferences("Gate", "./assets/img/GateTile_cropped.png", "gate.wav", 4, stack, previousStack);
    
        stack.forEach(tile => console.log(tile.id));
        return stack;
    }

    if(isAdvancedMode){
        stack = CreateTileReferences("PitFiend", "./assets/img/Pitfiend2_cropped.png", "pit_fiend.wav", 2, stack, previousStack);
        stack = CreateTileReferences("Keeper", "./assets/img/Keeper2_cropped.png", "keeper.wav", 7, stack, previousStack);   
        stack = CreateTileReferences("Wax Eater", "./assets/img/WaxEaterTile_cropped.png", "wax_eater.wav", 2, stack, previousStack, true); 
    }
    else{
        stack = CreateTileReferences("Wax Eater", "./assets/img/WaxEaterTile_cropped.png", "wax_eater.wav", 10, stack, previousStack, true);
        stack = CreateTileReferences("Key", "./assets/img/KeyTile_cropped.png", "key.wav", 7, stack, previousStack);
    }    

    stack = CreateTileReferences("T-Bend", "./assets/img/T_Bend2_cropped.png", "safe_tile_draw.wav", 25, stack, previousStack);
    stack = CreateTileReferences("Crossroads", "./assets/img/Crossroads2_cropped.png", "safe_tile_draw.wav", 9, stack, previousStack);
    stack = CreateTileReferences("Straight", "./assets/img/Straight3_cropped.png", "crumble_tile.wav", 8, stack, previousStack);         
    stack = CreateTileReferences("Gate", "./assets/img/GateTile_cropped.png", "gate.wav", 4, stack, previousStack);
    
    stack.forEach(tile => console.log(tile.id));
    return stack;
}

/**
 * Disables all buttons related to drawing/discarding tiles from the game stack
 */
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

/**
 * Fisher-Yates shuffle compliments of Google search
 * @param {Array<GameTile>} stack The Game Tiles to shuffle
 * @returns {Array<GameTile} The newly shuffled stack
 */
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

/**
 * Creates all copies of a single tile needed for the current stack and returns the stack with new tiles added
 * @param {string} name Display Name for Tile
 * @param {string} src  Image Name
 * @param {string} wav  sound file name with extension
 * @param {number} count Number of tiles to create
 * @param {Array<GameTile>} stack The current stack where these new tiles will be added
 * @param {Array<GameTile>} previousStack All other stacks that have previously been created (used to determine ID)
 * @param {boolean} isMonster Whether the new tile is a monster
 * @returns {Array<GameTile>} The new stack of tiles
 */
function CreateTileReferences(
    name, 
    src, 
    wav,
    count, 
    stack, 
    previousStack = [],
    isMonster = false
)
    {
    iterator = 1;
    while (iterator <= count){
        let tile = CreateTileReference((1 + previousStack.length + stack.length), name, src, wav, isMonster);
        stack.push(tile);
        iterator++;
    }
    return stack;
}

/**
 * Creates and returns a single GameTile object intended to be used in the game stack
 * @param {string} id Unique ID for the new Tile
 * @param {string} name Display name for the tile
 * @param {string} src  route to image
 * @param {string} wav  sound file name
 * @param {boolean} isMonster whether the tile is a monster
 * @returns {GameTile}
 */
function CreateTileReference(id, name, src, wav, isMonster){
    return {
        "id": `${name}-${id}`,
        "name": name,
        "src": src,
        "isMonster": isMonster,
        "wav": wav
    }
}

/**
 * Manages a cache of sounds to be used in the game and returns the requested sound
 * @param {string} wavName file name with extension
 * @param {boolean} wasDiscardedAttack whether the sound should be a "surprise" attack
 * @returns {Audio}
 */
function GetSound(wavName, wasDiscardedAttack){
    let wavSplit = wavName.split('.');
    let name = wavSplit[0];
    if(wasDiscardedAttack == true){
        if(soundCache[`${name}-Attack`]){
            return soundCache[`${name}-Attack`];
        }
        let newWavName = `${name}_attack.${wavSplit[1]}`
        soundCache[`${name}-Attack`] = new Audio(`./assets/wav/${newWavName}`);
        return soundCache[`${name}-Attack`]
    }
    if(soundCache[name]){
        return soundCache[name];
    }
    soundCache[name] = new Audio(`./assets/wav/${wavName}`);
    return soundCache[name];
}

/**
 * Just plays the main game sound
 */
function StartGameLoopMusic(){
    let player = document.getElementById("game-music-player");
    player.play();
}
