class opening extends Phaser.Scene{
  constructor(){
    super("opening")
  }
  create(){
    this.logoText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "Team Be Inspired", {fontFamily: "Moving", fontSize: "96px"}).setOrigin(0.5)
    this.logoText.alpha = 0
    this.skip = this.add.text(10,10,"SKIP").setInteractive()
    this.skip.on("pointerdown", () => {this.scene.start("test")})
    this.fadeIn()

    this.time.addEvent({
      delay: 3000,
      callback: () => {
        this.fadeOut()
        this.time.addEvent({
          delay: 3000,
          callback: () => {
            this.logoText.text = "Doctor's Diary"
            this.fadeIn()
            this.time.addEvent({
              delay: 2000,
              callback: () => {
                this.fadeOut();
                this.time.addEvent({
                  delay: 2000,
                  callback: () => {this.scene.start("test")}
                })
              }
            })
          }
        })
      }
    })
  };

  fadeIn() {
    this.teamLogoAppear = this.time.addEvent({
      delay: 50,
      callback: () => {
        this.logoText.alpha += .05
      },
      repeat: 20
    });
  }

  fadeOut() {
    this.teamLogoDisappear = this.time.addEvent({
      delay: 50,
      callback: () => {this.logoText.alpha -= .05},
      repeat: 20
    })
  }

  update(){
  }
}
