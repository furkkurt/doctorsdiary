class scene8 extends baseScene{
  constructor(){
    super("scene8")
  }

  create(data){
    // Check for progress 9 cutscene
    if (progress == 7) {
      this.startProgress7Cutscene();
      return;
    }
    // Set the current slot from the passed data
    if (data && data.currentSlot !== undefined) {
      currentSlot = data.currentSlot;
    }
    this.itemSelector()
    
    this.scene.launch("dialogueOverlay");
    this.scene.bringToTop("dialogueOverlay");
    this.scene.launch("inventoryOverlay");
    this.inventory = this.scene.get("inventoryOverlay");
    this.time.delayedCall(1000, () => {
      this.scene.bringToTop("inventoryOverlay");
    })
    this.dialogue = this.scene.get('dialogueOverlay');

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

    this.bg = this.add.image(0,0,"bg8").setOrigin(0)
    this.scaleFactor = this.scale.height/this.bg.height
    this.bg.setScale(this.scaleFactor)
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.player = this.physics.add.sprite(this.mapWidth - 400,650,"doc").setDepth(99).setScale(1)
    this.player.play("docIdle")
    this.player.flipX = true

    this.tree = this.physics.add.sprite(0,0,"tree").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable().setVisible(false)
    this.objects = [this.tree]


    const map = this.make.tilemap({ key: 'garden' });
    const intLayer = map.getObjectLayer('interactive');
    if (intLayer && intLayer.objects) {
      intLayer.objects.forEach(obj => {
        if (obj.name === 'tree') {
          this.tree.x = obj.x * this.scaleFactor;
          this.tree.y = obj.y * this.scaleFactor;
        }
      });
    }

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keydown-E", () => {
      switch(this.selectedItem){
        case "NaN":
          break;
        case this.tree:
          this.dialogue.dialogue("I wonder how old the tree is...", "docPort", null, "1", null, "Doctor");
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
    this.startScene("scene6", {
      from: 8,
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

  startProgress7Cutscene() {
    // Set up basic scene elements
    this.scene.launch("dialogueOverlay");
    this.scene.bringToTop("dialogueOverlay");
    this.dialogue = this.scene.get('dialogueOverlay');
    
    this.musicPlayer = this.scene.get("musicPlayer");
    this.isWalking = false;
    this.walkingSound = null;
    this.isTransitioning = false;
    
    // Set up scene
    this.bg = this.add.image(0,0,"bg8").setOrigin(0);
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.scaleFactor = this.mapWidth/this.bg.width;
    
    // Create kids sprite in the middle
    this.kids = this.add.sprite(this.mapWidth/2, 1000, "kids").setDepth(98).setScale(this.scaleFactor);
    this.kids.play("kids1");
    
    // Create doctor sprite
    this.player = this.physics.add.sprite(this.mapWidth - 400, 1000, "doc").setDepth(99).setScale(1);
    this.player.play("docIdle");
    this.player.flipX = true;
    
    // Set up camera
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);
    
    // Start the sequence
    this.time.delayedCall(1000, () => {
      // Doctor walks towards kids
      this.player.play("docWalk");
      this.player.setVelocityX(-300);
      this.musicPlayer.playSfx("walk");
      
      // Stop after a bit and start dialogue
      this.time.delayedCall(4000, () => {
        this.player.setVelocityX(0);
        this.player.play("docIdle");
        this.musicPlayer.stopAllSfx();
        this.startDialogueSequence();
      });
    });
  }

  startDialogueSequence() {
    const dialogueArray = [
      { text: "good morning kids.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: null, name: "Doctor" },
      { text: "good morning mister doctor", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: "13", name: "Ayaz" },
      { text: "reconnecting with nature i see.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: null, name: "Doctor" },
      { text: "yeah aras realy likes to go outside", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: null, rightAnimation: "3", name: "Ayaz" },
      { text: "does he now?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: null, name: "Doctor" },
      { text: "...yeah.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: null, rightAnimation: "16", name: "Aras" },
      { text: "im so glad to hear you talk, boy.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: null, name: "Doctor" },
      { text: "...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: null, rightAnimation: "15", name: "Aras" },
      { text: "well... it used to be better. I mean the nature.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: null, name: "Doctor" },
      { text: "...realy?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: null, rightAnimation: "17", name: "Aras" },
      { text: "yeah... the grass was greener, the air was more clear.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: null, name: "Doctor" },
      { text: "...before the war heartache...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: null, name: "Doctor" },
      { text: "...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: null, rightAnimation: "1", name: "Aras" },
      { text: "*kids start to caugh*", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: null, rightAnimation: null },
      { text: "okay better go inside kids. Its cold out here.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: null, name: "Doctor" },
      { text: "...okay.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: null, rightAnimation: "6", name: "Ayaz" }
    ];
    
    this.dialogue.startDialogueSequence(dialogueArray, () => {
      // After dialogue ends, fade to black and transition to scene1
      this.overlayDark = this.add.graphics();
      this.overlayDark.fillStyle(0x000000, 1);
      this.overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
      this.overlayDark.setScrollFactor(0);
      this.overlayDark.setDepth(100);
      this.overlayDark.alpha = 0;
      
      //bahçe kısmı bitince progress 8 yapalım
      progress = 8;
      this.dialogue.fadeIn(this.overlayDark, 1000);
      this.startScene("scene1", {
        from: 8,
        currentSlot: currentSlot
      }, 1500);
    });
  }

  update() {
    // Transition to scene3 when reaching the right edge
    if (this.player.x > this.mapWidth - 300 && !this.isTransitioning) {
      this.startDoorTransition();
    }
    if (this.player.x < 50){
      this.stop();
      this.player.x += 10
      return;
    }
  }
}
