class demo extends Phaser.Scene{
  constructor(){
    super("demo")
  }
  create(){
    this.add.text(10,10,"Main Menu").setInteractive().on("pointerdown",()=>{this.scene.start("mainMenu")}).setScale(4)
    this.add.text(10,110,"intro").setInteractive().on("pointerdown",()=>{this.scene.start("opening")}).setScale(4)
    this.add.text(10,210,"scene 0").setInteractive().on("pointerdown",()=>{this.scene.start("scene0")}).setScale(4)
    this.add.text(10,310,"scene 1").setInteractive().on("pointerdown",()=>{this.scene.start("scene1")}).setScale(4)


  };

  update(){
  }
}
