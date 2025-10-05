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

    this.bg = this.add.image(0,0,"bg4").setOrigin(0)
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.scaleFactor = this.mapWidth/this.bg.width
    this.player = this.physics.add.sprite(900,800,"doc").setDepth(99).setScale(1.1)
    this.player.play("docIdle")

    this.ofis1= this.physics.add.sprite(0,0,"ofis1").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.ofis2= this.physics.add.sprite(0,0,"ofis2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.stairs= this.physics.add.sprite(0,0,"stairs").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)

    this.objects = [this.ofis1, this.ofis2, this.stairs]

    const map = this.make.tilemap({ key: 'corridor2' });
    const intLayer = map.getObjectLayer('interactive');
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
        case this.stairs:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          break;
        case this.ofis1:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          this.startDoorTransition();
          break;
        case this.ofis2:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
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
  right() {
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
  }
}
