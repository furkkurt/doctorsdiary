class scene2 extends baseScene{
  constructor(){
    super("scene2")
  }

  create(data){
    this.playerY = 700;
    if(progress == 6)
      this.tutorText.setVisible(false)
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

    this.musicPlayer = this.scene.get("musicPlayer")
    this.musicPlayer.playMusic("docsTheme")
    this.scene.bringToTop("musicPlayer")
    this.isWalking = false
    this.walkingSound = null
    this.isTransitioning = false
    this.controlsLocked = false
    this.matchUsed = false

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
    
    console.log("Current slot:", currentSlot, "Inventory:", this.inventoryArr);

    this.overlayDark = this.add.graphics();
    this.overlayDark.fillStyle(0x000000, 1);
    this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlayDark.setScrollFactor(0);
    this.overlayDark.setDepth(100)
    this.dialogue.fadeOut(this.overlayDark)
    this.bg = this.add.image(0,0,"bg4").setOrigin(0)
    if(progress >= 6)
      this.bg.setTexture("bg42")
    this.scaleFactor = this.scale.height/this.bg.height
    this.bg.setScale(this.scaleFactor)
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.player = this.physics.add.sprite(900,this.playerY,"doc").setDepth(99).setScale(1.05)
    this.player.play("docIdle")

    this.ofis1= this.physics.add.sprite(0,0,"ofis1").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.ofis2= this.physics.add.sprite(0,0,"ofis2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.stairs= this.physics.add.sprite(0,0,"stairs").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.power = this.physics.add.sprite(0,0,"power").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.desk = this.physics.add.sprite(0,0,"desk").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)

    this.objects = [this.ofis1, this.ofis2, this.stairs, this.desk, this.power]

    const map = this.make.tilemap({ key: 'corridor2' });
    const intLayer = map.getObjectLayer('interactive');
    let nurseX = 1400;
    let nurseY = 800;
    intLayer.objects.forEach(obj => {
      if (obj.name === 'ofis1') {
        this.ofis1.x = obj.x*this.scaleFactor
        this.ofis1.y = obj.y*this.scaleFactor
      } else if (obj.name === "ofis2") {
        this.ofis2.x = obj.x*this.scaleFactor
        this.ofis2.y = obj.y*this.scaleFactor
      } else if(obj.name === "stairs") {
        this.stairs.x = obj.x*this.scaleFactor
        this.stairs.y = obj.y*this.scaleFactor
      } else if(obj.name === "power") {
        this.power.x = obj.x*this.scaleFactor
        this.power.y = obj.y*this.scaleFactor
      } else if (obj.name === 'nurse') {
        nurseX = obj.x*this.scaleFactor
        nurseY = obj.y*this.scaleFactor
      } else if(obj.name === "desk") {
        this.desk.x = obj.x*this.scaleFactor
        this.desk.y = obj.y*this.scaleFactor
      }
    });

    // Spawn nurse for progress 8 or 13
    if (progress == 6 || progress == 13) {
      this.nurse = this.physics.add.sprite(nurseX, nurseY, "nurse").setDepth(98).setScale(nurseScale).setImmovable();
      this.nurse.alpha = nurseAlpha;
      this.nurse.play && this.nurse.play("nurseIdle");
    }

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    // Progress 8/13: enable dark flickering overlay
    if (progress == 6 || progress === 7 || progress == 13) {
      this.musicPlayer.stopTheMusic()
      this.musicPlayer.playMusic("nursesTheme")
      this.bg.setTexture("bg42")
    /*
      this.overlayDark.alpha = 0.8;
      this.flickerTween = this.tweens.add({
        targets: this.overlayDark,
        alpha: { from: 0.6, to: 1.0 },
        duration: 250,
        ease: 'Linear',
        yoyo: true,
        repeat: -1,
        onRepeat: () => {
          if (Math.random() < 0.3) {
            const randomDelay = Phaser.Math.Between(100, 400);
            this.time.delayedCall(randomDelay, () => {
              this.overlayDark.alpha = Phaser.Math.FloatBetween(0.5, 1.0);
            });
          }
        }
      });
    */
      // Flags for progress 6 events
      this.p6NurseDialogueStarted = false;
      this.p6BoundaryWarned = false;
    }
    // If coming from scene3, spawn at right edge facing left
    if (data && data.from === 3) {
      this.player.setPosition(this.mapWidth - 50, this.playerY);
      this.player.flipX = true;
    }
    // If coming from scene5, spawn at position 1800
    if (data && data.from === 5) {
      this.player.setPosition(1800, this.playerY);
      this.player.flipX = true;
    }
    // If coming from scene6, spawn at right edge facing left
    if (data && data.from === 6) {
      this.player.setPosition(this.mapWidth - 300, this.playerY);
      this.player.flipX = true;
    }

    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keydown-E", () => {
      switch(this.selectedItem){
        case "NaN":
          break;
        case this.stairs:
          this.transitionToScene6();
          break;
        case this.ofis1:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          this.startDoorTransition();
          break;
        case this.ofis2:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          if (progress == 6 || progress == 9) {
            this.startTransitionToScene5();
          } else {
            this.dialogue.dialogue("That's not my office... Better not enter.", "docPort", null, "1", null, "Doctor");
          }
          break;
        case this.power:
          //this.inventory.pick(this.selectedItem, false, "I wonder how long this power will last...", this.dialogue);
          this.dialogue.dialogue("I wonder how long this power will last...", "docPort", null, "1", null, "Doctor");
          break;
        case this.desk:
          //this.inventory.pick(this.selectedItem, false, "I can't even say 'Strange... no one's here'.", this.dialogue);
          this.dialogue.dialogue("I can't even say 'Strange... no one's here'.", "docPort", null, "1", null, "Doctor");
          break;
      }
    });
    this.input.keyboard.on("keyup-A", this.stop.bind(this));
    this.input.keyboard.on("keyup-D", this.stop.bind(this));
    this.input.keyboard.on("keydown-ESC", this.pause.bind(this));
    this.input.keyboard.on("keydown-SPACE", this.pause.bind(this));

  };


  pause(){
    this.scene.launch("menu", {from: this.scene.key})
    this.scene.pause()
    this.time.addEvent({delay: 10, callback: () => {this.stop();}})
    // Stop all SFX sounds when pausing
    this.musicPlayer.stopAllSfx();
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
    
    // Use baseScene's startSceneWithFade
    this.startScene("scene1", {
      from: 2,
      currentSlot: currentSlot
    }, 1000);
  }

  startTransitionToScene5() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.input.keyboard.removeAllListeners();
    this.musicPlayer.stopAllSfx();
    this.musicPlayer.playDoorSfx("door");
    this.dialogue.fadeIn(this.overlayDark, 800);
    // Use baseScene's startSceneWithFade
    this.startScene("scene5", {
      from: 2,
      currentSlot: currentSlot
    }, 800);
  }

  transitionToScene6() {
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
    
    // Use baseScene's startSceneWithFade
    this.startScene("scene6", {
      from: 2,
      currentSlot: currentSlot
    }, 1000);
  }

  lockControlsFor(ms) {
    this.controlsLocked = true;
    this.player.setVelocity(0);
    this.player.play("docIdle");
    this.time.delayedCall(ms, () => { this.controlsLocked = false; });
  }

  startTransitionToScene3() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;

    this.input.keyboard.removeAllListeners();
    this.musicPlayer.stopAllSfx();
    this.musicPlayer.playDoorSfx("door");
    this.dialogue.fadeIn(this.overlayDark, 1000);
    this.scene.stop("inventoryOverlay");
    this.time.delayedCall(1000, () => {
      this.scene.stop("dialogueOverlay");
      this.scene.start("scene3", {
        from: 2,
        currentSlot: currentSlot
      });
    });
  }
  right() {
    if (this.controlsLocked) return;
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
    if (this.controlsLocked) return;
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
  walkIntoDark(){
    if (this.player.flipX == true)
      this.player.flipX = false;
    else
      this.player.flipX = true;

    if(this.player.flipX == true) {
      this.player.x -= 100;
      this.player.setVelocityX(-500);
    } else {
      this.player.x += 100;
      this.player.setVelocityX(500);
    }
    this.player.play("docWalk", true);
    this.time.addEvent({
      delay: 500,
      callback: () => {
        this.stop();
        this.dialogue.dialogue("...its dark", "docPort", null, "1", null, "Doctor");
      }
    });
  }


  update() {
    console.log(this.useMatchBtn)
      // Going forward past 3500
      if(this.player.x > 2600 && this.player.x < 2700 && this.bg.texture.key == "bg42" && !this.matchUsed && !this.useMatchBtn) {
        if(this.inventoryArr.includes("matches")) {
          this.stop();
          this.controlsLocked = true;
          this.useMatchBtn = this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY,
            "Click to use match",
            {fontFamily:"Moving", fontSize:"64px", color: "white",  stroke: '#000000',
                strokeThickness: 2}
          ).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive();

          this.useMatchBtn.on("pointerdown", () => {
            // Clean up button immediately
            this.useMatchBtn.text = "";
            this.useMatchBtn.destroy();
            this.useMatchBtn = null;
            this.matchUsed = true;

            //screen face to black
            this.tweens.add({
              targets: this.overlayDark,
              alpha: 1,
              duration: 1000,
              onComplete: () => {
                this.player.x = 3800;
                this.time.delayedCall(1000, () => {
                  this.tweens.add({
                    targets: this.overlayDark,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => {
                      console.log("DONE")
                      this.controlsLocked = false
                      this.isTransitioning = false;
                      this.player.x += 10;
                      this.player.flipX = false;
                      this.matchUsed = false;
                    }
                  })
                });
              }
            })
          })
        }
        else {
          this.walkIntoDark();
        }
      }
      if(this.player.x < 3600 && this.player.x > 3500 && this.bg.texture.key == "bg42" && !this.matchUsed && !this.useMatchBtn) {
        if(this.inventoryArr.includes("matches")) {
          this.stop();
          this.controlsLocked = true;
          this.useMatchBtn = this.add.text(
            this.cameras.main.centerX, 
            this.cameras.main.centerY,
            "Click to use match",
            {fontFamily:"Moving", fontSize:"64px", color: "white",  stroke: '#000000',
                strokeThickness: 2}
          ).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive();

          this.useMatchBtn.on("pointerdown", () => {
            // Clean up button immediately
            this.useMatchBtn.text = "";
            this.useMatchBtn.destroy();
            this.useMatchBtn = null;
            this.matchUsed = true;

            //screen face to black
            this.tweens.add({
              targets: this.overlayDark,
              alpha: 1,
              duration: 1000,
              onComplete: () => {
                this.player.x = 2600;
                this.time.delayedCall(1000, () => {
                  this.tweens.add({
                    targets: this.overlayDark,
                    alpha: 0,
                    duration: 1000,
                    onComplete: () => {
                      console.log("DONE")
                      this.controlsLocked = false
                      this.isTransitioning = false;
                      this.player.x -= 10;
                      this.player.flipX = true;
                      this.matchUsed = false;
                    }
                  })
                });
              }
            })
          })
        }
        else {
          this.walkIntoDark();
        }
      }
    // Progress 8/13 scripted events
    if (progress == 6 || progress == 13) {
      // Trigger nurse dialogue at x > 2000 once
      if (!this.p6NurseDialogueStarted && this.player.x > 2550) {
        this.p6NurseDialogueStarted = true;
        this.stop()
        this.controlsLocked = true;
        let seq;
        //nurese son diyalog başlayınca 13 yaptık
        if (progress == 13) {
          progress = 14
          seq = [
            { text: "still haven't decided who to kill?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
            { text: "you have to speak to them now?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" }
          ];
        } else {
          seq = [
            { text: "dark, darker yet darker?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
            { text: "dark like the asit that rain in their eyes?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
            { text: ".......", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "11", rightAnimation: null, name: "Doctor" },
            { text: "kids are outside?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" }
          ];
        }
        this.cameras.main.pan(3200, this.cameras.main.y, 3000, 'Sine.easeInOut');
        this.time.delayedCall(5000, () => {
        this.dialogue.startDialogueSequence(seq, () => {
          if (this.nurse) {
            this.tweens.add({ targets: this.nurse, alpha: 0, duration: 500, onComplete: () => { this.nurse.destroy(); this.nurse = null; this.controlsLocked = false; } });
          }
        });
      });
    }
    }
   // Transition to scene3 when reaching the right edge
    if (this.player.x > this.mapWidth - 50 && !this.isTransitioning) {
      this.startTransitionToScene3();
      return;
    }
    // Left boundary
    if (this.player.x < 0){
      this.stop();
      this.player.x += 10
    }
  }

}
