class scene5 extends baseScene{
  constructor(){
    super("scene5")
  }

  create(data){
    this.scene.get('OverlayScene');
    this.dialogue = this.scene.launch('dialogueOverlay');
    this.dialogue = this.scene.get('dialogueOverlay');
    this.scene.launch("inventoryOverlay");
    this.inventory = this.scene.get("inventoryOverlay", 1);
    this.time.delayedCall(1000, () => {
      this.scene.bringToTop("inventoryOverlay");
    })
    this.scene.bringToTop("dialogueOverlay")
    this.selectedItem = "NaN"
    this.from = data.from
    this.isWalking = false
    this.walkingSound = null
    this.isTransitioning = false
    this.glowingObject = null
    // Set the current slot from the passed data
    if (data && data.currentSlot !== undefined) {
      currentSlot = data.currentSlot;
    }
    this.currentSlot = currentSlot

    this.musicPlayer = this.scene.get("musicPlayer")
    this.musicPlayer.playMusic("docsTheme")


    if(this.currentSlot === 1)
      this.slot = "firstSlotItem"
    else if(this.currentSlot === 2)
      this.slot = "secondSlotItem"
    else
      this.slot = "thirdSlotItem"

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

    this.time.addEvent({
      delay: 10,
      callback: () => {this.overlayDark.alpha -= .01}, repeat: 100
    })


    this.bg1 = this.add.image(0,0,"bg7").setOrigin(0)
    this.scaleFactor = this.scale.height/this.bg1.height
    this.bg1.setScale(this.scaleFactor)
    this.player = this.physics.add.sprite(1100,700,"doc").setDepth(99)
    this.player.play("docIdle")

    this.matches= this.physics.add.sprite(0,0,"matches").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.matches.alpha = .01

    this.objects = [this.matches]
    this.itemSelector()

    const map = this.make.tilemap({ key: 'office2' });
    const intLayer = map.getObjectLayer('interactive');

    intLayer.objects.forEach(obj => {
      if (obj.name === 'matches') {
        this.matches.x = obj.x*this.scaleFactor
        this.matches.y = obj.y*this.scaleFactor
      }  
    });

    this.mapWidth = this.bg1.width * this.bg1.scaleX;
    this.mapHeight = this.bg1.height * this.bg1.scaleY;
    
    if (this.from == 2) {
      // Returning from scene2 - position by door facing left
      this.player.setPosition(this.mapWidth - 50, 700);
      this.player.flipX = true;
    }
    
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keydown-E", () => {


      switch(this.selectedItem){
        case "NaN":
          break;
        case this.matches:
          this.inventory.pick(this.selectedItem, true, "I found some matches here!", this.dialogue, "docPort", null, "1", null);
          //kibritleri alınca progress 7 yapalım
          progress = 7
          break;


      }
      if(this.inventoryArr.includes(localStorage.getItem(this.slot+"1")) == false)
        this.inventoryArr.push(localStorage.getItem(this.slot+"1"));
      if(this.inventoryArr.includes(localStorage.getItem(this.slot+"2")) == false)
        this.inventoryArr.push(localStorage.getItem(this.slot+"2"));
      if(this.inventoryArr.includes(localStorage.getItem(this.slot+"3")) == false)
        this.inventoryArr.push(localStorage.getItem(this.slot+"3"));
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
    
    // After 1 second delay, transition to scene2
    this.startSceneWithFade("scene2", {
      from: 5,
      currentSlot: currentSlot
    }, 1000);
  }
  right() {
    this.player.setVelocityX(500);
    this.player.play("docWalk", true)
    this.player.flipX = false
    this.dialogue.hideDialogue()
    
    // Play walking sound only when starting to walk
    if (!this.isWalking) {
      this.isWalking = true
      this.walkingSound = this.musicPlayer.playSfx("walk")
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
      this.walkingSound = this.musicPlayer.playSfx("walk")
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
        let minDistance = Math.min(...distances)
        
        if(minDistance < 200){
          let nearestObject = this.objects[index]
          if (index < 3) { //that means its a pickable :)
            // Remove glow from previously glowing object if it's different
            if (this.glowingObject && this.glowingObject !== nearestObject) {
              this.removeGlowEffect(this.glowingObject);
            }
            
            // Apply glow to the nearest object if it's not already glowing
            if (this.glowingObject !== nearestObject) {
              this.applyGlowEffect(nearestObject);
              this.glowingObject = nearestObject;
            } else {
              console.log("Object already glowing, no change needed");
            }
          }
          this.selectedItem = nearestObject
        } else {
          this.selectedItem = "NaN"
          // Remove glow when no object is selected
          if (this.glowingObject) {
            this.removeGlowEffect(this.glowingObject);
            this.glowingObject = null;
          }
        }

      }, loop: true
    })
  }

  applyGlowEffect(sprite) {
    
    // Store original properties for restoration
    sprite.originalTint = sprite.tint;
    sprite.originalBlendMode = sprite.blendMode;
    
    // Apply glow effect to the original sprite (keep original size and alpha)
    sprite.setTint(0xffaa00); // bright orange-yellow tint - more visible than pure yellow

    // Animate the glow for a flickering effect using tint intensity
    sprite.glowTween = this.tweens.add({
      targets: sprite,
      tint: { from: 0xffcc44, to: 0xffaa00 }, // animate between lighter and darker orange-yellow
      duration: 400,
      yoyo: true,
      repeat: -1
    });
  }

  removeGlowEffect(sprite) {
    if (!sprite) return;
    
    // Stop the glow animation
    if (sprite.glowTween) {
      sprite.glowTween.stop();
      sprite.glowTween = null;
    }
    
    // Restore original properties (only tint and blendMode were changed)
    sprite.clearTint() // remove tint
          .setBlendMode(sprite.originalBlendMode || Phaser.BlendModes.NORMAL);
  }
  saveProgressToSlot(){
    const key = currentSlot === 1 ? "firstSlotScene" : (currentSlot === 2 ? "secondSlotScene" : "thirdSlotScene")
    try{ localStorage.setItem(key, String(progress)) } catch(e) {}
  }

  logProgress(where){
    const key = currentSlot === 1 ? "firstSlotScene" : (currentSlot === 2 ? "secondSlotScene" : "thirdSlotScene")
    console.log(`[${where}] currentSlot=`, currentSlot, "progress=", progress, key, "=", localStorage.getItem(key))
  }

  update() {
    if (this.player.x < 0){
      this.stop();
      this.player.x += 10
    }

  if (this.player.x > this.mapWidth - 50 && !this.isTransitioning){
       this.startDoorTransition();
    }
  }

}

