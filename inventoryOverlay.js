class inventoryOverlay extends Phaser.Scene{
  constructor(){
    super("inventoryOverlay");
  }
  create(from){
    this.inventory = this.add.sprite(-20,this.cameras.main.centerY,"inventory").setOrigin(0, 0.5).setScale(6).setScrollFactor(0).setDepth(99)

    if(currentSlot === 1)
      this.slot = "firstSlotItem"
    else if(currentSlot === 2)
      this.slot = "secondSlotItem"
    else
      this.slot = "thirdSlotItem"

    this.item1 = this.add.sprite(this.inventory.x+20, this.inventory.y-140, "").setOrigin(0).setScale(2).setVisible(false)
    this.item2 = this.add.sprite(this.inventory.x+20, this.inventory.y-40, "").setOrigin(0).setVisible(false)
    this.item3 = this.add.sprite(this.inventory.x+20, this.inventory.y+60, "").setOrigin(0).setScale(2).setVisible(false)

    this.updateSlots()


  };

  pick(item, collect, msg, dialogue) {
    console.log("Pick function called with item:", item);
    console.log("Current slot:", this.slot);
    console.log("this context:", this);
    
    if (!item) {
      console.error("item yok amk");
      return;
    }
    
    if (!this.slot) {
      console.error("slot yok amk :(");
      return;
    }

    if (collect) {
      let success = true
      if(localStorage.getItem(this.slot+"1") === "")
        localStorage.setItem(this.slot+"1", item.texture.key)
      else if(localStorage.getItem(this.slot+"2") === "")
        localStorage.setItem(this.slot+"2", item.texture.key)
      else if(localStorage.getItem(this.slot+"3") === "")
        localStorage.setItem(this.slot+"3", item.texture.key)
      else {
        dialogue.dialogue("My hands are full...")
        success = false
      }

      if(success) {
        item.setVisible(false)
        this.updateSlots()
      }
    }

    if(msg != ""){
      dialogue.dialogue(msg)

      this.time.delayedCall(10000, () => {
        dialogue.hideDialogue()
      })
    }

    //merdiven
    if(item == this.stairs)
      this.stairs()
    else if(item == this.ofis1)
      this.ofis1()
  }

  updateSlots() {
    if(localStorage.getItem(this.slot+"1") == ""){
      this.item1.setVisible(false)
    } else {
      this.item1.setVisible(true)
      this.item1.setTexture(localStorage.getItem(this.slot+"1"))
    }

    if(localStorage.getItem(this.slot+"2") == ""){
      this.item2.setVisible(false)
    } else {
      this.item2.setVisible(true)
      this.item2.setTexture(localStorage.getItem(this.slot+"2"))
    }

    if(localStorage.getItem(this.slot+"3") == ""){
      this.item3.setVisible(false)
    } else {
      this.item3.setVisible(true)
      this.item3.setTexture(localStorage.getItem(this.slot+"3"))
    }
  }

  stairs(){
    console.log("stairs")
  }

  ofis1() {
    this.scene.start("scene1", {from: data.from})
  }

  update(){
  }
}
