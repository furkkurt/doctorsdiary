class brightnessOverlay extends Phaser.Scene{
  constructor(){
    super("brightnessOverlay")
  }
  create(){
    let overlayBright = this.add.graphics();
    overlayBright.fillStyle(0xffffff, 1);
    overlayBright.fillRect(0, 0, this.scale.width, this.scale.height);
    overlayBright.setScrollFactor(0);
    overlayBright.setDepth(999);

    let overlayDark = this.add.graphics();
    overlayDark.fillStyle(0x000000, 1);
    overlayDark.fillRect(0, 0, this.scale.width, this.scale.height);
    overlayDark.setScrollFactor(0);
    overlayDark.setDepth(999);

    overlayDark.alpha = overlayBright.alpha = 0;
    if (brightness <= 5)
      overlayDark.alpha = 0.05 * (5-brightness)
    else
      overlayBright.alpha = 0.005 * brightness

    console.log(overlayDark.alpha, overlayBright.alpha);


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
