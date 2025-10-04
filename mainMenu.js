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
    if (currentMusic=="")
      this.musicPlayer.playMusic("ong")

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
        this.scene.start("scene0")
      }
      else if(localStorage.getItem("secondSlotScene") == ""){
        currentSlot = 2
        localStorage.setItem("secondSlotScene", "0")
        this.scene.start("scene0")
      }
      else if(localStorage.getItem("thirdSlotScene") == ""){
        currentSlot = 3
        localStorage.setItem("thirdSlotScene", "0")
        this.scene.start("scene0")
      }
      else{
        currentSlot = 0
        this.allSlotsFullMessage()
      }
    });

    this.loadGameBtn.on("pointerover", () => {this.hover(this.loadGameBtn)});
    this.loadGameBtn.on("pointerout", () => {this.hoverout(this.loadGameBtn)});

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

  }

  update(){
  }
}
