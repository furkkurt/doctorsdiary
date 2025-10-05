class scene4 extends Phaser.Scene{
  constructor(){
    super("scene4")
  }

  create(data){
    // Set the current slot from the passed data
    if (data && data.currentSlot !== undefined) {
      currentSlot = data.currentSlot;
    }
    // Do not force progress here; leave progression to author-driven events

    this.scene.launch("dialogueOverlay");
    this.scene.bringToTop("dialogueOverlay");
    this.dialogue = this.scene.get('dialogueOverlay');

    this.scene.launch("musicPlayer");
    this.musicPlayer = this.scene.get("musicPlayer");
    
    // Start playing docsTheme music
    this.musicPlayer.playMusic("docsTheme");

    let overlayDark = this.add.graphics();
    overlayDark.fillStyle(0x000000, 1);
    overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    overlayDark.setScrollFactor(0);
    overlayDark.setDepth(100)
    this.dialogue.fadeOut(overlayDark)
    this.logProgress("scene4 create")

    // Use bg6 and kidsRoom map
    this.bg = this.add.image(0,0,"bg6").setOrigin(0)
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.scaleFactor = this.mapWidth/this.bg.width

    // Doctor enters from the right side of the screen
    this.doctor = this.physics.add.sprite(this.mapWidth + 100, 1000, "doc").setDepth(99).setScale(this.scaleFactor).setScale(1.3)
    this.doctor.play("docIdle")
    this.doctor.flipX = true; // Face left (toward the room)

    // Load kidsRoom map and position kids sprite
    const map = this.make.tilemap({ key: 'kidsRoom' });
    console.log("Scene4 map loaded:", map);
    console.log("Scene4 available layers:", map.layers.map(layer => layer.name));
    
    const intLayer = map.getObjectLayer('interactive');
    console.log("Scene4 interactive layer found:", intLayer);
    
    if (intLayer && intLayer.objects) {
      console.log("Scene4 objects in interactive layer:", intLayer.objects);
      intLayer.objects.forEach(obj => {
        console.log("Scene4 processing object:", obj.name, "at", obj.x, obj.y);
        if (obj.name === 'kids') {
          // Add kids sprite at the position from the interactive layer
          this.kids = this.add.sprite(obj.x * this.scaleFactor, obj.y * this.scaleFactor, "kids").setScale(this.scaleFactor).setDepth(98);
          this.kids.play("kids1"); // Start with kids1 animation
          console.log("Kids sprite positioned at:", this.kids.x, this.kids.y);
        }
      });
    } else {
      console.error("Scene4: Interactive layer or objects not found!");
      // Default kids position if map loading fails
      this.kids = this.add.sprite(400 * this.scaleFactor, 300 * this.scaleFactor, "kids").setScale(this.scaleFactor).setDepth(98);
      this.kids.play("kids1"); // Start with kids1 animation
    }

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.doctor, true, 0.1, 0.1);

    // Movement input bindings
    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keyup-A", this.stop.bind(this));
    this.input.keyboard.on("keyup-D", this.stop.bind(this));
    this.input.keyboard.on("keydown-ESC", () => { if (!this.controlsLocked) { this.stop(); } });

    // Movement state
    this.isWalking = false
    this.walkingSound = null
    this.controlsLocked = false

    // Start the appropriate sequence
    if (progress === 9) {
      // Progress 9: kids hidden, doctor walks in, says a line, then player can move
      if (this.kids) this.kids.setVisible(false);
      this.controlsLocked = true;
      this.time.delayedCall(500, () => {
        this.doctor.setVelocityX(-200);
        this.doctor.play("docWalk");
        this.musicPlayer.playSfx("walk");
        this.time.delayedCall(1500, () => {
          this.doctor.setVelocityX(0);
          this.doctor.play("docIdle");
          this.musicPlayer.stopAllSfx();
          this.dialogue.dialogue("Huh... Where are they?", null, "docPort", null, "docPort1", "Doctor");
          this.time.delayedCall(1500, () => {
            this.dialogue.hideDialogue();
            this.controlsLocked = false;
          });
        });
      });
    } else {
      // Default: original cutscene
      this.startCutscene();
    }

    console.log("Scene4 created - cutscene ready for dialogue implementation");
  };

  startCutscene() {
    // Doctor stands there for a second
    this.time.delayedCall(2000, () => {
      // Doctor starts walking towards kids
      this.doctor.setVelocityX(-200);
      this.doctor.play("docWalk");
      this.musicPlayer.playSfx("walk")
      
      // Kids switch to kids2 animation when doctor starts walking
      this.time.delayedCall(6000, () => {
        this.kids.play("kids2");
      })
      
      // Doctor walks for a second
      this.time.delayedCall(7000, () => {
        // Doctor stops
        this.doctor.setVelocityX(0);
        this.doctor.play("docIdle");
        this.musicPlayer.stopAllSfx();
        
        // Wait another second, then start dialogue
        this.time.delayedCall(2000, () => {
          if (progress === 6) {
            this.startDialogueSequenceP6_Part1();
          } else {
            this.startDialogueSequence();
          }
        });
      });
    });
  }

  right() {
    if (this.controlsLocked) return;
    this.doctor.setVelocityX(500);
    this.doctor.play("docWalk", true)
    this.doctor.flipX = false
    this.dialogue.hideDialogue()
    if (!this.isWalking) {
      this.isWalking = true
      this.walkingSound = this.musicPlayer.playSfx("walk")
    }
  }

  left() {
    if (this.controlsLocked) return;
    this.doctor.setVelocityX(-500)
    this.doctor.play("docWalk", true)
    this.doctor.flipX = true
    this.dialogue.hideDialogue()
    if (!this.isWalking) {
      this.isWalking = true
      this.walkingSound = this.musicPlayer.playSfx("walk")
    }
  }

  stop() {
    this.doctor.setVelocity(0);
    this.doctor.play("docIdle")
    if (this.isWalking && this.walkingSound) {
      this.walkingSound.stop()
      this.walkingSound = null
      this.isWalking = false
    }
  }

  startDialogueSequence() {
    const dialogueArray = [
      // Dr – Hello there, child.
      { text: "Hello there, child.", leftPortrait: null, rightPortrait: "docPort", leftAnimation: null, rightAnimation: "docPort1", name: "Doctor" },
      
      // Aras – ...
      { text: "...", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Aras" },
      
      // Ayaz – ...Hello there..!
      { text: "...Hello there..!", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      
      // Dr – So, tell me about your daily life.
      { text: "So, tell me about your daily life.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      
      // Ay – Um... we... we like to draw!
      { text: "Um... we... we like to draw!", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      
      // Dr – I mean... how do you do your excretion and such?
      { text: "I mean... how do you do your excretion and such?", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      
      // Dr – ...Urination and bowel movements.
      { text: "...Urination and bowel movements.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      
      // "Damn, it's been long since I had a case with a child."
      { text: "\"Damn, it's been long since I had a case with a child.\"", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      
      // Ay – Ewww, that's gross.
      { text: "Ewww, that's gross.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      
      // Ar – Pff... snorts
      { text: "Pff... snorts", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Aras" },
      
      // Dr – Hm...
      { text: "Hm...", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      
      // Dr – Can the other one talk?
      { text: "Can the other one talk?", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      
      // Ay – Y-yeah! He's just shy sometimes.
      { text: "Y-yeah! He's just shy sometimes.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      
      // Dr – Interesting... scribbles something
      { text: "Interesting... scribbles something", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      
      // Ay – smiles nervously
      { text: "smiles nervously", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      
      // Ar – ... looks away
      { text: "... looks away", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Aras" },
      
      // Dr – Yeah, you guys don't share thoughts... since you don't share the same head and no connection through the thalamus. I thought I might ask anyway, haha.
      { text: "Yeah, you guys don't share thoughts... since you don't share the same head and no connection through the thalamus. I thought I might ask anyway, haha.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      
      // twins look at each other
      { text: "twins look at each other", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1" },
      
      // Ay – ...
      { text: "...", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      
      // Ay – ...Is it gonna hurt..?
      { text: "...Is it gonna hurt..?", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      
      // Aras nudges Ayaz
      { text: "Aras nudges Ayaz", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "" },
      
      // Ar – Ssshh!
      { text: "Ssshh!", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Aras" },
      
      // Ay – What! I gotta ask!?
      { text: "What! I gotta ask!?", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      
      // Dr – Huh?
      { text: "Huh?", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      
      // Ay – Nurse Aysa told us about the... tests...
      { text: "Nurse Aysa told us about the... tests...", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      
      // Dr – Oh, the tests are nothing invasive. It's gonna take one week. I'll be just monitoring you...
      { text: "Oh, the tests are nothing invasive. It's gonna take one week. I'll be just monitoring you...", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      
      // both kids look at him
      { text: "both kids look at him", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1" },
      
      // Dr – ....you ...guys. And some simple tests.
      { text: "....you ...guys. And some simple tests.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      
      // Dr – I'd love to meet your guys' nurse.
      { text: "I'd love to meet your guys' nurse.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      
      // Ay – She's a shy one too.
      { text: "She's a shy one too.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      
      // Dr – She was not in the nursing station.
      { text: "She was not in the nursing station.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      
      // Ay – I dunno.
      { text: "I dunno.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      
      // Dr – Hm... okay, let's give you guys' medication.
      { text: "Hm... okay, let's give you guys' medication.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" }
    ];

    this.dialogue.startDialogueSequence(dialogueArray, () => {
      console.log("Dialogue sequence completed!");
      this.startPostDialogueSequence();
    });
  }

  // Progress 6 alternative dialogue flow
  startDialogueSequenceP6_Part1() {
    const dialogueArray = [
      { text: "hello there kids, good morning.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      { text: "good morning doctor!", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      { text: "what uh, What are you guys drawing?", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      { text: "green trees!", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      { text: "looks green to me..!", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      { text: "you have a notebook, do you draw too mister doctor?", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      { text: "ah- um no i uh i take notes... in it.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      { text: "do u ever draw?", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      { text: "no, i mean. I used to at least.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      { text: "realy??!", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      { text: "...yeah.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      { text: "youre cooler than you seem mister doctor!", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      { text: "hah!... i suppose i can show you some of my old talents.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" }
    ];
      this.dialogue.startDialogueSequence(dialogueArray, () => {
      this.fadeToBlackAndBack(() => {
        this.startDialogueSequenceP6_Part2();
      });
    });
  }

  fadeToBlackAndBack(afterFadeCallback) {
    let overlayDark = this.add.graphics();
    overlayDark.fillStyle(0x000000, 1);
    overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    overlayDark.setScrollFactor(0);
    overlayDark.setDepth(100);
    overlayDark.alpha = 0;
    // Fade to black
    this.tweens.add({
      targets: overlayDark,
      alpha: 1,
      duration: 600,
      ease: 'Linear',
      onComplete: () => {
        this.time.delayedCall(400, () => {
          // Fade back
          this.tweens.add({
            targets: overlayDark,
            alpha: 0,
            duration: 600,
            ease: 'Linear',
            onComplete: () => {
              overlayDark.destroy();
              if (afterFadeCallback) afterFadeCallback();
            }
          });
        });
      }
    });
  }

  startDialogueSequenceP6_Part2() {
    const dialogueArray = [
      { text: "heh.. i still got it.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      { text: "woah. Where did you learn to draw like this mister doctor?", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      { text: "well... i wanted to study finearts actually.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      { text: "why didnt you?", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      { text: "its... but of a long story. sad", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      { text: "hm...do you only draw with black?", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      { text: "wel... i like it like this", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      { text: "its so gloomy.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      { text: "...", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      { text: "well im gonna give you a homework mister doctor! Make a colorfull drawing. U can borrow our creyons.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" },
      { text: "you little rascals. Fine", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      { text: "let me give you guys your meds. Time to rest.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" }
    ];
    this.dialogue.startDialogueSequence(dialogueArray, () => {
      this.startPostDialogueSequence();
    });
  }

  startPostDialogueSequence() {
    // Create overlayDark for screen fade
    let overlayDark = this.add.graphics();
    overlayDark.fillStyle(0x000000, 1);
    overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    overlayDark.setScrollFactor(0);
    overlayDark.setDepth(100);
    overlayDark.alpha = 0;

    // Fade in the dark overlay
    this.tweens.add({
      targets: overlayDark,
      alpha: 1,
      duration: 1000,
      ease: 'Linear',
      onComplete: () => {
        // Move sprites during black screen
        this.repositionSprites();
        
        // Wait a bit, then fade out
        this.time.delayedCall(1000, () => {
          this.tweens.add({
            targets: overlayDark,
            alpha: 0,
            duration: 1000,
            ease: 'Linear',
            onComplete: () => {
              // Start final dialogue sequence
              this.startFinalDialogue();
            }
          });
        });
      }
    });
  }

  repositionSprites() {
    // Find kids2 object in interactive layer and move kids sprite there
    const map = this.make.tilemap({ key: 'kidsRoom' });
    const intLayer = map.getObjectLayer('interactive');
    
    if (intLayer && intLayer.objects) {
      intLayer.objects.forEach(obj => {
        if (obj.name === 'kids2') {
          // Move kids sprite to kids2 position
          this.kids.setPosition(obj.x * this.scaleFactor, obj.y * this.scaleFactor);
          console.log("Kids moved to kids2 position:", this.kids.x, this.kids.y);
        }
      });
    }
    
    // Move doctor to +300 x from kids position, same y
    const doctorNewX = this.kids.x + 700;
    this.doctor.setPosition(doctorNewX, this.doctor.y);
    console.log("Doctor moved to:", this.doctor.x, this.doctor.y);
  }

  startFinalDialogue() {
    const finalDialogueArray = [
      { text: "Well, rest for the rest of today.", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort3", rightAnimation: "docPort1", name: "Doctor" },
      { text: "Okay!", leftPortrait: "kidsPort", rightPortrait: "docPort", leftAnimation: "kidsPort2", rightAnimation: "docPort1", name: "Ayaz" }
    ];

    this.dialogue.startDialogueSequence(finalDialogueArray, () => {
      console.log("Final dialogue completed!");
      this.exitToScene3();
    });
  }

  exitToScene3() {
    // Flip doctor to face left (towards door)
    this.doctor.flipX = false;
    
    // Make doctor walk back to door
    this.doctor.setVelocityX(200);
    this.doctor.play("docWalk");
    
    // Play walking sound
    this.musicPlayer.playSfx("walk");
    
    // Stop when reaching the right edge of screen
    this.time.addEvent({
      delay: 100,
      callback: () => {
        if (this.doctor.x > this.mapWidth - 50) {
          this.doctor.setVelocityX(0);
          this.doctor.play("docIdle");
          
          // Stop walking sound and play door sound
          this.musicPlayer.stopAllSfx();
          this.musicPlayer.playDoorSfx("door");
          
          // progress 6 to 7 (author-controlled; leave as-is but fix typo)
          if(progress == 6)
            progress = 7


          // Transition to scene3
          this.scene.stop("dialogueOverlay");
          this.scene.stop("musicPlayer");
          this.scene.start("scene3", {
            from: 4,
            currentSlot: currentSlot
          });
        }
      },
      repeat: -1
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
      this.scene.start("scene3", {
        from: 4,
        currentSlot: currentSlot
      });
    });
  }

  update(){
  if ((this.doctor.x > this.mapWidth - 50 && !this.isTransitioning) && this.controlsLocked == false){
       this.startDoorTransition();
    }
  }
}
