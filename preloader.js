var brightness = parseInt(localStorage.getItem("brightness")) ?? 5
var musicVolume = parseInt(localStorage.getItem("musicVol")) ?? 5
var sfxVolume = parseInt(localStorage.getItem("sfxVol")) ?? 5
var favNum = parseInt(localStorage.getItem("favNum")) ?? 5
var currentMusic = ""
var currentSlot = 0

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
        this.load.image("inventory", "./assets/inventory.png");
        this.load.tilemapTiledJSON('room1', 'assets/room1.json');

        this.load.audio("ong", "music/ong.wav")
        this.load.audio("docsTheme", "music/docsTheme.wav")

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


        //BUNU SONRA SİL
        localStorage.setItem("firstSlotScene", "")

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
            frameRate: 8,
            frames: [{key:"doc", frame:"1"}, {key: "doc", frame: "2"}, {key: "doc", frame: "3"}, {key: "doc", frame: "4"}, {key: "doc", frame: "5"}, {key: "doc", frame: "6"}, {key: "doc", frame: "7"}, {key: "doc", frame: "8"}, {key: "doc", frame: "9"}],
            repeat: -1
        })

        this.scene.start("demo")

    }
}
