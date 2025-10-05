class scene8 extends Phaser.Scene{
  constructor(){
    super("scene8")
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

    this.bg = this.add.image(0,0,"bg8").setOrigin(0)
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.scaleFactor = this.mapWidth/this.bg.width
    this.player = this.physics.add.sprite(100,800,"doc").setDepth(99).setScale(1.1)
    this.player.play("docIdle")


    const map = this.make.tilemap({ key: 'garden' });

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keydown-E", () => {
      switch(this.selectedItem){
        case "NaN":
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
      this.scene.start("scene6", {
        from: 7,
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

  update() {
    // Transition to scene3 when reaching the right edge
    if (this.player.x > this.mapWidth - 50 && !this.isTransitioning) {
      this.stop();
      this.player.x -= 10
      return;
    }
    if (this.player.x < 50){
      this.startTransitionToScene7();
    }
  }
}
