class baseScene extends Phaser.Scene {
    constructor(key) {
        super(key);
    }

    startScene(key, data = {}) {
        // Stop all overlay scenes
        this.scene.stop("dialogueOverlay");
        this.scene.stop("inventoryOverlay");
        this.scene.stop("brightnessOverlay");
        this.scene.stop("musicPlayer");

        // Start the new scene
        this.scene.start(key, data);
    }

    init(data) {
        // Save progress and room when scene starts
        if(currentSlot !== undefined) {
            const slotPrefix = currentSlot === 1 ? "first" : (currentSlot === 2 ? "second" : "third");
            const progressKey = `${slotPrefix}SlotScene`;
            const roomKey = `${slotPrefix}SlotLastRoom`;
            
            try { 
                // Save progress
                localStorage.setItem(progressKey, String(progress));
                // Save current room (scene key will be like "scene1", "scene2", etc.)
                const roomNumber = this.scene.key.replace("scene", "");
                localStorage.setItem(roomKey, roomNumber);
            } catch(e) {}
        }

        // Create tutor text
        this.createTutorText();
        this.time.addEvent({
            delay: 1000,
            callback: () => {
                this.updateTutorText();
            },loop: true
        })

        // Create track info
        this.createTrackInfo();
        this.time.delayedCall(1000, () => {
        this.showTrackInfo(currentMusic);
        console.log("showTrackInfo", currentMusic)
        })

        // Call the scene's own init if it exists
        if(this.sceneInit) {
            this.sceneInit(data);
        }
    }

    createTrackInfo() {

        this.trackDisplay = this.add.text(
            this.game.config.width - 20,
            20,
            '',
            {
                fontFamily: 'Moving',
                fontSize: '32px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 2
            }   
        )
        .setOrigin(1, 0)
        .setScrollFactor(0)
        .setDepth(1000)
        .setAlpha(.8);

        this.events.on('trackChanged', (trackInfo) => {
            this.trackDisplay.setText(`Current Track: ${trackInfo}`);
        });
    }

    createTutorText() {
        // Create tutor text with common style
        this.tutorText = this.add.text(20, 10, "", {
            fontFamily: "Moving",
            fontSize: "40px",
            color: "white",
            stroke: "#000000",
            strokeThickness: 2
        }).setOrigin(0).setScrollFactor(0).setDepth(1000);

        // Set initial alpha
        this.tutorText.alpha = 0;

        // Update text based on progress
        this.updateTutorText();

        // For progress 1, start flickering between two messages
        if (progress === 0) {
            this.startTutorTextFlicker();
        }

        // Listen for dialogue overlay events
        const dialogueOverlay = this.scene.get('dialogueOverlay');
        if (dialogueOverlay) {
            dialogueOverlay.events.on('dialogue-started', this.hideTutorText, this);
            dialogueOverlay.events.on('dialogue-ended', this.showTutorText, this);
        }
    }

    updateTutorText() {
        const messages = {
            0: ["Read the documents about the test subject", "Press E to interact with objects"],
            1: "See patient at room 3",
            2: "Return to your office and take notes",
            3: "Visit your patient again",
            4: "",
            5: "Take your meds and work on your notes",
            6: "Find a light source",
            7: "Visit your patient",
            8: "Take your meds",
            9: "Take. Your. Meds.",
            10: "Use restroom",
            11: "Visit kids",
            12: "Go to your office",
            13: "See the kids",
            14: "See the kids",
            15: "Go back to your office and face the consuqences of your choice"
        };

        const message = messages[progress] || "";
        if (progress !== 0) {
            this.tutorText.setText(message);
            if (message) {
                this.fadeInTutorText();
            }
        }
    }


    startTutorTextFlicker() {
        if (this.tutorFlickerTimer) {
            this.tutorFlickerTimer.destroy();
        }

        let showingFirst = true;
        this.tutorFlickerTimer = this.time.addEvent({
            delay: 3000,
            callback: () => {
                if (progress !== 0) {
                    this.tutorFlickerTimer.destroy();
                    return;
                }
                if (progress === 0) {
                    this.tutorText.setText(showingFirst ? 
                        "Read the documents about the test subject" : 
                        "Press E to interact with objects"
                    );
                }  
                this.fadeInTutorText();
                showingFirst = !showingFirst;
            },
            loop: true
        });

        // Initial text
        this.tutorText.setText("Read the documents about the test subject");
        this.fadeInTutorText();
    }

    fadeInTutorText() {
        // Stop any existing tween
        if (this.tutorTween) {
            this.tutorTween.stop();
        }

        // Make sure text is visible initially
        this.tutorText.alpha = 0.6;

        // Create neon-like blinking effect
        this.tutorTween = this.tweens.add({
            targets: this.tutorText,
            alpha: 1,
            duration: 1000, // Fast fade in
            yoyo: true,
            hold: 200, // Hold at full brightness
            repeatDelay: 100, // Slight pause between cycles
            repeat: -1,
            ease: 'Sine.easeIn',
            onUpdate: () => {
                // Add slight color variation for neon effect
                const brightness = 0.8 + (this.tutorText.alpha * 0.2); // Varies between 0.8 and 1.0
                this.tutorText.setTint(Phaser.Display.Color.GetColor(
                    255 * brightness, // R
                    255 * brightness, // G
                    255 * brightness  // B
                ));
            }
        });
    }

    hideTutorText() {
        if (this.tutorText) {
            // Stop the neon effect tween if it exists
            if (this.tutorTween) {
                this.tutorTween.stop();
                this.tutorTween = null;
            }
            // Quick fade out
            this.tweens.add({
                targets: this.tutorText,
                alpha: 0,
                duration: 200,
                ease: 'Linear',
                onComplete: () => {
                    // Reset the tint when hidden
                    this.tutorText.clearTint();
                }
            });
        }
    }

    showTutorText() {
        if (this.tutorText && this.tutorText.text) {
            this.fadeInTutorText();
        }
    }


  showTrackInfo(key) {
    console.log("SHOW TRACK")
    console.log(this.trackDisplay.alpha)
    console.log("showTrackInfo", key)
                const { artist, name } = musicPlayer.trackInfo[key];
                const text = `${artist} - ${name}`;
    try {
      console.log("text", text)

      // Emit event for other scenes
      //this.events.emit('trackChanged', text);
        this.trackDisplay.setText(`Current Track: ${text}`);

        this.displayTween = this.tweens.add({
          targets: this.trackDisplay,
          alpha: { from: 0, to: 1 },
          duration: 500,
          ease: 'Linear',
          onComplete: () => {
            console.log(this.trackDisplay.alpha)
            this.time.delayedCall(5000, () => {
              this.tweens.add({
                targets: this.trackDisplay,
                alpha: 0,
                duration: 500,
                ease: 'Linear'
              });
            });
          }
        });

        if(this.trackDisplay.text== ""){
            try {
                this.trackDisplay.text = text
                this.trackDisplay.alpha = 1
            } catch (e) {
            }
        }
    } catch (e) {
      // Silently ignore any errors - track info is nice to have but not critical
    }
  }

}