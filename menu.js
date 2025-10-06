class menu extends Phaser.Scene{
  constructor(){
    super("menu")
  }
  create(data){
    this.fromScene = data.from;

    this.overlay = this.add.image(0,0,"pauseOverlay").setOrigin(0)
    //this.overlay.height = this.scale.height
    //this.overlay.width = this.scale.width
    this.overlay.setScale(this.scale.height/this.overlay.height)

    this.menuBar = this.add.sprite(this.cameras.main.centerX, -50, "menuBar").setOrigin(0.5, 0).setInteractive().setScrollFactor(0).setScale(1.25);
    this.menuBar.play("menuDrop");

    this.resumeBtn=this.add.text(this.menuBar.x-50, this.menuBar.y+400,"RESUME",{fontFamily:"Moving", fontSize:"48px", color:"black"}).setOrigin(0.5).setVisible(false).setInteractive()
    this.resumeBtn.alpha = .7
    this.resumeBtn.on("pointerdown", () => {
      this.menuBar.play("menuFold")
      this.resumeBtn.setVisible(false)
      this.time.addEvent({
        delay: 500,
        callback: () => {
          this.scene.stop();
          this.scene.resume(this.fromScene)
        }
      })
    })

    this.saveBtn = this.add.text(this.menuBar.x-50, this.menuBar.y+475,"SAVE",{fontFamily:"Moving", fontSize:"48px", color:"black"}).setOrigin(0.5).setVisible(false).setInteractive()
    this.saveBtn.alpha = .7
    this.saveText =this.add.text(this.menuBar.x -50 , this.menuBar.y + 700, "Game saved", {fontFamily:"Moving", fontSize:"48px", color:"black"}).setOrigin(0.5).setVisible(false)
    this.saveText.alpha = .7
    
    this.saveBtn.on("pointerdown", () => {
      const slotPrefix = currentSlot === 1 ? "first" : (currentSlot === 2 ? "second" : "third");
      const progressKey = `${slotPrefix}SlotScene`;
      const roomKey = `${slotPrefix}SlotLastRoom`;
      
      try{ 
        // Save progress
        localStorage.setItem(progressKey, String(progress));
        // Save current room (fromScene will be like "scene1", "scene2", etc.)
        const roomNumber = this.fromScene.replace("scene", "");
        localStorage.setItem(roomKey, roomNumber);
      } catch(e) {}
      
      this.saveText.setVisible(true)
      this.time.delayedCall(2000, () => {
        this.saveText.setVisible(false)
      })  
    })

    this.saveBtn.on("pointerover", () => {this.saveBtn.alpha = 1})
    this.saveBtn.on("pointerout", () => {this.saveBtn.alpha = .7})
    this.resumeBtn.on("pointerover", () => {this.resumeBtn.alpha = 1})
    this.resumeBtn.on("pointerout", () => {this.resumeBtn.alpha = .7})

    this.exitToMainMenuBtn = this.add.text(this.menuBar.x-50, this.menuBar.y+550,"MAIN MENU",{fontFamily:"Moving", fontSize:"48px", color:"black"}).setOrigin(0.5).setVisible(false).setInteractive()
    this.exitToMainMenuBtn.alpha = .7
    this.exitToMainMenuBtn.on("pointerdown", () => {
      // Stop all overlay scenes
      this.scene.stop("dialogueOverlay");
      this.scene.stop("inventoryOverlay");
      this.scene.stop("brightnessOverlay");
      this.scene.stop("musicPlayer");
      
      // Stop the parent scene
      this.scene.stop(this.fromScene);
      
      // Stop this menu scene
      this.scene.stop();
      
      // Start main menu
      this.scene.start("mainMenu");
    })
    this.exitToMainMenuBtn.on("pointerover", () => {this.exitToMainMenuBtn.alpha = 1})
    this.exitToMainMenuBtn.on("pointerout", () => {this.exitToMainMenuBtn.alpha = .7})

    this.showButtons = this.time.addEvent({
      delay: 500,
      callback: () => {
        this.resumeBtn.setVisible(true)
        this.saveBtn.setVisible(true)
        this.exitToMainMenuBtn.setVisible(true)
      }
    })
  };

  update(){
  }
}
