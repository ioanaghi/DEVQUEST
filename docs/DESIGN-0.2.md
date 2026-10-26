# 0.2 presentation update

The game now treats exploration as the primary screen. The office fills the viewport at crisp integer pixel scales, with no scrolling page, navigation rail, headline, or permanent dashboard panels.

A compact HUD carries the player, XP, coins, day, and a collapsible quest tracker. The lower hotbar opens game pop-ups. Escape pauses/resumes; Q, J, K, I, and M open quests, journal, skills, backpack, and the office map. The map provides equivalent room interactions without requiring movement.

The Mac window enters native full screen on the first launch of this presentation. Later full-screen choices are remembered. The game consumes Escape natively so closing a pop-up does not also exit full screen. The pause menu includes full-screen switching, sound, controls/saves, and Save & quit.

The art uses original code-drawn pixel assets: textured and staggered oak planks, tiled training/kitchen floors, window cityscapes and light beams, shaded desks and monitors, detailed chairs, plants, books, a server cabinet, and an espresso machine. Characters have facial details, clothing highlights, blinking, walk cycles, and celebration particles. Furniture and characters render by depth, and a cached background keeps the added detail efficient.

The workstation is a dark, focused game overlay. The story dialogue appears near the bottom with a character portrait. Skills, inventory, onboarding, and notes share the same forest-green, parchment, and gold interface palette.

## Verification

- Native full-screen launch and window/full-screen switching verified.
- Escape pause, Escape resume, and panel closing verified without exiting full screen.
- The K shortcut opens the skill tree; map shortcuts open the workstation.
- Existing avatar, code, XP, missions, and decoration loaded from the previous save.
- The redesigned Java workstation ran the saved method and returned passing sample results.
- The new Save & quit action was exercised.
- 22 regression tests passed; the Docker-only test remains skipped locally.
- TypeScript, production build, Swift compilation, and local code-signature verification passed.

The local Mac artifact remains Apple Silicon, macOS 13.5+, ad-hoc signed, and offline. Developer ID signing and notarization are unchanged release prerequisites for trusted public distribution.
