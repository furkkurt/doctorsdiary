class scene3 extends baseScene{
  constructor(){
    super("scene3")
  }

  create(data){
    // Set the current slot from the passed data
    if (data && data.currentSlot !== undefined) {
      currentSlot = data.currentSlot;
    }
    
    console.log("SAHNE ÜÇDEYŞZ")
    this.scene.launch("dialogueOverlay");
    this.scene.bringToTop("dialogueOverlay");
    this.scene.launch("inventoryOverlay");
    this.inventory = this.scene.get("inventoryOverlay");
    this.time.delayedCall(1000, () => {
      this.scene.bringToTop("inventoryOverlay");
    })
    this.dialogue = this.scene.get('dialogueOverlay');

    this.scene.launch("musicPlayer");
    this.musicPlayer = this.scene.get("musicPlayer")
    
    // Start playing docsTheme music
    this.musicPlayer.playMusic("docsTheme");
    
    // Check for progress 3 cutscene
    if (progress == 3) {
      this.startProgress3Cutscene();
      return; // Exit early to prevent normal scene setup
    }
    // Check for progress 7 sequence (return after scene4)
    if (progress == 5) {
      this.startProgress5Sequence();
      return; // Exit early to prevent normal scene setup
    }
    
    const playerY = 650;
    this.isWalking = false
    this.walkingSound = null
    this.isTransitioning = false

    this.overlayDark = this.add.graphics();
    this.overlayDark.fillStyle(0x000000, 1);
    this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlayDark.setScrollFactor(0);
    this.overlayDark.setDepth(100)
    this.dialogue.fadeOut(this.overlayDark)
    this.logProgress("scene3 create")

    // Use bg5 and corridorUp map
    this.bg = this.add.image(0,0,"bg5").setOrigin(0)
    this.scaleFactor = this.scale.height/this.bg.height
    this.bg.setScale(this.scaleFactor)
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    // Check progress and position player accordingly
    if (progress == 2 || data.from == 4) {

      // Position player at kidsRoom object location (do not change progress here)
      const map = this.make.tilemap({ key: 'corridorUp' });
      const intLayer = map.getObjectLayer('interactive');
      if (intLayer && intLayer.objects) {
        intLayer.objects.forEach(obj => {
          if (obj.name === 'kidsRoom') {
            this.player = this.physics.add.sprite(obj.x * this.scaleFactor, playerY, "doc").setDepth(99).setScale(1.1);
            this.player.play("docIdle");
          }
        });
      }
    } else {
      // Default position
      this.player = this.physics.add.sprite(900,playerY,"doc").setDepth(99).setScale(1.1);
      this.player.play("docIdle");
    }

    // Only one interactive object - kidsRoom (invisible)
    this.kidsRoom = this.physics.add.sprite(0,0,"kidsRoomDoor").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.stairs= this.physics.add.sprite(0,0,"stairs2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.objects = [this.kidsRoom, this.stairs]

    // Load corridorUp map and position kidsRoom
    const map = this.make.tilemap({ key: 'corridorUp' });
    console.log("Map loaded:", map);
    console.log("Available layers:", map.layers.map(layer => layer.name));
    
    const intLayer = map.getObjectLayer('interactive');
    console.log("Interactive layer found:", intLayer);
    
    if (intLayer && intLayer.objects) {
      console.log("Objects in interactive layer:", intLayer.objects);
    intLayer.objects.forEach(obj => {
        console.log("Processing object:", obj.name, "at", obj.x, obj.y);
        if (obj.name === 'kidsRoom') {
          this.kidsRoom.x = obj.x*this.scaleFactor
          this.kidsRoom.y = obj.y*this.scaleFactor
        }
        if (obj.name === 'stairs') {
        this.stairs.x = obj.x*this.scaleFactor
        this.stairs.y = obj.y*this.scaleFactor
        }
      });
    } else {
      console.error("Interactive layer or objects not found!");
    }

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // If coming from scene2, spawn at left edge facing right
    if (data && data.from === 2) {
      this.player.setPosition(50, playerY);
      this.player.flipX = false;
    }

    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keydown-E", () => {
      switch(this.selectedItem){
        case "NaN":
          break;
        case this.kidsRoom:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          if (progress == 3) {
            if (!this.cut3NurseDialogueStarted) {
              this.startNurseDialogue();
            }
          }
          //çocuklarla zaten konuşmuşuz
           else if (progress == 2) {
            // Special dialogue for progress 2
            this.dialogue.dialogue("Wouldn't wanna tire them too much...", "docPort", null, "1", null, "Doctor");
          } else {
            this.startDoorTransition();
          }
          break;
          case this.stairs:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          break;
      }
    });
    this.itemSelector();
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
    this.startScene("scene4", {
      from: 3,
      currentSlot: currentSlot
    }, 1000);
  }

  startTransitionToScene2() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    this.input.keyboard.removeAllListeners();
    this.musicPlayer.stopAllSfx();
    this.musicPlayer.playDoorSfx("door");
    this.dialogue.fadeIn(this.overlayDark, 1000);
    // Use baseScene's startSceneWithFade
    this.startScene("scene2", {
      from: 3,
      currentSlot: currentSlot
    }, 1000);
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
    // Transition to scene2 when reaching the left edge (outside cutscenes)
    if (!this.controlsLocked && this.player && this.player.x < 50 && !this.isTransitioning) {
      this.startTransitionToScene2();
      return;
    }
    if (this.player.x < 0){
      this.stop();
      this.player.x += 10
    }
    
    // Progress 5 cutscene runtime logic
    if (progress == 3 && this.player) {
      // Interrupt texts at x>200/600/1000
      if (!this.cut3Shown200 && this.player.x > 400) {
        this.cut3Shown200 = true;
        this.lockControlsFor(1000);
        this.stop();
        this.dialogue.dialogue("huh-...", "docPort", null, "1", null, "Doctor");
      }
      if (!this.cut3Shown600 && this.player.x > 1200) {
        this.cut3Shown600 = true;
        // Prevent stray portrait flash before dialogue at ~1200 by ensuring dialogue is hidden first
        this.dialogue.hideDialogue();
        this.lockControlsFor(1000);
        this.stop();
        this.dialogue.dialogue("is there someone? ...hello?","docPort", null, "1", null, "Doctor");
      }
      if (!this.cut3Shown1000 && this.player.x > 2000) {
        this.cut3Shown1000 = true;
        this.lockControlsFor(1000);
        this.stop();
        this.dialogue.dialogue(".... its dark.", "docPort", null, "1", null, "Doctor");
      }
      
      // Nurse dialogue now triggered via kidsRoom interaction when progress===5
      
      // After trying to walk, interrupt after 1s with another text
      if (this.isWalking && !this.cut3PostWalkShown) {
        if (this.cut3WalkTimer == null) {
          this.cut3WalkTimer = this.time.delayedCall(1000, () => {
            this.stop();
            this.dialogue.dialogue("...its dark", "docPort", null, "1", null, "Doctor");
            this.cut3PostWalkShown = true;
          });
        }
      }
      if (!this.isWalking && this.cut3WalkTimer) {
        this.cut3WalkTimer.remove(false);
        this.cut3WalkTimer = null;
      }
    }
  }

  startProgress3Cutscene() {
    console.log("Starting progress 5 cutscene - creepy corridor");
    
    // Set up basic scene elements for cutscene
    this.bg = this.add.image(0,0,"bg5").setOrigin(0)
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.scaleFactor = this.mapWidth/this.bg.width
    
    // Create dark overlay for creepy effect
    this.overlayDark = this.add.graphics();
    this.overlayDark.fillStyle(0x000000, 1); // Start with full darkness
    this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlayDark.setScrollFactor(0);
    this.overlayDark.setDepth(100);
    this.overlayDark.alpha = 0.8; // Set initial alpha to 80% darkness (darker overall)
    
    // Create subtle flickering light effect (easier on eyes)
    /*
    this.flickerTween = this.tweens.add({
      targets: this.overlayDark,
      alpha: { from: 0.6, to: 1.0 }, // Flicker between 60% darkness and complete black
      duration: 250, // Slower, more comfortable flicker
      ease: 'Linear',
      yoyo: true,
      repeat: -1,
      onRepeat: () => {
        // Add occasional random variations for realism
        if (Math.random() < 0.3) { // 30% chance of random variation
          const randomDelay = Phaser.Math.Between(100, 400);
          this.time.delayedCall(randomDelay, () => {
            this.overlayDark.alpha = Phaser.Math.FloatBetween(0.5, 1.0);
          });
        }
      }
    });
    */
    // Load map and place nurse & kidsRoom from interactive object
    const map = this.make.tilemap({ key: 'corridorUp' });
    const intLayer = map.getObjectLayer('interactive');
    let nurseX = 1400;
    let nurseY = 800;
    let doorX = 1800;
    let doorY = 800;
    if (intLayer && intLayer.objects) {
      intLayer.objects.forEach(obj => {
        if (obj.name === 'nurse') {
          nurseX = obj.x * this.scaleFactor;
          nurseY = obj.y * this.scaleFactor;
        }
        if (obj.name === 'kidsRoom') {
          doorX = obj.x * this.scaleFactor;
          doorY = obj.y * this.scaleFactor;
        }
      });
    }
    this.nurse = this.physics.add.sprite(nurseX, nurseY, "nurse").setDepth(98).setScale(1.0).setImmovable();
    this.nurse.play && this.nurse.play("nurseIdle");
    
    // Invisible interaction object for kidsRoom
    this.kidsRoom = this.physics.add.sprite(doorX, doorY, "kidsRoomDoor").setOrigin(0.5,1).setImmovable().setVisible(false)
    
    // Create player for cutscene
    this.player = this.physics.add.sprite(100, playerY, "doc").setDepth(99).setScale(1.1);
    console.log("Player positioned at:", this.player.x, this.player.y);
    this.player.play("docIdle");
    
    // Set up camera
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    
    // Enable movement controls for this cutscene
    this.isWalking = false;
    this.controlsLocked = false;
    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keyup-A", this.stop.bind(this));
    this.input.keyboard.on("keyup-D", this.stop.bind(this));
    this.input.keyboard.on("keydown-ESC", this.pause.bind(this));
    this.input.keyboard.on("keydown-SPACE", this.pause.bind(this));
    // Interact with kidsRoom via E
    this.objects = [this.kidsRoom];
    this.itemSelector();
    this.input.keyboard.on("keydown-E", () => {
      switch(this.selectedItem){
        case "NaN":
          break;
        case this.kidsRoom:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          //nurse diyaloğundan sonra çocuklara girince progress 4
          if (progress == 3) {
            progress = 4;
            if (!this.cut3NurseDialogueStarted) {
              this.startNurseDialogue();
            } else {
              this.startDoorTransition();
            }
            this.startDoorTransition();
          } else {
            this.startDoorTransition();
          }
          break;
      }
    });
    
    // Cutscene flags and state
    this.cut3Shown200 = false;
    this.cut3Shown600 = false;
    this.cut3Shown1000 = false;
    this.cut3NurseDialogueStarted = false;
    this.cut3NurseDialogueDone = false;
    this.cut3PostWalkShown = false;
    this.cut3WalkTimer = null;
    
    // Add some ambient sound effect for creepiness (if you have one)
    // this.musicPlayer.playSfx("flickeringLight"); // Uncomment if you add this sound
    
    console.log("Creepy corridor cutscene initialized with flickering lights");
  }

  lockControlsFor(ms) {
    this.controlsLocked = true;
    this.player.setVelocity(0);
    this.player.play("docIdle");
    this.time.delayedCall(ms, () => {
      this.controlsLocked = false;
    });
  }

  startProgress5Sequence() {
    // Background
    this.bg = this.add.image(0,0,"bg52").setOrigin(0)
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.scaleFactor = this.mapWidth/this.bg.width
    
    // Dark overlay with flicker (reuse progress 5 style)
    /*
    this.overlayDark = this.add.graphics();
    this.overlayDark.fillStyle(0x000000, 1);
    this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlayDark.setScrollFactor(0);
    this.overlayDark.setDepth(100);
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
    // Load map and place nurse & kidsRoom from interactive object
    const map = this.make.tilemap({ key: 'corridorUp' });
    const intLayer = map.getObjectLayer('interactive');
    let nurseX = 1400;
    let nurseY = 800;
    let doorX = 1800;
    let doorY = 800;
    if (intLayer && intLayer.objects) {
      intLayer.objects.forEach(obj => {
        if (obj.name === 'nurse') {
          nurseX = obj.x * this.scaleFactor;
          nurseY = obj.y * this.scaleFactor;
        }
        if (obj.name === 'kidsRoom') {
          doorX = obj.x * this.scaleFactor;
          doorY = obj.y * this.scaleFactor;
        }
        if (obj.name === 'stairs') {
          // place stairs too if needed later
          this.stairsX = obj.x * this.scaleFactor;
          this.stairsY = obj.y * this.scaleFactor;
        }
      });
    }

    // Nurse sprite
    this.nurse = this.physics.add.sprite(nurseX, nurseY, "nurse").setDepth(98).setScale(1.0).setImmovable();
    this.nurse.play && this.nurse.play("nurseIdle");

    // Invisible interaction objects
    this.kidsRoom = this.physics.add.sprite(doorX, doorY, "kidsRoomDoor").setOrigin(0.5,1).setImmovable().setVisible(false)
    this.stairs = this.physics.add.sprite(this.stairsX || 0, this.stairsY || 0, "stairs2").setOrigin(0.5,1).setImmovable().setVisible(false)

    // Player at kidsRoom door
    this.player = this.physics.add.sprite(doorX, playerY, "doc").setDepth(99).setScale(1.1);
    this.player.play("docIdle");

    // Camera
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Movement controls; lock until dialogue finishes
    this.isWalking = false;
    this.controlsLocked = true;
    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keyup-A", this.stop.bind(this));
    this.input.keyboard.on("keyup-D", this.stop.bind(this));
    this.input.keyboard.on("keydown-ESC", this.pause.bind(this));
    this.input.keyboard.on("keydown-SPACE", this.pause.bind(this));

    // Selection helpers
    this.objects = [this.kidsRoom, this.stairs];
    this.itemSelector();
    this.input.keyboard.on("keydown-E", () => {
      switch(this.selectedItem){
        case "NaN":
          break;
        case this.kidsRoom:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          this.startDoorTransition();
          break;
        case this.stairs:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          // stairs2 handled by inventoryOverlay if needed
          break;
      }
    });

    // Auto dialogue
    const seq = [
      { text: "youre getting closer?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
      { text: "what-!? You again!?", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "12", rightAnimation: null, name: "Doctor" },
      { text: "but to what?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
      { text: "does it have to be just one?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
      { text: "it can't be both?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" }
    ];
    this.startDialogueWhenReady(seq, () => {
      this.controlsLocked = false;
    });
  }

  startDialogueWhenReady(seq, onDone){
    const tryStart = () => {
      const overlay = this.dialogue;
      if (overlay && overlay.dialogueBox && overlay.dialogueText && overlay.scene.isActive()){
        overlay.startDialogueSequence(seq, onDone)
        return true
      }
      return false
    }
    if (!tryStart()){
      this.time.addEvent({ delay: 100, callback: () => { if (!tryStart()) this.time.addEvent({ delay: 100, callback: tryStart }) } })
    }
  }

  startNurseDialogue() {
    this.cut3NurseDialogueStarted = true;
    this.lockControlsFor(1000);
    // Doctor portrait on the left only; Nurse has no portrait
    const seq = [
      { text: "Don't be scared...", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
      { text: "Sometimes stepping in and embracing your fears is better?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
      { text: "What?", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "1", rightAnimation: null, name: "Doctor" },
      { text: "...?", leftPortrait: "docPort", rightPortrait: "nursePort", leftAnimation: "1", rightAnimation: null, name: "Nurse" },
      { text: "Hello? Nurse Ayşa? Is that you?", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "1", rightAnimation: null, name: "Doctor" },
    ];
    this.dialogue.startDialogueSequence(seq, () => {
      this.cut3NurseDialogueDone = true;
      // Do not change progress here; caller will decide when to advance
    });
  }

  saveProgressToSlot(){
    const key = currentSlot === 1 ? "firstSlotScene" : (currentSlot === 2 ? "secondSlotScene" : "thirdSlotScene")
    try{ localStorage.setItem(key, String(progress)) } catch(e) {}
  }

  logProgress(where){
    const key = currentSlot === 1 ? "firstSlotScene" : (currentSlot === 2 ? "secondSlotScene" : "thirdSlotScene")
    console.log(`[${where}] currentSlot=`, currentSlot, "progress=", progress, key, "=", localStorage.getItem(key))
  }
}
