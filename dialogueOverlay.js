class dialogueOverlay extends Phaser.Scene{
  constructor(){
    super("dialogueOverlay");
  }
  create(){
    console.log("BEHOLD THE DIALOGS!!!");

    this.dialogueBox = this.add.sprite(this.cameras.main.centerX, 920, "textbg").setOrigin(0.5).setScrollFactor(0).setDepth(100)
    this.dialogueBox.alpha = 0
    this.dialogueText = this.add.text(this.dialogueBox.x, this.dialogueBox.y-80, "", {fontFamily:"Moving", fontSize: "48px", color: "black"}).setScrollFactor(0).setDepth(100)
    this.dialogueText.setOrigin(0.5, 0)
    this.dialogueText.alpha = 0

    // Nametag system
    this.nameTag = this.add.sprite(this.dialogueBox.x-this.dialogueBox.width/2-120, this.dialogueBox.y - this.dialogueBox.height/2+20, "namebg").setOrigin(0).setScrollFactor(0).setDepth(102).setScale(.5)
    this.nameTag.alpha = 0
    this.nameText = this.add.text(this.nameTag.x + 270, this.nameTag.y+150, "", {fontFamily:"Moving", fontSize: "32px", color: "white"}).setOrigin(0).setScrollFactor(0).setDepth(103)
    this.nameText.alpha = 0

    // Portrait sprites for left and right sides
    this.leftPortrait = null
    this.rightPortrait = null
    
    // Dialogue sequence system
    this.dialogueSequence = []
    this.currentDialogueIndex = 0
    this.isInSequence = false
    this.sequenceCallback = null
    this.currentTypingEvent = null

  };

  dialogue(text, leftPortrait = null, rightPortrait = null, leftAnimation = null, rightAnimation = null, name = null) {
    // Emit dialogue started event
    this.events.emit('dialogue-started');

    // Hide existing portraits
    this.hidePortraits()
    //bi dursun
    this.dialogueText.text = ""
    
    // Show portraits if provided
    if (leftPortrait) {
      this.showPortrait(leftPortrait, leftAnimation, "left")
    }
    if (rightPortrait) {
      this.showPortrait(rightPortrait, rightAnimation, "right")
    }
    
    // Set name tag if provided
    if (name) {
      this.nameText.text = name;
      this.fadeIn(this.nameTag, 100);
      this.fadeIn(this.nameText, 100);

    } else {
      this.fadeOut(this.nameTag, 100);
      this.fadeOut(this.nameText, 100);
    }

    //belirmece
    this.fadeIn(this.dialogueBox, 100)
    this.fadeIn(this.dialogueText, 100)

    this.writeText(text)

  }

  writeText(text){
    // Stop any existing text writing event
    if (this.currentTypingEvent) {
      this.currentTypingEvent.destroy();
      this.currentTypingEvent = null;
    }

    //yazmaca
    let i = 0;
    this.time.delayedCall(100, () => {
      this.currentTypingEvent = this.time.addEvent({
        delay: 50,
        callback: () => {
          if(text.charAt(i) != "ü")
            this.dialogueText.text += text.charAt(i);
          else
            this.dialogueText.text = "";
          i++
        }, repeat: text.length
      })
    })
  }
  hideDialogue(){
    this.fadeOut(this.dialogueBox, 100)
    this.fadeOut(this.dialogueText, 100)
    this.fadeOut(this.nameTag, 100)
    this.fadeOut(this.nameText, 100)
    this.destroyPortraits() // Use immediate destruction instead of fade
    this.dialogueText.text = ""
    this.nameText.text = ""
    
    // Emit dialogue ended event
    this.events.emit('dialogue-ended');
  }

  //fade in efektini de buraya alıyorum her sahne 50 kere yazıyom amk
  fadeIn(sprite, duration = 1000) {
    if (!sprite) return;
    

    this.tweens.add({
      targets: sprite,
      alpha: 1,
      duration: duration,
      ease: 'Linear',
      onComplete: () => {
        if (sprite && sprite.texture) {
          console.log("Fade in complete for:", sprite.texture.key, "final alpha:", sprite.alpha);
        }
      }
    });
  }

  fadeOut(sprite, duration = 1000) {
    if (!sprite) return;
    this.tweens.add({
      targets: sprite,
      alpha: 0,
      duration: duration,
      ease: 'Linear'
    });
  }

  showPortrait(textureKey, animation, side) {
    console.log("Creating portrait:", textureKey, animation, side);
    
    // Determine the actual texture key based on animation number
    const actualTextureKey = animation ? `${textureKey}${animation}` : textureKey;
    console.log("Using texture key:", actualTextureKey);
    
    // Create portrait sprite with scaling
    let portrait = this.add.sprite(0, this.scale.height, actualTextureKey)
      .setScrollFactor(0)
      .setScale(0.25)    // Scale down portraits
      .setDepth(99)     // Set depth between dialogue box and name tag
    
    // Always put doctor on left, others on right
    const isDoctor = textureKey.includes('docPort');
    if (isDoctor || side === "left") {
      portrait.setScale(0.5)
      portrait.setOrigin(0, 1);  // Bottom-left corner
      portrait.setPosition(0, this.scale.height);  // Bottom-left of screen
      this.leftPortrait = portrait;
    } else {
      portrait.setOrigin(1, 1);  // Bottom-right corner
      portrait.setPosition(this.scale.width, this.scale.height);  // Bottom-right of screen
      this.rightPortrait = portrait;
    }
    
    console.log("Portrait positioned at:", portrait.x, portrait.y, "Scale:", portrait.scaleX);
    console.log("Portrait created successfully, fading in...");

    // Set initial alpha based on who will be speaking next
    portrait.alpha = 0;
    if (this.leftPortrait && this.rightPortrait && this.isInSequence) {
      // Look at the next dialogue in sequence
      const nextDialogue = this.dialogueSequence[this.currentDialogueIndex];
      if (nextDialogue) {
        const isDoctor = nextDialogue.name === "Doctor";
        const targetAlpha = (isDoctor && portrait === this.leftPortrait) || (!isDoctor && portrait === this.rightPortrait) ? 1 : 0.6;
        
        console.log("Next speaker:", nextDialogue.name);
        console.log("Setting alpha for", side, "portrait to", targetAlpha);
        
        // Fade in to the target alpha
        this.tweens.add({
          targets: portrait,
          alpha: targetAlpha,
          duration: 200,
          ease: 'Linear'
        });
      } else {
        this.fadeIn(portrait, 200);
      }
    } else {
      // If not in sequence or only one portrait, fade in to full alpha
      this.fadeIn(portrait, 200);
    }
  }

  hidePortraits() {
    const oldLeft = this.leftPortrait;
    const oldRight = this.rightPortrait;
    if (oldLeft) {
      this.fadeOut(oldLeft, 200)
      this.time.delayedCall(200, () => {
        if (oldLeft && oldLeft.destroy) {
          oldLeft.destroy()
        }
        if (this.leftPortrait === oldLeft) {
          this.leftPortrait = null
        }
      })
    }
    
    if (oldRight) {
      this.fadeOut(oldRight, 200)
      this.time.delayedCall(200, () => {
        if (oldRight && oldRight.destroy) {
          oldRight.destroy()
        }
        if (this.rightPortrait === oldRight) {
          this.rightPortrait = null
        }
      })
    }
  }

  // Start a dialogue sequence with click-to-advance functionality
  startDialogueSequence(dialogueArray, callback = null) {
    this.dialogueSequence = dialogueArray
    this.currentDialogueIndex = 0
    this.isInSequence = true
    this.sequenceCallback = callback
    
    // Set up click and key listeners for advancing dialogue
    this.input.on('pointerdown', this.advanceDialogue, this);
    this.input.keyboard.on('keydown-E', this.advanceDialogue, this);
    
    // Start with first dialogue
    this.showCurrentDialogue()
  }

  // Destroy portraits immediately
  destroyPortraits() {
    if (this.leftPortrait) {
      this.leftPortrait.destroy()
      this.leftPortrait = null
    }
    if (this.rightPortrait) {
      this.rightPortrait.destroy()
      this.rightPortrait = null
    }
  }

  // Show the current dialogue in the sequence
  showCurrentDialogue() {
    if (this.currentDialogueIndex >= this.dialogueSequence.length) {
      this.endDialogueSequence()
      return
    }
    
    const currentDialogue = this.dialogueSequence[this.currentDialogueIndex]
    const isLastEntry = this.currentDialogueIndex === this.dialogueSequence.length - 1
    
    // Clear previous text
    this.dialogueText.text = ""
    
    // Always hide previous portraits first to prevent lingering or duplicates
    this.hidePortraits()

    // For the final entry, keep portraits hidden; otherwise show provided portraits
    if (!isLastEntry) {
      if (currentDialogue.leftPortrait) {
        this.showPortrait(currentDialogue.leftPortrait, currentDialogue.leftAnimation, "left")
      }
      if (currentDialogue.rightPortrait) {
        this.showPortrait(currentDialogue.rightPortrait, currentDialogue.rightAnimation, "right")
      }

      // Alpha values are now handled in showPortrait
    }
    
    // Set name tag if provided
    if (currentDialogue.name) {
      this.nameText.text = currentDialogue.name;
      this.fadeIn(this.nameTag, 100);
      this.fadeIn(this.nameText, 100);
    } else {
      this.fadeOut(this.nameTag, 100);
      this.fadeOut(this.nameText, 100);
    }
    
    // Show dialogue box and text
    this.fadeIn(this.dialogueBox, 100)
    this.fadeIn(this.dialogueText, 100)
    
    // Type out the text
    this.typeText(currentDialogue.text)
  }

  // Type out text character by character with word wrapping
  typeText(text) {
    // Stop any current typing event
    if (this.currentTypingEvent) {
      this.currentTypingEvent.destroy();
      this.currentTypingEvent = null;
    }

    // First, check if the text would need more than 3 lines
    const testText = this.add.text(0, 0, text, {
      fontFamily: "Moving",
      fontSize: "48px",
      wordWrap: { width: this.dialogueBox.displayWidth * 0.8 }
    });
    const lines = testText.getWrappedText(text);
    testText.destroy();

    // If more than 3 lines, find the cutoff point
    if (lines.length > 3) {
      let firstThreeLines = lines.slice(0, 3).join(' ');
      let remainingLines = lines.slice(3).join(' ');

      // Find where the third line ends in the original text
      let cutoffIndex = text.indexOf(lines[2]) + lines[2].length;

      // Create a new dialogue entry with the remaining text
      if (remainingLines.trim().length > 0) {
        this.splitRemainingText(text.substring(cutoffIndex).trim());
        text = text.substring(0, cutoffIndex);
      }
    }
    
    let i = 0;
    this.time.delayedCall(100, () => {
      this.currentTypingEvent = this.time.addEvent({
        delay: 50,
        callback: () => {
          if(text.charAt(i) != "ü") {
            this.dialogueText.text += text.charAt(i);
            this.wrapText();
          } else {
            this.dialogueText.text = "";
          }
          i++
        }, repeat: text.length
      })
    })
  }

  // Wrap text when it gets too wide for the dialogue box
  wrapText() {
    const maxWidth = this.dialogueBox.displayWidth * 0.8; // 80% of dialogue box width
    this.dialogueText.setWordWrapWidth(maxWidth);
  }

  // Split remaining text into a new dialogue entry
  splitRemainingText(remainingText) {
    // Get the current dialogue object
    const currentDialogue = this.dialogueSequence[this.currentDialogueIndex];
    
    // Create a new dialogue object with the remaining text and same portraits
    const newDialogue = {
      text: remainingText.trim(),
      leftPortrait: currentDialogue.leftPortrait,
      rightPortrait: currentDialogue.rightPortrait,
      leftAnimation: currentDialogue.leftAnimation,
      rightAnimation: currentDialogue.rightAnimation,
      name: currentDialogue.name
    };
    
    // Insert the new dialogue entry after the current one
    this.dialogueSequence.splice(this.currentDialogueIndex + 1, 0, newDialogue);
    
    console.log("Text split: remaining text added as new dialogue entry");
  }

  // Advance to next dialogue in sequence
  advanceDialogue() {
    if (!this.isInSequence) return
    
    // Stop current typing event
    if (this.currentTypingEvent) {
      this.currentTypingEvent.destroy();
      this.currentTypingEvent = null;
    }
    
    this.currentDialogueIndex++
    
    if (this.currentDialogueIndex >= this.dialogueSequence.length) {
      this.endDialogueSequence()
    } else {
      this.showCurrentDialogue()
    }
  }

  // End the dialogue sequence
  endDialogueSequence() {
    this.isInSequence = false
    this.currentDialogueIndex = 0
    this.dialogueSequence = []
    
    // Stop any current typing event
    if (this.currentTypingEvent) {
      this.currentTypingEvent.destroy();
      this.currentTypingEvent = null;
    }
    
    // Remove click and key listeners
    this.input.off('pointerdown', this.advanceDialogue, this);
    this.input.keyboard.off('keydown-E', this.advanceDialogue, this);
    
    // Hide dialogue and portraits immediately
    this.hideDialogue()
    this.destroyPortraits()
    
    // Call callback if provided
    if (this.sequenceCallback) {
      this.sequenceCallback()
      this.sequenceCallback = null
    }
  }
  update(){
  }
}
