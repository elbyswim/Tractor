# Tractor

## Features:


## Todos:

### Frontend:
  - make horizontal scroll on vertical scroll wheel (when cards overflow)
  - scroll by touch
  - display other hands
  - organize the socket receivers into stages (function stage1()... function stagen() etc)
  - switch feature to allow user to select how to sort cards in hand
    - allow custom dragndrop ordering of cards in hand?
  - create pre-config file for all the constants that change by device sizes/types (e.g. card sizes)
  - create rooms
  - have a 'ready' button -> only start game when every player has clicked 'ready'
    - or first player is the "master" player -> they can start the rounds
  - allow for choosing teams? (easier for choosing display location)
  - refactor redux actions/selectors/reducer into proper files
  - support for other resolutions
    - [] 1680*939 (mac)
    - [] 2560x1440 (later)
    - [done] 1920x1080
    - [] 1280x720
    - ipad / ipad pro res
  - custom backgrounds? way way later
  - load svgs before game starts to avoid render delay

### Backend:
  - seperate bidding and playing
    - create bidding class
      - determine finished bidding ('doneBid')
      - receive winner
      - set play order
    - playing round class
      - send bottom cards ('originalBottom')
      - receive bottom cards ('newBottom')
  
  - factor socket helpers into different file (e.g. socketUtils.js & listeners.js)
  - factor socket listeners into stages
    - stage 1: setup
    - stage 2: dealing + calling bottom
    - etc
    - **remove listeners from each stage once the stage is completed**