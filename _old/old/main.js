var width = 800;
var height = 600;
var ratio = width / height;
var renderer = PIXI.autoDetectRenderer(width, height,{
    backgroundColor : 0x1099bb,
    autoResize : true
});
document.body.appendChild(renderer.view);

// create the root of the scene graph
var stage = new PIXI.Container();

var container = new PIXI.ParticleContainer(5000,{
    scale: true,
    position: true,
    rotation: false,
    uvs: true,
    alpha: true
});

stage.addChild(container);

for (var j = 0; j < 5; j++) {

    for (var i = 0; i < 5; i++) {
        var bunny = PIXI.Sprite.fromImage('bunny.png');
        bunny.interactive = true;
        bunny.buttonMode = true;
        bunny.x = 40 * i;
        bunny.y = 40 * j;
        container.addChild(bunny);
    };
};
/*
 * All the bunnies are added to the container with the addChild method
 * when you do this, all the bunnies become children of the container, and when a container moves,
 * so do all its children.
 * This gives you a lot of flexibility and makes it easier to position elements on the screen
 */
container.x = height / 2;
container.y = width / 8 + 5 * 40;

// start animating
animate();

function animate() {

    requestAnimationFrame(animate);

    for(var index in container.children){
        var bunny = container.children[index];
        if(bunny){
            bunny.alpha = Math.random();
        }
    }

    // render the root container
    resize();
    renderer.render(stage);
    //renderer.resize($(window).width(),$(window).height());
}
function resize(){
    if (window.innerWidth / window.innerHeight >= ratio) {
        var w = window.innerHeight * ratio;
        var h = window.innerHeight;
    } else {
        var w = window.innerWidth;
        var h = window.innerWidth / ratio;
    }
    renderer.view.style.width = w + 'px';
    renderer.view.style.height = h + 'px';
}
