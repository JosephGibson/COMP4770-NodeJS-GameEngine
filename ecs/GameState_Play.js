// @flow
/* istanbul ignore file */
/* global module */
/* global require */
// flowlint untyped-import:off

const GameEngine = require('./GameEngine.js');
const GameState = require('./GameState.js');
const EntityManager = require('./EntityManager.js');
const Entity = require('./Entity.js');
const Components = require('./Components.js');
const CTransform = Components.CTransform;
const CAnimation = Components.CAnimation;
const CInput = Components.CInput;
const Vec = require('./Vec.js');

class GameState_Play extends GameState {
    game: GameEngine;
    entityManager: EntityManager;
    paused: boolean;
    player: Entity;
    levelPath: string;
    update: void => void;

    constructor(game: GameEngine, levelPath: string) {
        super();
        this.game = game;
        this.entityManager = new EntityManager();
        this.paused = false;
        this.player = this.entityManager.addEntity("player");
        this.levelPath = levelPath;

        this.init();
    }

    init() {
        this.game.setBackground('bg_cave');
        this.loadLevel();
        this.spawnPlayer();
    }

    loadLevel() {
        // TODO: load the level here (if necessary)
    }

    spawnPlayer() {
        this.player.addComponent(new CTransform(new Vec(0, 0)));
        this.player.addComponent(new CAnimation("playerRun", true));
        this.player.addComponent(new CInput());
    }

    update() {
        this.entityManager.update();

        if (!this.paused) {
            this.sAI();
            this.sMovement();
            this.sLifespan();
            this.sCollision();
            this.sAnimation();
        }

        this.sUserInput();
        this.sRender();

    }

    sUserInput() {
        // TODO: Process all user input here
        let inputMap = this.game.getInputMap();
        let playerInput = this.player.getComponent(CInput);
        playerInput.up = inputMap.w;
        playerInput.down = inputMap.s;
        playerInput.left = inputMap.a;
        playerInput.right = inputMap.d;
        playerInput.mousePos = new Vec(inputMap.mousePos[0], inputMap.mousePos[1])
    }

    sMovement() {
        // TODO: Process all movement here.
        let playerInput = this.player.getComponent(CInput);

        // Example
        if (playerInput.up) {
            this.player.getComponent(CTransform).pos.y += 1;
        }
    }

    sAnimation() {
        // TODO: Handle all animation here.
        let entities = this.entityManager.getAllEntities();
        for (let i = 0; i < entities.length; i++) {
            entities[i].getComponent(CAnimation).animation.update();
        }
    }

    sRender() {
        // TODO: Handle all rendering here.
        let entities = this.entityManager.getAllEntities();
        for (let i = 0; i < entities.length; i++) {
            // let pos = entities[i].getComponent(CTransform).pos;
            // let anim = entities[i].getComponent(CAnimation).animation;
        }
    }

    sAI() {
        // TODO: Implement Follow and Patrol behavior
    }

    sCollision() {
        // TODO: Implement collisions and physics
    }

    sLifespan() {
        // TODO: Support entity lifespans
    }
}

module.exports = GameState_Play;
