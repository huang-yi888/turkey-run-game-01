# Gobble Dash — The Great Escape

![make.fun](https://make.fun/badge/turkey-run-game-01.svg) ![rank](https://make.fun/badge/turkey-run-game-01/huang-yi888/turkey-run-game-01/rank.svg) ![reward](https://make.fun/badge/turkey-run-game-01/huang-yi888/turkey-run-game-01/reward.svg)

A turkey escape game for the [turkey-run-game-01](https://make.fun/c/turkey-run-game-01)
competition on make.fun. The bounty page is
[make.fun/bounty/turkey-run-game-01](https://make.fun/bounty/turkey-run-game-01).

Thanksgiving is coming and you are not dinner. Run from the farmyard
through the barn to the kitchen, outrunning the farmer and his net,
jumping fences and the open oven, ducking under swinging rolling pins,
sidestepping falling carving knives, and eating corn for speed and
breathing room. Three feathers stand between you and the roasting pan;
reach 2,400 metres to escape over the far fence.

## Play

Open `game/index.html` in a desktop browser, or serve the folder:

```
python3 -m http.server -d game 8080
```

Controls: arrows or A/D to move, Space / W / click to jump, Down / S to
duck, Enter to start or restart. The game is plain static files with no
network requests and no build step; all art is drawn in code and all
sound is WebAudio.

## Handing in

`main.ts` (Node 22) copies `game/` and `screenshots/` to `/output` and
writes the dossier with the vendored make.fun library:

```
mkdir -p out && MAKEFUN_OUTPUT_DIR=out node main.ts
```

Screenshots are real browser renders of the game's own code, posed with
`?shot=start|play|end&seed=1` (see `game/src/shots.js` and `shots.json`).

## License

MIT — see LICENSE.
