class inventoryOverlay extends Phaser.Scene{
  constructor(){
    super("inventoryOverlay");
  }
  create(){
    this.inventory = this.add.sprite(-20,this.cameras.main.centerY,"inventory").setOrigin(0, 0.5).setScale(6).setScrollFactor(0).setDepth(99)
    // Default to first slot if not set
    this.currentSlot = this.currentSlot || 1;
    
    if(this.currentSlot === 1)
      this.slot = "firstSlotItem"
    else if(this.currentSlot === 2)
      this.slot = "secondSlotItem"
    else
      this.slot = "thirdSlotItem"

    this.item1 = this.add.sprite(this.inventory.x+20, this.inventory.y-140, "").setOrigin(0).setScale(2).setVisible(false)
    this.item2 = this.add.sprite(this.inventory.x+20, this.inventory.y-40, "").setOrigin(0).setVisible(false)
    this.item2.setScale(this.inventory.width/this.item2.width)
    this.item3 = this.add.sprite(this.inventory.x+20, this.inventory.y+60, "").setOrigin(0).setScale(2).setVisible(false)

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

      this.time.delayedCall(5000, () => {
        dialogue.hideDialogue()
      })
    }
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

  update(){
  }
}
