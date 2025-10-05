class loadGame extends Phaser.Scene{
  constructor(){
    super("loadGame")
  }
  create(){
    this.scene.launch("brightnessOverlay")
    this.scene.bringToTop("brightnessOverlay");
    this.menuBg = this.add.image(0,0,"mainMenuBg").setOrigin(0)
    this.menuBg.setScale(this.scale.height/this.menuBg.height)

    // Slots layout similar to settings
    const yBase = 620
    const yGap = 100
    this.slotRows = []
    for (let i = 1; i <= 3; i++) {
      const y = yBase + (i-1) * yGap
      const slotName = i === 1 ? "first" : i === 2 ? "second" : "third"
      const sceneKey = `${slotName}SlotScene`
      const item1Key = `${slotName}SlotItem1`
      const item2Key = `${slotName}SlotItem2`
      const item3Key = `${slotName}SlotItem3`

      const savedProgress = localStorage.getItem(sceneKey)
      const isEmpty = savedProgress === null || savedProgress === ""
      const progressText = isEmpty ? "Empty" : `Progress: ${parseInt(savedProgress)}`

      const label = this.add.text(1150, y, `Slot ${i}: ${progressText}`, {fontFamily:"Moving", fontSize: "48px", color: "#91cad1"}).setOrigin(0.5)
      const loadBtn = this.add.text(1600, y, "Load", {fontFamily:"Moving", fontSize: "56px", color: "#91cad1"}).setOrigin(0.5).setInteractive()
      const delBtn = this.add.text(1750, y, "Delete", {fontFamily:"Moving", fontSize: "56px", color: "#91cad1"}).setOrigin(0.5).setInteractive()

      this.addHover(loadBtn)
      this.addHover(delBtn)

      loadBtn.on("pointerdown", () => {
        this.loadSlot(i, sceneKey)
      })
      delBtn.on("pointerdown", () => {
        this.deleteSlot(label, sceneKey, item1Key, item2Key, item3Key)
      })

      this.slotRows.push({ label, loadBtn, delBtn })
    }

    // Back button
    this.backBtn = this.add.text(100, 1000, "Back", {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5).setInteractive()
    this.addHover(this.backBtn)
    this.backBtn.on("pointerdown", () => {
      this.scene.start("mainMenu")
    })
  };

  addHover(btn) {
    btn.on("pointerover", () => {
      this.time.addEvent({ delay: 10, callback: () => { btn.scale += .01 }, repeat: 10 })
    })
    btn.on("pointerout", () => {
      this.time.addEvent({ delay: 10, callback: () => { btn.scale -= .01 }, repeat: 10 })
    })
  }

  loadSlot(slotIndex, sceneKey) {
    const savedProgress = localStorage.getItem(sceneKey)
    if (savedProgress === null || savedProgress === "") {
      return
    }
    currentSlot = slotIndex
    progress = parseInt(savedProgress)
    this.scene.start("scene1", { currentSlot })
  }

  deleteSlot(label, sceneKey, item1Key, item2Key, item3Key) {
    localStorage.setItem(sceneKey, "")
    localStorage.setItem(item1Key, "")
    localStorage.setItem(item2Key, "")
    localStorage.setItem(item3Key, "")
    label.text = label.text.replace(/Progress:.*/, "Empty")
  }

  update(){
  }
}


