class inventoryOverlay extends Phaser.Scene{
  constructor(){
    super("inventoryOverlay");
  }
  create(data){
    this.inventory = this.add.sprite(-20,this.cameras.main.centerY,"inventory").setOrigin(0, 0.5).setScale(6).setScrollFactor(0).setDepth(99)
    this.from = data.from

    if(currentSlot === 1)
      this.slot = "firstSlotItem"
    else if(currentSlot === 2)
      this.slot = "secondSlotItem"
    else
      this.slot = "thirdSlotItem"

    this.item1 = this.add.sprite(this.inventory.x+20, this.inventory.y-140, "").setOrigin(0).setScale(1.5).setVisible(false).setScale(.33)
    this.item2 = this.add.sprite(this.inventory.x+20, this.inventory.y-40, "").setOrigin(0).setScale(1.5).setVisible(false).setScale(.33)
    this.item3 = this.add.sprite(this.inventory.x+20, this.inventory.y+60, "").setOrigin(0).setScale(1.5).setVisible(false).setScale(.33)

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
      if (item._visible == true){
        let success = true
        if(localStorage.getItem(this.slot+"1") === "")
          localStorage.setItem(this.slot+"1", item.texture.key)
        else if(localStorage.getItem(this.slot+"2") === "")
          localStorage.setItem(this.slot+"2", item.texture.key)
        else if(localStorage.getItem(this.slot+"3") === "")
          localStorage.setItem(this.slot+"3", item.texture.key)
        else {
          dialogue.dialogue("My hands are full...", "docPort", null, "docPort1")
          success = false
        }

        if(success) {
          item.setVisible(false)
          this.updateSlots()
        }

      }
    }

    if(msg != ""){
      dialogue.dialogue(msg, "docPort", null, "docPort1")

      this.time.delayedCall(10000, () => {
        dialogue.hideDialogue()
      })
    }
    console.log(item.texture.key)
    //merdiven
    if(item.texture.key == "stairs")
      this.stairs()
    else if(item.texture.key == "stairs2")
      this.stairs2()
    else if(item.texture.key == "ofis1")
      return this.ofis1()
    else if(item.texture.key == "lamp" || item.texture.key == "lamp2")
      return this.lamp()
    else if(item.texture.key == "kidsRoom")
      return this.kidsRoom()
  }

  updateSlots() {
    if(localStorage.getItem(this.slot+"1") == ""){
      this.item1.setVisible(false)
    } else {
      this.item1.setVisible(true)
      this.item1.setTexture(localStorage.getItem(this.slot+"1") + "item")
    }

    if(localStorage.getItem(this.slot+"2") == ""){
      this.item2.setVisible(false)
    } else {
      this.item2.setVisible(true)
      this.item2.setTexture(localStorage.getItem(this.slot+"2") + "item")
    }

    if(localStorage.getItem(this.slot+"3") == ""){
      this.item3.setVisible(false)
    } else {
      this.item3.setVisible(true)
      this.item3.setTexture(localStorage.getItem(this.slot+"3") + "item")
    }
  }

  stairs(){
    console.log("stairs() function called");
    
    // Try different approaches to find the current scene
    console.log("All scenes:", this.scene.manager.getScenes(false).map(s => s.scene.key));
    
    let currentScene = this.scene.manager.getScenes(false).find(scene => scene.scene.isActive());
    console.log("Current active scene:", currentScene ? currentScene.scene.key : "none");
    
    // Try to find scene2 specifically
    let scene2 = this.scene.manager.getScene("scene2");
    console.log("Scene2 found:", scene2 ? "yes" : "no");
    
    if (scene2) {
      console.log("Starting scene6 from scene2");
      // Start scene6 from scene2
      scene2.scene.stop("inventoryOverlay");
      scene2.scene.stop("dialogueOverlay");
      scene2.scene.stop("musicPlayer");
      scene2.scene.start("scene6", {
        from: 2,
        currentSlot: currentSlot
      });
    } else {
      console.log("Scene2 not found");
    }
  }

  stairs2(){
    console.log("stairs2() function called");
    
    // Try to find scene3 specifically
    let scene6 = this.scene.manager.getScene("scene6");
    console.log("Scene6 found:", scene6 ? "yes" : "no");
    
    if (scene3) {
      console.log("Starting scene2 from scene3");
      // Start scene2 from scene6
      scene3.scene.stop("inventoryOverlay");
      scene3.scene.stop("dialogueOverlay");
      scene3.scene.stop("musicPlayer");
      scene3.scene.start("scene2", {
        from: 6,
        currentSlot: currentSlot
      });
    } else {
      console.log("Scene6 not found");
    }
  }

  ofis1() {
    return ("scene1")
  }

  lamp() {
    // Get the scene that launched this inventory overlay
    let currentScene = this.scene.manager.getScenes(false).find(scene => scene.scene.isActive());
    
    if (currentScene && currentScene.lamp) {
      // Toggle lamp state
      if (currentScene.lamp.texture.key == "lamp") {
        currentScene.bg1.setTexture("testBg2");
        currentScene.lamp.setTexture("lamp2");
      } else {
        currentScene.bg1.setTexture("testBg");
        currentScene.lamp.setTexture("lamp");
      }
    }
  }

  kidsRoom() {
    // If progress is 5, trigger nurse dialogue in scene3 instead of starting scene4
    if (progress === 5) {
      let scene3 = this.scene.manager.getScene("scene3");
      if (scene3 && scene3.scene.isActive()) {
        scene3.startNurseDialogue();
      } else {
        // Fallback: try to get any active scene that has startNurseDialogue
        let currentScene = this.scene.manager.getScenes(false).find(s => typeof s.startNurseDialogue === 'function');
        if (currentScene) currentScene.startNurseDialogue();
      }
      return;
    }
    
    // For any other progress, launch scene4 normally
    // Prefer the active scene's cinematic transition if available
    let active = this.scene.manager.getScenes(false).find(s => s.scene.isActive());
    if (active) {
      if (typeof active.startDoorTransition === 'function') {
        active.startDoorTransition();
      } else {
        active.scene.stop("inventoryOverlay");
        active.scene.stop("dialogueOverlay");
        active.scene.stop("musicPlayer");
        active.scene.start("scene4", {
          from: active.scene.key === "scene2" ? 2 : 3,
          currentSlot: currentSlot
        });
      }
    }
 }

  update(){
  }
}
