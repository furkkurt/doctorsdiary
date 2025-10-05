var config = {
  type: Phaser.AUTO,
  width: 1920,
  height: 1080,
  scale: {
    mode: Phaser.Scale.FIT,
    autoCenter: Phaser.Scale.CENTER_BOTH
  },
  physics: {
    default: "arcade",
    arcade: {
      debug: false
    }
  },
  scene: [preloader, demo, opening, brightnessOverlay, dialogueOverlay, inventoryOverlay, musicPlayer, mainMenu, settings, loadGame, scene0, scene1, scene2, scene3, scene4, scene5, scene6, scene7, menu],
  pixelArt: false,
  backgroundColor: "#000"
};

var game = new Phaser.Game(config);
