class musicPlayer extends Phaser.Scene{
  constructor(){
    super("musicPlayer")
  }
  create(){
    console.log("BEHOLD THE MUSIC PLAYER!");


  };

  playMusic(key) {
    currentMusic = key
    let music = this.sound.add(key, { loop: true, volume: musicVolume/5 });
    this.sound.sounds.forEach(s => {
      if (s.loop) {   // looplananlar müziktir varsaydım
        s.stop();
      }
    });
    music.play();
    return music;
  }

  playSfx(key) {
    let sfx = this.sound.add(key, { volume: sfxVolume/5 });
    sfx.play();
    return sfx;
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

  update(){
  }
}
