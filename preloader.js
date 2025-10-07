class preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    }

    init() {
        // Add a dark background
        this.cameras.main.setBackgroundColor('#000000');

        // Create loading text with temporary Arial font
        this.loadingText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 100, 'LOADING', {
            fontFamily: 'Moving',
            fontSize: '64px',
            color: '#ffffff',
            stroke: '#000000',
            strokeThickness: 4
        });
        this.loadingText.setOrigin(0.5);

        // Create percentage text
        this.percentText = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY - 30, '0%', {
            fontFamily: 'Moving',
            fontSize: '64px',
            color: '#ffffff'
        });
        this.percentText.setOrigin(0.5);

        // Create loading bar
        const width = 600;
        const height = 30;
        this.progressBar = this.add.graphics();
        this.progressBox = this.add.graphics();
        
        // Create a more stylized progress box with border
        this.progressBox.lineStyle(4, 0xffffff, 1);
        this.progressBox.strokeRect((this.cameras.main.width - width) / 2, this.cameras.main.centerY+20, width, height);
        
        // Loading progress events
        this.load.on('progress', (value) => {
            this.progressBar.clear();
            // Create a gradient-like effect for the progress bar
            this.progressBar.fillStyle(0x91cad1, 1);
            this.progressBar.fillRect(
                (this.cameras.main.width - width) / 2, 
                this.cameras.main.centerY+20, 
                width * value, 
                height
            );
            
            // Update percentage text
            this.percentText.setText(`${Math.round(value * 100)}%`);

            this.time.addEvent({
                delay: 500,
                callback: () => {
                    if (this.loadingText.text == "LOADING")
                        this.loadingText.text = "LOADING."
                    else if (this.loadingText.text == "LOADING.")
                        this.loadingText.text = "LOADING.."
                    else if (this.loadingText.text == "LOADING..")
                        this.loadingText.text = "LOADING..."
                    else if (this.loadingText.text == "LOADING...")
                        this.loadingText.text = "LOADING"
                }
            })
        });

        this.load.on('complete', () => {
            // Switch to Moving font once it's loaded
            this.loadingText.setStyle({
                fontFamily: 'Moving',
                fontSize: '64px',
                color: '#ffffff',
                stroke: '#000000',
                strokeThickness: 4
            });
            this.percentText.setStyle({
                fontFamily: 'Moving',
                fontSize: '32px',
                color: '#ffffff'
            });

            // Add a short delay before cleaning up
            this.time.delayedCall(500, () => {
                this.progressBar.destroy();
                this.loadingText.destroy();
                this.percentText.destroy();
            });
        });
    }

    preload() {
        // Load font as a binary file
        this.load.binary('Moving', 'Moving.ttf');
        this.load.atlas("menuBar", "./assets/bandaj.png", "./assets/bandaj.json");
        this.load.image("pauseOverlay", "./assets/pauseOverlay.png");
        this.load.image("mainMenuBg", "./assets/menuBg.webp");
        this.load.image("namebg", "./assets/isimlik.png");
        this.load.image("textbg", "./assets/textbg.png");
        this.load.atlas("doc", "./assets/doktor.png", "./assets/doktor.json");
        this.load.image("testBg", "./assets/roombg1.webp");
        this.load.image("bg2", "./assets/bg2.png");
        this.load.image("bg3", "./assets/bg3.png");
        this.load.image("bg32", "./assets/bg32.png");
        this.load.image("bg4", "./assets/bg4.png");
        this.load.image("bg42", "./assets/bg42.png");
        this.load.image("bg5", "./assets/bg5.png");
        this.load.image("bg52", "./assets/bg52.png");
        this.load.image("bg6", "./assets/bg6.png");
        this.load.image("bg62", "./assets/bg62.png");
        this.load.image("bg7", "./assets/bg7.png");
        this.load.image("bg8", "./assets/bg8.png");
        this.load.image("corridorBg", "./assets/room2.webp");
        this.load.image("testBg2", "./assets/roombg1light.webp");
        this.load.image("testBgObjects", "./assets/room1objects.webp");
        this.load.image("drugs", "./assets/drugs.webp");
        this.load.image("drugs2", "./assets/drugs2.webp");
        this.load.image("lamp", "./assets/lamp.webp");
        this.load.image("lamp2", "./assets/lamp2.webp");
        this.load.image("book1", "./assets/book1.webp");
        this.load.image("book12", "./assets/book12.webp");
        this.load.image("book2", "./assets/book2.webp");
        this.load.image("book22", "./assets/book22.webp");
        this.load.image("book1item", "./assets/book1Item.png");
        this.load.image("book2item", "./assets/book2Item.png");
        this.load.image("matchesitem", "./assets/matchesItem.png");
        this.load.image("inventory", "./assets/inventory.png");
        this.load.tilemapTiledJSON('room1', 'assets/room1.json');
        this.load.tilemapTiledJSON('room2', 'assets/kidsRoom.json');
        this.load.tilemapTiledJSON('office2', 'assets/ofis2.json');
        this.load.tilemapTiledJSON('kidsRoom', 'assets/kidsRoom.json');
        this.load.tilemapTiledJSON('corridor2', 'assets/corridor2.json');
        this.load.tilemapTiledJSON('corridorUp', 'assets/corridorUp.json');
        this.load.tilemapTiledJSON('corridorDown', 'assets/corridorDown.json');
        this.load.tilemapTiledJSON('corridorDown2', 'assets/corridorDown2.json');
        this.load.tilemapTiledJSON('garden', 'assets/garden.json');
        this.load.image("nurse", "./assets/nurse.webp");
        this.load.image("nursePort", "./assets/nurse1-sheet.png");
        
        // Load individual doctor portraits
        for (let i = 1; i <= 14; i++) {
            this.load.image(`docPort${i}`, `./assets/doc${i}.png`);
        }
        
        // Load individual kids portraits
        for (let i = 1; i <= 20; i++) {
            this.load.image(`kidsPort${i}`, `./assets/twins${i}.png`);
        }
        
        this.load.atlas("kids", "./assets/t1-sheet.webp", "./assets/kids1.json");
        //doldurma
        this.load.image("stairs", "./assets/stairs.png");
        this.load.image("tree", "./assets/stairs.png");
        this.load.image("stairs2", "./assets/stairs.png");
        this.load.image("toilet", "./assets/stairs.png");
        this.load.image("desk", "./assets/stairs.png");
        this.load.image("matches", "./assets/stairs.png");
        this.load.image("door", "./assets/stairs.png");
        this.load.image("door2", "./assets/stairs.png");
        this.load.image("babies", "./assets/stairs.png");
        this.load.image("toilet2", "./assets/stairs.png");
        this.load.image("ofis1", "./assets/stairs.png");
        this.load.image("kidsRoomDoor", "./assets/stairs.png");

        this.load.audio("ong", "music/ong.wav")
        this.load.audio("docsTheme", "music/docsTheme.wav")
        this.load.audio("walk", "sfx/walking.wav")
        this.load.audio("walkEcho", "sfx/walkingEcho.wav")
        this.load.audio("door", "sfx/door.wav")
        this.load.audio("toilet", "sfx/toilet.wav")
        this.load.audio("nursesTheme", "music/nurseTheme.wav")
        this.load.audio("goodEnding", "music/goodEnding.wav")
        this.load.audio("monitor", "sfx/monitor.wav")
        this.load.audio("writing", "sfx/writing.wav")

        this.load.image("cs1", "./assets/cs1.png");
        this.load.image("cs2", "./assets/cs2.png");
        this.load.image("cs3", "./assets/cs3.png");
        this.load.image("cs4", "./assets/cs4.png");
        this.load.image("cs5", "./assets/cs5.png");

    };

    create() {

        console.log(parseInt(localStorage.getItem("brightness")))
        if(localStorage.getItem("brightness") == undefined)
            localStorage.setItem("brightness", "5");
        if(localStorage.getItem("sfxVol") == undefined)
            localStorage.setItem("sfxVol", "5");
        if(localStorage.getItem("musicVol") == undefined)
            localStorage.setItem("musicVol", "5");
        if(localStorage.getItem("favNum") == undefined)
            localStorage.setItem("favNum", "5");
        if(localStorage.getItem("firstSlotScene") == undefined)
            localStorage.setItem("firstSlotScene", "");
        if(localStorage.getItem("secondSlotScene") == undefined)
            localStorage.setItem("secondSlotScene", "");
        if(localStorage.getItem("thirdSlotScene") == undefined)
            localStorage.setItem("thirdSlotScene", "");
        if(localStorage.getItem("firstSlotItem1") == undefined)
            localStorage.setItem("firstSlotItem1", "");
        if(localStorage.getItem("firstSlotItem2") == undefined)
            localStorage.setItem("firstSlotItem2", "");
        if(localStorage.getItem("firstSlotItem3") == undefined)
            localStorage.setItem("firstSlotItem3", "");
        if(localStorage.getItem("secondSlotItem1") == undefined)
            localStorage.setItem("secondSlotItem1", "");
        if(localStorage.getItem("secondSlotItem2") == undefined)
            localStorage.setItem("secondSlotItem2", "");
        if(localStorage.getItem("secondSlotItem3") == undefined)
            localStorage.setItem("secondSlotItem3", "");
        if(localStorage.getItem("thirdSlotItem1") == undefined)
            localStorage.setItem("thirdSlotItem1", "");
        if(localStorage.getItem("thirdSlotItem2") == undefined)
            localStorage.setItem("thirdSlotItem2", "");
        if(localStorage.getItem("thirdSlotItem3") == undefined)
            localStorage.setItem("thirdSlotItem3", "");
            
        // Progress saving is now handled by baseScene


        // keep existing saves intact; do not reset slot scene keys here

        console.log("preload")

        this.anims.create({
            key: "menuDrop",
            frameRate: 8,
            frames: [{key: "menuBar", frame: "0"}, {key: "menuBar", frame: "1"}, {key: "menuBar", frame: "2"}, {key: "menuBar", frame: "3"}],
            repeat: 0
        })
        this.anims.create({
            key: "menuFold",
            frameRate: 8,
            frames: [{key: "menuBar", frame: "3"}, {key: "menuBar", frame: "2"}, {key: "menuBar", frame: "1"}, {key: "menuBar", frame: "0"}],
            repeat: 0
        })
        this.anims.create({
            key: "docIdle",
            frameRate: 1,
            frames: [{key: "doc", frame: "0"}],
            repeat: 0
        })
        this.anims.create({
            key:"docWalk",
            frameRate: 10,
            frames: [{key:"doc", frame:"1"}, {key: "doc", frame: "2"}, {key: "doc", frame: "3"}, {key: "doc", frame: "4"}, {key: "doc", frame: "5"}, {key: "doc", frame: "6"}, {key: "doc", frame: "7"}, {key: "doc", frame: "8"}, {key: "doc", frame: "9"}],
            repeat: -1
        })
        this.anims.create({
            key: "kids1",
            frameRate: 1,
            frames: [{key: "kids", frame: "0"}],
            repeat: 0
        })
        this.anims.create({
            key: "kids2",
            frameRate: 1,
            frames: [{key: "kids", frame: "1"}],
            repeat: 0
        })
        // Portraits are now static images, no animations needed

        this.scene.start("mainMenu")

    }
}
