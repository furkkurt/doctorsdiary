var brightness = parseInt(localStorage.getItem("brightness")) ?? 5
var musicVolume = parseInt(localStorage.getItem("musicVol")) ?? 5
var sfxVolume = parseInt(localStorage.getItem("sfxVol")) ?? 5
var favNum = parseInt(localStorage.getItem("favNum")) ?? 5
var currentMusic = ""
var currentSlot = 0
var progress = 0

class mainMenu extends Phaser.Scene{
  constructor(){
    super("mainMenu")
  }
  create(){
    //lokalden değişkenleri alma işi
    if (localStorage.getItem("brightness") !== undefined)
      brightness = parseInt(localStorage.getItem("brightness"));
    if (localStorage.getItem("musicVol") !== undefined)
      musicVolume = parseInt(localStorage.getItem("musicVol"));
    if (localStorage.getItem("sfxVol") !== undefined)
      sfxVolume = parseInt(localStorage.getItem("sfxVol"));
    if (localStorage.getItem("favNum") !== undefined)
      favNum = parseInt(localStorage.getItem("favNum"));

    //müzik açma işi
    this.scene.launch("musicPlayer")
    this.musicPlayer = this.scene.get("musicPlayer")
    this.scene.launch("brightnessOverlay")
    this.scene.bringToTop("brightnessOverlay")
    this.scene.bringToTop("musicPlayer")

    // Create music text display
    this.musicText = this.add.text(
      this.scale.width - 20,
      20,
      'Kurt Clawhammer - Something',
      {
        fontFamily: 'Moving',
        fontSize: '24px',
        color: '#ffffff',
        align: 'right'
      }
    ).setOrigin(1, 0).setScrollFactor(0).setDepth(101);

    // Update music text when track changes
    if(this.musicPlayer.currentMusic != "ong")
      this.musicPlayer.playMusic("ong")
    this.time.delayedCall(4000, () => {
      this.time.addEvent({
        delay: 10,
        callback: () => {
          this.musicText.alpha -= 0.01
        }, repeat: 100
      })
    });

    this.menuBg = this.add.image(0,0,"mainMenuBg").setOrigin(0)
    this.menuBg.setScale(this.scale.height/this.menuBg.height)
    this.newGameBtn = this.add.text(1500, 600, "New Game", {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5).setInteractive()
    this.loadGameBtn = this.add.text(1500, 700, "Load Game", {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5).setInteractive()
    this.settingsBtn = this.add.text(1500, 800, "Settings", {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5).setInteractive()
    this.libraryBtn = this.add.text(1500, 900, "Library", {fontFamily:"Moving", fontSize: "64px", color: "#91cad1"}).setOrigin(0.5).setInteractive()
    this.libraryBtn.alpha = .5

    this.newGameBtn.on("pointerover", () => {this.hover(this.newGameBtn)});
    this.newGameBtn.on("pointerout", () => {this.hoverout(this.newGameBtn)});

    //yeni save açma işi
    this.newGameBtn.on("pointerdown", () => {
      //slotları kontrol et
      if(localStorage.getItem("firstSlotScene") == ""){
        currentSlot = 1
        localStorage.setItem("firstSlotScene", "0")
        localStorage.setItem("firstSlotItem1", "")
        localStorage.setItem("firstSlotItem2", "")
        localStorage.setItem("firstSlotItem3", "")
        progress = localStorage.getItem("firstSlotScene")
        this.scene.start("scene0")
      }
      else if(localStorage.getItem("secondSlotScene") == ""){
        currentSlot = 2
        localStorage.setItem("secondSlotScene", "0")
        localStorage.setItem("secondSlotItem1", "")
        localStorage.setItem("secondSlotItem2", "")
        localStorage.setItem("secondSlotItem3", "")
        progress = localStorage.getItem("secondSlotScene")
        this.scene.start("scene0")
      }
      else if(localStorage.getItem("thirdSlotScene") == ""){
        currentSlot = 3
        localStorage.setItem("thirdSlotScene", "0")
        localStorage.setItem("thirdSlotItem1", "")
        localStorage.setItem("thirdSlotItem2", "")
        localStorage.setItem("thirdSlotItem3", "")
        progress = localStorage.getItem("thirdSlotScene")
        this.scene.start("scene0")
      }
      else{
        currentSlot = 0
        this.allSlotsFullMessage()
      }
    });

    this.loadGameBtn.on("pointerover", () => {this.hover(this.loadGameBtn)});
    this.loadGameBtn.on("pointerout", () => {this.hoverout(this.loadGameBtn)});
    this.loadGameBtn.on("pointerdown", () => {this.scene.start("loadGame")});

    this.settingsBtn.on("pointerover", () => {this.hover(this.settingsBtn)});
    this.settingsBtn.on("pointerout", () => {this.hoverout(this.settingsBtn)});
    this.settingsBtn.on("pointerdown", () => {this.scene.start("settings")});

    //buraya döncem
    if (false){
      this.libraryBtn.alpha = 1
      this.libraryBtn.on("pointerover", () => {this.hover(this.libraryBtn)});
      this.libraryBtn.on("pointerout", () => {this.hoverout(this.libraryBtn)});
    }

    //şarkı looplama işi
    /*
    this.intro=this.sound.add("ongIntro");
    this.loop=this.sound.add("ongLoop");
    this.intro.play();
    this.time.addEvent({
      delay:46000,
      callback: () => {
        this.loop.play();
        this.time.addEvent({
          delay:42400,
          callback: () => {
            this.loop.play()
          }, loop: true
        })
      }
    })
    */


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

  allSlotsFullMessage(){
    // Create semi-transparent black overlay
    const overlay = this.add.graphics();
    overlay.fillStyle(0x000000, 0.7);
    overlay.fillRect(0, 0, this.scale.width, this.scale.height);
    overlay.setScrollFactor(0).setDepth(100);

    // Create warning message
    const message = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY - 50,
      "All save slots are full!\nPlease delete a save to start a new game.",
      {
        fontFamily: "Moving",
        fontSize: "48px",
        color: "#ffffff",
        align: 'center',
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5).setDepth(101);

    // Create OK button
    const okButton = this.add.text(
      this.cameras.main.centerX,
      this.cameras.main.centerY + 100,
      "OK",
      {
        fontFamily: "Moving",
        fontSize: "48px",
        color: "#91cad1",
        stroke: '#000000',
        strokeThickness: 4
      }
    ).setOrigin(0.5).setDepth(101).setInteractive();

    // Add hover effect
    okButton.on('pointerover', () => this.hover(okButton));
    okButton.on('pointerout', () => this.hoverout(okButton));

    // Close message on click
    okButton.on('pointerdown', () => {
      overlay.destroy();
      message.destroy();
      okButton.destroy();
    });
  }

  update(){
  }
}
