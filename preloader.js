class preloader extends Phaser.Scene {
    constructor() {
        super("preloader");
    };

    preload() {
        this.load.atlas("menuBar", "./assets/bandaj.png", "./assets/bandaj.json");
        this.load.image("pauseOverlay", "./assets/pauseOverlay.png");
        this.load.image("mainMenuBg", "./assets/menuBg.webp");
        this.load.image("namebg", "./assets/isimlik.png");
        this.load.image("textbg", "./assets/textbg.png");
        this.load.atlas("doc", "./assets/doktor.png", "./assets/doktor.json");
        this.load.image("testBg", "./assets/roombg1.webp");
        this.load.image("bg2", "./assets/bg2.png");
        this.load.image("bg3", "./assets/bg3.png");
        this.load.image("bg4", "./assets/bg4.png");
        this.load.image("bg5", "./assets/bg5.png");
        this.load.image("bg6", "./assets/bg6.png");
        this.load.image("bg62", "./assets/bg62.png");
        this.load.image("bg7", "./assets/bg7.png");
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
        this.load.image("matchesitem", "./assets/matches.png");
        this.load.image("inventory", "./assets/inventory.png");
        this.load.tilemapTiledJSON('room1', 'assets/room1.json');
        this.load.tilemapTiledJSON('room2', 'assets/kidsRoom.json');
        this.load.tilemapTiledJSON('office2', 'assets/ofis2.json');
        this.load.tilemapTiledJSON('kidsRoom', 'assets/kidsRoom.json');
        this.load.tilemapTiledJSON('corridor2', 'assets/corridor2.json');
        this.load.tilemapTiledJSON('corridorUp', 'assets/corridorUp.json');
        this.load.image("nurse", "./assets/nurse.webp");
        this.load.image("nursePort", "./assets/nursePort.webp");
        this.load.atlas("docPort", "./assets/docport1.png", "./assets/docport1.json");
        this.load.atlas("kids", "./assets/kids1.png", "./assets/kids1.json");
        this.load.atlas("kidsPort", "./assets/kidsport1.png", "./assets/kidsport1.json");
        //doldurma
        this.load.image("stairs", "./assets/stairs.png");
        this.load.image("stairs2", "./assets/stairs.png");
        this.load.image("matches", "./assets/stairs.png");
        this.load.image("ofis1", "./assets/ofis1.png");
        this.load.image("kidsRoomDoor", "./assets/kidsRoom.png");

        this.load.audio("ong", "music/ong.wav")
        this.load.audio("docsTheme", "music/docsTheme.wav")
        this.load.audio("walk", "sfx/walking.wav")
        this.load.audio("walkEcho", "sfx/walkingEcho.wav")
        this.load.audio("door", "sfx/door.wav")

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
        // progress is tracked via first/second/thirdSlotScene only


        // keep existing saves intact; do not reset slot scene keys here

        this.loading = this.add.text(this.cameras.main.centerX, this.cameras.main.centerY, "LOADING", {
            fontFamily: "Moving",
            fontSize: "64px",
        });

        console.log("preload")

        this.loading.setOrigin(0.5, 0.5)

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
        //portraits 
        this.anims.create({
            key: "kidsPort1",
            frameRate: 1,
            frames: [{key: "kidsPort", frame: "0"}],
            repeat: 0
        })
        this.anims.create({
            key: "kidsPort2",
            frameRate: 1,
            frames: [{key: "kidsPort", frame: "1"}],
            repeat: 0
        })
        this.anims.create({
            key: "kidsPort3",
            frameRate: 1,
            frames: [{key: "kidsPort", frame: "2"}],
            repeat: 0
        })
        this.anims.create({ 
            key: "kidsPort4",
            frameRate: 1,
            frames: [{key: "kidsPort", frame: "3"}],
            repeat: 0
        })
        this.anims.create({
            key: "kidsPort5",
            frameRate: 1,
            frames: [{key: "kidsPort", frame: "4"}],
            repeat: 0
        })
        this.anims.create({
            key: "kidsPort6",
            frameRate: 1,
            frames: [{key: "kidsPort", frame: "5"}],
            repeat: 0
        })
        
        this.anims.create({
            key: "docPort1",
            frameRate: 1,
            frames: [{key: "docPort", frame: "0"}],
            repeat: 0
        })
        this.anims.create({
            key: "docPort2",
            frameRate: 1,
            frames: [{key: "docPort", frame: "1"}],
            repeat: 0
        })
        this.anims.create({
            key: "docPort3",
            frameRate: 1,
            frames: [{key: "docPort", frame: "2"}],
            repeat: 0
        })
        this.anims.create({
            key: "docPort4",
            frameRate: 1,
            frames: [{key: "docPort", frame: "3"}],
            repeat: 0
        })
        this.anims.create({
            key: "docPort5",
            frameRate: 1,
            frames: [{key: "docPort", frame: "4"}],
            repeat: 0
        })
        this.anims.create({
            key: "docPort6",
            frameRate: 1,
            frames: [{key: "docPort", frame: "5"}],
            repeat: 0
        })
        this.anims.create({
            key: "docPort7",
            frameRate: 1,
            frames: [{key: "docPort", frame: "6"}],
            repeat: 0
        })
        this.anims.create({
            key: "docPort8",
            frameRate: 1,
            frames: [{key: "docPort", frame: "7"}],
            repeat: 0
        })
        this.anims.create({
            key: "docPort9",
            frameRate: 1,
            frames: [{key: "docPort", frame: "8"}],
            repeat: 0
        })
        this.anims.create({
            key: "docPort10",
            frameRate: 1,
            frames: [{key: "docPort", frame: "9"}],
            repeat: 0
        })
        this.anims.create({
            key: "docPort11",
            frameRate: 1,
            frames: [{key: "docPort", frame: "10"}],
            repeat: 0
        })
        this.anims.create({
            key: "docPort12",
            frameRate: 1,
            frames: [{key: "docPort", frame: "11"}],
            repeat: 0
        })
        

        this.scene.start("demo")

    }
}
