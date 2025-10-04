class menu extends Phaser.Scene{
  constructor(){
    super("menu")
  }
  create(data){
    this.fromScene = data.from;

    this.overlay = this.add.image(0,0,"pauseOverlay").setOrigin(0)
    this.overlay.height = this.scale.height
    this.overlay.width = this.scale.width

    this.menuBar = this.add.sprite(this.cameras.main.centerX, -50, "menuBar").setOrigin(0.5, 0).setInteractive().setScrollFactor(0);
    this.menuBar.play("menuDrop");

    this.resumeBtn=this.add.text(this.menuBar.x-50, this.menuBar.y+300,"RESUME",{fontFamily:"Moving", fontSize:"32px", color:"black"}).setOrigin(0.5).setVisible(false).setInteractive()
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
    this.resumeBtn.on("pointerover", () => {this.resumeBtn.alpha = 1})
    this.resumeBtn.on("pointerout", () => {this.resumeBtn.alpha = .7})

    this.showButtons = this.time.addEvent({
      delay: 500,
      callback: () => {
        this.resumeBtn.setVisible(true)
      }
    })
  };

  update(){
  }
}
