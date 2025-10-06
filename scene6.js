class scene6 extends Phaser.Scene{
  constructor(){
    super("scene6")
  }

  create(data){
    // Set the current slot from the passed data
    if (data && data.currentSlot !== undefined) {
      currentSlot = data.currentSlot;
    }
    
    this.scene.launch("dialogueOverlay");
    this.scene.bringToTop("dialogueOverlay");
    this.scene.launch("inventoryOverlay");
    this.inventory = this.scene.get("inventoryOverlay");
    this.dialogue = this.scene.get('dialogueOverlay');
    this.itemSelector();
    console.log(data.from)

    this.musicPlayer = this.scene.get("musicPlayer")
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
    if(progress === 12)
      this.bg.setTexture("bg32")
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.scaleFactor = this.mapWidth/this.bg.width
    this.player = this.physics.add.sprite(this.mapWidth - 300,800,"doc").setDepth(99).setScale(1.1)
    this.player.play("docIdle")
    this.player.flipX = true;

    // Add nurse if progress is 12
    if (progress === 12) {
      this.nurse = this.add.sprite(0, 0, "nurse").setScale(this.scaleFactor).setDepth(98);
      this.musicPlayer.playMusic("nursesTheme");
    }

    this.toilet= this.physics.add.sprite(0,0,"toilet").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.garden= this.physics.add.sprite(0,0,"garden").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.stairs2= this.physics.add.sprite(0,0,"stairs2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)

    this.objects = [this.toilet, this.stairs2, this.garden]

    const map = this.make.tilemap({ key: 'corridorDown' });
    const intLayer = map.getObjectLayer('interactive');
    intLayer.objects.forEach(obj => {
      if (obj.name === 'toilet') {
        this.toilet.x = obj.x*this.scaleFactor
        this.toilet.y = obj.y*this.scaleFactor
        if (progress === 12 && this.nurse) {
          this.nurse.x = obj.x*this.scaleFactor+500
          this.nurse.y = this.player.y
        }
        console.log("toilet found")
      }else if(obj.name === "stairs2") {
        this.stairs2.x = obj.x*this.scaleFactor
        this.stairs2.y = obj.y*this.scaleFactor
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
      }
    });
    this.input.keyboard.on("keyup-A", this.stop.bind(this));
    this.input.keyboard.on("keyup-D", this.stop.bind(this));
    this.input.keyboard.on("keydown-ESC", this.pause.bind(this));
    this.input.keyboard.on("keydown-SPACE", this.pause.bind(this));

    if(data.from === 8){
      this.player.x = this.garden.x
    }
  };  

  toiletInteraction(){
    if (progress === 12) {
      this.musicPlayer.playSfx("toilet")
      this.dialogue.fadeIn(this.overlayDark, 1000);
      
      this.time.delayedCall(1000, () => {
        this.dialogue.fadeOut(this.overlayDark, 1000);
        
        // After fade out, spawn nurse and start dialogue
        this.time.delayedCall(1000, () => {
          // Create nurse if not exists
          if (!this.nurse) {
            this.nurse = this.add.sprite(this.player.x - 200, this.player.y, "nurse").setScale(this.scaleFactor).setDepth(98);
          }
          
          // Disable player movement
          this.input.keyboard.removeAllListeners();
          this.player.setVelocityX(0);
          this.player.play("docIdle");
          this.musicPlayer.stopAllSfx();
          
          // Start dialogue sequence
          this.dialogue.dialogue("you cant run this time?", null, "nursePort", null, null, "Nurse");
          
          this.time.delayedCall(2000, () => {
            this.dialogue.hideDialogue();
            this.time.delayedCall(100, () => {
              this.dialogue.dialogue("shut up.", "docPort", null, "10", null, "Doctor");
              
              this.time.delayedCall(2000, () => {
                this.dialogue.hideDialogue();
                this.time.delayedCall(100, () => {
                  this.dialogue.dialogue("is this an opurtunity to redeem yourself?", null, "nursePort", null, null, "Nurse");
                  
                  this.time.delayedCall(2000, () => {
                    this.dialogue.hideDialogue();
                    this.time.delayedCall(100, () => {
                      this.dialogue.dialogue("or escape the pain? Again?", null, "nursePort", null, null, "Nurse");
                      
                      this.time.delayedCall(2000, () => {
                        this.dialogue.hideDialogue();
                        this.time.delayedCall(100, () => {
                          this.dialogue.dialogue("sometimes we have to choose?", null, "nursePort", null, null, "Nurse");
                          
                          this.time.delayedCall(2000, () => {
                            this.dialogue.hideDialogue();
                            this.time.delayedCall(100, () => {
                              this.dialogue.dialogue("one or another?", null, "nursePort", null, null, "Nurse");
                              
                              this.time.delayedCall(2000, () => {
                                this.dialogue.hideDialogue();
                                this.time.delayedCall(100, () => {
                                  this.dialogue.dialogue("it cant be both?", null, "nursePort", null, null, "Nurse");
                                  
                                  this.time.delayedCall(2000, () => {
                                    this.dialogue.hideDialogue();
                                    this.time.delayedCall(100, () => {
                                      this.dialogue.dialogue("SHUT UP", "docPort", null, "12", null, "Doctor");
                                      
                                      // After final dialogue, update progress and re-enable movement
                                      this.time.delayedCall(2000, () => {
                                        progress = 13;
                                        
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
                                });
                              });
                            });
                          });
                        });
                      });
                    });
                  });
                });
              });
            });
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
    if (!this.isTransitioning) {
      this.isTransitioning = true;
      
      // Disable player movement during transition
      this.input.keyboard.removeAllListeners();
      this.player.setVelocityX(0);
      this.player.play("docIdle");
      
      // Fade out
      this.dialogue.fadeIn(this.overlayDark, 1000);
      
      this.time.delayedCall(1000, () => {
        // Teleport player
        if (this.player.x < this.toilet.x) {
          this.player.x = this.toilet.x;
        } else {
          this.player.x = this.toilet.x - 600;
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
    this.time.delayedCall(1000, () => {
      this.scene.stop("inventoryOverlay");
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
    this.time.delayedCall(1000, () => {
      this.scene.stop("inventoryOverlay");
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
    this.time.delayedCall(1000, () => {
      this.scene.stop("inventoryOverlay");
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
    
    // After fade completes, transition to scene8
    this.time.delayedCall(1000, () => {
      this.scene.stop("inventoryOverlay");
      this.scene.stop("dialogueOverlay");
      this.scene.start("scene8", {
        from: 6,
        currentSlot: currentSlot
      });
    });
  }
  right() {
    // Check if we're at teleport point
    if (progress === 12 && !this.nurse && this.player.x > 3800 && this.player.x < 3900) {
      this.stop();
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
    // Check if we're at teleport point
    if (progress === 12 && !this.nurse && this.player.x > 4900 && this.player.x < 5000) {
      this.stop();
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
    console.log(this.player.x-this.toilet.x)
      // Check distance to toilet for progress 12
      if (progress === 12) {
        if (this.nurse) this.nurse.y = this.player.y
      const distanceToToilet = Math.abs(this.player.x - this.toilet.x);
      
      // Stop player at boundary and show match button
      if (this.player.x > 4850 && this.player.x < 4900) {
        console.log("toilet boundary reached")
        this.stop();
        this.player.setVelocityX(0);
        
          // Show match button if not already shown
        if (!this.matchButton) {
          this.matchButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, "Click to use matches", {
            fontFamily: "Moving",
            fontSize: "32px",
            color: "#ffffff",
            stroke: "#000000",
            strokeThickness: 4
          }).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive();
          
          this.matchButton.on('pointerdown', () => this.handleMatchClick());
        }
      } else if (this.matchButton) {
        this.matchButton.destroy();
        this.matchButton = null;
      }
    }
    // Progress 12 nurse dialogue
    if (progress === 12) {
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
          
          // Show match button if not already shown
          if (!this.matchButton) {
            this.matchButton = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, "Click to use matches", {
              fontFamily: "Moving",
              fontSize: "64px",
              color: "#ffffff",
              stroke: "#000000",
              strokeThickness: 4
            }).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive();
            
            this.matchButton.on('pointerdown', () => {
              if (!this.isTransitioning) {
                this.isTransitioning = true;
                
                // Disable player movement during transition
                this.input.keyboard.removeAllListeners();
                this.player.setVelocityX(0);
                this.player.play("docIdle");
                
                // Fade out
                this.dialogue.fadeIn(this.overlayDark, 1000);
                
                this.time.delayedCall(1000, () => {
                  // Teleport player
                  if (this.player.x < 4200) {
                    this.player.x = 5000;
                  } else {
                    this.player.x = 4190;
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
              this.matchButton.destroy();
              this.matchButton = null;
            });
          }
          
      }
    }
  }
}
