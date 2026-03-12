import * as THREE from "three";
import { GLTF } from "three-stdlib";
import { eyebrowBoneNames, typingBoneNames } from "../../../data/boneData";

const STANDING_CLIP_NAMES = [
  "standing",
  "Standing",
  "stand",
  "idle_stand",
  "idle_standing",
  "Stand",
];
type PoseMode = "sitting" | "standing";

const setAnimations = (gltf: GLTF) => {
  const character = gltf.scene;
  const mixer = new THREE.AnimationMixer(character);
  const keyActions: THREE.AnimationAction[] = [];
  let typingAction: THREE.AnimationAction | null = null;
  let standingAction: THREE.AnimationAction | null = null;
  let currentPose: PoseMode = "sitting";

  if (gltf.animations) {
    // Log available clips once (helps if you add stand/sit clips to the GLTF)
    if (import.meta.env.DEV) {
      console.log(
        "[Character] Animation clips:",
        gltf.animations.map((c) => c.name)
      );
    }

    const introClip = gltf.animations.find(
      (clip) => clip.name === "introAnimation"
    );
    if (introClip) {
      const introAction = mixer.clipAction(introClip);
      introAction.setLoop(THREE.LoopOnce, 1);
      introAction.clampWhenFinished = true;
      introAction.play();
    }

    const clipNames = ["key1", "key2", "key5", "key6"];
    clipNames.forEach((name) => {
      const clip = THREE.AnimationClip.findByName(gltf.animations, name);
      if (clip) {
        const action = mixer.clipAction(clip);
        action.play();
        action.timeScale = 1.2;
        keyActions.push(action);
      }
    });

    typingAction = createBoneAction(gltf, mixer, "typing", typingBoneNames);
    if (typingAction) {
      typingAction.enabled = true;
      typingAction.play();
      typingAction.timeScale = 1.2;
    }

    // Optional full-body standing clip (add to GLTF with one of these names)
    for (const name of STANDING_CLIP_NAMES) {
      const clip = THREE.AnimationClip.findByName(gltf.animations, name);
      if (clip) {
        standingAction = mixer.clipAction(clip);
        standingAction.setLoop(THREE.LoopRepeat, Infinity);
        standingAction.clampWhenFinished = false;
        standingAction.enabled = false;
        standingAction.setEffectiveWeight(0);
        break;
      }
    }
  }

  const FOOT_SIT_Y = 3.36;
  const FOOT_STAND_Y = 0;

  function setFootHeight(y: number) {
    const footR = character.getObjectByName("footR");
    const footL = character.getObjectByName("footL");
    if (footR) footR.position.y = y;
    if (footL) footL.position.y = y;
  }

  function setPoseMode(mode: PoseMode) {
    if (mode === currentPose) return;
    currentPose = mode;
    const duration = 0.6;

    if (mode === "standing") {
      if (standingAction) {
        standingAction.reset();
        standingAction.setEffectiveWeight(1);
        standingAction.fadeIn(duration).play();
        keyActions.forEach((a) => a.fadeOut(duration));
        if (typingAction) typingAction.fadeOut(duration);
      } else {
        // No standing clip: fade out typing/keys so bind pose or intro pose shows more;
        // lift feet to approximate standing height relative to chair
        keyActions.forEach((a) => a.fadeOut(duration));
        if (typingAction) typingAction.fadeOut(duration);
        setTimeout(() => {
          setFootHeight(FOOT_STAND_Y);
        }, duration * 500);
      }
    } else {
      // sitting — back to desk pose
      setFootHeight(FOOT_SIT_Y);
      if (standingAction) standingAction.fadeOut(duration);
      keyActions.forEach((a) => a.fadeIn(duration).play());
      if (typingAction) {
        typingAction.fadeIn(duration);
        typingAction.play();
      }
    }
  }

  function startIntro() {
    const introClip = gltf.animations.find(
      (clip) => clip.name === "introAnimation"
    );
    if (!introClip) return;
    const introAction = mixer.clipAction(introClip);
    introAction.clampWhenFinished = true;
    introAction.reset().play();
    setTimeout(() => {
      const blink = gltf.animations.find((clip) => clip.name === "Blink");
      if (blink) mixer.clipAction(blink).play().fadeIn(0.5);
    }, 2500);
  }

  function hover(gltf: GLTF, hoverDiv: HTMLDivElement) {
    const eyeBrowUpAction = createBoneAction(
      gltf,
      mixer,
      "browup",
      eyebrowBoneNames
    );
    let isHovering = false;
    if (eyeBrowUpAction) {
      eyeBrowUpAction.setLoop(THREE.LoopOnce, 1);
      eyeBrowUpAction.clampWhenFinished = true;
      eyeBrowUpAction.enabled = true;
    }
    const onHoverFace = () => {
      if (eyeBrowUpAction && !isHovering) {
        isHovering = true;
        eyeBrowUpAction.reset();
        eyeBrowUpAction.enabled = true;
        eyeBrowUpAction.setEffectiveWeight(4);
        eyeBrowUpAction.fadeIn(0.5).play();
      }
    };
    const onLeaveFace = () => {
      if (eyeBrowUpAction && isHovering) {
        isHovering = false;
        eyeBrowUpAction.fadeOut(0.6);
      }
    };
    hoverDiv.addEventListener("mouseenter", onHoverFace);
    hoverDiv.addEventListener("mouseleave", onLeaveFace);
    return () => {
      hoverDiv.removeEventListener("mouseenter", onHoverFace);
      hoverDiv.removeEventListener("mouseleave", onLeaveFace);
    };
  }

  return { mixer, startIntro, hover, setPoseMode, getPose: () => currentPose };
};

const createBoneAction = (
  gltf: GLTF,
  mixer: THREE.AnimationMixer,
  clip: string,
  boneNames: string[]
): THREE.AnimationAction | null => {
  const AnimationClip = THREE.AnimationClip.findByName(gltf.animations, clip);
  if (!AnimationClip) {
    console.error(`Animation "${clip}" not found in GLTF file.`);
    return null;
  }
  const filteredClip = filterAnimationTracks(AnimationClip, boneNames);
  return mixer.clipAction(filteredClip);
};

const filterAnimationTracks = (
  clip: THREE.AnimationClip,
  boneNames: string[]
): THREE.AnimationClip => {
  const filteredTracks = clip.tracks.filter((track) =>
    boneNames.some((boneName) => track.name.includes(boneName))
  );
  return new THREE.AnimationClip(
    clip.name + "_filtered",
    clip.duration,
    filteredTracks
  );
};

export default setAnimations;
