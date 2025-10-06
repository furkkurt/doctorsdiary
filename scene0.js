var brightness = parseInt(localStorage.getItem("brightness")) ?? 5
var musicVolume = parseInt(localStorage.getItem("musicVol")) ?? 5
var sfxVolume = parseInt(localStorage.getItem("sfxVol")) ?? 5
var favNum = parseInt(localStorage.getItem("favNum")) ?? 5
var currentMusic = ""
var currentSlot = 0

class scene0 extends Phaser.Scene{
  constructor(){
    super("scene0")
  }

  create(){
    //diyalog sahnesi başladı diğer sahnelerde sadece get dicen galiba
    this.scene.launch("dialogueOverlay")
    this.scene.bringToTop("dialogueOverlay")
    this.dialogue = this.scene.get('dialogueOverlay');
    progress = 0;
    this.logProgress("scene0 start")

    let overlayDark = this.add.graphics();
    overlayDark.fillStyle(0x000000, 1);
    overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    overlayDark.setScrollFactor(0);
    overlayDark.setDepth(100)

    this.bigTextText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "", {fontFamily: "Moving", fontSize: "64px"}).setOrigin(0.5).setDepth(101);

    this.scene.launch("musicPlayer")
    this.musicPlayer = this.scene.get("musicPlayer")
    this.musicPlayer.playMusic("docsTheme")
    this.scene.launch("brightnessOverlay")
    this.brightness = this.scene.get("brightnessOverlay")
    this.scene.bringToTop("brightnessOverlay")


    this.bg1 = this.add.image(0,0,"testBg").setOrigin(0)
    this.bg2 = this.add.image(0,0,"testBgObjects").setOrigin(0)
    this.scaleFactor = this.scale.height/this.bg1.height
    this.bg1.setScale(this.scaleFactor)
    this.bg2.setScale(this.scaleFactor)
    this.player = this.physics.add.sprite(100,700,"doc").setDepth(99)
    this.player.play("docIdle")


    this.lamp = this.physics.add.sprite(0,0,"lamp").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()

    this.book1 = this.physics.add.sprite(0,0,"book1").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.book2 = this.physics.add.sprite(0,0,"book2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.drugs= this.physics.add.sprite(0,0,"drugs").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()

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
      } else {
        this.drugs.x = obj.x*this.scaleFactor
        this.drugs.y = obj.y*this.scaleFactor
      }
    });

    this.mapWidth = this.bg1.width * this.bg1.scaleX;
    this.mapHeight = this.bg1.height * this.bg1.scaleY;
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    //sekans
    this.time.delayedCall(1000, () => {
      this.bigText("Finally... ")
    })
    this.time.delayedCall(4000, () => {
      this.bigText("how long was it... ")
    })
    this.time.delayedCall(7000, () => {
      this.bigText("10 years? ")
    })
    this.time.delayedCall(8000, () => {
      this.bigText("20?")
    })
    this.time.delayedCall(10000, () => {
      this.bigText("üI don't remember...")
      this.time.delayedCall(2000, () => {
        this.time.addEvent({
          delay: 20,
          callback: () => {
            this.bigTextText.alpha -= 0.01
          }, repeat: 100
        })
      })
    })
    this.time.delayedCall(14000, () => {
      this.bigText("üI'm here at last...")
    })
    this.time.delayedCall(17000, () => {
      this.time.addEvent({
        delay: 20,
        callback: () => {
          this.bigTextText.alpha -= 0.01
        }, repeat: 100
      })
    })
    this.time.delayedCall(21000, () => {
      this.bigTextText.setFontSize("128px")
      this.bigTextText.text = "5 days left"
      this.time.addEvent({
        delay: 20,
        callback: () => {
          this.bigTextText.alpha += 0.01
        }, repeat: 100
      })
      this.time.delayedCall(23000, () => {
        this.time.addEvent({
          delay: 20,
          callback: () => {
            this.bigTextText.alpha -= 0.01
          }, repeat: 100
        })
      })
    })
    this.time.delayedCall(25000, () => {
      this.player.play("docWalk")
      this.musicPlayer.playSfx("walk")
      this.player.setVelocityX(200)
      this.time.addEvent({
        delay: 20,
        callback: () => {
          overlayDark.alpha -= 0.01
          this.bigTextText.alpha -= 0.01
        }, repeat: 100
      })
    })
    this.time.delayedCall(30000, () => {
      this.player.setVelocityX(0);
      this.player.play("docIdle")
      // Stop walking sound when player stops
      this.musicPlayer.stopAllSfx();
    })
    this.time.delayedCall(32000, () => {
      this.dialogue.dialogue("... ", "docPort", null, "1", null)
    })
    this.time.delayedCall(34000, () => {
      this.dialogue.dialogue("Better start working on my... ", "docPort", null, "1", null)
    })
    this.time.delayedCall(37000, () => {
      this.dialogue.dialogue("case here.", "docPort", null, "1", null)
    })
    this.time.delayedCall(40000, () => {
      this.time.addEvent({
        delay: 20,
        callback: () => {
          overlayDark.alpha += 0.01
          this.dialogue.dialogueBox.alpha -= .01
          this.dialogue.dialogueText.alpha -= .01
          if (this.dialogue.leftPortrait) this.dialogue.leftPortrait.alpha -= .01
          if (this.dialogue.rightPortrait) this.dialogue.rightPortrait.alpha -= .01
        }, repeat: 100
      })
    })
    this.time.delayedCall(42000, () => {this.scene.stop("inventoryOverlay");
      this.scene.stop("dialogueOverlay");
      this.scene.stop("musicPlayer");
      this.scene.start("scene1", {from: 0, currentSlot: currentSlot})
    })

  };


  pause(){
    this.scene.launch("menu", {from: this.scene.key})
    this.scene.pause()
    this.time.addEvent({delay: 10, callback: () => {this.stop();}})
  }

  logProgress(where){
    const key = currentSlot === 1 ? "firstSlotScene" : (currentSlot === 2 ? "secondSlotScene" : "thirdSlotScene")
    console.log(`[${where}] currentSlot=`, currentSlot, "progress=", progress, key, "=", localStorage.getItem(key))
  }

  bigText(text) {
    let i = 0;
    this.time.addEvent({
      delay: 50,
      callback: () => {
        if(text.charAt(i) != "ü"){
          this.bigTextText.text += text.charAt(i);
          //bunu buraya koymak şüpheli ama fadeler için yaptım
          this.bigTextText.alpha = 1
        }
        else
          this.bigTextText.text = ""
        i++
      }, repeat: text.length
    })
  }

  update(){
  }
}
