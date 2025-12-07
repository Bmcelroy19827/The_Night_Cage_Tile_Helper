# The_Night_Cage_Tile_Helper

A GitHub Pages static site to handle tile setup and drawing during gameplay so the players do not need to worry so much about that part.

Current Features:

- Radios for choosing player count (only really setup for 1-4)
  - 1-4 players
  - 5 players (not implemented)
- Checkbox for advanced mode (will replace all but two wax eaters with keepers and pit fiends)
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
  

## Todos

- Add the following sounds
  - When a key is discarded
  - When a gate is discarded
  - When a monster is discarded that does not attack (death rattle?)
  - When the game enters the "final flicker" stage
  - Loopable track(s) for ambience (maybe different levels of intensity)

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
