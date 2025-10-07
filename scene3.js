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
    if(this.musicPlayer.currentMusic == "")
      this.musicPlayer.playMusic("docsTheme")
    this.scene.bringToTop("musicPlayer")
    // Start playing docsTheme music
    this.musicPlayer.playMusic("docsTheme");
    
    // Check for progress 3 cutscene
    if (progress == 3) {
      this.startedWithProgress3 = true;  // Flag to track if we started with progress 3
      this.startProgress3Sequence();
      return; // Exit early to prevent normal scene setup
    }
    // Check for progress 7 sequence (return after scene4)
    if (progress == 5 && data.from == 4) {
      this.startProgress5Sequence();
      return; // Exit early to prevent normal scene setup
    }
    
    this.playerY = 700;
    this.isWalking = false
    this.walkingSound = null
    this.isTransitioning = false

    this.overlayDark = this.add.graphics();
    this.overlayDark.fillStyle(0x000000, 1);
    this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlayDark.setScrollFactor(0);
    this.overlayDark.setDepth(100)
    this.dialogue.fadeOut(this.overlayDark)

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
            this.player = this.physics.add.sprite(obj.x * this.scaleFactor, this.playerY, "doc").setDepth(99).setScale(1);
            this.player.play("docIdle");
          }
        });
      }
    } else {
      // Default position
      this.player = this.physics.add.sprite(900,this.playerY,"doc").setDepth(99).setScale(1);
      this.player.play("docIdle");
    }

    // Only one interactive object - kidsRoom (invisible)
    this.kidsRoom = this.physics.add.sprite(0,0,"kidsRoomDoor").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.door1= this.physics.add.sprite(0,0,"door").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.door2= this.physics.add.sprite(0,0,"door2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.objects = [this.kidsRoom, this.door1, this.door2]

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
        if (obj.name === 'door') {
          console.log("door found")
        this.door1.x = obj.x*this.scaleFactor
        this.door1.y = obj.y*this.scaleFactor
        }
        if (obj.name === 'door2') {
        this.door2.x = obj.x*this.scaleFactor
        this.door2.y = obj.y*this.scaleFactor
        }
      });
    } else {
      console.error("Interactive layer or objects not found!");
    }

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // If coming from scene2, spawn at left edge facing right
    if (data && data.from === 2) {
      this.player.setPosition(50, this.playerY);
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
            } else if (this.cut3NurseDialogueDone && !this.dialogue.isInSequence) {
              progress = 4;
              this.startDoorTransition();
            }
          } else if ([1, 4, 7, 11, 14].includes(progress)) {
            this.startDoorTransition();
          } else {
            // Any other progress value shows "Wouldn't wanna tire them too much..."
            this.dialogue.dialogue("Wouldn't wanna tire them too much...", "docPort", null, "1", null, "Doctor");
          }
          break;
          case this.stairs:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          break;
        case this.door1:
          this.dialogue.dialogue("Seems to be locked...", "docPort", null, "1", null, "Doctor");
          break;
        case this.door2:
          this.dialogue.dialogue("Seems to be locked...", "docPort", null, "1", null, "Doctor");
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
    console.log("DOOR TRANSITION:", {
      progress,
      startedWithProgress3: this.startedWithProgress3,
      isTransitioning: this.isTransitioning,
      nurseDialogueDone: this.cut3NurseDialogueDone
    });
    
    // Prevent multiple transitions
    if (this.isTransitioning) {
      console.log("ALREADY TRANSITIONING, SKIPPING");
      return;
    }
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
    // Debug info
    console.log("UPDATE CHECK:", {
      startedWithProgress3: this.startedWithProgress3,
      currentProgress: progress,
      isTransitioning: this.isTransitioning,
      nurseDialogueStarted: this.cut3NurseDialogueStarted,
      nurseDialogueDone: this.cut3NurseDialogueDone,
      dialogueInSequence: this.dialogue?.isInSequence
    });
    
    // If we started with progress 3 and it changed to 4, transition to scene4
    if (this.startedWithProgress3 && progress === 4 && !this.isTransitioning) {
      console.log("SHOULD START SCENE 4 NOW!");
      this.startDoorTransition();
      return;
    }
    
    // Transition to scene2 when reaching the left edge (outside cutscenes)
    if (!this.controlsLocked && this.player && this.player.x < 50 && !this.isTransitioning && 
        (progress !== 5 || (progress === 5 && this.cut5DialogueDone))) {
      console.log("transitioning to scene2");
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
    console.log("Starting progress 3 cutscene - creepy corridor");
    // Set up basic scene elements for cutscene
    this.bg.setTexture("bg52")
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.scaleFactor = this.mapWidth/this.bg.width
    
    // Create dark overlay for creepy effect
    this.overlayDark = this.add.graphics();
    this.overlayDark.fillStyle(0x000000, 1); // Start with full darkness
    this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlayDark.setScrollFactor(0);
    this.overlayDark.setDepth(100);
    this.overlayDark.alpha = 0.4; // Set initial alpha to 80% darkness (darker overall)
    
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
    console.log("PlayerY:", this.playerY);
    this.playerY = 700;
    this.player = this.physics.add.sprite(100, this.playerY, "doc").setDepth(99).setScale(1);
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
            console.log(this.cut3NurseDialogueStarted);
            if (!this.cut3NurseDialogueStarted) {
              this.startNurseDialogue();
            } else {
              progress = 4;
              this.startDoorTransition();
            }
          } else if (progress == 1 || progress == 4 || progress == 7 || progress == 11 || progress == 14) {
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
    this.musicPlayer.stopTheMusic()
    this.musicPlayer.playMusic("nursesTheme")
    this.bg.setTexture("bg52")
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.scaleFactor = this.mapWidth/this.bg.width
    
    // Initialize flags
    this.isTransitioning = false;
    this.cut5DialogueDone = false;
    
    // Dark overlay with flicker (reuse progress 5 style)
    /*
    this.overlayDark = this.add.graphics();
    this.overlayDark.fillStyle(0x000000, 1);
    this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlayDark.setScrollFactor(0);
    this.overlayDark.setDepth(100);
    this.overlayDark.alpha = 0.4;
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
    this.nurse = this.physics.add.sprite(nurseX, nurseY, "nurse").setDepth(98).setScale(1.0).setImmovable().setVisible(true);
    this.nurse.play("nurseIdle");

    // Invisible interaction objects
    this.kidsRoom = this.physics.add.sprite(doorX, doorY, "kidsRoomDoor").setOrigin(0.5,1).setImmovable().setVisible(false)
    this.stairs = this.physics.add.sprite(this.stairsX || 0, this.stairsY || 0, "stairs2").setOrigin(0.5,1).setImmovable().setVisible(false)

    // Player setup
    this.playerY = 700;
    this.player = this.physics.add.sprite(doorX, this.playerY, "doc").setDepth(99).setScale(1);
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
          if(progress == 1 || progress == 3 || progress == 4 || progress == 7 || progress == 11 || progress == 14) 
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
      this.cut5DialogueDone = true;
      this.nurse.setVisible(false);
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

  startProgress3Sequence() {
    // Background setup
    this.musicPlayer.stopTheMusic()
    this.musicPlayer.playMusic("nursesTheme")
    this.isTransitioning = false; // Reset transition flag at sequence start
    
    // Create or update background
    this.bg = this.add.image(0,0,"bg52").setOrigin(0)
    this.scaleFactor = this.scale.height/this.bg.height
    this.bg.setScale(this.scaleFactor)
    
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;

    // Load map and place nurse & kidsRoom
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

    // Create nurse and door sprites
    this.nurse = this.physics.add.sprite(nurseX, nurseY, "nurse").setDepth(98).setScale(1.0).setImmovable();
    this.nurse.play("nurseIdle");
    this.kidsRoom = this.physics.add.sprite(doorX, doorY, "kidsRoomDoor").setOrigin(0.5,1).setImmovable().setVisible(false);

    // Player setup
    this.playerY = 700;
    this.player = this.physics.add.sprite(100, this.playerY, "doc").setDepth(99).setScale(1);
    this.player.play("docIdle");

    // Camera setup
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Controls setup
    this.isWalking = false;
    this.controlsLocked = false;
    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keyup-A", this.stop.bind(this));
    this.input.keyboard.on("keyup-D", this.stop.bind(this));
    this.input.keyboard.on("keydown-ESC", this.pause.bind(this));
    this.input.keyboard.on("keydown-SPACE", this.pause.bind(this));

    // Interaction setup
    this.objects = [this.kidsRoom];
    this.itemSelector();
    this.input.keyboard.on("keydown-E", () => {
      if (this.selectedItem === this.kidsRoom) {
        this.inventory.pick(this.selectedItem, false, "", this.dialogue);
        if (!this.cut3NurseDialogueStarted) {
          this.startNurseDialogue();
        } else if (this.cut3NurseDialogueDone && !this.dialogue.isInSequence) {
          progress = 4;
          this.startDoorTransition();
        }
      }
    });

    // Initialize flags
    this.cut3NurseDialogueStarted = false;
    this.cut3NurseDialogueDone = false;
  }

  startNurseDialogue() {
    console.log("STARTING NURSE DIALOGUE");
    this.cut3NurseDialogueStarted = true;
    this.isTransitioning = false; // Reset transition flag when starting dialogue
    this.lockControlsFor(1000);
    const seq = [
      { text: "Don't be scared...", leftPortrait: null, rightPortrait: "nursePort", leftAnimation: null, rightAnimation: null, name: "Nurse" },
      { text: "", leftPortrait: null, rightPortrait: null, leftAnimation: null, rightAnimation: null, name: "" },
      { text: "Sometimes stepping in and embracing your fears is better?", leftPortrait: null, rightPortrait: "nursePort", leftAnimation: null, rightAnimation: null, name: "Nurse" },
      { text: "What?", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "1", rightAnimation: null, name: "Doctor" },
      { text: "...?", leftPortrait: null, rightPortrait: "nursePort", leftAnimation: null, rightAnimation: null, name: "Nurse" },
      { text: "Hello? Nurse Ayşa? Is that you?", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "1", rightAnimation: null, name: "Doctor" },
    ];
    this.startDialogueWhenReady(seq, () => {
      console.log("NURSE DIALOGUE COMPLETED");
      this.cut3NurseDialogueDone = true;
      this.nurse.setVisible(false);
      if (this.startedWithProgress3) {
        console.log("SETTING PROGRESS TO 4");
        progress = 4;
      }
    });
  }
}
