class scene2 extends Phaser.Scene{
  constructor(){
    super("scene2")
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
    this.controlsLocked = false

    // build inventory array AFTER determining slot
    this.inventoryArr=[]
    const i1 = localStorage.getItem(this.slot+"1")
    const i2 = localStorage.getItem(this.slot+"2")
    const i3 = localStorage.getItem(this.slot+"3")
    if (i1 && !this.inventoryArr.includes(i1)) this.inventoryArr.push(i1)
    if (i2 && !this.inventoryArr.includes(i2)) this.inventoryArr.push(i2)
    if (i3 && !this.inventoryArr.includes(i3)) this.inventoryArr.push(i3)

    this.overlayDark = this.add.graphics();
    this.overlayDark.fillStyle(0x000000, 1);
    this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlayDark.setScrollFactor(0);
    this.overlayDark.setDepth(100)
    this.dialogue.fadeOut(this.overlayDark)
    this.logProgress("scene2 create")

    this.bg = this.add.image(0,0,"bg4").setOrigin(0)
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.scaleFactor = this.mapWidth/this.bg.width
    this.player = this.physics.add.sprite(900,800,"doc").setDepth(99).setScale(1.1)
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
      } else {
        this.desk.x = obj.x*this.scaleFactor
        this.desk.y = obj.y*this.scaleFactor
      }
    });

    // Spawn nurse for progress 8
    if (progress === 8) {
      this.nurse = this.physics.add.sprite(nurseX, nurseY, "nurse").setDepth(98).setScale(1.0).setImmovable();
      this.nurse.play && this.nurse.play("nurseIdle");
    }

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    // Progress 8: enable dark flickering overlay
    if (progress === 8 || progress === 9) {
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
      // Flags for progress 8 events
      this.p8NurseDialogueStarted = false;
      this.p8BoundaryWarned = false;
    }

    // If coming from scene3, spawn at right edge facing left
    if (data && data.from === 3) {
      this.player.setPosition(this.mapWidth - 50, 800);
      this.player.flipX = true;
    }

    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keydown-E", () => {
      switch(this.selectedItem){
        case "NaN":
          break;
        case this.stairs:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          break;
        case this.ofis1:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          this.startDoorTransition();
          break;
        case this.ofis2:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          if (progress === 8) {
            this.startTransitionToScene5();
          }
          break;
        case this.power:
          this.inventory.pick(this.selectedItem, false, "I wonder how long this power will last...", this.dialogue);
          break;
        case this.desk:
          this.inventory.pick(this.selectedItem, false, "I can't even say 'Strange... no one's here'.", this.dialogue);
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
      this.scene.start("scene1", {
        from: 2,
        currentSlot: currentSlot
      });
    });
  }

  startTransitionToScene5() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.input.keyboard.removeAllListeners();
    this.musicPlayer.stopAllSfx();
    this.musicPlayer.playDoorSfx("door");
    this.dialogue.fadeIn(this.overlayDark, 800);
    this.time.delayedCall(800, () => {
      this.scene.stop("inventoryOverlay");
      this.scene.stop("dialogueOverlay");
      this.scene.start("scene5", { from: 2, currentSlot: currentSlot });
    });
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
    this.time.delayedCall(1000, () => {
      this.scene.stop("inventoryOverlay");
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

  update() {
    // Progress 8 scripted events
    if (progress === 8) {
      progress = 9
      // Trigger nurse dialogue at x > 2000 once
      if (!this.p8NurseDialogueStarted && this.player.x > 2000) {
        this.p8NurseDialogueStarted = true;
        this.lockControlsFor(1000);
        const seq = [
          { text: "dark, darker yet darker?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "docPort1", rightAnimation: null, name: "Nurse" },
          { text: "dark like the asit that rain in their eyes?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "docPort1", rightAnimation: null, name: "Nurse" },
          { text: ".......", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "docPort11", rightAnimation: null, name: "Doctor" },
          { text: "kids are outside?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "docPort1", rightAnimation: null, name: "Nurse" }
        ];
        this.dialogue.startDialogueSequence(seq, () => {
          if (this.nurse) {
            this.tweens.add({ targets: this.nurse, alpha: 0, duration: 500, onComplete: () => { this.nurse.destroy(); this.nurse = null; } });
          }
        });
      }

      // Block going beyond x > 2500 with warning (but only lock briefly)
      if (this.player.x > 2500 && !this.p8BoundaryWarned) {
        if (this.inventoryArr.includes("matches")){
          return;
        }
        else {
          this.p8BoundaryWarned = true;
          this.player.x = 2450;
          this.lockControlsFor(3000);
          this.dialogue.dialogue("I dont want to walk into dark, i need to find a source of light", null, "docPort", null, "docPort1", "Doctor");
          this.time.delayedCall(2000, () => { this.p8BoundaryWarned = false; });
        }
      }
    }
    // Transition to scene3 when reaching the right edge
    if (this.player.x > this.mapWidth - 50 && !this.isTransitioning) {
      this.startTransitionToScene3();
      return;
    }
    if (this.player.x < 0){
      this.stop();
      this.player.x += 10
    }
  }
}
