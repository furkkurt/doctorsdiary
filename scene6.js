class scene6 extends baseScene{
  constructor(){
    super("scene6")
  }

  create(data){
    this.controlsLocked = false;
    this.playerY = 700;
    // Set the current slot from the passed data
    if (data && data.currentSlot !== undefined) {
      currentSlot = data.currentSlot;
    }
    
    this.scene.launch("dialogueOverlay");
    this.scene.bringToTop("dialogueOverlay");
    this.scene.launch("inventoryOverlay");
    this.inventory = this.scene.get("inventoryOverlay");
    this.time.delayedCall(1000, () => {
      this.scene.bringToTop("inventoryOverlay");
    })
    this.dialogue = this.scene.get('dialogueOverlay');
    this.itemSelector();
    console.log(data.from)

    // build inventory array AFTER determining slot
    this.slot = currentSlot === 1 ? "firstSlotItem" : (currentSlot === 2 ? "secondSlotItem" : "thirdSlotItem");
    this.inventoryArr = [];
    
    // Get items from localStorage
    const i1 = localStorage.getItem(this.slot + "1");
    const i2 = localStorage.getItem(this.slot + "2");
    const i3 = localStorage.getItem(this.slot + "3");
    
    // Only add non-empty items to inventory
    if (i1 && i1 !== "" && !this.inventoryArr.includes(i1)) this.inventoryArr.push(i1);
    if (i2 && i2 !== "" && !this.inventoryArr.includes(i2)) this.inventoryArr.push(i2);
    if (i3 && i3 !== "" && !this.inventoryArr.includes(i3)) this.inventoryArr.push(i3);

    this.musicPlayer = this.scene.get("musicPlayer")
    if(this.musicPlayer.currentMusic == "")
      this.musicPlayer.playMusic("docsTheme")
    this.scene.bringToTop("musicPlayer")
    this.isWalking = false
    this.walkingSound = null
    this.isTransitioning = false

    this.overlayDark = this.add.graphics();
    this.overlayDark.fillStyle(0x000000, 1);
    this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlayDark.setScrollFactor(0);
    this.overlayDark.setDepth(100)
    this.dialogue.fadeOut(this.overlayDark)
    this.logProgress("scene2 create")

    this.bg = this.add.image(0,0,"bg3").setOrigin(0)
    if(progress == 10)
      this.bg.setTexture("bg32")
    this.scaleFactor = this.scale.height/this.bg.height
    this.bg.setScale(this.scaleFactor)
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.player = this.physics.add.sprite(this.mapWidth - 300,this.playerY,"doc").setDepth(99).setScale(1.01)
    this.player.play("docIdle")
    this.player.flipX = true;

    // Add nurse if progress is 10
    if (progress == 10) {
      this.nurse = this.add.sprite(0, 0, "nurse").setScale(this.scaleFactor).setDepth(98);
      this.musicPlayer.stopTheMusic()
      this.musicPlayer.playMusic("nursesTheme");
    }

    this.toilet= this.physics.add.sprite(0,0,"toilet").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.toilet2= this.physics.add.sprite(0,0,"toilet2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.garden= this.physics.add.sprite(0,0,"garden").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.stairs2= this.physics.add.sprite(0,0,"stairs2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)

    this.objects = [this.toilet, this.toilet2, this.stairs2, this.garden]

    const map = this.make.tilemap({ key: 'corridorDown' });
    const intLayer = map.getObjectLayer('interactive');
    intLayer.objects.forEach(obj => {
      if (obj.name === 'toilet') {
        this.toilet.x = obj.x*this.scaleFactor
        this.toilet.y = obj.y*this.scaleFactor
        if (progress == 10 && this.nurse) {
          this.nurse.x = obj.x*this.scaleFactor+500
          this.nurse.y = this.player.y
        }
        console.log("toilet found")
      }else if(obj.name === "stairs2") {
        this.stairs2.x = obj.x*this.scaleFactor
        this.stairs2.y = obj.y*this.scaleFactor
      } else if(obj.name === "toilet2") {
        this.toilet2.x = obj.x*this.scaleFactor
        this.toilet2.y = obj.y*this.scaleFactor
      } else if(obj.name === "garden") {
        this.garden.x = obj.x*this.scaleFactor
        this.garden.y = obj.y*this.scaleFactor
      }  
    });

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keydown-E", () => {
      switch(this.selectedItem){
        case "NaN":
          break;
        case this.stairs2:
          this.transitionToScene2();
          break;
        case this.toilet:
          this.toiletInteraction();
          break;
        case this.garden:
          this.transitionToScene8();
          break;
        case this.toilet2:
          this.dialogue.dialogue("this ones for women...", "docPort", null, "1", null, "Doctor");
          break;
      }
    });
    this.input.keyboard.on("keyup-A", this.stop.bind(this));
    this.input.keyboard.on("keyup-D", this.stop.bind(this));
    this.input.keyboard.on("keydown-ESC", this.pause.bind(this));
    this.input.keyboard.on("keydown-SPACE", this.pause.bind(this));

    if(data.from === 8){
      this.player.x = this.garden.x
    } else if(data.from === 2){
      this.player.x = this.mapWidth - 300
    }
  };  

  toiletInteraction(){
    this.stop();
    if (progress == 10) {
      this.musicPlayer.playSfx("toilet")
      this.dialogue.fadeIn(this.overlayDark, 1000);
      
      this.time.delayedCall(1000, () => {
        this.dialogue.fadeOut(this.overlayDark, 1000);
        
        // After fade out, spawn nurse and start dialogue
        this.time.delayedCall(1000, () => {
          // Create nurse if not exists
          this.nurse = this.add.sprite(3700, 650, "nurse").setScale(this.scaleFactor).setDepth(98);
          this.nurse.flipX = true
          
          // Disable player movement
          this.input.keyboard.removeAllListeners();
          this.player.setVelocityX(0);
          this.player.play("docIdle");
          this.musicPlayer.stopAllSfx();
          
          // Start dialogue sequence
          const seq = [
            { text: "you cant run this time?", leftPortrait: null, rightPortrait: "nursePort", leftAnimation: null, rightAnimation: null, name: "Nurse" },
            { text: "shut up.", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "10", rightAnimation: null, name: "Doctor" },
            { text: "is this an opurtunity to redeem yourself?", leftPortrait: null, rightPortrait: "nursePort", leftAnimation: null, rightAnimation: null, name: "Nurse" },
            { text: "or escape the pain? Again?", leftPortrait: null, rightPortrait: "nursePort", leftAnimation: null, rightAnimation: null, name: "Nurse" },
            { text: "sometimes we have to choose?", leftPortrait: null, rightPortrait: "nursePort", leftAnimation: null, rightAnimation: null, name: "Nurse" },
            { text: "one or another?", leftPortrait: null, rightPortrait: "nursePort", leftAnimation: null, rightAnimation: null, name: "Nurse" },
            { text: "it cant be both?", leftPortrait: null, rightPortrait: "nursePort", leftAnimation: null, rightAnimation: null, name: "Nurse" },
            { text: "SHUT UP", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "12", rightAnimation: null, name: "Doctor" }
          ];
          
          this.dialogue.startDialogueSequence(seq, () => {
            //nurse diyaoloğu sonrası
            progress = 11;
            
            // Re-enable player movement
            this.input.keyboard.on("keydown-A", this.left.bind(this));
            this.input.keyboard.on("keydown-D", this.right.bind(this));
            this.input.keyboard.on("keydown-E", () => {
              switch(this.selectedItem){
                case "NaN":
                  break;
                case this.stairs2:
                  this.transitionToScene2();
                  break;
                case this.toilet:
                  this.toiletInteraction();
                  break;
                case this.garden:
                  this.transitionToScene8();
                  break;
              }
            });
            this.input.keyboard.on("keyup-A", this.stop.bind(this));
            this.input.keyboard.on("keyup-D", this.stop.bind(this));
            this.input.keyboard.on("keydown-ESC", this.pause.bind(this));
            this.input.keyboard.on("keydown-SPACE", this.pause.bind(this));
          });
        });
      });
    } else {
      // Normal toilet interaction for other progress values
      this.musicPlayer.playSfx("toilet")
      this.dialogue.fadeIn(this.overlayDark, 1000);
      this.time.delayedCall(1000, () => {
        this.dialogue.fadeOut(this.overlayDark, 1000);
      });
    }
  }

  handleMatchClick() {
    if(this.nurse)
      this.nurse.setVisible(false)
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      
      // Disable player movement during transition
      this.input.keyboard.removeAllListeners();
      this.player.setVelocityX(0);
      this.player.play("docIdle");
      
      // Fade out
      this.dialogue.fadeIn(this.overlayDark, 1000);
      
      this.time.delayedCall(1000, () => {
        // Teleport player based on current position
        if (this.player.x > 4000) { // Right side
          this.player.x = 3200;
        } else { // Left side
          this.player.x = 4250;
        }
        
        // Fade back in
        this.dialogue.fadeOut(this.overlayDark, 1000);
        this.time.delayedCall(1000, () => {
          this.isTransitioning = false;
          
          // Re-enable player movement
          this.input.keyboard.on("keydown-A", this.left.bind(this));
          this.input.keyboard.on("keydown-D", this.right.bind(this));
          this.input.keyboard.on("keydown-E", () => {
            switch(this.selectedItem){
              case "NaN":
                break;
              case this.stairs2:
                this.transitionToScene2();
                break;
              case this.toilet:
                this.toiletInteraction();
                break;
              case this.garden:
                this.transitionToScene8();
                break;
            }
          });
          this.input.keyboard.on("keyup-A", this.stop.bind(this));
          this.input.keyboard.on("keyup-D", this.stop.bind(this));
          this.input.keyboard.on("keydown-ESC", this.pause.bind(this));
          this.input.keyboard.on("keydown-SPACE", this.pause.bind(this));
        });
      });
    }
    
    // Remove button
    if (this.matchButton) {
      this.matchButton.destroy();
      this.matchButton = null;
    }
  }

  pause(){
    this.scene.launch("menu", {from: this.scene.key})
    this.scene.pause()
    this.time.addEvent({delay: 10, callback: () => {this.stop();}})
    // Stop all SFX sounds when pausing
    this.musicPlayer.stopAllSfx();
  }

  logProgress(where){
    const key = currentSlot === 1 ? "firstSlotScene" : (currentSlot === 2 ? "secondSlotScene" : "thirdSlotScene")
    console.log(`[${where}] currentSlot=`, currentSlot, "progress=", progress, key, "=", localStorage.getItem(key))
  }

  startDoorTransition() {
    // Prevent multiple transitions
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    // Disable player movement
    this.input.keyboard.removeAllListeners();
    
    // Stop walking sound and play door sound
    this.musicPlayer.stopAllSfx();
    this.musicPlayer.playDoorSfx("door");
    
    // Fade in the dark overlay
    this.dialogue.fadeIn(this.overlayDark, 1000);
    
    // After 1 second delay, transition to scene1
    this.scene.stop("inventoryOverlay");
    this.time.delayedCall(1000, () => {
      this.scene.stop("dialogueOverlay");
      this.scene.start("scene8", {
        from: 6,
        currentSlot: currentSlot
      });
    });
  }

  startTransitionToScene7() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.input.keyboard.removeAllListeners();
    this.musicPlayer.stopAllSfx();
    this.musicPlayer.playDoorSfx("door");
    this.dialogue.fadeIn(this.overlayDark, 1000);
    this.scene.stop("inventoryOverlay");
    this.time.delayedCall(1000, () => {
      this.scene.stop("dialogueOverlay");
      this.scene.start("scene7", {
        from: 6,
        currentSlot: currentSlot
      });
    });
  }

  transitionToScene2() {
    // Prevent multiple transitions
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    // Disable player movement
    this.input.keyboard.removeAllListeners();
    
    // Stop walking sound and play door sound
    this.musicPlayer.stopAllSfx();
    this.musicPlayer.playDoorSfx("door");
    
    // Fade in the dark overlay
    this.dialogue.fadeIn(this.overlayDark, 1000);
    
    // After fade completes, transition to scene2
      this.scene.stop("inventoryOverlay");
    this.time.delayedCall(1000, () => {
      this.scene.stop("dialogueOverlay");
      this.scene.start("scene2", {
        from: 6,
        currentSlot: currentSlot
      });
    });
  }

  transitionToScene8() {
    // Prevent multiple transitions
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    // Disable player movement
    this.input.keyboard.removeAllListeners();
    
    // Stop walking sound and play door sound
    this.musicPlayer.stopAllSfx();
    this.musicPlayer.playDoorSfx("door");
    
    // Fade in the dark overlay
    this.dialogue.fadeIn(this.overlayDark, 1000);
    
      this.scene.stop("inventoryOverlay");
    // After fade completes, transition to scene8
    this.time.delayedCall(1000, () => {
      this.scene.stop("dialogueOverlay");
      this.scene.start("scene8", {
        from: 6,
        currentSlot: currentSlot
      });
    });
  }
  right() {
    if(this.controlsLocked) return;
    // Check if we're at teleport point
    if (progress == 10 && !this.nurse && this.player.x > 3800 && this.player.x < 3900) {
      this.stop();
      this.lockControlsFor(2000);
      // Show match button if not already shown
      if (!this.matchButton) {
        this.matchButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, "Click to use matches", {
          fontFamily: "Moving",
          fontSize: "64px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive();
        
        this.matchButton.on('pointerdown', () => this.handleMatchClick());
      }
      return;
    }

    this.player.setVelocityX(500);
    this.player.play("docWalk", true)
    this.player.flipX = false
    this.dialogue.hideDialogue()
    
    // Play walking sound only when starting to walk
    if (!this.isWalking) {
      this.isWalking = true
      this.walkingSound = this.musicPlayer.playSfx("walkEcho")
    }
  }

  left() {
    if(this.controlsLocked) return;
    // Check if we're at teleport point
    if (progress == 10 && !this.nurse && this.player.x > 4500 && this.player.x < 4850) {
      this.stop();
      this.lockControlsFor(2000);
      // Show match button if not already shown
      if (!this.matchButton) {
        this.matchButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, "Click to use matches", {
          fontFamily: "Moving",
          fontSize: "64px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive();
        
        this.matchButton.on('pointerdown', () => this.handleMatchClick());
      }
      return;
    }
    this.player.setVelocityX(-500)
    this.player.play("docWalk", true)
    this.player.flipX = true
    this.dialogue.hideDialogue()
    
    // Play walking sound only when starting to walk
    if (!this.isWalking) {
      this.isWalking = true
      this.walkingSound = this.musicPlayer.playSfx("walkEcho")
    }
  }

  lockControlsFor(ms) {
    this.controlsLocked = true;
    this.player.setVelocity(0);
    this.player.play("docIdle");
    this.time.delayedCall(ms, () => { this.controlsLocked = false; });
  }

  stop() {
    this.player.setVelocity(0);
    this.player.play("docIdle")
    
    // Stop walking sound when stopping
    if (this.isWalking && this.walkingSound) {
      this.walkingSound.stop()
      this.walkingSound = null
      this.isWalking = false
    }
  }

  itemSelector() {
    this.time.addEvent({
      delay: 100,
      callback: () => {

        let distances = []
        this.objects.forEach(obj => {
          distances.push(Math.abs(this.player.x-obj.x))
        })
        let index = distances.indexOf(Math.min(...distances))
        if(Math.min(...distances) < 200){
          let nearestObject = this.objects[index]
          this.selectedItem = nearestObject
        } else {
          this.selectedItem = "NaN"
        }
      }, loop: true
    })
  }

  showMatchButton() {
    if (this.matchButton) return;
    
    console.log("Creating match button");
    this.matchButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 100,
      "Click to use matches",
      {
        fontFamily: "Moving",
        fontSize: "64px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 4
      }
    )
    .setOrigin(0.5)
    .setScrollFactor(0)
    .setDepth(999)
    .setAlpha(1)
    .setVisible(true)
    .setInteractive();

    this.children.bringToTop(this.matchButton);
    this.matchButton.on('pointerdown', () => this.handleMatchClick());
  }

  hideMatchButton() {
    if (!this.matchButton) return;
    console.log("Destroying match button");
    this.matchButton.destroy();
    this.matchButton = null;
  }

  update() {
    // Transition to scene3 when reaching the right edge
    if (this.player.x > this.mapWidth - 50 && !this.isTransitioning) {
      this.startTransitionToScene7();
      return;
    }
    if (this.player.x < 0){
      this.stop();
      this.player.x += 10
    }
    // Check for matches requirement
    if ((this.player.x < 4200 && this.player.x > 4100) || (this.player.x > 3250 && this.player.x < 3400)) {
      if (this.inventoryArr.includes("matches") && !this.isTransitioning) {
        this.stop();
        this.player.setVelocityX(0); // Ensure player is completely stopped
        
        // Only show button if we don't already have one
        if (!this.matchButton) {
          this.showMatchButton();
        }
      }
    } else if (this.matchButton) {
      this.hideMatchButton();
    }

    // Check distance to toilet for progress 10
    if (progress == 10) {
      if (this.nurse) this.nurse.y = this.player.y
      const distanceToToilet = Math.abs(this.player.x - this.toilet.x);
    }
    // Progress 10 nurse dialogue
    if (progress == 10) {
      // Update nurse position
      if (this.nurse) this.nurse.y = this.player.y;
      
      // Show nurse dialogue when close
      if (this.nurse && !this.nurseDialogueShown && this.player.x > 3500) {
        this.nurseDialogueShown = true;
        
        // Disable player movement and stop sounds
        this.input.keyboard.removeAllListeners();
        this.player.setVelocityX(0);
        this.player.play("docIdle");
        this.musicPlayer.stopAllSfx();
        
        // Show nurse dialogue with nurse on right
        this.dialogue.dialogue("are you planning to run again?", null, "nursePort", null, null, "Nurse");
        
        // After nurse dialogue, show doctor's response
        this.time.delayedCall(2000, () => {
          this.dialogue.hideDialogue();
          this.time.delayedCall(100, () => {
            this.dialogue.dialogue("ugh!", "docPort", null, "12", null, "Doctor");
          });
          
          // Fade out nurse after dialogue
          this.time.delayedCall(2000, () => {
            this.tweens.add({
              targets: this.nurse,
              alpha: 0,
              duration: 1000,
              onComplete: () => {
                this.nurse.destroy();
                
                // Re-enable player movement
                this.input.keyboard.on("keydown-A", this.left.bind(this));
                this.input.keyboard.on("keydown-D", this.right.bind(this));
                this.input.keyboard.on("keydown-E", () => {
                  switch(this.selectedItem){
                    case "NaN":
                      break;
                    case this.stairs2:
                      this.transitionToScene2();
                      break;
                    case this.toilet:
                      this.toiletInteraction();
                      break;
                    case this.garden:
                      this.transitionToScene8();
                      break;
                  }
                });
                this.input.keyboard.on("keyup-A", this.stop.bind(this));
                this.input.keyboard.on("keyup-D", this.stop.bind(this));
                this.input.keyboard.on("keydown-ESC", this.pause.bind(this));
                this.input.keyboard.on("keydown-SPACE", this.pause.bind(this));
              }
            });
          });
        });
      }
      
      // Match teleportation and boundary check
      if (!this.nurse && !this.isTransitioning) {
        this.showMatchButton();
      }
    }
  }
}
