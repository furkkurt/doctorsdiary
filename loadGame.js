class loadGame extends Phaser.Scene{
  constructor(){
    super("loadGame")
  }
  create(){
    this.scene.launch("brightnessOverlay")
    this.scene.bringToTop("brightnessOverlay");
    this.menuBg = this.add.image(0,0,"mainMenuBg").setOrigin(0)
    this.menuBg.setScale(this.scale.height/this.menuBg.height)

    // Initialize ending values for each slot if they don't exist
    for (let i = 1; i <= 3; i++) {
      const slotPrefix = i === 1 ? "first" : i === 2 ? "second" : "third";
      const endingKey = `${slotPrefix}SlotEnding`;
      if (!localStorage.getItem(endingKey)) {
        localStorage.setItem(endingKey, "undetermined");
      }
    }

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
      const progressText = isEmpty ? "Empty" : `Progress: ${parseInt(savedProgress)}/13`

      const label = this.add.text(1150, y, `Slot ${i}: ${progressText}`, {fontFamily:"Moving", fontSize: "48px", color: "#91cad1"}).setOrigin(0.5)
      const loadBtn = this.add.text(1600, y, "Load", {fontFamily:"Moving", fontSize: "56px", color: "#91cad1"}).setOrigin(0.5).setInteractive()
      const delBtn = this.add.text(1750, y, "Delete", {fontFamily:"Moving", fontSize: "56px", color: "#91cad1"}).setOrigin(0.5).setInteractive()

      this.addHover(loadBtn)
      this.addHover(delBtn)

      loadBtn.on("pointerdown", () => {
        this.loadSlot(i, sceneKey)
      })
      delBtn.on("pointerdown", () => {
        this.showDeleteConfirmation(label, sceneKey, item1Key, item2Key, item3Key)
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
    
    // Get the last room the player was in
    const slotPrefix = slotIndex === 1 ? "first" : (slotIndex === 2 ? "second" : "third");
    const roomKey = `${slotPrefix}SlotLastRoom`;
    const lastRoom = localStorage.getItem(roomKey);
    
    this.scene.launch("musicPlayer");
    this.musicPlayer = this.scene.get("musicPlayer");
    this.musicPlayer.stopTheMusic();
    // Start in the last room if it exists, otherwise start in scene1
    if (lastRoom && lastRoom !== "") {
      this.scene.start(`scene${lastRoom}`, { currentSlot });
    } else {
      this.scene.start("scene1", { currentSlot });
    }
  }

  deleteSlot(label, sceneKey, item1Key, item2Key, item3Key) {
    const slotPrefix = sceneKey.replace("SlotScene", "");
    const roomKey = `${slotPrefix}SlotLastRoom`;
    const endingKey = `${slotPrefix}SlotEnding`;
    
    localStorage.setItem(sceneKey, "")
    localStorage.setItem(item1Key, "")
    localStorage.setItem(item2Key, "")
    localStorage.setItem(item3Key, "")
    localStorage.setItem(roomKey, "")
    localStorage.setItem(endingKey, "undetermined")
    label.text = label.text.replace(/Progress:.*/, "Empty")
  }

  showDeleteConfirmation(label, sceneKey, item1Key, item2Key, item3Key) {
    // Create semi-transparent black overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, this.scale.width, this.scale.height);
    overlay.setScrollFactor(0).setDepth(100);

    // Create confirmation message
    const message = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 50,
      "Are you sure you want to delete this save?",
      {
        fontFamily: "Moving",
        fontSize: "48px",
        color: "#ffffff",
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5).setDepth(101);

    // Create Yes/No buttons
    const yesButton = this.add.text(
      this.cameras.main.centerX - 100,
      this.cameras.main.centerY + 100,
      "Yes",
      {
        fontFamily: "Moving",
        fontSize: "48px",
        color: "#91cad1",
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5).setDepth(101).setInteractive();

    const noButton = this.add.text(
      this.cameras.main.centerX + 100,
      this.cameras.main.centerY + 100,
      "No",
      {
        fontFamily: "Moving",
        fontSize: "48px",
        color: "#91cad1",
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5).setDepth(101).setInteractive();

    // Add hover effects
    this.addHover(yesButton);
    this.addHover(noButton);

    // Handle button clicks
    yesButton.on('pointerdown', () => {
      this.deleteSlot(label, sceneKey, item1Key, item2Key, item3Key);
      overlay.destroy();
      message.destroy();
      yesButton.destroy();
      noButton.destroy();
    });

    noButton.on('pointerdown', () => {
      overlay.destroy();
      message.destroy();
      yesButton.destroy();
      noButton.destroy();
    });
  }

  update(){
  }
}


