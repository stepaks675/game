import Phaser from "phaser";
export default class MainMenu extends Phaser.Scene {
    constructor() {
      super("MainMenu");
    }
  
    preload() {
      this.load.image("menuBg", "assets/menubg.jpg"); 
      this.load.audio("menuMusic", "assets/menumusic.mp3"); 
    }
  
    create() {
      this.add.image(800, 300, "menuBg").setScale(1); 
  
      this.music = this.sound.add("menuMusic", { loop: true });
      this.music.play(); 
  
      const startButton = this.add.text(800, 300, "START", {
        fontSize: "92px",
        fill: "#ffffff",
        fontFamily: "Arial",
        fontWeight: "bold",
        backgroundColor: "#ff0000",
        padding: { x: 20, y: 10 },
      });
  
      startButton.setInteractive();
      startButton.on("pointerdown", () => {
        this.music.stop();
        this.scene.start("GameScene"); 
      });
    }
  }
  