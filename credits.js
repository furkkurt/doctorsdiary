class credits extends Phaser.Scene {
  constructor() {
    super("credits");
  }

  create() {
    this.scene.launch("musicPlayer")
    this.musicPlayer = this.scene.get("musicPlayer")
    this.musicPlayer.stopAllSfx();
    this.scene.bringToTop("musicPlayer")

    // Create music text display
    this.musicText = this.add.text(
      20,
      20,
      'Kurt Clawhammer - Something',
      {
        fontFamily: 'Moving',
        fontSize: '24px',
        color: '#ffffff',
        align: 'right'
      }
    ).setOrigin(0, 0).setScrollFactor(0).setDepth(101);

    // Update music text when track changes
   
    this.musicPlayer.playMusic("ong");
    this.time.delayedCall(4000, () => {
      this.time.addEvent({
        delay: 10,
        callback: () => {
          this.musicText.alpha -= 0.01
        }, repeat: 100
      })
    });

    // Set up black background
    this.cameras.main.setBackgroundColor('#000000');
    this.textText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "", {fontFamily: "Moving", fontSize: "32px", color: "#ffffff", align: "center"}).setOrigin(0.5);
    // Create scrolling text
    this.creditsText = 
      "Thanks for playing our game!\n"+
      "-Lead dev weylibn\n"+
      "\n"+
      "Scenerio, dialogs, sprites, character designs\n"+
      "Weylibn\n"+
      "\n"+
      "Backgrounds\n"+
      "Eslem\n"+
      "\n"+
      "Music\n"+
      "Creakywaffle and Kurt Clawhammer\n"+
      "\n"+
      "Coding\n"+
      "Furkan Kurt aka Kurt Clawhammer\n"+
      "\n"+
      "Some help with porting phaser project to windows\n"+
      "Hakkıcan";
    this.creditsText2 = 
      "Hi there! It's the lead dev, lead artist and writer weylibn!\n"+
      "I worked on the story, dialogues, character designs and sprites\n"+
      "I'm so grateful to everyone who played this game, and to my team\n"+
      "who helped me make this project real — I couldn't have done it without them.\n"+
      "\n"+
      "If you liked this game, I'm currently working on another one called\n"+
      '"LINE – Love Is Not Enough" (previously titled "Split in Half").\n'+
      "I bet you'll love it when it's finished!\n"+
      "\n"+
      "If you're interested, check out my TikTok and other socials:\n"
    
      this.credits2Buttons = []
      this.credits2Buttons.push(this.add.text(500, 900, "TikTok", {fontFamily: "Moving", fontSize: "48px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
      this.credits2Buttons.push(this.add.text(800, 900, "Youtube", {fontFamily: "Moving", fontSize: "48px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
      this.credits2Buttons.push(this.add.text(1100, 900, "Twitter", {fontFamily: "Moving", fontSize: "48px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
      this.credits2Buttons.push(this.add.text(1400, 900, "Instagram", {fontFamily: "Moving", fontSize: "48px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
      this.credits2Buttons.forEach(button => {
        button.on("pointerover", () => {
          this.tweens.add({
            targets: button,
            scale: 1.1,
            duration: 100,
            ease: "Linear",
          });
        });
        button.on("pointerout", () => {
          this.tweens.add({
            targets: button,
            scale: 1,
            duration: 100,
            ease: "Linear",
          });
        });
        button.on("pointerdown", () => {
          this.openLink(this.links[this.allBtns.indexOf(button)])
        });
      });

    this.creditsText3 = 
      "It's not all about games — I post other stuff too!\n"+
      "\n"+
      "If you want to help me pay my team (they do incredible work),\n"+
      "here's my Patreon and Buy Me a Coffee:\n"
    this.credits3Buttons = []
      this.credits3Buttons.push(this.add.text(800, 900, "Patreon", {fontFamily: "Moving", fontSize: "48px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
      this.credits3Buttons.push(this.add.text(1100, 900, "Buy Me a Coffee", {fontFamily: "Moving", fontSize: "48px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
    this.creditsText4 = 
      "Heyy its eslem!!! im the background artist of the game and had so much fun being a part of this team!\n"+
      "\n"+
      "hope you had as much fun as we did and if you are interested to see more of my art follow my socials x3\n"+
      "(instagram artstation tiktok)\n"+
      "\n"+
      "@eslemw on instagram @eslemw on artstation @eslemw on tiktok\n"
    this.credits4Buttons = []
      this.credits4Buttons.push(this.add.text(500, 900, "Instagram", {fontFamily: "Moving", fontSize: "48px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
      this.credits4Buttons.push(this.add.text(800, 900, "Artstation", {fontFamily: "Moving", fontSize: "48px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
      this.credits4Buttons.push(this.add.text(1100, 900, "Tiktok", {fontFamily: "Moving", fontSize: "48px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
      this.credits4Buttons.push(this.add.text(1400, 900, "Buy Me a Coffee", {fontFamily: "Moving", fontSize: "48px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
    this.creditsText5 = 
      "Hello there! It's Kurt here, I coded this hell of a game and also made the track that is playing rn for menu and the credits!\n"+
      "\n"+
      "For my game dev projects look up makinDAGames and for my music projects look up Kurt Clawhammer. Thanks for playing!\n"+
      "\n"+
      "Kurt Clawhammer and Abuzer DAG on youtube, Kurt Clawhammer and The Clawhammers on Spotify and other music platforms."+
      "\n"+
      "(We know your favorite number is " + localStorage.getItem("favNum") + " !!!)"
    this.credits5Buttons = []
      this.credits5Buttons.push(this.add.text(200, 900, "Youtube", {fontFamily: "Moving", fontSize: "32px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
      this.credits5Buttons.push(this.add.text(500, 900, "Spotify", {fontFamily: "Moving", fontSize: "32px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
      this.credits5Buttons.push(this.add.text(800, 900, "Other Spotify", {fontFamily: "Moving", fontSize: "32px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
      this.credits5Buttons.push(this.add.text(1100, 900, "makindagames.xyz", {fontFamily: "Moving", fontSize: "32px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
      this.credits5Buttons.push(this.add.text(1400, 900, "clawhammer.xyz", {fontFamily: "Moving", fontSize: "32px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
      this.credits5Buttons.push(this.add.text(1700, 900, "github", {fontFamily: "Moving", fontSize: "32px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
    this.creditsText6 = 
      "Hello everypony. I'm Daniel - CreakyWaffle, sometimes I music-ing. It was nice to work with this team. =)\n"+
      "\n"+
      "You can visit my YT - Creaky Waffle\n"
    this.credits6Buttons = []
    this.credits6Buttons.push(this.add.text(this.cameras.main.centerX, 900, "Youtube", {fontFamily: "Moving", fontSize: "48px", color: "#ffffff"}).setOrigin(0.5).setScrollFactor(0).setDepth(101).setInteractive().setVisible(false));
    this.allBtns = [...this.credits2Buttons, ...this.credits3Buttons, ...this.credits4Buttons, ...this.credits5Buttons, ...this.credits6Buttons]
    this.links = ["https://www.tiktok.com/@weylibn", "https://www.youtube.com/@weylb1828", "https://x.com/Frisk00071", "https://www.instagram.com/weylibn/", "https://www.patreon.com/weylibn", "https://www.buymeacoffee.com/weylibn", "https://www.instagram.com/eslemw", "https://www.artstation.com/eslemw", "https://www.tiktok.com/@eslemw", "https://www.buymeacoffee.com/eslemw", "https://www.youtube.com/@kurtclawhammer", "https://open.spotify.com/intl-tr/artist/0c0jNUmp0CTt5DYNKB9cc0", "https://open.spotify.com/intl-tr/artist/0FAxMIAZlrhY5EyvxBJoIh", "https://www.makindagames.xyz", "https://www.clawhammer.xyz", "https://www.github.com/furkkurt", "https://www.youtube.com/@creakywaffle1029"]

this.credits2Buttons.forEach(button => {
        button.on("pointerover", () => {
          this.tweens.add({
            targets: button,
            scale: 1.1,
            duration: 100,
            ease: "Linear",
          });
        });
        button.on("pointerout", () => {
          this.tweens.add({
            targets: button,
            scale: 1,
            duration: 100,
            ease: "Linear",
          });
        });
        button.on("pointerdown", () => {
          this.openLink(this.links[this.allBtns.indexOf(button)])
        });
      });
this.credits3Buttons.forEach(button => {
        button.on("pointerover", () => {
          this.tweens.add({
            targets: button,
            scale: 1.1,
            duration: 100,
            ease: "Linear",
          });
        });
        button.on("pointerout", () => {
          this.tweens.add({
            targets: button,
            scale: 1,
            duration: 100,
            ease: "Linear",
          });
        });
        button.on("pointerdown", () => {
          this.openLink(this.links[this.allBtns.indexOf(button)])
        });
      });
this.credits4Buttons.forEach(button => {
        button.on("pointerover", () => {
          this.tweens.add({
            targets: button,
            scale: 1.1,
            duration: 100,
            ease: "Linear",
          });
        });
        button.on("pointerout", () => {
          this.tweens.add({
            targets: button,
            scale: 1,
            duration: 100,
            ease: "Linear",
          });
        });
        button.on("pointerdown", () => {
          this.openLink(this.links[this.allBtns.indexOf(button)])
        });
      });
this.credits5Buttons.forEach(button => {
        button.on("pointerover", () => {
          this.tweens.add({
            targets: button,
            scale: 1.1,
            duration: 100,
            ease: "Linear",
          });
        });
      this.credits5Buttons.forEach(button => {
        button.on("pointerout", () => {
          this.tweens.add({
            targets: button,
            scale: 1,
            duration: 100,
            ease: "Linear",
          });
        });
      });
      button.on("pointerdown", () => {
        this.openLink(this.links[this.allBtns.indexOf(button)])
      });
    });

this.credits6Buttons.forEach(button => {
        button.on("pointerover", () => {
          this.tweens.add({
            targets: button,
            scale: 1.1,
            duration: 100,
            ease: "Linear",
          });
        });
        button.on("pointerout", () => {
          this.tweens.add({
            targets: button,
            scale: 1,
            duration: 100,
            ease: "Linear",
          });
        });
        button.on("pointerdown", () => {
          this.openLink(this.links[this.allBtns.indexOf(button)])
        });
      });
    // Calculate total height needed
    //const lineHeight = 40;
    //const totalHeight = creditsText.length * lineHeight;

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
    /** 
    let currentY = 0;
    creditsText.forEach(line => {
      const textObject = this.add.text(0, currentY, line, textStyle)
        .setOrigin(0.5, 0);
      container.add(textObject);
      currentY += lineHeight;
    });
    */
    // Set up scrolling animation
    /** 
    this.tweens.add({
      targets: container,
      y: -totalHeight,
      duration: 40000, // 40 seconds to scroll
      ease: 'Linear',
      onComplete: () => {
        // After credits finish, return to title/menu
        this.time.delayedCall(1000, () => {
          // You can change this to whatever scene should come after credits
          this.scene.start('mainMenu');
        });
      }
    });

    */
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
    this.i = 0
    this.textText.text = this.creditsText; 
    // Handle skip input
    this.input.keyboard.on('keydown-SPACE', () => {
      //this.scene.start('mainMenu');
      if(this.i == 0) {
        this.textText.text = this.creditsText2;
        this.credits2Buttons.forEach(button => {
          button.setVisible(true)
        });
      }
      if(this.i == 1) {
        this.textText.text = this.creditsText3;
        this.credits2Buttons.forEach(button => {
          button.setVisible(false)
        });
        this.credits3Buttons.forEach(button => {
          button.setVisible(true)
        });
      }
      if(this.i == 2) {
        this.textText.text = this.creditsText4;
        this.credits3Buttons.forEach(button => {
          button.setVisible(false)
        });
        this.credits4Buttons.forEach(button => {
          button.setVisible(true)
        });
      }
      if(this.i == 3) {
        this.textText.text = this.creditsText5;
        this.credits4Buttons.forEach(button => {
          button.setVisible(false)
        });
        this.credits5Buttons.forEach(button => {
          button.setVisible(true)
        });
      }
      if (this.i == 4) {
        this.textText.text = this.creditsText6;
        this.credits5Buttons.forEach(button => {
          button.setVisible(false)
        });
        this.credits6Buttons.forEach(button => {
          button.setVisible(true)
        });
      }
      if(this.i == 5) {
        this.scene.start('mainMenu');
      }
      this.i++;
    });
  }
  openLink (link) {
    window.open(link, "_blank");
  }
}
