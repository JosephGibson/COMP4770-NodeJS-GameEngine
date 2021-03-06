// @flow
/* global module */
/* global require */

const Vec = require('./Vec.js');
const Animation = require('./../rendering/Animation.js');
const getAnimation = require('./../rendering/Rendering.js').getAnimation;
// $FlowFixMe
const Clock = require('@gamestdio/clock');

const MAX_COMPONENTS = 17;

// Think of this as an abstract base class
class Component {
    static INDEX: number;
}
// The value of INDEX is useless here.
Component.INDEX = Infinity;

class CTransform extends Component {
    static INDEX: number;

    pos: Vec;
    prevPos: Vec;
    facing: number;
    speed: Vec;
    angle: number;

    constructor(p: Vec) {
        super();
        this.pos = p;
        this.prevPos = p;
        this.facing = 1;
        this.speed = new Vec(0.0, 0.0);
        this.angle = 0.0;
    }
}
CTransform.INDEX = 0;

class CInput extends Component {
    static INDEX: number;

    up: boolean;
    down: boolean;
    left: boolean;
    right: boolean;
    shoot: boolean;
    canJump: boolean;
    jumpClock: Clock;

    constructor() {
        super();
        this.up = false;
        this.down = false;
        this.left = false;
        this.right = false;
        this.shoot = false;
        this.canJump = true;
        this.jumpClock = new Clock();
    }
}
CInput.INDEX = 1;

class CBoundingBox extends Component {
    static INDEX: number;

    size: Vec;
    halfSize: Vec;
    blockMove: boolean;
    blockVision: boolean;

    constructor(s: Vec, m: boolean, v: boolean) {
        super();
        this.size = s;
        this.halfSize = new Vec(this.size.x / 2, this.size.y / 2);
        this.blockMove = m;
        this.blockVision = v;
    }
}
CBoundingBox.INDEX = 2;

class CGravity extends Component {
    static INDEX: number;

    gravity: number;

    constructor(g: number) {
        super();
        this.gravity = g;
    }
}
CGravity.INDEX = 3;

class CHealth extends Component {
    static INDEX: number;

    health: number;

    constructor(hp: number) {
        super();
        this.health = hp;
    }
}
CHealth.INDEX = 4;

class CState extends Component {
    static INDEX: number;

    state: string;
    grounded: boolean;

    constructor(s: string) {
        super();
        this.state = s;
        this.grounded = true;
    }
}
CState.INDEX = 5;

class CDraggable extends Component {
    static INDEX: number;

    isBeingDragged: boolean;
    animationIndex: number;

    constructor() {
        super();
        this.isBeingDragged = false;
        this.animationIndex = 0;
    }
}
CDraggable.INDEX = 6;

/* istanbul ignore next */
class CFollow extends Component {
    static INDEX: number;

    hasVision: boolean;         // The boolean to keep track of weather the entity has vison.
    home: Vec;                  // The "home" location of the entity.
    approachDistance: number;   // The approach-distance for the follow behavior.
    visionDistance: number;     // The vision-distance for the follow behavior. 
    speed: number;              // The speed the entity will follow at. 
    returnHome: boolean;        // The bool to decide if the enity should go home on no-vision.
    constructor(h: Vec, ad: number, vd: number, s: number, g: boolean) {
        super();
        this.approachDistance = ad * ad; // Use with distf() ! 
        this.visionDistance =  vd * vd;  // Use distf() !
        this.speed = s;
        this.returnHome = g;
        this.home = h;
        this.hasVision = false;
    }

}
CFollow.INDEX = 7;

class CPatrol extends Component {
    static INDEX: number;

    positions: Array<number>;
    currentPosition: number;
    speed: number;

    constructor(p: Array<number>, s: number) {
        super();
        this.positions = p;
        this.speed = s;
    }
}
CPatrol.INDEX = 8;

/* istanbul ignore next */
class CAnimation extends Component {
    static INDEX: number;

    animation: Animation;
    repeated: boolean;

