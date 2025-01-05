const SOUNDS = [
  "sounds/bird-chirp.mp3",
  "sounds/cat-meow.mp3",
  "sounds/chicken-click.mp3",
  "sounds/chimpanzee-hoots.mp3",
  "sounds/cow-moos.wav",
  "sounds/cricket-chirp.mp3",
  "sounds/dog-bark.mp3",
  "sounds/dog-barks-2.wav",
  "sounds/elephant-trumpets.mp3",
  "sounds/elsa-1.mp3",
  "sounds/elsa-2.mp3",
  "sounds/elsa-3.mp3",
  "sounds/elsa-4.mp3",
  "sounds/elsa-5.mp3",
  "sounds/frog-croaks.mp3",
  "sounds/guinea-pig-squeak.mp3",
  "sounds/horse-snort.mp3",
  "sounds/lion-roar.mp3",
  "sounds/many-moos.mp3",
  "sounds/pig-snort.mp3",
  "sounds/snake-hiss.mp3",
];

const ELSA_SOUNDS = [
  "sounds/elsa-1.mp3",
  "sounds/elsa-2.mp3",
  "sounds/elsa-3.mp3",
  "sounds/elsa-4.mp3",
  "sounds/elsa-5.mp3",
];

export const getRandomSound = () => {
  return SOUNDS[Math.floor(Math.random() * SOUNDS.length)];
};

export const getRandomElsa = () => {
  return ELSA_SOUNDS[Math.floor(Math.random() * ELSA_SOUNDS.length)];
};
