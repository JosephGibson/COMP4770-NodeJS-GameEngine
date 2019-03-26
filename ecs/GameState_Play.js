// @flow
/* istanbul ignore file */
/* global module */
/* global require */
// flowlint untyped-import:off
// flowlint unclear-type:off

const GameEngine = require('./GameEngine.js');
const GameState = require('./GameState.js');
const EntityManager = require('./EntityManager.js');
const Entity = require('./Entity.js');
const Components = require('./Components.js');
const CTransform = Components.CTransform;
const CAnimation = Components.CAnimation;
const CBoundingBox = Components.CBoundingBox;
const CInput = Components.CInput;
const Vec = require('./Vec.js');
const getAnimationsByTag = require('./../rendering/Rendering.js').getAnimationsByTag;

class GameState_Play extends GameState {
    game: GameEngine;
    entityManager: EntityManager;
    paused: boolean;
    player: Entity;
    update: void => void;
    level: Object;
    background: string;
    playerSpawn: Vec;
    levelObjective: Vec;



    constructor(game: GameEngine, level: Object) { 
        super();
        this.level = level;
        this.background = level.background;
        this.playerSpawn = new Vec(level.playerSpawn[0], level.playerSpawn[1]);
        this.levelObjective = new Vec(level.levelObjective[0], level.levelObjective[1]);
        this.game = game;
        this.entityManager = new EntityManager();
        this.paused = false;
        this.player = this.entityManager.addEntity("player");
        this.init();
    }

    init() {
        this.loadLevel();
    }


    loadLevel() {

        this.game.setBackground(this.background);
        this.spawnPlayer(this.playerSpawn);

        let tiles = this.level.entities.tiles;
        for (let i = 0; i < tiles.length; i++) {
            let tile = tiles[i];
            let newTile = this.entityManager.addEntity("tile");
            newTile.addComponent(new CTransform(new Vec(tile.pos[0], tile.pos[1])));
            newTile.addComponent(new CAnimation(tile.sprite, true));
            newTile.addComponent(new CBoundingBox(new Vec(16, 16), true, true));
        }

        let npcs = this.level.entities.npcs;
        for (let i = 0; i < npcs.length; i++) {
            let npc = npcs[i];
            let newNpc = this.entityManager.addEntity("npc");
            newNpc.addComponent(new CTransform(new Vec(npc.pos[0],npc.pos[1])));
            if (npc.name === "cowman") {
                // $FlowFixMe
                newNpc.addComponent(new CAnimation(getAnimationsByTag('npc')[0], true));
                let anim = newNpc.getComponent(CAnimation).animation;
                newNpc.addComponent(new CBoundingBox(new Vec(anim.width, anim.height), true, true));
            } else if (npc.name === "imp") {
                // $FlowFixMe
                newNpc.addComponent(new CAnimation(getAnimationsByTag('npc')[2], true));
                let anim = newNpc.getComponent(CAnimation).animation;
                newNpc.addComponent(new CBoundingBox(new Vec(anim.width, anim.height), true, true));
            } else if (npc.name === "goblin") {
                // $FlowFixMe
                newNpc.addComponent(new CAnimation(getAnimationsByTag('npc')[1], true));
                let anim = newNpc.getComponent(CAnimation).animation;
                newNpc.addComponent(new CBoundingBox(new Vec(anim.width, anim.height), true, true));
            }
        }

        let items = this.level.entities.items;
        for (let i = 0; i < items.length; i++) {
            let item = items[i];
            let newItem = this.entityManager.addEntity("item");
            newItem.addComponent(new CTransform(new Vec(item.pos[0], item.pos[1])));
            newItem.addComponent(new CAnimation(item.sprite, true));
            newItem.addComponent(new CBoundingBox(new Vec(16, 16), true, true));
        }

        let decorations = this.level.entities.decs;
        for (let i = 0; i < decorations.length; i++) {
            let decoration = decorations[i];
            let newDec = this.entityManager.addEntity('dec');
            newDec.addComponent(new CTransform(new Vec(decoration.pos[0], decoration.pos[1])));
            newDec.addComponent(new CAnimation(decoration.sprite, true));
            let anim = newDec.getComponent(CAnimation).animation
            newDec.addComponent(new CBoundingBox(new Vec(anim.width, anim.height), true, true));
        }

    }


    spawnPlayer(pos: Vec) {
        this.player.addComponent(new CTransform(pos));
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
        if (inputMap.escape){
            this.game.setNextLevel();
            this.game.popState();
        }

        playerInput.up = inputMap.w;
        playerInput.down = inputMap.s;
        playerInput.left = inputMap.a;
        playerInput.right = inputMap.d;
    }

    sMovement() {

        let playerInput = this.player.getComponent(CInput);

        // Example
        if (playerInput.up) {
            this.player.getComponent(CTransform).pos.y += 3;
        }
        else if (playerInput.down) {
            this.player.getComponent(CTransform).pos.y -= 3;
        }

        if (playerInput.left) {
            this.player.getComponent(CTransform).pos.x -= 3;
            this.player.getComponent(CTransform).facing = -1;
        } else if (playerInput.right) {
            this.player.getComponent(CTransform).pos.x += 3;
            this.player.getComponent(CTransform).facing = 1;
        }
    }

    sAnimation() {
        // TODO: Handle all animation here.
        let entities = this.entityManager.getAllEntities();
        for (let i = 0; i < entities.length; i++) {
            if (entities[i].hasComponent(CAnimation)){
                entities[i].getComponent(CAnimation).animation.update();
            }
        }
    }

    sRender() {
        let playerPos = this.player.getComponent(CTransform).pos;
        let entities = this.entityManager.getAllEntities();
        for (let i = 0; i < entities.length; i++) {
            let entity = entities[i];
            // Only draw entities with Animations.
            if (entity.hasComponent(CAnimation)){
                let pos = entity.getComponent(CTransform).pos;
                // Use culling to rapidly remove non-onscreen entites.
                if (playerPos.distf(pos) < 360000) {
                    let dir = entity.getComponent(CTransform).facing;
                    let anim = entity.getComponent(CAnimation).animation;
                    this.game.draw(anim, dir, pos);
                }
            }
        }
        this.game.drawFrame(playerPos);
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
