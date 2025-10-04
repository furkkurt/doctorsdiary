class scene1 extends Phaser.Scene{
  constructor(){
    super("scene1")
  }

  create(){
    //parlaklık şeysi (BUNA GEREK VAR MI BİLMİYORUM)
    this.scene.get('OverlayScene');
    this.dialogue = this.scene.launch('dialogueOverlay');
    this.dialogue = this.scene.get('dialogueOverlay');
    this.scene.launch("inventoryOverlay");
    this.inventory = this.scene.get("inventoryOverlay");
    console.log("Inventory scene:", this.inventory); // Debug log
    this.scene.bringToTop("inventoryOverlay");
    this.scene.bringToTop("dialogueOverlay")
    this.selectedItem = "NaN"

    let overlayDark = this.add.graphics();
    overlayDark.fillStyle(0x000000, 1);
    overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    overlayDark.setScrollFactor(0);
    overlayDark.setDepth(100)

    this.time.addEvent({
      delay: 10,
      callback: () => {overlayDark.alpha -= .01}, repeat: 100
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
    this.book1.on("pointerover", () => {this.book1.setTexture("book12")})
    this.book1.on("pointerout", () => {this.book1.setTexture("book1")})

    //günlük
    this.book2 = this.physics.add.sprite(0,0,"book2").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.book2.setInteractive()
    this.book2.on("pointerdown", () => {this.inventory.pick(this.book2)})
    this.book2.on("pointerover", () => {this.book2.setTexture("book22")})
    this.book2.on("pointerout", () => {this.book2.setTexture("book2")})

    this.drugs= this.physics.add.sprite(0,0,"drugs").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.drugs.setInteractive()
    this.drugs.on("pointerdown", () => {this.inventory.pick(this.drugs)})
    this.drugs.on("pointerover", () => {this.drugs.setTexture("drugs2")})
    this.drugs.on("pointerout", () => {this.drugs.setTexture("drugs")})


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
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    //tutorial şeysi
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

    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keydown-E", () => {
      console.log(this.selectedItem)
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
          this.inventory.pick(this.selectedItem, false, "I don't need them right now.", this.dialogue);
          break;
        case this.window:
          this.inventory.pick(this.selectedItem, false, "Brighter than ever!", this.dialogue);
          break;
        case this.shelf:
          this.inventory.pick(this.selectedItem, false, "I lost my habbit of reading...", this.dialogue);
          break;
        case this.chair:
          this.inventory.pick(this.selectedItem, false, "I wonder if there is anyone left to host in my office.", this.dialogue);
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
  }
  right() {
    this.player.setVelocityX(500);
    this.player.play("docWalk", true)
    this.player.flipX = false
    this.dialogue.hideDialogue()
  }

  left() {
    this.player.setVelocityX(-500)
    this.player.play("docWalk", true)
    this.player.flipX = true
    this.dialogue.hideDialogue()
  }

  stop() {
    this.player.setVelocity(0);
    this.player.play("docIdle")
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
          if (index < 3) { //that means its a pickable :)
            let hoverTexture = ["book12", "book22", "drugs2"][index]
            this.book1.setTexture("book1")
            this.book2.setTexture("book2")
            this.drugs.setTexture("drugs")
            nearestObject.setTexture(hoverTexture)
          }
          this.selectedItem = nearestObject
        } else {
          this.selectedItem = "NaN"
          this.book1.setTexture("book1")
          this.book2.setTexture("book2")
          this.drugs.setTexture("drugs")
        }

      }, loop: true
    })
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
    if (this.player.x > 1400)
      this.tutorText2.paused = false
  }
}
