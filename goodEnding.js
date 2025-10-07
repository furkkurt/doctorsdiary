class goodEnding extends Phaser.Scene {
  constructor() {
    super("goodEnding");
  }

  create() {
    this.scene.launch("musicPlayer")
    this.musicPlayer = this.scene.get("musicPlayer")
    this.musicPlayer.stopAllSfx();
    this.musicPlayer.playMusic("goodEnding");
    this.scene.bringToTop("musicPlayer")
    // Set up scene like scene1
    this.bg1 = this.add.image(0,0,"testBg").setOrigin(0);
    this.bg2 = this.add.image(0,0,"testBgObjects").setOrigin(0);
    this.scaleFactor = this.scale.height/this.bg1.height;
    this.bg1.setScale(this.scaleFactor);
    this.bg2.setScale(this.scaleFactor);

    // Create doctor and nurse
    this.doctor = this.physics.add.sprite(1100,700,"doc").setDepth(99);
    this.doctor.play("docIdle");
    this.nurse = this.add.sprite(900, 700, "nurse").setDepth(98).setScale(1.0);
    this.nurse.play("nurseIdle");

    // Set up dialogue overlay
    this.scene.launch("dialogueOverlay");
    this.scene.bringToTop("dialogueOverlay");
    this.dialogue = this.scene.get('dialogueOverlay');

    // Create overlay for initial fade
    this.overlayDark = this.add.graphics();
    this.overlayDark.fillStyle(0x000000, 1);
    this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlayDark.setScrollFactor(0);
    this.overlayDark.setDepth(100);

    // Wait for dialogue system to be ready
    this.time.delayedCall(100, () => {
      this.dialogue.fadeOut(this.overlayDark);
      
      // Start initial dialogue sequence
      const initialDialogue = [
        { text: "Everyones melted together.", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "Tar-like flesh, sticking.", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "But its not your foult?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "Was war heartache your foult?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "No?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "At least you tried yeah?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "Youre just a one person?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "You cant change anything?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "Whats the worth in even trying?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "or.... is this even trying?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "youre lying to yourself again?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "youre just running away.", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "even this purgatory of a life.", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "even after your death.", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "youre running away.", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
        { text: "ENOUGH-!", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Doctor" }
      ];

      const tryStartDialogue = () => {
        if (this.dialogue && this.dialogue.dialogueText) {
          this.dialogue.startDialogueSequence(initialDialogue, () => {
            // Start cutscene sequence
            this.showCutscenes();
          });
        } else {
          this.time.delayedCall(100, tryStartDialogue);
        }
      };

      tryStartDialogue();
    });
  }

  showCutscenes() {
    this.bg1.setVisible(false);
    this.bg2.setVisible(false);
    // Create full screen images
    const images = ['cs1', 'cs2', 'cs3', 'cs4', 'cs5'].map(key => {
      return this.add.image(this.cameras.main.centerX, this.cameras.main.centerY, key)
        .setOrigin(0.5)
        .setDisplaySize(this.scale.width, this.scale.height)
        .setAlpha(0)
        .setDepth(100);
    });

    // Show each image with delay
    let delay = 0;
    images.forEach((img, i) => {
      this.tweens.add({
        targets: img,
        alpha: { from: 0, to: 1 },
        duration: 500,
        delay: delay,
        yoyo: true,
        hold: 1000,
        onComplete: () => {
          img.destroy();
          if (i === images.length - 1) {
            this.startFinalSequence();
            this.bg1.setVisible(true);
          }
        }
      });
      delay += 2000; // 0.5s fade in + 1s hold + 0.5s fade out
    });
  }

  startFinalSequence() {
    // Change background
    this.bg1.setTexture("bg62");
    this.overlayDark.alpha = 1;
    this.dialogue.fadeOut(this.overlayDark);
    // Hide nurse
    this.nurse.destroy();

    // Final dialogue sequence
    const finalDialogue = [
      { text: "good morning kids...", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "4", rightAnimation: null, name: "Doctor" },
      { text: "...", leftPortrait: null, rightPortrait: null, leftAnimation: null, rightAnimation: null, name: "Ayaz" },
      { text: "...", leftPortrait: null, rightPortrait: null, leftAnimation: null, rightAnimation: null, name: "Aras" },
      { text: "ill find a way... dont you guys ever worry okay?", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "4", rightAnimation: null, name: "Doctor" },
      { text: "ill find a way.", leftPortrait: null, rightPortrait: null, leftAnimation: null, rightAnimation: null, name: "Doctor" }
    ];

    this.dialogue.startDialogueSequence(finalDialogue, () => {
      // Fade to black and show final text
      this.showFinalText();
    });
  }

  showFinalText() {
    this.doctor.setVisible(false);
    // Create black overlay
    const overlay = this.add.graphics()
      .fillStyle(0x000000, 1)
      .fillRect(0, 0, this.scale.width, this.scale.height)
      .setAlpha(0);

    // Fade to black
    this.tweens.add({
      targets: overlay,
      alpha: 1,
      duration: 1000,
      onComplete: () => {
        const textStyle = {
          fontFamily: "Moving",
          fontSize: "32px",
          color: "#ffffff",
          align: "center",
          wordWrap: { width: this.scale.width * 0.8 }
        };

        const text = this.add.text(
          this.cameras.main.centerX,
          this.cameras.main.centerY,
          "THE END",
          textStyle
        ).setOrigin(0.5).setAlpha(0);

        // Fade in text
        this.tweens.add({
          targets: text,
          alpha: 1,
          duration: 2000,
          onComplete: () => {
            // Wait 5 seconds before transitioning to credits
            this.time.delayedCall(15000, () => {
              //bad ending bittiğinde progress 13 yaptık
              this.scene.start('credits');
            });
          }
        });
      }
    });
  }
}