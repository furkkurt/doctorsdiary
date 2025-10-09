class musicPlayer extends Phaser.Scene{
  // Track info mapping as static property
  static trackInfo = {
    'docsTheme': { artist: 'Creakywaffle', name: "Doctor's Theme" },
    'nursesTheme': { artist: 'Creakywaffle', name: "Nurse's Theme" },
    'goodEnding': { artist: 'Creakywaffle', name: 'Untitled' },
    'ong': { artist: 'Kurt Clawhammer', name: 'Something' }
  };

  constructor(){
    super("musicPlayer")
  }
  create(){
    console.log("BEHOLD THE MUSIC PLAYER!");
    };
  

  playMusic(key) {
    if(currentMusic == key)
      return;
    currentMusic = key
    console.log("currentMusic", currentMusic)
    console.log("key", key)
    currentMusic = key
    let music = this.sound.add(key, { loop: true, volume: musicVolume/5 });
    this.sound.sounds.forEach(s => {
      if (s.loop) {   // looplananlar müziktir varsaydım
        s.stop();
      }
    });
    music.play();
    let slot = ""
    if (currentSlot == 1)
      slot = "first"
    else if (currentSlot == 2)
      slot = "second"
    else
      slot = "third"
    this.time.delayedCall(1000, () => {
      let currentScene = this.scene.get("scene"+localStorage.getItem(`${slot}SlotLastRoom`))
      console.log("currentScene", currentScene)
      try {
        currentScene.showTrackInfo(key);
      } catch (e) {
      }
    })
    return music;
  }

  playSfx(key) {
    let sfx = this.sound.add(key, { volume: sfxVolume/5 });
    sfx.play();
    return sfx;
  }

  playDoorSfx(key) {
    let doorSfx = this.sound.add(key, { volume: sfxVolume/5 });
    doorSfx.isDoorSfx = true; // Mark as door SFX to exclude from stopAllSfx
    doorSfx.play();
    return doorSfx;
  }

  setMusicVolume(value) {
    this.sound.sounds.forEach(s => {
      if (s.loop) {   // looplananlar müziktir varsaydım
        s.setVolume(musicVolume/5);
      }
    });
  }

  setSfxVolume(value) {
    this.sound.sounds.forEach(s => {
      if (!s.loop) {  // looplanmıyorsa sound efekt varsaydım
        s.setVolume(sfxVolume/5);
      }
    });
  }

  stopAllSfx() {
    this.sound.sounds.forEach(s => {
      if (!s.loop && !s.isDoorSfx) {  // looplanmıyorsa sound efekt varsaydım, ama door SFX hariç
        s.stop();
      }
    });
  }

  //please don't
  stopTheMusic() {
    this.sound.sounds.forEach(s => {
      if (s.loop) {  // looplanmıyorsa sound efekt varsaydım, ama door SFX hariç
        s.stop();
      }
    });
  }

  update(){
    // Keep track display in fixed position on screen
    if (this.trackDisplay) {
      this.scene.bringToTop();
      this.trackDisplay.setPosition(this.game.config.width - 20, 20);
    }
  }
}
