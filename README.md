# The_Night_Cage_Tile_Helper

A GitHub Pages static site to handle tile setup and drawing during gameplay so the players do not need to worry so much about that part.

Site with official rules for the board game: https://rules.dized.com/game/q9XiaNOwTECchKRb8oszag/U347pAr8SEmBOHBRlqNRQQ/overview

Current Features:

- Radios for choosing player count
  - 1-4 players
  - 5 players 
- Checkbox for advanced mode 
  - removes 8 wax eaters, adds 2 pit fiends and 6 or 7 keepers (depending on player count)
- buttons
  - Start Game
  - End Game
  - Draw
  - Mark Played (simply clears the pic of current tile)
  - Discard (used when discarding due to stay action)
  - Wax Eater Attack Discard (discards three tiles due to wax eater attack)
  - Keeper Ranged Attack Discard (discards one tile due to ranged attack from The Keeper)
  - Keeper Melee Attack Discard (discards three tiles due to melee attack from The Keeper)
- Pic and Name of current Tile
- Sounds
  - Start Game
  - End Game
  - Draw crumbling tile
  - Draw T-Bend or Crossroads (safe tiles)
  - Draw Wax Eater
  - Draw Key
  - Draw Gate
  - Draw Keeper
  - Place Tile
  - Discard tile without attack
  - Attack from Wax Eater when discarded through "Discard" button (stay action)
  - Marking the current piece as placed via "Tile Placed" button
  - Ambient sound added which is looped during gameplay and can be stopped at any time
- Played Stack added to show tiles believed to be on the gameboard
- Discarded Stack added to show tiles believed to be discarded
  

## Todos

- Ability to click item on "Played" stack, moving it to the "Discard" stack
- Add the following sounds
  - When a key is discarded
  - When a gate is discarded
  - Add attack sounds for other monsters when discarded via stay action
  - When the game enters the "final flicker" stage
- Add some animations or color shifts to the buttons for a little more response for the user. 

### Future Features

- Map on screen allowing players to place and remove pieces as necessary
  - Will need to allow rotating the tiles
- Add players
  - ability to place on board
  - ability to mark lights out
  - ability to mark flame lit
  - Keep track of what tiles they illuminate
  - Indicate to players how many tiles they need to place after moving
- tooltips to help users with rules as pieces are played and discarded
- Handle end-game conditions

## Future Future Features
