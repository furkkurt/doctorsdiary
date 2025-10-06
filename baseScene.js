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

        // Call the scene's own init if it exists
        if(this.sceneInit) {
            this.sceneInit(data);
        }
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
        if (progress === 1 || progress === 0) {
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
            1: ["See patient at room 3", "Press E to interact with objects"],
            2: "Return to your office and take notes",
            3: "Visit your patient again",
            4: "",
            5: "Take your meds and work on your notes",
            6: "Find a light source",
            7: "Visit your patient",
            8: "Take your meds",
            9: "Use restroom",
            10: "Use restroom",
            11: "",
            12: "Visit kids",
            13: "Go back to your office and face the consuqences of your choice"
        };

        const message = messages[progress] || "";
        if (progress !== 1 && progress !== 0) {
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
                if (progress !== 1 && progress !== 0) {
                    this.tutorFlickerTimer.destroy();
                    return;
                }
                if (progress === 0) {
                    this.tutorText.setText(showingFirst ? 
                        "Read the documents about the test subject" : 
                        "Press E to interact with objects"
                    );
                } else {
                    this.tutorText.setText(showingFirst ? 
                        "See patient at room 3" : 
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
}