    constructor(n: string, r: boolean) {
        super();
        this.animation = getAnimation(n);
        this.repeated = r;
    }
}
CAnimation.INDEX = 9;


/* istanbul ignore next */
class CMeele extends Component {
    static INDEX: number;

    damage: number;             // The damage of the meele attack.
    range: number;              // The range of the meele attack.
    offset: number;             // The hit box offset.
    halfSize: Vec;              // The "halfSize" of the hurt-box.
    frameStart: number;         // The first frame of the attack animation.
    frameEnd: number;           // The last frame of the attack animation.
    cooldown: number;           // The time until the entity can attack again.
    clock: Clock;               // The clock to mesure the cooldown.

    constructor(d: number, hs: Vec, c: number, r: number, o: number,fs: number, fe: number) {
        super();
        this.damage = d; 
        this.halfSize = hs;
        this.frameStart = fs;
        this.frameEnd = fe;
        this.cooldown = c;
        this.offset = o;
        this.clock = new Clock();
        this.range = r * r;           // Use me with distf()!
    }
}
CMeele.INDEX = 10;


/* istanbul ignore next */
class CRanged extends Component {
    static INDEX: number;

    range: number;          // The minimum attack range.
    cooldown: number;       // The cooldown time after an attack (in ms)/
    clock: Clock;           // The clock to manage the cooldown.

    constructor(r: number, c: number) {
        super();
        this.range = r*r;        // Use me with distf()!
        this.cooldown = c;
        this.clock = new Clock();
    }
}
CRanged.INDEX = 11;


/* istanbul ignore next */
class CProjectile extends Component {
    static INDEX: number;

    damage: number;            // The damgage the projectile deals.
    friendly: boolean;         // Does this projectile hurt players?
    constructor(d: number, f: boolean) {
        super();
        this.damage = d;
        this.friendly = f;
    }
}
CProjectile.INDEX = 12;


/* istanbul ignore next */
class CLifespan extends Component {
    static INDEX: number;

    duration: number;
    clock: Clock;

    constructor(d: number) {
        super();
        this.duration = d;
        this.clock = new Clock(true);
    }
}
CLifespan.INDEX = 13;


/* istanbul ignore next */
class CMagic extends Component {
    static INDEX: number;
    mp: number;
    canMagic: boolean;
    cooldown: number;
    clock: Clock;

    constructor(mp: number, c: number) {
        super();
        this.mp = mp;
        this.cooldown = c;
        this.canMagic = true;
        this.clock = new Clock();
    }
}
CLifespan.INDEX = 14;


/* istanbul ignore next */
class CItem extends Component {
    static INDEX: number;

    type: string;
    amount: number;

    constructor(t: string, a: number) {
        super();
        this.type = t;
        this.amount = a;
    }
}
CItem.INDEX = 15;


/* istanbul ignore next */
class CInventory extends Component {
    static INDEX: number;

    redPotions: number;
    bluePotions: number;

    constructor() {
        super();
        this.redPotions = 0;
        this.bluePotions = 0;
    }
}
CInventory.INDEX = 16;


/* istanbul ignore next */
class CScore extends Component {
    static INDEX: number;

    score: number;

    constructor(score: number) {
        super();
        this.score = score;
    }
}
CScore.INDEX = 17;



module.exports = {
    'Component': Component,
    'CTransform': CTransform,
    'CInput': CInput,
    'CBoundingBox': CBoundingBox,
    'CGravity': CGravity,
    'CHealth': CHealth,
    'CState': CState,
    'CDraggable': CDraggable,
    'CFollow': CFollow,
    'CPatrol': CPatrol,
    'CAnimation': CAnimation,
    'CMeele': CMeele,
    'CRanged': CRanged,
    'CProjectile': CProjectile,
    'CLifespan': CLifespan,
    'CMagic': CMagic,
    'CItem': CItem,
    'CInventory': CInventory,
    'CScore': CScore,
    'MAX_COMPONENTS': MAX_COMPONENTS
};
