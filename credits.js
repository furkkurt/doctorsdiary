class credits extends Phaser.Scene {
  constructor() {
    super("credits");
  }

  create() {
    this.scene.launch("musicPlayer")
    this.musicPlayer = this.scene.get("musicPlayer")
    this.musicPlayer.stopAllSfx();
    this.musicPlayer.playMusic("ong");
    // Set up black background
    this.cameras.main.setBackgroundColor('#000000');

    // Create scrolling text
    const creditsText = [
      "Thanks for playing our game!",
      "-Lead dev weylibn",
      "\n",
      "Scenerio, dialogs, sprites, character designs",
      "Weylibn",
      "\n",
      "Backgrounds",
      "Eslem",
      "\n",
      "Music",
      "Creakywaffle and Kurt Clawhammer",
      "\n",
      "Coding",
      "Furkan Kurt aka Kurt Clawhammer",
      "\n\n",
      "Hi there! It's the lead dev, lead artist and writer weylibn!",
      "I worked on the story, dialogues, character designs and sprites",
      "I'm so grateful to everyone who played this game, and to my team",
      "who helped me make this project real — I couldn't have done it without them.",
      "\n",
      "If you liked this game, I'm currently working on another one called",
      '"LINE – Love Is Not Enough" (previously titled "Split in Half").',
      "I bet you'll love it when it's finished!",
      "\n",
      "If you're interested, check out my TikTok and other socials:",
      "[links here – TT / YT / Twitter / IG]",
      "It's not all about games — I post other stuff too!",
      "\n",
      "If you want to help me pay my team (they do incredible work),",
      "here's my Patreon and Buy Me a Coffee:",
      "[links here]",
      "\n",
      "And if you think you can help me with the new game —",
      "I mostly need help with coding —",
      "contact me on Instagram!"
    ];

    // Calculate total height needed
    const lineHeight = 40;
    const totalHeight = creditsText.length * lineHeight;

    // Create text objects
    const textStyle = {
      fontFamily: 'Moving',
      fontSize: '32px',
      color: '#ffffff',
      align: 'center',
      lineSpacing: 10
    };

    // Create container for all text
    const container = this.add.container(this.cameras.main.centerX, this.cameras.main.height);

    // Add each line of text to the container
    let currentY = 0;
    creditsText.forEach(line => {
      const textObject = this.add.text(0, currentY, line, textStyle)
        .setOrigin(0.5, 0);
      container.add(textObject);
      currentY += lineHeight;
    });

    // Set up scrolling animation
    this.tweens.add({
      targets: container,
      y: -totalHeight,
      duration: 40000, // 40 seconds to scroll
      ease: 'Linear',
      onComplete: () => {
        // After credits finish, return to title/menu
        this.time.delayedCall(1000, () => {
          // You can change this to whatever scene should come after credits
          this.scene.start('demo');
        });
      }
    });

    // Add skip option
    const skipText = this.add.text(
      this.cameras.main.width - 20, 
      20, 
      'Press SPACE to skip', 
      {
        fontFamily: 'Moving',
        fontSize: '24px',
        color: '#ffffff'
      }
    ).setOrigin(1, 0);

    // Handle skip input
    this.input.keyboard.on('keydown-SPACE', () => {
      this.scene.start('mainMenu');
    });
  }
}
