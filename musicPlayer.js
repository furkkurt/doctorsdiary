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
    currentMusic = "";
    
    // Create track display text
    this.trackDisplay = this.add.text(
      this.game.config.width - 20,
      20,
      '',
      {
        fontFamily: 'Moving',
        fontSize: '32px',
        color: '#ffffff',
        stroke: '#000000',
        strokeThickness: 4
      }
    )
    .setOrigin(1, 0)
    .setScrollFactor(0)
    .setDepth(Number.MAX_SAFE_INTEGER)
    .setAlpha(0);
  };

  showTrackInfo(key) {
    try {
      if (!musicPlayer.trackInfo[key]) return;

      const { artist, name } = musicPlayer.trackInfo[key];
      const text = `Current Track: ${artist} - ${name}`;

      if (this.trackDisplay && this.trackDisplay.setText) {
        this.trackDisplay.setText(text);
        
        // Only try animation if the text update worked
        if (this.displayTween) {
          this.displayTween.stop();
        }

        this.displayTween = this.tweens.add({
          targets: this.trackDisplay,
          alpha: { from: 0, to: 1 },
          duration: 500,
          ease: 'Linear',
          onComplete: () => {
            this.time.delayedCall(5000, () => {
              this.tweens.add({
                targets: this.trackDisplay,
                alpha: 0,
                duration: 500,
                ease: 'Linear'
              });
            });
          }
        });
      }
    } catch (e) {
      // Silently ignore any errors - track info is nice to have but not critical
    }
  }
  

  playMusic(key) {
    currentMusic = key
    let music = this.sound.add(key, { loop: true, volume: musicVolume/5 });
    this.sound.sounds.forEach(s => {
      if (s.loop) {   // looplananlar müziktir varsaydım
        s.stop();
      }
    });
    music.play();
    this.showTrackInfo(key);
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
