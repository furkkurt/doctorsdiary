class scene1 extends Phaser.Scene{
  constructor(){
    super("scene1")
  }

  create(data){
    //parlaklık şeysi (BUNA GEREK VAR MI BİLMİYORUM)
    this.scene.get('OverlayScene');
    this.dialogue = this.scene.launch('dialogueOverlay');
    this.dialogue = this.scene.get('dialogueOverlay');
    this.scene.launch("inventoryOverlay");
    this.inventory = this.scene.get("inventoryOverlay", 1);
    this.scene.bringToTop("inventoryOverlay");
    this.scene.bringToTop("dialogueOverlay")
    this.selectedItem = "NaN"
    this.from = data.from
    this.isWalking = false
    this.walkingSound = null
    this.isTransitioning = false
    this.glowingObject = null
    if (this.from == undefined)
      this.from = 0
    // Set the current slot from the passed data
    if (data && data.currentSlot !== undefined) {
      currentSlot = data.currentSlot;
    }
    this.currentSlot = currentSlot

    this.musicPlayer = this.scene.get("musicPlayer")
    this.musicPlayer.playMusic("docsTheme")

    //progress ayarlamaca - only clamp if 0, do not auto-advance
    if (progress < 1) {
      progress = 1
      this.saveProgressToSlot()
    }
    this.logProgress("scene1 create after clamp")
    
    // Check for progress 3 cutscene
    if (progress === 3) {
      this.startProgress3Cutscene();
      return; // Exit early to prevent normal scene setup
    }
    
    // Check for progress 10 cutscene
    if (progress === 10) {
      this.startProgress10Cutscene();
      return; // Exit early to prevent normal scene setup
    }
    
    // Check for progress 11 cutscene
    if (progress === 11) {
      this.startProgress11Cutscene();
      return; // Exit early to prevent normal scene setup
    }

    // Check for progress 13/14 cutscene
    if (progress === 13) {
      this.startProgress13Cutscene();
      return; // Exit early to prevent normal scene setup
    }
    if (progress === 14) {
      this.startProgress14Cutscene();
      return; // Exit early to prevent normal scene setup
    }

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


    this.bg1 = this.add.image(0,0,"testBg").setOrigin(0)
    this.bg2 = this.add.image(0,0,"testBgObjects").setOrigin(0)
    this.scaleFactor = this.scale.height/this.bg1.height
    this.bg1.setScale(this.scaleFactor)
    this.bg2.setScale(this.scaleFactor)
    this.player = this.physics.add.sprite(1100,700,"doc").setDepth(99)
    this.player.play("docIdle")

    this.lamp = this.physics.add.sprite(0,0,"lamp").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.lamp.setInteractive()
    this.lamp.on("pointerdown", () => {
      if (this.lamp.texture.key == "lamp") {
        this.bg1.setTexture("testBg2");
        this.lamp.setTexture("lamp2");
      } else {
        this.bg1.setTexture("testBg");
        this.lamp.setTexture("lamp");
      }
    })

    //not defteri
    this.book1 = this.physics.add.sprite(0,0,"book1").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.book1.setInteractive()
    this.book1.on("pointerdown", () => {this.inventory.pick(this.book1)})

    //günlük
    this.book2 = this.physics.add.sprite(0,0,"book2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.book2.setInteractive()
    this.book2.on("pointerdown", () => {this.inventory.pick(this.book2)})

    this.drugs= this.physics.add.sprite(0,0,"drugs").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.drugs.setInteractive()
    this.drugs.on("pointerdown", () => {this.inventory.pick(this.drugs)})


    this.chair= this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.window= this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.shelf= this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)

    this.objects = [this.book1, this.book2, this.drugs, this.lamp, this.chair, this.window, this.shelf]
    this.itemSelector()

    const map = this.make.tilemap({ key: 'room1' });
    const intLayer = map.getObjectLayer('interactive');

    intLayer.objects.forEach(obj => {
      if (obj.name === 'lamp') {
        this.lamp.x = obj.x*this.scaleFactor
        this.lamp.y = obj.y*this.scaleFactor
      } else if (obj.name === "book1") {
        this.book1.x = obj.x*this.scaleFactor
        this.book1.y = obj.y*this.scaleFactor
      } else if (obj.name === "book2") {
        this.book2.x = obj.x*this.scaleFactor
        this.book2.y = obj.y*this.scaleFactor
      } else if (obj.name === "drugs") {
        this.drugs.x = obj.x*this.scaleFactor
        this.drugs.y = obj.y*this.scaleFactor
      } else if (obj.name === "window") {
        this.window.x = obj.x*this.scaleFactor
        this.window.y = obj.y*this.scaleFactor
      }else if (obj.name === "chair") {
        this.chair.x = obj.x*this.scaleFactor
        this.chair.y = obj.y*this.scaleFactor
      }else if (obj.name === "shelf") {
        this.shelf.x = obj.x*this.scaleFactor
        this.shelf.y = obj.y*this.scaleFactor
      }
    });

    this.mapWidth = this.bg1.width * this.bg1.scaleX;
    this.mapHeight = this.bg1.height * this.bg1.scaleY;
    
    // Hide collected items
    if (this.inventoryArr.includes("book1")) {
      this.book1.setVisible(false);
    }
    if (this.inventoryArr.includes("book2")) {
      this.book2.setVisible(false);
    }
    
    // Set player position based on where they're coming from
    if (this.from == 2) {
      // Returning from scene2 - position by door facing left
      this.player.setPosition(this.mapWidth - 50, 700);
      this.player.flipX = true;
    }
    
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    //tutorial şeysi
    if(progress == 1) {
    this.tutorText = this.add.text(20,10,"Read the documents about the test subject.",{fontFamily:"Moving", fontSize:"32px", color: "white"}).setOrigin(0).setScrollFactor(0)
    this.tutorText.alpha = 0
    this.time.delayedCall(1000, () => {
      this.dialogue.fadeIn(this.tutorText)
    })
    this.tutorText2 = this.time.addEvent({
      delay: 10,
      callback: () => {
        this.dialogue.fadeOut(this.tutorText)
        this.time.delayedCall(1000, () => {
          this.tutorText.text = "To interact with objects, stay in front of them and press E"
          this.dialogue.fadeIn(this.tutorText)
        })
      }, paused: true
    })
    }

    // Progress 7 guidance: prompt meds and show tutor text
    if (progress === 7) {
    const tryPrompt = () => {
      if (this.dialogue && this.dialogue.dialogueText) {
        //this.dialogue.dialogue("I need to take my meds", "docPort", null, "1", null, "Doctor");
        this.tutorText = this.add.text(20,10,"Take your meds",{fontFamily:"Moving", fontSize:"32px", color: "white"}).setOrigin(0).setScrollFactor(0)
        this.tutorText.alpha = 0
        this.time.delayedCall(500, () => { this.dialogue.fadeIn(this.tutorText) })
        return true;
      }
      return false;
    }/**
    if (!tryPrompt()) {
      this.time.addEvent({ delay: 100, callback: () => { if (!tryPrompt()) this.time.addEvent({ delay: 100, callback: tryPrompt }) } })
    }*/
    }

    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keydown-E", () => {


      switch(this.selectedItem){
        case "NaN":
          break;
        case this.book1:
          this.inventory.pick(this.selectedItem, true, "", this.dialogue);
          break;
        case this.book2:
          this.inventory.pick(this.selectedItem, true, "", this.dialogue);
          break;
        case this.drugs:
            if (progress === 7) {
              this.startMedsCutscene();
            } else if (progress === 10) {
              this.startProgress10MedsCutscene();
            } else if (progress === 11) {
              this.dialogue.dialogue("I need to use the bathroom", "docPort", null, "1", null, "Doctor");
              if (this.tutorText) {
                this.tutorText.destroy();
              }
              this.tutorText = this.add.text(20,10,"Go to bathroom",{fontFamily:"Moving", fontSize:"32px", color: "white"}).setOrigin(0).setScrollFactor(0);
              this.tutorText.alpha = 0;
              this.dialogue.fadeIn(this.tutorText);
            }
            break;
        case this.lamp:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          break;
        case this.window:
          this.inventory.pick(this.selectedItem, false, "Brighter than ever!", this.dialogue);
          break;
        case this.shelf:
          this.inventory.pick(this.selectedItem, false, "I lost my habbit of reading...", this.dialogue);
          break;
        case this.chair:
          this.inventory.pick(this.selectedItem, false, "I wonder if there is anyone left I can host in my office.", this.dialogue);
          break;


      if(this.inventoryArr.includes(localStorage.getItem(this.slot+"1")) == false)
        this.inventoryArr.push(localStorage.getItem(this.slot+"1"));
      if(this.inventoryArr.includes(localStorage.getItem(this.slot+"2")) == false)
        this.inventoryArr.push(localStorage.getItem(this.slot+"2"));
      if(this.inventoryArr.includes(localStorage.getItem(this.slot+"3")) == false)
        this.inventoryArr.push(localStorage.getItem(this.slot+"3"));
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
    
    // After 1 second delay, transition to scene2
    this.time.delayedCall(1000, () => {
      this.scene.stop("inventoryOverlay");
      this.scene.stop("dialogueOverlay");
      this.scene.start("scene2", {
        from: 1,
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

  startProgress3Cutscene() {
    console.log("Starting progress 3 cutscene");
    
    // Set up overlays for cutscene
    this.scene.launch("OverlayScene");
    this.scene.get('OverlayScene');
    this.scene.bringToTop("OverlayScene");
    this.dialogue = this.scene.launch('dialogueOverlay');
    this.dialogue = this.scene.get('dialogueOverlay');
    this.scene.launch("inventoryOverlay");
    this.inventory = this.scene.get("inventoryOverlay", 1);
    this.scene.bringToTop("inventoryOverlay");
    this.scene.bringToTop("dialogueOverlay")
    
    // Set up slot and inventory array for cutscene
    if(this.currentSlot === 1)
      this.slot = "firstSlotItem"
    else if(this.currentSlot === 2)
      this.slot = "secondSlotItem"
    else
      this.slot = "thirdSlotItem"
    
    this.inventoryArr = [];
    if (this.inventoryArr.includes(localStorage.getItem(this.slot+"1")) == false)
      this.inventoryArr.push(localStorage.getItem(this.slot+"1"));
    if (this.inventoryArr.includes(localStorage.getItem(this.slot+"2")) == false)
      this.inventoryArr.push(localStorage.getItem(this.slot+"2"));
    if (this.inventoryArr.includes(localStorage.getItem(this.slot+"3")) == false)
      this.inventoryArr.push(localStorage.getItem(this.slot+"3"));
    
    // Set up basic scene elements for cutscene
     this.bg1 = this.add.image(0,0,"testBg").setOrigin(0)
    this.bg2 = this.add.image(0,0,"testBgObjects").setOrigin(0)
    this.scaleFactor = this.scale.height/this.bg1.height
    this.bg1.setScale(this.scaleFactor)
    this.bg2.setScale(this.scaleFactor)
    
    // Create interactive objects for cutscene
    this.lamp = this.physics.add.sprite(0,0,"lamp").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.lamp.setInteractive()
    this.lamp.on("pointerdown", () => {
      if (this.lamp.texture.key == "lamp") {
        this.bg1.setTexture("testBg2");
        this.lamp.setTexture("lamp2");
      } else {
        this.bg1.setTexture("testBg");
        this.lamp.setTexture("lamp");
      }
    })

    //not defteri
    this.book1 = this.physics.add.sprite(0,0,"book1").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.book1.setInteractive()
    this.book1.on("pointerdown", () => {this.inventory.pick(this.book1)})

    //günlük
    this.book2 = this.physics.add.sprite(0,0,"book2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.book2.setInteractive()
    this.book2.on("pointerdown", () => {this.inventory.pick(this.book2)})

    this.drugs= this.physics.add.sprite(0,0,"drugs").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.drugs.setInteractive()
    this.drugs.on("pointerdown", () => {this.inventory.pick(this.drugs)})

    this.chair= this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.window= this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.shelf= this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)

    this.objects = [this.book1, this.book2, this.drugs, this.lamp, this.chair, this.window, this.shelf]

    // Load Tiled map and position objects for cutscene
    const map = this.make.tilemap({ key: 'room1' });
    const intLayer = map.getObjectLayer('interactive');

    intLayer.objects.forEach(obj => {
      if (obj.name === 'lamp') {
        this.lamp.x = obj.x*this.scaleFactor
        this.lamp.y = obj.y*this.scaleFactor
      } else if (obj.name === "book1") {
        this.book1.x = obj.x*this.scaleFactor
        this.book1.y = obj.y*this.scaleFactor
      } else if (obj.name === "book2") {
        this.book2.x = obj.x*this.scaleFactor
        this.book2.y = obj.y*this.scaleFactor
      } else if (obj.name === "drugs") {
        this.drugs.x = obj.x*this.scaleFactor
        this.drugs.y = obj.y*this.scaleFactor
      } else if (obj.name === "window") {
        this.window.x = obj.x*this.scaleFactor
        this.window.y = obj.y*this.scaleFactor
      }else if (obj.name === "chair") {
        this.chair.x = obj.x*this.scaleFactor
        this.chair.y = obj.y*this.scaleFactor
      }else if (obj.name === "shelf") {
        this.shelf.x = obj.x*this.scaleFactor
        this.shelf.y = obj.y*this.scaleFactor
      }
    });

    // Set map dimensions for cutscene
    this.mapWidth = this.bg1.width * this.bg1.scaleX;
    this.mapHeight = this.bg1.height * this.bg1.scaleY;
    
    // Hide collected items in cutscene
    if (this.inventoryArr.includes("book1")) {
      this.book1.setVisible(false);
    }
    if (this.inventoryArr.includes("book2")) {
      this.book2.setVisible(false);
    }
    
    // Create overlay for cutscene
    this.overlayDark = this.add.graphics();
    this.overlayDark.fillStyle(0x000000, 1);
    this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlayDark.setScrollFactor(0);
    this.overlayDark.setDepth(100);
    this.overlayDark.alpha = 0; // Start transparent

    // Doctor starts off-screen on the right
    this.player = this.physics.add.sprite(this.mapWidth + 100, 700, "doc").setDepth(99).setScale(this.scaleFactor).setScale(1.1)
    this.player.play("docIdle")
    this.player.flipX = true; // Face left (toward the room)

    // Set up camera
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    // Start the cutscene sequence
    this.time.delayedCall(1000, () => {
      // Doctor starts walking slowly
      this.player.setVelocityX(-200);
      this.player.play("docWalk");
      
      // Play walking sound
      this.musicPlayer.playSfx("walk");
      
      // After walking for a bit, fade out screen
      this.time.delayedCall(3000, () => {
        // Stop walking sound
        this.musicPlayer.stopAllSfx();
        
        // Fade out screen
        this.dialogue.fadeIn(this.overlayDark, 3000);
        
        // After fade out, show text
        this.time.delayedCall(2000, () => {
          this.showProgress3Text();
        });
      });
    });
  }

  startProgress10Cutscene() {
    // Set up basic scene elements
    this.scene.launch("dialogueOverlay");
    this.scene.bringToTop("dialogueOverlay");
    this.dialogue = this.scene.get('dialogueOverlay');
    this.scene.launch("inventoryOverlay");
    this.inventory = this.scene.get("inventoryOverlay", 1);
    this.scene.bringToTop("inventoryOverlay");
    
    this.musicPlayer = this.scene.get("musicPlayer");
    this.musicPlayer.playMusic("docsTheme");
    
    // Set up scene
    this.bg1 = this.add.image(0,0,"testBg").setOrigin(0);
    this.bg2 = this.add.image(0,0,"testBgObjects").setOrigin(0);
    this.scaleFactor = this.scale.height/this.bg1.height;
    this.bg1.setScale(this.scaleFactor);
    this.bg2.setScale(this.scaleFactor);
    
    // Create player and objects
    this.player = this.physics.add.sprite(1100,700,"doc").setDepth(99);
    this.player.play("docIdle");
    
    // Set up all interactive objects
    this.lamp = this.physics.add.sprite(0,0,"lamp").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.lamp.setInteractive();
    this.lamp.on("pointerdown", () => {
      if (this.lamp.texture.key == "lamp") {
        this.bg1.setTexture("testBg2");
        this.lamp.setTexture("lamp2");
      } else {
        this.bg1.setTexture("testBg");
        this.lamp.setTexture("lamp");
      }
    });

    this.book1 = this.physics.add.sprite(0,0,"book1").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.book1.setInteractive();
    this.book1.on("pointerdown", () => {this.inventory.pick(this.book1)});

    this.book2 = this.physics.add.sprite(0,0,"book2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.book2.setInteractive();
    this.book2.on("pointerdown", () => {this.inventory.pick(this.book2)});

    this.drugs = this.physics.add.sprite(0,0,"drugs").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.drugs.setInteractive();
    this.drugs.on("pointerdown", () => {this.inventory.pick(this.drugs)});

    this.chair = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false);
    this.window = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false);
    this.shelf = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false);

    this.objects = [this.book1, this.book2, this.drugs, this.lamp, this.chair, this.window, this.shelf];
    this.itemSelector();

    // Load map and position objects
    const map = this.make.tilemap({ key: 'room1' });
    const intLayer = map.getObjectLayer('interactive');
    intLayer.objects.forEach(obj => {
      if (obj.name === 'lamp') {
        this.lamp.x = obj.x*this.scaleFactor;
        this.lamp.y = obj.y*this.scaleFactor;
      } else if (obj.name === "book1") {
        this.book1.x = obj.x*this.scaleFactor;
        this.book1.y = obj.y*this.scaleFactor;
      } else if (obj.name === "book2") {
        this.book2.x = obj.x*this.scaleFactor;
        this.book2.y = obj.y*this.scaleFactor;
      } else if (obj.name === "drugs") {
        this.drugs.x = obj.x*this.scaleFactor;
        this.drugs.y = obj.y*this.scaleFactor;
      } else if (obj.name === "window") {
        this.window.x = obj.x*this.scaleFactor;
        this.window.y = obj.y*this.scaleFactor;
      } else if (obj.name === "chair") {
        this.chair.x = obj.x*this.scaleFactor;
        this.chair.y = obj.y*this.scaleFactor;
      } else if (obj.name === "shelf") {
        this.shelf.x = obj.x*this.scaleFactor;
        this.shelf.y = obj.y*this.scaleFactor;
      }
    });
    
    // Set up camera
    this.mapWidth = this.bg1.width * this.bg1.scaleX;
    this.mapHeight = this.bg1.height * this.bg1.scaleY;
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    
    // Start walking loop sequence
    this.walkingLoopCount = 0;
    this.startWalkingLoop();
  }

  startWalkingLoop() {
    if (this.walkingLoopCount >= 3) {
      // After 3 loops, stop and show tutor text
      this.player.setVelocityX(0);
      this.player.play("docIdle");
      this.musicPlayer.stopAllSfx();
      
      // Show tutor text
      if (this.tutorText) {
        this.tutorText.destroy();
      }
      this.tutorText = this.add.text(20,10,"Take your meds",{fontFamily:"Moving", fontSize:"32px", color: "white"}).setOrigin(0).setScrollFactor(0);
      this.tutorText.alpha = 0;
      this.dialogue.fadeIn(this.tutorText);
      
      // Enable controls
      this.input.keyboard.on("keydown-A", this.left.bind(this));
      this.input.keyboard.on("keydown-D", this.right.bind(this));
      this.input.keyboard.on("keydown-E", () => {
        switch(this.selectedItem){
          case "NaN":
            break;
          case this.book1:
            this.inventory.pick(this.selectedItem, true, "", this.dialogue);
            break;
          case this.book2:
            this.inventory.pick(this.selectedItem, true, "", this.dialogue);
            break;
          case this.drugs:
            if (progress === 13) {
              this.startDoorTransition();
            } else {
              this.inventory.pick(this.selectedItem, false, "I don't need them right now.", this.dialogue);
            }
            break;
          case this.lamp:
            this.inventory.pick(this.selectedItem, false, "", this.dialogue);
            break;
          case this.window:
            this.inventory.pick(this.selectedItem, false, "Brighter than ever!", this.dialogue);
            break;
          case this.shelf:
            this.inventory.pick(this.selectedItem, false, "I lost my habbit of reading...", this.dialogue);
            break;
          case this.chair:
            this.inventory.pick(this.selectedItem, false, "I wonder if there is anyone left I can host in my office.", this.dialogue);
            break;
        }
      });
      this.input.keyboard.on("keyup-A", this.stop.bind(this));
      this.input.keyboard.on("keyup-D", this.stop.bind(this));
      this.input.keyboard.on("keydown-ESC", this.pause.bind(this));
      this.input.keyboard.on("keydown-SPACE", this.pause.bind(this));
      
      // Enable controls
      this.input.keyboard.on("keydown-A", this.left.bind(this));
      this.input.keyboard.on("keydown-D", this.right.bind(this));
      this.input.keyboard.on("keydown-E", () => {
        switch(this.selectedItem){
          case "NaN":
            break;
          case this.book1:
            this.inventory.pick(this.selectedItem, true, "", this.dialogue);
            break;
          case this.book2:
            this.inventory.pick(this.selectedItem, true, "", this.dialogue);
            break;
          case this.drugs:
            if (progress === 10) {
              this.startProgress10MedsCutscene();
            } else if (progress === 11) {
              this.dialogue.dialogue("I need to use the bathroom", "docPort", null, "1", null, "Doctor");
              if (this.tutorText) {
                this.tutorText.destroy();
              }
              this.tutorText = this.add.text(20,10,"Go to bathroom",{fontFamily:"Moving", fontSize:"32px", color: "white"}).setOrigin(0).setScrollFactor(0);
              this.tutorText.alpha = 0;
              this.dialogue.fadeIn(this.tutorText);
            }
            break;
          case this.lamp:
            this.inventory.pick(this.selectedItem, false, "", this.dialogue);
            break;
          case this.window:
            this.inventory.pick(this.selectedItem, false, "Brighter than ever!", this.dialogue);
            break;
          case this.shelf:
            this.inventory.pick(this.selectedItem, false, "I lost my habbit of reading...", this.dialogue);
            break;
          case this.chair:
            this.inventory.pick(this.selectedItem, false, "I wonder if there is anyone left I can host in my office.", this.dialogue);
            break;
        }
      });
      this.input.keyboard.on("keyup-A", this.stop.bind(this));
      this.input.keyboard.on("keyup-D", this.stop.bind(this));
      this.input.keyboard.on("keydown-ESC", this.pause.bind(this));
      this.input.keyboard.on("keydown-SPACE", this.pause.bind(this));
      return;
    }
    
    // Walk right
    this.player.setVelocityX(500);
    this.player.play("docWalk", true);
    this.player.flipX = false;
    if (!this.isWalking) {
      this.isWalking = true;
      this.walkingSound = this.musicPlayer.playSfx("walk");
    }
    
    this.time.delayedCall(2000, () => {
      // Walk left
      this.player.setVelocityX(-500);
      this.player.play("docWalk", true);
      this.player.flipX = true;
      
      this.time.delayedCall(2000, () => {
        this.walkingLoopCount++;
        this.startWalkingLoop();
      });
    });
  }

  startProgress14Cutscene() {
    // Set up basic scene elements
    this.scene.launch("dialogueOverlay");
    this.scene.bringToTop("dialogueOverlay");
    this.dialogue = this.scene.get('dialogueOverlay');
    this.scene.launch("inventoryOverlay");
    this.inventory = this.scene.get("inventoryOverlay", 1);
    this.scene.bringToTop("inventoryOverlay");
    
    this.musicPlayer = this.scene.get("musicPlayer");
    this.musicPlayer.playMusic("docsTheme");
    
    // Set up scene
    this.bg1 = this.add.image(0,0,"testBg").setOrigin(0);
    this.bg2 = this.add.image(0,0,"testBgObjects").setOrigin(0);
    this.scaleFactor = this.scale.height/this.bg1.height;
    this.bg1.setScale(this.scaleFactor);
    this.bg2.setScale(this.scaleFactor);
    
    // Create player and objects
    this.player = this.physics.add.sprite(1100,700,"doc").setDepth(99);
    this.player.play("docIdle");
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    
    // Set up all interactive objects
    this.lamp = this.physics.add.sprite(0,0,"lamp").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.lamp.setInteractive();
    this.lamp.on("pointerdown", () => {
      if (this.lamp.texture.key == "lamp") {
        this.bg1.setTexture("testBg2");
        this.lamp.setTexture("lamp2");
      } else {
        this.bg1.setTexture("testBg");
        this.lamp.setTexture("lamp");
      }
    });

    this.book1 = this.physics.add.sprite(0,0,"book1").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.book1.setInteractive();
    this.book1.on("pointerdown", () => {this.inventory.pick(this.book1)});

    this.book2 = this.physics.add.sprite(0,0,"book2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.book2.setInteractive();
    this.book2.on("pointerdown", () => {this.inventory.pick(this.book2)});

    this.drugs = this.physics.add.sprite(0,0,"drugs").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.drugs.setInteractive();
    this.drugs.on("pointerdown", () => {this.inventory.pick(this.drugs)});

    this.chair = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false);
    this.window = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false);
    this.shelf = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false);

    this.objects = [this.book1, this.book2, this.drugs, this.lamp, this.chair, this.window, this.shelf];
    this.itemSelector();

    // Load map and position objects
    const map = this.make.tilemap({ key: 'room1' });
    const intLayer = map.getObjectLayer('interactive');
    intLayer.objects.forEach(obj => {
      if (obj.name === 'lamp') {
        this.lamp.x = obj.x*this.scaleFactor;
        this.lamp.y = obj.y*this.scaleFactor;
      } else if (obj.name === "book1") {
        this.book1.x = obj.x*this.scaleFactor;
        this.book1.y = obj.y*this.scaleFactor;
      } else if (obj.name === "book2") {
        this.book2.x = obj.x*this.scaleFactor;
        this.book2.y = obj.y*this.scaleFactor;
      } else if (obj.name === "drugs") {
        this.drugs.x = obj.x*this.scaleFactor;
        this.drugs.y = obj.y*this.scaleFactor;
      } else if (obj.name === "window") {
        this.window.x = obj.x*this.scaleFactor;
        this.window.y = obj.y*this.scaleFactor;
      } else if (obj.name === "chair") {
        this.chair.x = obj.x*this.scaleFactor;
        this.chair.y = obj.y*this.scaleFactor;
      } else if (obj.name === "shelf") {
        this.shelf.x = obj.x*this.scaleFactor;
        this.shelf.y = obj.y*this.scaleFactor;
      }
    });
    
    // Show tutor text
    this.tutorText = this.add.text(20,10,"TAKE. YOUR. MEDS.",{fontFamily:"Moving", fontSize:"32px", color: "white"}).setOrigin(0).setScrollFactor(0);
    this.tutorText.alpha = 0;
    this.tutorText.setVisible(true);
    this.dialogue.fadeIn(this.tutorText);
    
    // Enable controls
    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keydown-E", () => {
      switch(this.selectedItem){
        case "NaN":
          break;
        case this.book1:
          this.inventory.pick(this.selectedItem, true, "", this.dialogue);
          break;
        case this.book2:
          this.inventory.pick(this.selectedItem, true, "", this.dialogue);
          break;
        case this.drugs:
          if (window.ending === "fix") {
            this.startBadEndingTransition();
          } else {
            // Show "0 Days Left" and fade to black
            this.overlayDark = this.add.graphics();
            this.overlayDark.fillStyle(0x000000, 1);
            this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
            this.overlayDark.setScrollFactor(0);
            this.overlayDark.setDepth(100);
            this.overlayDark.alpha = 0;
            
            this.dialogue.fadeIn(this.overlayDark, 1000);
            
            this.time.delayedCall(1200, () => {
              const bigText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "0 Days Left", {
                fontFamily: "Moving",
                fontSize: "96px",
                color: "#ffffff",
                stroke: "#000000",
                strokeThickness: 8
              }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
              
              bigText.alpha = 0;
              this.tweens.add({ targets: bigText, alpha: 1, duration: 800, ease: 'Linear' });
              
              this.time.delayedCall(2500, () => {
                this.scene.start("goodEnding");
              });
            });
          }
          break;
        case this.lamp:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          break;
        case this.window:
          this.inventory.pick(this.selectedItem, false, "Brighter than ever!", this.dialogue);
          break;
        case this.shelf:
          this.inventory.pick(this.selectedItem, false, "I lost my habbit of reading...", this.dialogue);
          break;
        case this.chair:
          this.inventory.pick(this.selectedItem, false, "I wonder if there is anyone left I can host in my office.", this.dialogue);
          break;
      }
    });
    this.input.keyboard.on("keyup-A", this.stop.bind(this));
    this.input.keyboard.on("keyup-D", this.stop.bind(this));
    this.input.keyboard.on("keydown-ESC", this.pause.bind(this));
    this.input.keyboard.on("keydown-SPACE", this.pause.bind(this));
  }

  startBadEndingTransition() {
    // Disable controls
    this.input.keyboard.removeAllListeners();
    
    // Walk right
    this.player.flipX = false;
    this.player.setVelocityX(200);
    this.player.play("docWalk");
    this.musicPlayer.playSfx("walk");
    
    // After walking for a bit, transition to bad ending
    this.time.delayedCall(2000, () => {
      this.scene.start("badEnding");
    });
  }

  startProgress13Cutscene() {
    // Set up basic scene elements
    this.scene.launch("dialogueOverlay");
    this.scene.bringToTop("dialogueOverlay");
    this.dialogue = this.scene.get('dialogueOverlay');
    this.scene.launch("inventoryOverlay");
    this.inventory = this.scene.get("inventoryOverlay", 1);
    this.scene.bringToTop("inventoryOverlay");
    
    this.musicPlayer = this.scene.get("musicPlayer");
    this.musicPlayer.playMusic("docsTheme");
    
    // Set up scene
    this.bg1 = this.add.image(0,0,"testBg").setOrigin(0);
    this.bg2 = this.add.image(0,0,"testBgObjects").setOrigin(0);
    this.scaleFactor = this.scale.height/this.bg1.height;
    this.bg1.setScale(this.scaleFactor);
    this.bg2.setScale(this.scaleFactor);
    
    // Create player and objects
    this.player = this.physics.add.sprite(1100,700,"doc").setDepth(99);
    this.player.play("docIdle");
    
    // Set up all interactive objects
    this.lamp = this.physics.add.sprite(0,0,"lamp").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.lamp.setInteractive();
    this.lamp.on("pointerdown", () => {
      if (this.lamp.texture.key == "lamp") {
        this.bg1.setTexture("testBg2");
        this.lamp.setTexture("lamp2");
      } else {
        this.bg1.setTexture("testBg");
        this.lamp.setTexture("lamp");
      }
    });

    this.book1 = this.physics.add.sprite(0,0,"book1").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.book1.setInteractive();
    this.book1.on("pointerdown", () => {this.inventory.pick(this.book1)});

    this.book2 = this.physics.add.sprite(0,0,"book2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.book2.setInteractive();
    this.book2.on("pointerdown", () => {this.inventory.pick(this.book2)});

    this.drugs = this.physics.add.sprite(0,0,"drugs").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.drugs.setInteractive();
    this.drugs.on("pointerdown", () => {this.inventory.pick(this.drugs)});

    this.chair = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false);
    this.window = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false);
    this.shelf = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false);

    this.objects = [this.book1, this.book2, this.drugs, this.lamp, this.chair, this.window, this.shelf];
    this.itemSelector();

    // Load map and position objects
    const map = this.make.tilemap({ key: 'room1' });
    const intLayer = map.getObjectLayer('interactive');
    intLayer.objects.forEach(obj => {
      if (obj.name === 'lamp') {
        this.lamp.x = obj.x*this.scaleFactor;
        this.lamp.y = obj.y*this.scaleFactor;
      } else if (obj.name === "book1") {
        this.book1.x = obj.x*this.scaleFactor;
        this.book1.y = obj.y*this.scaleFactor;
      } else if (obj.name === "book2") {
        this.book2.x = obj.x*this.scaleFactor;
        this.book2.y = obj.y*this.scaleFactor;
      } else if (obj.name === "drugs") {
        this.drugs.x = obj.x*this.scaleFactor;
        this.drugs.y = obj.y*this.scaleFactor;
      } else if (obj.name === "window") {
        this.window.x = obj.x*this.scaleFactor;
        this.window.y = obj.y*this.scaleFactor;
      } else if (obj.name === "chair") {
        this.chair.x = obj.x*this.scaleFactor;
        this.chair.y = obj.y*this.scaleFactor;
      } else if (obj.name === "shelf") {
        this.shelf.x = obj.x*this.scaleFactor;
        this.shelf.y = obj.y*this.scaleFactor;
      }
    });
    
    // Build inventory array
    if(this.currentSlot === 1)
      this.slot = "firstSlotItem"
    else if(this.currentSlot === 2)
      this.slot = "secondSlotItem"
    else
      this.slot = "thirdSlotItem"

    this.inventoryArr = [];
    const i1 = localStorage.getItem(this.slot+"1");
    const i2 = localStorage.getItem(this.slot+"2");
    const i3 = localStorage.getItem(this.slot+"3");
    if (i1 && i1 !== "" && !this.inventoryArr.includes(i1)) this.inventoryArr.push(i1);
    if (i2 && i2 !== "" && !this.inventoryArr.includes(i2)) this.inventoryArr.push(i2);
    if (i3 && i3 !== "" && !this.inventoryArr.includes(i3)) this.inventoryArr.push(i3);

    // Set up camera
    this.mapWidth = this.bg1.width * this.bg1.scaleX;
    this.mapHeight = this.bg1.height * this.bg1.scaleY;
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    
    // Hide collected books
    if (this.inventoryArr.includes("book1")) {
      this.book1.setVisible(false);
    }
    if (this.inventoryArr.includes("book2")) {
      this.book2.setVisible(false);
    }
    
    // Create and show overlay
    this.overlayDark = this.add.graphics();
    this.overlayDark.fillStyle(0x000000, 1);
    this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlayDark.setScrollFactor(0);
    this.overlayDark.setDepth(100);
    
    // Show "1 Day Left" text
    const bigText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "1 Day Left", {
      fontFamily: "Moving",
      fontSize: "96px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
    
    // After showing text, fade out and start walking sequence
    this.time.delayedCall(2000, () => {
      this.dialogue.fadeOut(this.overlayDark);
      this.tweens.add({
        targets: bigText,
        alpha: 0,
        duration: 1000,
        onComplete: () => {
          bigText.destroy();
          // Start walking loop
          this.walkingLoopCount = 0;
          this.startWalkingLoop();
        }
      });
    });
  }

  startProgress11Cutscene() {
    // Set up basic scene elements
    this.scene.launch("dialogueOverlay");
    this.scene.bringToTop("dialogueOverlay");
    this.dialogue = this.scene.get('dialogueOverlay');
    this.scene.launch("inventoryOverlay");
    this.inventory = this.scene.get("inventoryOverlay", 1);
    this.scene.bringToTop("inventoryOverlay");
    
    this.musicPlayer = this.scene.get("musicPlayer");
    this.musicPlayer.playMusic("docsTheme");
    
    // Set up scene
    this.bg1 = this.add.image(0,0,"testBg").setOrigin(0);
    this.bg2 = this.add.image(0,0,"testBgObjects").setOrigin(0);
    this.scaleFactor = this.scale.height/this.bg1.height;
    this.bg1.setScale(this.scaleFactor);
    this.bg2.setScale(this.scaleFactor);
    
    // Create player and objects
    this.player = this.physics.add.sprite(1100,700,"doc").setDepth(99);
    this.player.play("docIdle");
    
    // Set up all interactive objects
    this.lamp = this.physics.add.sprite(0,0,"lamp").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.lamp.setInteractive();
    this.lamp.on("pointerdown", () => {
      if (this.lamp.texture.key == "lamp") {
        this.bg1.setTexture("testBg2");
        this.lamp.setTexture("lamp2");
      } else {
        this.bg1.setTexture("testBg");
        this.lamp.setTexture("lamp");
      }
    });

    this.book1 = this.physics.add.sprite(0,0,"book1").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.book1.setInteractive();
    this.book1.on("pointerdown", () => {this.inventory.pick(this.book1)});

    this.book2 = this.physics.add.sprite(0,0,"book2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.book2.setInteractive();
    this.book2.on("pointerdown", () => {this.inventory.pick(this.book2)});

    this.drugs = this.physics.add.sprite(0,0,"drugs").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable();
    this.drugs.setInteractive();
    this.drugs.on("pointerdown", () => {this.inventory.pick(this.drugs)});

    this.chair = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false);
    this.window = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false);
    this.shelf = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false);

    this.objects = [this.book1, this.book2, this.drugs, this.lamp, this.chair, this.window, this.shelf];
    this.itemSelector();

    // Load map and position objects
    const map = this.make.tilemap({ key: 'room1' });
    const intLayer = map.getObjectLayer('interactive');
    intLayer.objects.forEach(obj => {
      if (obj.name === 'lamp') {
        this.lamp.x = obj.x*this.scaleFactor;
        this.lamp.y = obj.y*this.scaleFactor;
      } else if (obj.name === "book1") {
        this.book1.x = obj.x*this.scaleFactor;
        this.book1.y = obj.y*this.scaleFactor;
      } else if (obj.name === "book2") {
        this.book2.x = obj.x*this.scaleFactor;
        this.book2.y = obj.y*this.scaleFactor;
      } else if (obj.name === "drugs") {
        this.drugs.x = obj.x*this.scaleFactor;
        this.drugs.y = obj.y*this.scaleFactor;
      } else if (obj.name === "window") {
        this.window.x = obj.x*this.scaleFactor;
        this.window.y = obj.y*this.scaleFactor;
      } else if (obj.name === "chair") {
        this.chair.x = obj.x*this.scaleFactor;
        this.chair.y = obj.y*this.scaleFactor;
      } else if (obj.name === "shelf") {
        this.shelf.x = obj.x*this.scaleFactor;
        this.shelf.y = obj.y*this.scaleFactor;
      }
    });
    
    // Set up camera
    this.mapWidth = this.bg1.width * this.bg1.scaleX;
    this.mapHeight = this.bg1.height * this.bg1.scaleY;
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    
    // Start walking loop sequence
    this.walkingLoopCount = 0;
    this.startWalkingLoop();
  }

  startProgress10MedsCutscene() {
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    
    // Create and fade in overlay
    this.overlayDark = this.add.graphics();
    this.overlayDark.fillStyle(0x000000, 1);
    this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    this.overlayDark.setScrollFactor(0);
    this.overlayDark.setDepth(100);
    this.overlayDark.alpha = 0;
    
    // Fade to black
    this.dialogue.fadeIn(this.overlayDark, 1000);
    
    // After fade, show bigText then restart
    this.time.delayedCall(1200, () => {
      const bigText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "2 days left", {
        fontFamily: "Moving",
        fontSize: "96px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8
      }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
      
      bigText.alpha = 0;
      this.tweens.add({ targets: bigText, alpha: 1, duration: 800, ease: 'Linear' });
      
      this.time.delayedCall(2500, () => {
        // Clean overlays and restart scene1
        this.scene.stop("inventoryOverlay");
        this.scene.stop("dialogueOverlay");
        progress = 11;
        this.scene.start("scene1", { from: 0, currentSlot: currentSlot });
      });
    });
  }

  startMedsCutscene(){
    if (this.isTransitioning) return;
    this.isTransitioning = true;
    // Fade to black
    this.dialogue.fadeIn(this.overlayDark, 1000);
    // After fade, show bigText then restart
    this.time.delayedCall(1200, () => {
      const bigText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "3 days left", {
        fontFamily: "Moving",
        fontSize: "96px",
        color: "#ffffff",
        stroke: "#000000",
        strokeThickness: 8
      }).setOrigin(0.5).setScrollFactor(0).setDepth(101);
      bigText.alpha = 0;
      this.tweens.add({ targets: bigText, alpha: 1, duration: 800, ease: 'Linear' });
      this.time.delayedCall(2500, () => {
        // Clean overlays and restart scene1 at starting position
        this.scene.stop("inventoryOverlay");
        this.scene.stop("dialogueOverlay");
        progress = 8
        this.scene.start("scene1", { from: 0, currentSlot: currentSlot });
      });
    });
  }

  showProgress3Text() {
    // Create big text like in scene0
    const bigText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "4 days left", {
      fontFamily: "Moving",
      fontSize: "96px",
      color: "#ffffff",
      stroke: "#000000",
      strokeThickness: 8
    }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

    // Fade in the text
    bigText.alpha = 0;
    this.tweens.add({
      targets: bigText,
      alpha: 1,
      duration: 1000,
      ease: 'Linear'
    });

    // After showing "4 days left", show the second text
    this.time.delayedCall(4000, () => {
      // Fade out first text
      this.tweens.add({
        targets: bigText,
        alpha: 0,
        duration: 500,
        ease: 'Linear',
        onComplete: () => {
          bigText.destroy();
        }
      });

      // Show second text
      this.time.delayedCall(1000, () => {
        progress = 5;
        const secondText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "When did world became this... hell of a hole. I dont even remember", {
          fontFamily: "Moving",
          fontSize: "64px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 6,
          align: 'center',
          wordWrap: { width: 800 }
        }).setOrigin(0.5).setScrollFactor(0).setDepth(101);

        // Fade in the second text
        secondText.alpha = 0;
        this.tweens.add({
          targets: secondText,
          alpha: 1,
          duration: 1000,
          ease: 'Linear'
        });

        // After showing second text, update progress and fade back in
        this.time.delayedCall(5000, () => {
          // Do not change progress here automatically; keep author-controlled
          
          // Fade out second text
          this.tweens.add({
            targets: secondText,
            alpha: 0,
            duration: 500,
            ease: 'Linear',
            onComplete: () => {
              secondText.destroy();
              this.scene.restart({ currentSlot: currentSlot });
            }
          });
        });
      });
    });
  }

  update() {
    /*
    let objectDistances = [Math.abs(this.player.x - this.book1.x), Math.abs(this.player.x - this.book2.x), Math.abs(this.player.x - this.drugs.x)]
    let pickNum= objectDistances.indexOf(Math.min(...objectDistances))
    if(Math.min(...objectDistances) < 200) {
      let closestItem = [this.book1, this.book2, this.drugs][pickNum]
      let hoverTexture = ["book12", "book22", "drugs2"][pickNum]
      this.book1.setTexture("book1")
      this.book2.setTexture("book2")
      this.drugs.setTexture("drugs")
      closestItem.setTexture(hoverTexture)
      this.selectedItem = closestItem
    } else {
      this.selectedItem = "NaN"
    }
    */

    //tutorial yazısını e yle alcan falan yap
    if (this.player.x > 1400 && this.tutorText2)
      this.tutorText2.paused = false
    if (this.player.x < 0){
      this.stop();
      this.player.x += 10
    }

    if ((this.player.x > this.mapWidth - 50 && !this.isTransitioning) && progress != 3){
       if (progress == 1) {
        const hasItems = this.hasRequiredItems();
        console.log("[scene1 exit check] hasRequiredItems=", hasItems, "inventoryArr=", this.inventoryArr);
        if(hasItems){
           // Do not change progress here automatically; keep author-controlled
           this.startDoorTransition();
         } else {
          this.player.x -= 10
         }
       }
       else {
         this.startDoorTransition();
         if (progress == 11)
          progress = 12
       }
     }
  }

  saveProgressToSlot(){
    const key = currentSlot === 1 ? "firstSlotScene" : (currentSlot === 2 ? "secondSlotScene" : "thirdSlotScene")
    try{ localStorage.setItem(key, String(progress)) } catch(e) {}
  }

  logProgress(where){
    const key = currentSlot === 1 ? "firstSlotScene" : (currentSlot === 2 ? "secondSlotScene" : "thirdSlotScene")
    console.log(`[${where}] currentSlot=`, currentSlot, "progress=", progress, key, "=", localStorage.getItem(key))
  }

  hasRequiredItems(){
    const s1 = localStorage.getItem(this.slot+"1")
    const s2 = localStorage.getItem(this.slot+"2")
    const s3 = localStorage.getItem(this.slot+"3")
    const items = [s1, s2, s3]
    return items.includes("book1") && items.includes("book2")
  }
}

