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
    // Hide existing portraits
    this.hidePortraits()
    
    // Show portraits if provided
    if (leftPortrait) {
      this.showPortrait(leftPortrait, leftAnimation, "left")
    }
    if (rightPortrait) {
      this.showPortrait(rightPortrait, rightAnimation, "right")
    }
    
    // Set name tag if provided (guard against uninitialized text/sprites)
    if (name && this.nameText && this.nameTag) {
      this.nameText.text = name;
      this.fadeIn(this.nameTag, 100);
      this.fadeIn(this.nameText, 100);
    } else if (this.nameTag && this.nameText) {
      this.fadeOut(this.nameTag, 100);
      this.fadeOut(this.nameText, 100);
    }
    
    //belirmece
    this.fadeIn(this.dialogueBox, 100)
    this.fadeIn(this.dialogueText, 100)

    //yazmaca
    let i = 0;
    this.time.delayedCall(100, () => {
      this.time.addEvent({
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
    this.time.delayedCall(100, () => {
      this.dialogueText.text = ""
      this.nameText.text = ""
    })
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
    
    // Create portrait sprite
    let portrait = this.add.sprite(0, this.scale.height, textureKey).setScrollFactor(0).setOrigin(0, 1)
    portrait.alpha = 0
    
    // Position based on side - bottom corners with proper margins
    if (side === "left") {
      portrait.setPosition(0, this.scale.height) // bottom left with margin
      this.leftPortrait = portrait
    } else if (side === "right") {
      portrait.setPosition(this.scale.width-portrait.width, this.scale.height) // bottom right with margin
      this.rightPortrait = portrait
    }
    
    console.log("Portrait positioned at:", portrait.x, portrait.y);
    
    // Play animation if provided
    if (animation) {
      console.log("Playing animation:", animation);
      portrait.play(animation)
    }
    
    // Flip kids portrait to face the right direction
    portrait.flipX = true;
    
    console.log("Portrait created successfully, fading in...");
    console.log("Portrait visible:", portrait.visible, "alpha:", portrait.alpha, "depth:", portrait.depth);
    
    // Fade in immediately (no forced alpha to 1 to avoid flicker)
    portrait.alpha = 0
    this.fadeIn(portrait, 200)
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
    
    // Set up click listener for advancing dialogue
    this.input.on('pointerdown', this.advanceDialogue, this)
    
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
    if(this.dialogueText != undefined)
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
    }
    
    // Set name tag if provided
    if (currentDialogue.name && this.nameText != undefined) {
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
    
    let i = 0;
    let lineBreaks = 0;
    this.time.delayedCall(100, () => {
      this.currentTypingEvent = this.time.addEvent({
        delay: 50,
        callback: () => {
          if(text.charAt(i) != "ü") {
            this.dialogueText.text += text.charAt(i);
            
            // Check if we need to wrap text
            const shouldWrap = this.wrapText();
            if (shouldWrap) {
              lineBreaks++;
              
              // If we've reached 2 line breaks, split the remaining text
              if (lineBreaks >= 2) {
                const remainingText = text.substring(i + 1);
                if (remainingText.trim().length > 0) {
                  // Split the remaining text into a new dialogue entry
                  this.splitRemainingText(remainingText);
                  return; // Stop typing current text
                }
              }
            }
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
    
    if (this.dialogueText.width > maxWidth) {
      // Find the last space before the overflow
      let lastSpaceIndex = this.dialogueText.text.lastIndexOf(' ');
      if (lastSpaceIndex > 0) {
        const beforeSpace = this.dialogueText.text.substring(0, lastSpaceIndex);
        const afterSpace = this.dialogueText.text.substring(lastSpaceIndex + 1);
        this.dialogueText.text = beforeSpace + '\n' + afterSpace;
        return true; // Wrapping occurred
      }
    }
    return false; // No wrapping occurred
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
    
    // Remove click listener
    this.input.off('pointerdown', this.advanceDialogue, this)
    
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
