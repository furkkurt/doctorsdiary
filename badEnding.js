class badEnding extends Phaser.Scene {
  constructor() {
    super("badEnding");
  }

  create() {
    this.scene.launch("musicPlayer")
    this.musicPlayer = this.scene.get("musicPlayer")
    this.musicPlayer.stopAllSfx();
    this.musicPlayer.playSfx("monitor");
    this.musicPlayer.playMusic("goodEnding");
    this.scene.bringToTop("musicPlayer")
    // Create black background
    this.add.graphics()
      .fillStyle(0x000000, 1)
      .fillRect(0, 0, this.scale.width, this.scale.height);
    
    // Text content
    const lines = [
      "Im scared.",
      "I was always scared.",
      "It never goes away.",
      "But i learn to, trust myself.",
      "I learn to... be okay, with being scared.",
      "It calms you down.",
      "Reminds you that youre human.",
      "And you can make mistakes.",
      "And it makes you recover from your mistakes.",
      "It makes you become a better person.",
      "It makes you realize you, are a person.",
      "So that you can forgive yourself.",
      "And live.",
      "Again."
    ];
    
    // Text style
    const textStyle = {
      fontFamily: "Moving",
      fontSize: "48px",
      color: "#ffffff",
      align: "center"
    };
    
    // Create all text objects but make them invisible
    const textObjects = lines.map((line, i) => {
      return this.add.text(
        this.cameras.main.centerX,
        this.cameras.main.height + 100, // Start below screen
        line,
        textStyle
      ).setOrigin(0.5).setAlpha(0);
    });
    
    // Function to animate one line
    const animateLine = (textObj, index) => {
      // Scroll up and fade in
      this.tweens.add({
        targets: textObj,
        y: this.cameras.main.centerY,
        alpha: 1,
        duration: 2000,
        ease: 'Linear',
        onComplete: () => {
          // Wait, then fade out and prepare for next line
          this.time.delayedCall(2000, () => {
            this.tweens.add({
              targets: textObj,
              y: -100, // Move up off screen
              alpha: 0,
              duration: 2000,
              ease: 'Linear',
              onComplete: () => {
                // Start next line if there is one
                if (index < textObjects.length - 1) {
                  animateLine(textObjects[index + 1], index + 1);
                } else {
                  // Last line finished, show final text
                  const finalText = 
                    "We unfortunately have to inform you about the lost of our only doctor in our town doctor Arif. " +
                    "He was discovered in his tent at 06.59 AM; a firearm was present.\n\n" +
                    "Without a physician to care for them, we face painful decisions. For those with injuries that cannot " +
                    "be treated or are incompatible with life, we may be forced to consider euthanasia as a last resort. " +
                    "We do not take this lightly and extend our deepest condolences and apologies to the families affected.\n\n" +
                    "In sympathy,\n\n" +
                    "The Mayor\n" +
                    "weylibn";

                  const finalTextStyle = {
                    fontFamily: "Moving",
                    fontSize: "32px",
                    color: "#ffffff",
                    align: "center",
                    wordWrap: { width: this.scale.width * 0.8 }
                  };

                  const finalTextObj = this.add.text(
                    this.cameras.main.centerX,
                    this.cameras.main.centerY,
                    finalText,
                    finalTextStyle
                  ).setOrigin(0.5).setAlpha(0);

                  // Fade in final text
                  this.tweens.add({
                    targets: finalTextObj,
                    alpha: 1,
                    duration: 2000,
                    onComplete: () => {
                      // Wait before transitioning to credits
                      this.time.delayedCall(15000, () => {
                        //bad ending bittiğinde progress 13 yaptık
                        this.scene.start('credits');
                      });
                    }
                  });
                }
              }
            });
          });
        }
      });
    };
    
    // Start with first line
    animateLine(textObjects[0], 0);
  }
}
