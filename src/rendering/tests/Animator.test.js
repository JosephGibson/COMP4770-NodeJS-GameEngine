const Animation = require('../Animation.js');
const {
    setAnimation,
    getAnimation,
    draw,
    update,
    loadAnimations
} = require('../Animator.js');


test('Animator', () => {
    // Create some abitary animation objects.
    setAnimation("dummy", "someSpirte", 2, 30, 64, 64);
    setAnimation("frame", "someSpirte", 1, 30, 64, 64);
    let anim = getAnimation("dummy");
    // Draw a 1 frame object.
    let frame = getAnimation("frame");
    update(frame);
    // Cycle through the frames. 
    update(anim);
    update(anim);
    update(anim);
    update(anim);    
    draw(anim);
    // Test expect.
    expect(anim.AnimationName).toBe("dummy");
    expect(anim.CurrentFrame).toBe(0);
    expect(anim.AnimationFrame).toBe(0);
});