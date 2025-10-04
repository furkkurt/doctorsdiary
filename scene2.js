class scene2 extends Phaser.Scene{
  constructor(){
    super("scene2")
  }

  create(data){
    this.scene.launch("dialogueOverlay")
    this.scene.bringToTop("dialogueOverlay")
    this.scene.launch("inventoryOverlay", {from: 2});
    this.inventory = this.scene.get("inventoryOverlay");
    this.dialogue = this.scene.get('dialogueOverlay');
    this.itemSelector();
    console.log(data.from)

    let overlayDark = this.add.graphics();
    overlayDark.fillStyle(0x000000, 1);
    overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    overlayDark.setScrollFactor(0);
    overlayDark.setDepth(100)
    this.dialogue.fadeOut(overlayDark)

    this.musicPlayer = this.scene.get("musicPlayer")

    this.bg = this.add.image(0,0,"bg4").setOrigin(0)
    this.mapWidth = this.bg.width * this.bg.scaleX;
    this.mapHeight = this.bg.height * this.bg.scaleY;
    this.scaleFactor = this.mapWidth/this.bg.width
    this.player = this.physics.add.sprite(900,800,"doc").setDepth(99).setScale(1.1)
    this.player.play("docIdle")

    this.ofis1= this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.ofis2= this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.stairs= this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.power = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()
    this.desk = this.physics.add.sprite(0,0,"").setScale(this.scaleFactor).setOrigin(0.5,1).setImmovable()

    this.objects = [this.ofis1, this.ofis2, this.stairs, this.desk, this.power]

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
      } else if(obj.name === "power") {
        this.power.x = obj.x*this.scaleFactor
        this.power.y = obj.y*this.scaleFactor
      } else {
        this.desk.x = obj.x*this.scaleFactor
        this.desk.y = obj.y*this.scaleFactor
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
          break;
        case this.ofis2:
          this.inventory.pick(this.selectedItem, false, "", this.dialogue);
          break;
        case this.power:
          this.inventory.pick(this.selectedItem, false, "I wonder how long this power will last...", this.dialogue);
          break;
        case this.desk:
          this.inventory.pick(this.selectedItem, false, "I can't even say 'Strange... no one's here'.", this.dialogue);
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
          this.selectedItem = nearestObject
        } else {
          this.selectedItem = "NaN"
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
