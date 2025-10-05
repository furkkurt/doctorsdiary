class demo extends Phaser.Scene{
  constructor(){
    super("demo")
  }
  create(){
    this.add.text(10,10,"Main Menu").setInteractive().on("pointerdown",()=>{this.scene.start("mainMenu")}).setScale(4)
    this.add.text(10,110,"intro").setInteractive().on("pointerdown",()=>{this.scene.start("opening")}).setScale(4)
    this.add.text(10,210,"scene 0").setInteractive().on("pointerdown",()=>{this.scene.start("scene0")}).setScale(4)
    this.add.text(10,310,"scene 1").setInteractive().on("pointerdown",()=>{this.scene.start("scene1")}).setScale(4)
    this.add.text(10,410,"scene 2").setInteractive().on("pointerdown",()=>{this.scene.start("scene2", {from: 1})}).setScale(4)
    this.add.text(10,510,"scene 3").setInteractive().on("pointerdown",()=>{this.scene.start("scene3", {from: 1})}).setScale(4)
    this.add.text(10,610,"scene 4").setInteractive().on("pointerdown",()=>{this.scene.start("scene4", {from: 1})}).setScale(4)
    this.add.text(10,710,"scene 5").setInteractive().on("pointerdown",()=>{this.scene.start("scene5", {from: 1})}).setScale(4)
    this.add.text(10,810,"scene 6").setInteractive().on("pointerdown",()=>{this.scene.start("scene6", {from: 1})}).setScale(4)
    this.add.text(10,910,"scene 7").setInteractive().on("pointerdown",()=>{this.scene.start("scene7", {from: 1})}).setScale(4)
    


  };

  update(){
  }
  /**
   * 1 doktorun ofis
   * 2 koridor
   * 3 koridorun devamı
   * 4 çocukların odası
   * 5 yan ofis
   * 6 alt kat koridor
   * 7 alt kat koridor devamı
   * 8 tuvalet
   * 9 balkon
   */
}
