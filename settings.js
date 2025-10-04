class settings extends Phaser.Scene{
  constructor(){
    super("settings")
  }
  create(){
    this.musicPlayer = this.scene.get("musicPlayer")
    this.scene.launch("brightnessOverlay")
    this.scene.bringToTop("brightnessOverlay");
    this.menuBg = this.add.image(0,0,"mainMenuBg").setOrigin(0)
    this.menuBg.setScale(this.scale.height/this.menuBg.height)
    this.brightness = this.add.text(1300, 600, "Brightness:", {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5)
    this.brightnessDown = this.add.text(1600, 600, "-", {fontFamily:"Moving", fontSize: "128px", color: "#91cad1"}).setOrigin(0.5).setInteractive()
    this.brightnessVal = this.add.text(1700, 600, brightness, {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5)
    this.brightnessUp = this.add.text(1800, 600, "+", {fontFamily:"Moving", fontSize: "128px", color: "#91cad1"}).setOrigin(0.5).setInteractive()

    this.sfxVol = this.add.text(1300, 700, "Sfx Volume:", {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5)
    this.sfxVolDown = this.add.text(1600, 700, "-", {fontFamily:"Moving", fontSize: "128px", color: "#91cad1"}).setOrigin(0.5).setInteractive()
    this.sfxVolVal= this.add.text(1700, 700, sfxVolume, {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5)
    this.sfxVolUp= this.add.text(1800, 700, "+", {fontFamily:"Moving", fontSize: "128px", color: "#91cad1"}).setOrigin(0.5).setInteractive()

    this.musicVol = this.add.text(1300, 800, "Music Volume:", {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5)
    this.musicVolDown = this.add.text(1600, 800, "-", {fontFamily:"Moving", fontSize: "128px", color: "#91cad1"}).setOrigin(0.5).setInteractive()
    this.musicVolVal= this.add.text(1700, 800, musicVolume, {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5)
    this.musicVolUp= this.add.text(1800, 800, "+", {fontFamily:"Moving", fontSize: "128px", color: "#91cad1"}).setOrigin(0.5).setInteractive()

    this.favNum = this.add.text(1300, 900, "Favorite Number:", {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5)
    this.favNumDown = this.add.text(1600, 900, "-", {fontFamily:"Moving", fontSize: "128px", color: "#91cad1"}).setOrigin(0.5).setInteractive()
    this.favNumVal= this.add.text(1700, 900, favNum, {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5)
    this.favNumUp= this.add.text(1800, 900, "+", {fontFamily:"Moving", fontSize: "128px", color: "#91cad1"}).setOrigin(0.5).setInteractive()

    this.backBtn = this.add.text(100, 1000, "Back", {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5).setInteractive()
    this.backBtn.on("pointerover", () => {this.hover(this.backBtn)})
    this.backBtn.on("pointerout", () => {this.hoverout(this.backBtn)})
    this.backBtn.on("pointerdown", () => {
      this.scene.start("mainMenu");
      localStorage.setItem("brightness", brightness)
      localStorage.setItem("sfxVol", sfxVolume)
      localStorage.setItem("musicVol", musicVolume)
      localStorage.setItem("favNum", favNum)
    })

    this.brightnessDown.on("pointerover", () => {this.hover(this.brightnessDown)})
    this.brightnessDown.on("pointerout", () => {this.hoverout(this.brightnessDown)})
    this.brightnessDown.on("pointerdown", () => {
      if (brightness>0)
        brightness--
      this.scene.launch("brightnessOverlay")
      this.brightnessVal.text = brightness
    })

    this.brightnessUp.on("pointerover", () => {this.hover(this.brightnessUp)})
    this.brightnessUp.on("pointerout", () => {this.hoverout(this.brightnessUp)})
    this.brightnessUp.on("pointerdown", () => {
      if (brightness<10)
        brightness++
      this.scene.launch("brightnessOverlay")
      this.brightnessVal.text = brightness
    })

    this.sfxVolDown.on("pointerover", () => {this.hover(this.sfxVolDown)})
    this.sfxVolDown.on("pointerout", () => {this.hoverout(this.sfxVolDown)})
    this.sfxVolDown.on("pointerdown", () => {
      if (sfxVolume>0)
        sfxVolume-=1
      this.sfxVolVal.text = sfxVolume
    })

    this.sfxVolUp.on("pointerover", () => {this.hover(this.sfxVolUp)})
    this.sfxVolUp.on("pointerout", () => {this.hoverout(this.sfxVolUp)})
    this.sfxVolUp.on("pointerdown", () => {
      if (sfxVolume<10)
        sfxVolume+=1
      this.sfxVolVal.text = sfxVolume
    })

    this.musicVolDown.on("pointerover", () => {this.hover(this.musicVolDown)})
    this.musicVolDown.on("pointerout", () => {this.hoverout(this.musicVolDown)})
    this.musicVolDown.on("pointerdown", () => {
      if (musicVolume>0)
        musicVolume--
      this.musicVolVal.text = musicVolume
      this.musicPlayer.setMusicVolume(musicVolume)
    })

    this.musicVolUp.on("pointerover", () => {this.hover(this.musicVolUp)})
    this.musicVolUp.on("pointerout", () => {this.hoverout(this.musicVolUp)})
    this.musicVolUp.on("pointerdown", () => {
      if (musicVolume<10)
        musicVolume++
      this.musicVolVal.text = musicVolume
      this.musicPlayer.setMusicVolume(musicVolume)
    })

    this.favNumDown.on("pointerover", () => {this.hover(this.favNumDown)})
    this.favNumDown.on("pointerout", () => {this.hoverout(this.favNumDown)})
    this.favNumDown.on("pointerdown", () => {
      if (favNum>0)
        favNum--
      this.favNumVal.text = favNum
    })

    this.favNumUp.on("pointerover", () => {this.hover(this.favNumUp)})
    this.favNumUp.on("pointerout", () => {this.hoverout(this.favNumUp)})
    this.favNumUp.on("pointerdown", () => {
      if (favNum<9)
        favNum++
      this.favNumVal.text = favNum
    })
  };

  hover(btn) {
    this.time.addEvent({
      delay: 10,
      callback: () => {
        btn.scale += .01
      }, repeat: 10
    })
  }

  hoverout(btn) {
    this.time.addEvent({
      delay: 10,
      callback: () => {
        btn.scale -= .01
      }, repeat: 10
    })
  }


  update(){
  }
}