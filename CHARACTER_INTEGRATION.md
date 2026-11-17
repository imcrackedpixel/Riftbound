# Riftbound — playable character integration

This branch is for integrating the user's supplied 3D character model as the controllable hero.

## Source model
- Original upload: `model.zip`
- Archive contents: `model.glb` (about 47.5 MB)
- Inspection: one GLB mesh/material asset; no armature/skeleton and no embedded animation clips.
- The model therefore needs rigging and animation before articulated walking, running, and combat can work.

## Integration target
Build a browser-playable prototype with:
- Third-person/isometric Diablo-inspired camera.
- Keyboard movement and mobile touch joystick.
- Character movement with camera-relative direction and ground collision.
- Idle/walk/run state handling once a rigged asset is available.
- Combat hooks for later attack/skill animations.

## Asset pipeline still required
1. Optimise the GLB (the source is very high-poly: approximately 812,050 vertices).
2. Create a humanoid armature and weight-paint the mesh.
3. Author or retarget idle, walk, run, attack, and hit/death clips.
4. Export a tested, mobile-friendly GLB.
5. Add the final asset under `public/assets/hero/` and wire it into the runtime.

The original binary model has not yet been committed to this repository. Do not treat this documentation as a completed playable build.
