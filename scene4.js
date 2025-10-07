class scene4 extends baseScene{
  constructor(){
    super("scene4")
  }

  create(data){
    this.tutorText.setVisible(false)
    console.log("Scene4 created");
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
    if(this.musicPlayer.currentMusic == "")
      this.musicPlayer.playMusic("docsTheme")
    this.scene.bringToTop("musicPlayer")
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
    this.scaleFactor = this.scale.height/this.bg.height
    this.bg.setScale(this.scaleFactor)
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;

    // Doctor enters from the right side of the screen
    this.doctor = this.physics.add.sprite(this.mapWidth + 100, 680, "doc").setDepth(99).setScale(this.scaleFactor).setScale(1.1)
    console.log("Doctor positioned at:", this.doctor.x, this.doctor.y);
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
          this.kids = this.add.sprite(obj.x * this.scaleFactor, obj.y * this.scaleFactor-30, "kids").setScale(this.scaleFactor).setDepth(98).setScale(.8);
          this.kids.play("kids1"); // Start with kids1 animation
          console.log("Kids sprite positioned at:", this.kids.x, this.kids.y);
        }
      });
    } else {
      console.error("Scene4: Interactive layer or objects not found!");
      // Default kids position if map loading fails
      this.kids = this.add.sprite(400 * this.scaleFactor, 300 * this.scaleFactor-30, "kids").setScale(this.scaleFactor).setDepth(98).setScale(.8);
      this.kids.play("kids1"); // Start with kids1 animation
    }

    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.doctor, true, 0.1, 0.1);

    // Movement input bindings

    if(progress == 7){
    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keyup-A", this.stop.bind(this));
    this.input.keyboard.on("keyup-D", this.stop.bind(this));
    this.input.keyboard.on("keydown-ESC", () => this.stop() );
    }

    // Movement state
    this.isWalking = false
    this.walkingSound = null
    this.controlsLocked = false

    // Start the appropriate sequence
    if (progress == 14) {
      // Progress 14: Final choice sequence
      this.startProgress14Sequence();
    } else if (progress == 11) {
      // Progress 11: Special dialogue sequence
      this.startProgress11Sequence();
    } else if (progress == 7) {
      // Progress 7: kids hidden, doctor walks in, says a line, then player can move
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
      this.time.delayedCall(5000, () => {
        // Doctor stops
        this.doctor.setVelocityX(0);
        this.doctor.play("docIdle");
        this.musicPlayer.stopAllSfx();
        
        // Wait another second, then start dialogue
        this.time.delayedCall(2000, () => {
          if (progress == 4) {
            this.startDialogueSequenceP4_Part1();
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
      // Ayaz – ...Hello there..! (5)
      { text: "...Hello there..!", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "5", name: "Ayaz" },
      
      // Dr – So, tell me about your daily life. (7)
      { text: "So, tell me about your daily life.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "7", rightAnimation: "5", name: "Doctor", onStart: () => this.musicPlayer.playSfx("paper") },
      
      // Ay – Um... we... we like to draw! (4)
      { text: "Um... we... we like to draw!", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "7", rightAnimation: "4", name: "Ayaz" },
      
      // Dr – I mean... how do you do your excretion and such? (7)
      { text: "I mean... how do you do your excretion and such?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "7", rightAnimation: "4", name: "Doctor" },
      
      // Ay- ...? (6)
      { text: "...?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "7", rightAnimation: "6", name: "Ayaz" },
      
      // Dr – ...Urination and bowel movements. (6)
      { text: "...Urination and bowel movements.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "6", name: "Doctor" },
      
      // Ay – Ewww, that's gross. (5)
      { text: "Ewww, that's gross.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "5", name: "Ayaz" },
      
      // Ar – Pff... snorts (10)
      { text: "Pff... *snorts*", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "10", name: "Aras" },
      
      // Dr – Hm... (1)
      { text: "Hm...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "10", name: "Doctor" },
      
      // Dr – Can the other one talk? (7)
      { text: "Can the other one talk?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "7", rightAnimation: "10", name: "Doctor" },
      
      // Ay – Y-yeah! He's just shy sometimes. (3)
      { text: "Y-yeah! He's just shy sometimes.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "7", rightAnimation: "3", name: "Ayaz" },
      
      // Dr – Interesting... scribbles something (7)
      { text: "Interesting... *scribbles something*", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "7", rightAnimation: "3", name: "Doctor" },
      
      // Ay – ...(2)
      { text: "...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "7", rightAnimation: "2", name: "Ayaz" },
      
      // Ar – ... (11)
      { text: "...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "7", rightAnimation: "11", name: "Aras" },
      
      // Dr – Yeah, you guys don't share thoughts... since you don't share the same head and no connection through the thalamus. I thought I might ask anyway, haha. (6)
      { text: "Yeah, you guys don't share thoughts... since you don't share the same head and no connection through the thalamus. I thought I might ask anyway, haha.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "11", name: "Doctor" },
      
      // Ay – ... (1)
      { text: "...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "1", name: "Ayaz" },
      
      // Ay – ...Is it gonna hurt..? (6)
      { text: "...Is it gonna hurt..?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "6", name: "Ayaz" },
      
      // Ar – Ssshh! (14)
      { text: "Ssshh!", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "14", name: "Aras" },
      
      // Ay – What! I gotta ask!? (14)
      { text: "What! I gotta ask!?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "14", name: "Ayaz" },
      
      // Dr – Huh? (2)
      { text: "Huh?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "2", rightAnimation: "14", name: "Doctor" },
      
      // Ay – Nurse Aysa told us about the... tests... (7)
      { text: "Nurse Aysa told us about the... tests...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "2", rightAnimation: "7", name: "Ayaz" },
      
      // Dr – Oh, the tests are nothing invasive. It's gonna take one week. I'll be just monitoring you... (2)
      { text: "Oh, the tests are nothing invasive. It's gonna take one week. I'll be just monitoring you...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "2", rightAnimation: "7", name: "Doctor" },
      
      // Ay- ...- (9)
      { text: "...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "2", rightAnimation: "9", name: "Ayaz" },
      
      // Dr – ....you ...guys. And some simple tests. (6)
      { text: "....you ...guys. And some simple tests.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "9", name: "Doctor" },
      
      // Ay-... (2)
      { text: "...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "2", name: "Ayaz" },
      
      // Ar-...... (12)
      { text: "......", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "12", name: "Aras" },
      
      // Dr – ...I'd love to meet your guys' nurse. (2)
      { text: "...I'd love to meet your guys' nurse.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "2", rightAnimation: "12", name: "Doctor" },
      
      // Ay – She's a shy one too. (6)
      { text: "She's a shy one too.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "2", rightAnimation: "6", name: "Ayaz" },
      
      // Dr – She was not in the nursing station. (7)
      { text: "She was not in the nursing station.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "7", rightAnimation: "6", name: "Doctor" },
      
      // Ay – I dunno. (7)
      { text: "I dunno.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "7", rightAnimation: "7", name: "Ayaz" },
      
      // Dr – Hm... okay, let's give you guys' medication. (6)
      { text: "Hm... okay, let's give you guys' medication.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "7", name: "Doctor" }
    ];

    this.dialogue.startDialogueSequence(dialogueArray, () => {
      console.log("Dialogue sequence completed!");
      this.startPostDialogueSequence();
    });
  }

  // Progress 6 alternative dialogue flow
  startDialogueSequenceP4_Part1() {
    const dialogueArray = [
      { text: "hello there kids, good morning.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "3", name: "Doctor" },
      { text: "good morning doctor!", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "3", name: "Ayaz" },
      { text: "what uh, What are you guys drawing?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "3", name: "Doctor" },
      { text: "green trees!", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "4", name: "Ayaz" },
      { text: "looks green to me..!", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: "4", name: "Doctor" },
      { text: "you have a notebook, do you draw too mister doctor?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: "3", name: "Ayaz" },
      { text: "ah- um no i uh i take notes... in it.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "3", name: "Doctor" },
      { text: "do u ever draw?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "7", name: "Ayaz" },
      { text: "no, i mean. I used to at least.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "7", name: "Doctor" },
      { text: "realy??!", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "13", name: "Ayaz" },
      { text: "...yeah.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: "13", name: "Doctor" },
      { text: "youre cooler than you seem mister doctor!", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: "3", name: "Ayaz" },
      { text: "hah!... i suppose i can show you some of my old talents.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "3", name: "Doctor" }
    ];
      this.dialogue.startDialogueSequence(dialogueArray, () => {
      this.fadeToBlackAndBack(() => {
        this.startDialogueSequenceP4_Part2();
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

  startDialogueSequenceP4_Part2() {
    const dialogueArray = [
      { text: "heh.. i still got it.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: "3", name: "Doctor" },
      { text: "woah. Where did you learn to draw like this mister doctor?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: "3", name: "Ayaz" },
      { text: "well... i wanted to study finearts actually.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "3", name: "Doctor" },
      { text: "why didnt you?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "7", name: "Ayaz" },
      { text: "its... but of a long story.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "7", rightAnimation: "7", name: "Doctor" },
      { text: "hm...do you only draw with black?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "7", rightAnimation: "6", name: "Ayaz" },
      { text: "wel... i like it like this", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "2", rightAnimation: "6", name: "Doctor" },
      { text: "its so gloomy.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "2", rightAnimation: "6", name: "Ayaz" },
      { text: "...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "8", rightAnimation: "6", name: "Doctor" },
      { text: "well im gonna give you a homework mister doctor! Make a colorfull drawing. U can borrow our creyons.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "8", rightAnimation: "13", name: "Ayaz" },
      { text: "you little rascals. Fine", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "6", rightAnimation: "13", name: "Doctor" },
      { text: "let me give you guys your meds. Time to rest.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "4", rightAnimation: "13", name: "Doctor" }
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
    
    /**
    if (intLayer && intLayer.objects) {
      intLayer.objects.forEach(obj => {
        if (obj.name === 'kids2') {
          // Move kids sprite to kids2 position
          this.kids.setPosition(obj.x * this.scaleFactor, obj.y * this.scaleFactor);
          console.log("Kids moved to kids2 position:", this.kids.x, this.kids.y);
        }
      });
    }
    */ 
    this.kids.setVisible(false)
    this.bg.setTexture("bg62")
    // Move doctor to +300 x from kids position, same y
    const doctorNewX = 1200;
    this.doctor.setPosition(doctorNewX, this.doctor.y);
    console.log("Doctor moved to:", this.doctor.x, this.doctor.y);
  }

  startFinalDialogue() {
    const finalDialogueArray = [
      { text: "Well, rest for the rest of today.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "2", rightAnimation: null, name: "Doctor" },
      { text: "Okay!", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: null, rightAnimation: "4", name: "Ayaz" }
    ];

    this.dialogue.startDialogueSequence(finalDialogueArray, () => {
      console.log("Final dialogue completed!");
      this.exitToScene3();
    });
  }

  exitToScene3() {
    //çocukların odadan çıkınca progressi 2 yapalım
    if(progress == 1)
      progress = 2
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
          
          //çıkarken progress 4 to 5 yapalım
          if(progress == 4)
            progress = 5


          // Transition to scene3
          this.startScene("scene3", {
            from: 4,
            currentSlot: currentSlot
          }, 1000);
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
      this.scene.stop("dialogueOverlay");
      this.scene.start("scene3", {
        from: 4,
        currentSlot: currentSlot
      });
    });
  }

  startProgress14Sequence() {
    this.controlsLocked = true;
    
    // Start by walking left
    this.doctor.flipX = true;
    this.doctor.setVelocityX(-200);
    this.doctor.play("docWalk");
    this.musicPlayer.playSfx("walk");
    
    // After walking for a few seconds, stop and start dialogue
    this.time.delayedCall(5000, () => {
      this.doctor.setVelocityX(0);
      this.doctor.play("docIdle");
      this.musicPlayer.stopAllSfx();
      
      // Hide kids sprite for this sequence
      if (this.kids) {
        this.kids.setVisible(true);
      }
      
      // Start dialogue sequence
      const dialogueArray = [
        { text: "g-good morning kids...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Doctor" },
        { text: "good *caugh* morning mister doctor..!", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "2", name: "Ayaz" },
        { text: "...good morning...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Aras" },
        { text: "well... how, how are you... guys...?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Doctor" },
        { text: "we've been *caugh* better.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "2", name: "Ayaz" },
        { text: "yeah.......", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Doctor" },
        { text: "i have to talk to you guys about something... something you already know.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Doctor" },
        { text: "you know... you guys both have just one heart. Yeah?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Doctor" },
        { text: "yeah.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "2", name: "Ayaz" },
        { text: "and... one heart is not enough to... keep you guys both... alive.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Doctor" },
        { text: "......yeah.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "2", name: "Ayaz" },
        { text: "and theres no energy to power any machine to keep you guys blood pomping anymore...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Doctor" },
        { text: "...............", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "2", name: "Ayaz" },
        { text: "are... are we gonna die....?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "2", name: "Ayaz" },
        { text: "well.......... you guys have to decide... whos gonna live. Cause. One heart is enough for only one body....", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Doctor" },
        { text: "we.... we cant do that... no........", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "2", name: "Ayaz" },
        { text: "...we cant kill each other...", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Aras" },
        { text: "can... can you decide.... mister doctor?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "2", name: "Ayaz" },
        { text: "me..?", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Doctor" },
        { text: "no... no i cant do that.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Doctor" },
        { text: "we cant kill each other.", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Aras" },
        { text: "...........", leftPortrait: "docPort", rightPortrait: "kidsPort", leftAnimation: "1", rightAnimation: "3", name: "Doctor" }
      ];
      
      this.dialogue.startDialogueSequence(dialogueArray, () => {
        // After dialogue, show choice buttons
        const buttonStyle = {
          fontFamily: "Moving",
          fontSize: "48px",
          color: "#ffffff",
          stroke: "#000000",
          strokeThickness: 4,
          backgroundColor: "#000000",
          padding: { x: 20, y: 10 }
        };
        
        // Create buttons
        const keepArasBtn = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, "Keep Aras alive", buttonStyle)
          .setOrigin(0.5)
          .setScrollFactor(0)
          .setDepth(101)
          .setInteractive();
          
        const keepAyazBtn = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Keep Ayaz alive", buttonStyle)
          .setOrigin(0.5)
          .setScrollFactor(0)
          .setDepth(101)
          .setInteractive();
          
        const fixBtn = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY + 100, "I can fix this", buttonStyle)
          .setOrigin(0.5)
          .setScrollFactor(0)
          .setDepth(101)
          .setInteractive();
        
        // Add click handlers
        const startExitSequence = () => {
           // Stand still for a second
           this.time.delayedCall(1000, () => {
             // Update progress to 13
             progress = 15;

          // Doctor walks right
          this.doctor.flipX = false;
          this.doctor.setVelocityX(200);
          this.doctor.play("docWalk");
          this.musicPlayer.playSfx("walk");
          
          // When reaching right edge, transition to scene1
          this.time.addEvent({
            delay: 100,
            callback: () => {
              if (this.doctor.x > this.mapWidth - 50) {
                this.doctor.setVelocityX(0);
                this.doctor.play("docIdle");
                this.musicPlayer.stopAllSfx();
                
                   // Play door sound and transition
                   this.musicPlayer.playDoorSfx("door");
                this.scene.stop("dialogueOverlay");
                this.scene.stop("musicPlayer");
                   this.scene.start("scene3", {
                  from: 4,
                  currentSlot: currentSlot
                });
              }
            },
            loop: true
             });
          });
        };

        keepArasBtn.on('pointerdown', () => {
          // Save ending to localStorage based on current slot
          const slotPrefix = currentSlot === 1 ? "first" : (currentSlot === 2 ? "second" : "third");
          localStorage.setItem(`${slotPrefix}SlotEnding`, "keepAras");
          window.ending = "keepAras";
          keepArasBtn.destroy();
          keepAyazBtn.destroy();
          fixBtn.destroy();
          
          // Show final dialogue then exit
          this.dialogue.dialogue("...we wont blame you.", null, "kidsPort", null, "2", "Ayaz");
          this.time.delayedCall(2000, () => {
            this.dialogue.hideDialogue();
            startExitSequence();
          });
        });
        
        keepAyazBtn.on('pointerdown', () => {
          // Save ending to localStorage based on current slot
          const slotPrefix = currentSlot === 1 ? "first" : (currentSlot === 2 ? "second" : "third");
          localStorage.setItem(`${slotPrefix}SlotEnding`, "keepAyaz");
          window.ending = "keepAyaz";
          keepArasBtn.destroy();
          keepAyazBtn.destroy();
          fixBtn.destroy();
          
          // Show final dialogue then exit
          this.dialogue.dialogue("...we wont blame you.", null, "kidsPort", null, "2", "Ayaz");
          this.time.delayedCall(2000, () => {
            this.dialogue.hideDialogue();
            startExitSequence();
          });
        });
        
        fixBtn.on('pointerdown', () => {
          // Save ending to localStorage based on current slot
          const slotPrefix = currentSlot === 1 ? "first" : (currentSlot === 2 ? "second" : "third");
          localStorage.setItem(`${slotPrefix}SlotEnding`, "fix");
          window.ending = "fix";
          keepArasBtn.destroy();
          keepAyazBtn.destroy();
          fixBtn.destroy();
          
          // Show final dialogue then exit
          this.dialogue.dialogue("we trust you...", null, "kidsPort", null, "2", "Ayaz");
          this.time.delayedCall(2000, () => {
            this.dialogue.hideDialogue();
            startExitSequence();
          });
        });
      });
    });
  }

  startProgress11Sequence() {
    this.controlsLocked = true;
    
    // Start by walking left
    this.doctor.flipX = true;
    this.doctor.setVelocityX(-300);
    this.doctor.play("docWalk");
    this.musicPlayer.playSfx("walk");
    
    // After walking for a few seconds, stop and start dialogue
    this.time.delayedCall(2000, () => {
      this.doctor.setVelocityX(0);
      this.doctor.play("docIdle");
      this.musicPlayer.stopAllSfx();
      
      // Start dialogue sequence
      const seq = [
        { text: "how you guys feeling", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "1", rightAnimation: null, name: "Doctor" },
        { text: "good", leftPortrait: null, rightPortrait: "kidsPort", leftAnimation: null, rightAnimation: "5", name: "Ayaz" },
        { text: "caugh caugh", leftPortrait: null, rightPortrait: "kidsPort", leftAnimation: null, rightAnimation: null, name: "Ayaz", onStart: () => this.kids.play("kidsCough") },
        { text: "...", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "9", rightAnimation: null, name: "Doctor" },
        { text: "... you guys- stay... here.", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "1", rightAnimation: null, name: "Doctor", onComplete: () => {
          // After this line, make doctor walk right
                      this.doctor.flipX = false;
                      this.doctor.setVelocityX(200);
                      this.doctor.play("docWalk");
                      this.musicPlayer.playSfx("walk");
                      
          // Stop after a bit
                      this.time.delayedCall(1000, () => {
                        this.doctor.setVelocityX(0);
                        this.doctor.play("docIdle");
                        this.musicPlayer.stopAllSfx();
          });
        }},
        { text: "we will be better promise.", leftPortrait: null, rightPortrait: "kidsPort", leftAnimation: null, rightAnimation: "18", name: "Aras" },
        { text: "so we can go outside and play this time", leftPortrait: null, rightPortrait: "kidsPort", leftAnimation: null, rightAnimation: "16", name: "Ayaz" },
        { text: ".............", leftPortrait: "docPort", rightPortrait: null, leftAnimation: "9", rightAnimation: null, name: "Doctor" }
      ];
      
      this.startDialogueWhenReady(seq, () => {
        // Stand still for a second
        this.time.delayedCall(1000, () => {
          // Start walking right
          this.doctor.flipX = false;
          this.doctor.setVelocityX(200);
          this.doctor.play("docWalk");
          this.musicPlayer.playSfx("walk");

          // Update progress to 12
          progress = 12;

          // Check for reaching the right edge
          this.time.addEvent({
            delay: 100,
            callback: () => {
              if (this.doctor.x > this.mapWidth - 50) {
                this.doctor.setVelocityX(0);
                this.doctor.play("docIdle");
                this.musicPlayer.stopAllSfx();
                
                // Play door sound and transition
                this.musicPlayer.playDoorSfx("door");
                                    this.scene.stop("dialogueOverlay");
                                    this.scene.stop("musicPlayer");
                this.scene.start("scene3", {
                                      from: 4,
                                      currentSlot: currentSlot
                });
              }
            },
            loop: true
          });
        });
      });
    });
  }

  startDialogueWhenReady(seq, onDone) {
    const tryStart = () => {
      if (this.dialogue && this.dialogue.dialogueBox && this.dialogue.dialogueText && this.dialogue.scene.isActive()) {
        this.dialogue.startDialogueSequence(seq, onDone);
        return true;
      }
      return false;
    };
    
    if (!tryStart()) {
      this.time.addEvent({ delay: 100, callback: () => { if (!tryStart()) this.time.addEvent({ delay: 100, callback: tryStart }) } });
    }
  }

  update(){
    if ((this.doctor.x > this.mapWidth - 50 && !this.isTransitioning) && (this.controlsLocked == false && progress == 7)){
      this.startDoorTransition();
    }
  }
}
