import Phaser from "phaser";
import { useEffect, useState, useRef } from "react";
import MainMenu from "./Menu";
import { VerifierComponent } from "./Verifier";
export const Game = () => {
  const gameRef = useRef(null);
  const [uname, setUname] = useState("")
  const [score, setScore] = useState(0);
  const [gameOver, setGameOver] = useState(true);
  const [proof, setProof] = useState({
    proof: "",
    "public-inputs": "",
    "vkey-hash": "",
  });
  const [isProving, setIsProving] = useState(false);

  useEffect(() => {
    if (gameRef.current) return;

    const config = {
      type: Phaser.AUTO,
      width: 1600,
      height: 600,
      parent: "game-container",
      physics: {
        default: "arcade",
        arcade: { gravity: { y: 500 }, debug: false },
      },
      scene: [MainMenu, GameScene],
    };

    let name = prompt("Enter Username")
    if (name) setUname(name)

    const game = new Phaser.Game(config);
    gameRef.current = game;

    return () => game.destroy(true);
  }, []);

  class GameScene extends Phaser.Scene {
    constructor() {
      super("GameScene");
    }
    preload() {
      this.load.image("background", "assets/bg.jpg");
      this.load.image("warning", "assets/warning.png");
      this.load.image("ground", "assets/ground.jpg");

      this.load.image("crab1", "assets/crab1.png");
      this.load.image("crab2", "assets/crab2.png");
      this.load.image("crabjump", "assets/crabjump.png");
      this.load.image("crabfall", "assets/crabfall.png");

      this.load.image("killwall", "assets/killwall.png");
      this.load.image("obstacle", "assets/obstacle.png");
      this.load.image("crisis", "assets/crisis.png");
      this.load.image("uma", "assets/eviluma.png");
      this.load.image("rocket", "assets/rocket.png");

      this.load.image("star", "assets/star.png");
      this.load.image("star2", "assets/star2.png");
      this.load.image("star3", "assets/star3.png");

      this.load.audio("death", "assets/dead.mp3");
      this.load.audio("bgmusic", "assets/zkflow.mp3");
      this.load.audio("jump", "assets/jump.mp3");
      this.load.audio("star", "assets/star.mp3");
      this.load.audio("crisisrizz", "assets/crisisrizz.mp3");
      this.load.audio("alarm", "assets/alarm.mp3");
      this.load.audio("babah", "assets/babah.mp3");
      this.load.audio("shot", "assets/shot.mp3")
    }

    create() {
      setGameOver(false);
      this.anims.create({
        key: "run",
        frames: [{ key: "crab1" }, { key: "crab2" }],
        frameRate: 6,
        repeat: -1,
      });

      this.anims.create({
        key: "starfly",
        frames: [{ key: "star" }, { key: "star2" }, { key: "star3" }],
        frameRate: 6,
        repeat: -1,
      });

      this.score = 0;
      this.bonusscore = 0;
      this.gameOver = false;

      this.bgmusic = this.sound.add("bgmusic", { loop: true });

      this.jumpsound = this.sound.add("jump");
      this.jumpsound.setVolume(0.5);

      this.deathsound = this.sound.add("death");
      this.starsound = this.sound.add("star");
      this.shot = this.sound.add("shot");
      this.shot.setVolume(0.6)
      this.crisissound = this.sound.add("crisisrizz");
      this.alarm = this.sound.add("alarm");
      this.boom = this.sound.add("babah");
      this.alarm.setVolume(0.75);
      this.bgmusic.play();

      this.add.image(800, 300, "background");
      this.ground = this.add.tileSprite(800, 530, 1600, 139, "ground");

      this.realground = this.add.rectangle(800, 600, 1600, 100);
      this.physics.add.existing(this.realground, true);

      this.player = this.physics.add.sprite(200, 300, "crab1").setScale(0.5);
      this.player.body.setGravityY(1300);

      this.killzone = this.add.sprite(-230, 300, "killwall");
      this.killzone.setAlpha(0.7);

      this.cursors = this.input.keyboard.createCursorKeys();

      this.obstacles = this.physics.add.group();
      this.warnings = this.add.group();
      this.nextObstacleTime = Phaser.Math.Between(1000, 3000);

      this.time.addEvent({
        delay: this.nextObstacleTime,
        callback: spawnObstacle,
        callbackScope: this,
      });
      this.time.addEvent({
        delay: this.nextObstacleTime,
        callback: spawnFlyingObstacle,
        callbackScope: this,
      });
      this.time.addEvent({
        delay: this.nextObstacleTime,
        callback: spawnMiddleObstacle,
        callbackScope: this,
      });
      this.time.addEvent({
        delay: 50000,
        callback: spawnRocketer,
        callbackScope: this,
      });
      this.time.addEvent({
        delay: 10000,
        callback: spawnStar,
        callbackScope: this,
      });

      function collectStar(player, star) {
        star.destroy();
        this.sound.play("star");
        this.bonusscore += 500;
      }
      function spawnRocketer() {
        if (this.gameOver) return;
        this.sound.play("alarm");
        const uma = this.add.sprite(1500, 100, "uma").setScale(2);
        this.time.addEvent({
          delay: 5000,
          callback: FIRE,
          callbackScope: this,
        });
      }

      function FIRE() {
        if (this.gameOver) return;
        this.shot.play()
        let xvec = this.player.x - 1500;
        let yvec = this.player.y - 100;
        const rocket = this.physics.add
          .sprite(1500, 100, "rocket")
          .setScale(0.32 + score / 20000);
        rocket.rotation = Phaser.Math.Angle.Between(
          rocket.x,
          rocket.y,
          xvec,
          yvec
        );
        rocket.rota;
        rocket.body.allowGravity = false;
        rocket.setVelocityX(xvec / 2 - score / 10000);
        rocket.setVelocityY(yvec / 2 - score / 10000);

        this.physics.add.collider(rocket, this.player, () => {
          this.player.x -= 50;
          rocket.destroy();
          this.boom.play();
        });
        this.physics.add.collider(rocket, this.realground, () => {
          rocket.destroy();
          this.boom.play();
        });
        this.physics.add.collider(rocket, this.obstacles, () => {
          rocket.destroy();
          this.boom.play();
        });

        this.time.addEvent({
          delay: Math.max(1000, 3000 - score / 10),
          callback: FIRE,
          callbackScope: this,
        });
      }
      function spawnStar() {
        if (this.gameOver) return;
        const randomcord = Phaser.Math.Between(200, 250);
        const star = this.physics.add
          .sprite(1600, randomcord, "star")
          .setScale(0.5);
        star.setVelocityX(-500);
        star.play("starfly");
        star.body.allowGravity = false;

        this.physics.add.overlap(this.player, star, collectStar, null, this);
        this.time.addEvent({
          delay: 10000,
          callback: spawnStar,
          callbackScope: this,
        });
      }

      function spawnMiddleObstacle() {
        if (this.gameOver) return;
        if (this.score > 2000) {
          const randomcord = Phaser.Math.Between(200, 500);
          const warning = this.warnings
            .create(800, randomcord, "warning")
            .setAlpha(0.5);
          this.time.delayedCall(700, () => {
            this.crisissound.play();
            const obstacle = this.obstacles
              .create(1600, randomcord, "crisis")
              .setScale(0.3);
            obstacle.setVelocityX(-2200 - score / 5);
            obstacle.body.immovable = true;
            obstacle.body.allowGravity = false;
            this.physics.add.collider(this.player, obstacle);

            warning.destroy();
          });
        }
        this.nextObstacleTime = Phaser.Math.Between(
          3000 - score / 10,
          7000 - score / 10
        );
        this.time.addEvent({
          delay: this.nextObstacleTime,
          callback: spawnMiddleObstacle,
          callbackScope: this,
        });
      }
      function spawnFlyingObstacle() {
        if (this.gameOver) return;
        if (this.score > 1000) {
          const obstacle = this.obstacles
            .create(1600, 250, "obstacle")
            .setScale(
              Phaser.Math.Between(250 + score / 25000, 500 + score / 25000) /
                1000
            );
          obstacle.setVelocityX(-200 - this.score / 7);
          obstacle.body.immovable = true;
          obstacle.body.allowGravity = false;
          this.physics.add.collider(this.player, obstacle);
        }
        this.nextObstacleTime = Phaser.Math.Between(2000, 5000);
        this.time.addEvent({
          delay: this.nextObstacleTime,
          callback: spawnFlyingObstacle,
          callbackScope: this,
        });
      }

      function spawnObstacle() {
        if (this.gameOver) return;
        const obstacle = this.obstacles
          .create(1600, 550, "obstacle")
          .setOrigin(0, 1)
          .setScale(
            Phaser.Math.Between(300 + score / 25000, 700 + score / 25000) / 1000
          );
        obstacle.setVelocityX(-400 - this.score / 3);
        obstacle.body.immovable = true;
        obstacle.body.allowGravity = false;

        this.physics.add.collider(this.player, obstacle);
        this.nextObstacleTime = Phaser.Math.Between(
          1000 - score / 10,
          4000 - score / 10
        );
        this.time.addEvent({
          delay: this.nextObstacleTime,
          callback: spawnObstacle,
          callbackScope: this,
        });
      }

      this.scoreText = this.add.text(20, 20, "Score: 0", {
        fontSize: "32px",
        fill: "#ffffff",
        fontFamily: "Arial",
        fontWeight: "bold",
      });

      this.physics.add.collider(this.player, this.realground);
    }

    update() {
      if (!this.gameOver) {
        this.ground.tilePositionX += 1 + this.score / 300;
        this.killzone.x = Math.min(this.killzone.x + 0.05, 500);
        this.player.setVelocityX(15 + score / 500);
        this.score += 1;
        this.scoreText.setText("Score: " + (this.score + this.bonusscore));

        if (this.player.x < this.killzone.x + 230) {
          setScore((p) => Math.max(this.score + this.bonusscore, p));
          this.deathsound.play();
          this.gameOver = true;
          this.alarm.stop();
          this.physics.pause();
          this.bgmusic.stop();

          setTimeout(() => {
            this.scene.start("MainMenu");
          }, 3000);
          setTimeout(() => {
            setGameOver(true);
          }, 3000);
        }
        if (this.cursors.up.isDown && this.player.body.touching.down) {
          this.jumpDuration = 1;
          this.jumpsound.play();
          this.player.setVelocityY(-500);
        }

        if (this.jumpDuration > 0) {
          if (this.cursors.up.isDown && this.jumpDuration < 30) {
            this.player.setVelocityY(-500 + this.jumpDuration * 2);
            this.jumpDuration++;
          } else {
            this.jumpDuration = 0;
          }
        }
        if (this.player.body.touching.down) {
          this.player.anims.play("run", true);
        } else {
          if (this.player.body.velocity.y < 0) {
            this.player.setTexture("crabjump");
          } else {
            this.player.setTexture("crabfall");
          }
        }
        this.obstacles.children.each((obstacle) => {
          if (obstacle.x < -100) {
            this.obstacles.remove(obstacle, true, true);
          }
        });
      }
    }
  }

  const ProofRequest = () => {
    alert(`Generating proof of ${score} score for ${uname || "ANON"}`)
    alert("Proving takes long, pls wait");
    setIsProving(true);
    fetch("http://localhost:3000/score", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({points: score}),
    })
      .then((r) => r.json())
      .then((r) => {
        console.log(r);
        setProof({
          proof: r.proof,
          "public-inputs": r["public_inputs"],
          "vkey-hash": r["vkey_hash"],
        });
        console.log("PROOF RECEIVED");
      });
  };

  return (
    <div className="flex flex-col justify-start items-center gap-10">
      <div id="game-container" className="relative border-8 border-l-white border-r-white border-b-white border-t-0">
        {gameOver && (
          <div className="absolute text-pink-500 left-[730px] top-[230px] text-5xl font-bold">
            YOUR HIGH SCORE: {score}
          </div>
        )}
      </div>
      {/* {gameOver && score>0 && (
        <button
          disabled={isProving}
          onClick={ProofRequest}
          className={`cursor-pointer text-6xl rounded-xl font-bold px-4 py-3 text-white  transition-all duration-1000 ${
            !isProving
              ? `hover:bg-pink-700 hover:scale-125 animate-pulse bg-pink-500`
              : `bg-gray-300`
          }`}
        >
          {isProving ? "PROVING..." : "PROVE SCORE"}
        </button>
      )}
      {gameOver && score > 0 && proof.proof && (
        <VerifierComponent
          a={proof.proof}
          b={proof["public-inputs"]}
          c={proof["vkey-hash"]}
        />
      )} */}
    </div>
  );
};
