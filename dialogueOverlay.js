class dialogueOverlay extends Phaser.Scene{
  constructor(){
    super("dialogueOverlay");
  }
  create(){
    console.log("BEHOLD THE DIALOGS!!!");

    this.dialogueBox = this.add.sprite(this.cameras.main.centerX, 920, "textbg").setOrigin(0.5).setScrollFactor(0).setDepth(100)
    this.dialogueBox.alpha = 0
    this.dialogueText = this.add.text(this.dialogueBox.x, this.dialogueBox.y-80, "", {fontFamily:"Moving", fontSize: "48px", color: "black"}).setScrollFactor(0).setDepth(100)
    this.dialogueText.setOrigin(0.5)
    this.dialogueText.alpha = 0

  };

  dialogue(text) {
    //belirmece
    this.fadeIn(this.dialogueBox, 100)
    this.fadeIn(this.dialogueText, 100)

    //yazmaca
    let i = 0;
    this.time.delayedCall(100, () => {
      this.time.addEvent({
        delay: 50,
        callback: () => {
          if(text.charAt(i) != "ü")
            this.dialogueText.text += text.charAt(i);
          else
            this.dialogueText.text = "";
          i++
        }, repeat: text.length
      })
    })
  }

  hideDialogue(){
    this.fadeOut(this.dialogueBox, 100)
    this.fadeOut(this.dialogueText, 100)
    this.time.delayedCall(100, () => {this.dialogueText.text = ""})

  }

  //fade in efektini de buraya alıyorum her sahne 50 kere yazıyom amk
  fadeIn(sprite, duration = 1000) {
    if (!sprite) return;

    this.tweens.add({
      targets: sprite,
      alpha: 1,
      duration: duration,
      ease: 'Linear'
    });
  }

  fadeOut(sprite, duration = 1000) {
    if (!sprite) return;
    this.tweens.add({
      targets: sprite,
      alpha: 0,
      duration: duration,
      ease: 'Linear'
    });
  }

  update(){
  }
}
