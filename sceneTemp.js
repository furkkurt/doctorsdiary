class scene0 extends Phaser.Scene{
  constructor(){
    super("scene0")
  }

  create(){
    this.scene.launch("dialogueOverlay")
    this.scene.bringToTop("dialogueOverlay")
    this.dialogue = this.scene.get('dialogueOverlay');

    let overlayDark = this.add.graphics();
    overlayDark.fillStyle(0x000000, 1);
    overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    overlayDark.setScrollFactor(0);
    overlayDark.setDepth(100)
    this.dialogue.fadeOut(overlayDark)

    this.musicPlayer = this.scene.get("musicPlayer")

    this.bg = this.add.image(0,0,"testBg").setOrigin(0)
    this.scaleFactor = this.scale.height/this.bg1.height
    this.player = this.physics.add.sprite(100,700,"doc").setDepth(99)
    this.player.play("docIdle")

    const map = this.make.tilemap({ key: 'room1' });
    const intLayer = map.getObjectLayer('interactive');
    intLayer.objects.forEach(obj => {
      if (obj.name === 'lamp') {
        this.lamp.x = obj.x*this.scaleFactor
        this.lamp.y = obj.y*this.scaleFactor
      }
    });

    this.mapWidth = this.bg1.width * this.bg1.scaleX;
    this.mapHeight = this.bg1.height * this.bg1.scaleY;
    this.cameras.main.setBounds(0, 0, this.mapWidth, this.mapHeight);
    this.cameras.main.startFollow(this.player, true, 0.1, 0.1);

    this.input.keyboard.on("keydown-A", this.left.bind(this));
    this.input.keyboard.on("keydown-D", this.right.bind(this));
    this.input.keyboard.on("keydown-E", () => {
      console.log(this.selectedItem)
      switch(this.selectedItem){
        case "NaN":
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
    if (this.player.x < 0){
      this.stop();
      this.player.x += 10
    }
  }
}
