import {
    ViewerApp,
    AssetManagerPlugin,
    GBufferPlugin,
    timeout,
    ProgressivePlugin,
    TonemapPlugin,
    SSRPlugin,
    SSAOPlugin,
    DiamondPlugin,
    FrameFadePlugin,
    GLTFAnimationPlugin,
    GroundPlugin,
    BloomPlugin,
    TemporalAAPlugin,
    AnisotropyPlugin,
    GammaCorrectionPlugin,
    Object3D, Material,
    Vector3, Vector2,
    Texture,

    addBasePlugins,
    TweakpaneUiPlugin, AssetManagerBasicPopupPlugin, CanvasSnipperPlugin, MeshStandardMaterial,



    // Color, // Import THREE.js internals
    // Texture, // Import THREE.js internals
} from "webgi";
import "./styles.css";

async function setupViewer() {

    // Initialize the viewer
    const viewer = new ViewerApp({
        canvas: document.getElementById('webgi-canvas'),
    })

    // Add some plugins
    const manager = await viewer.addPlugin(AssetManagerPlugin)

    // Add a popup(in HTML) with download progress when any asset is downloading.
    await viewer.addPlugin(AssetManagerBasicPopupPlugin)

    // Add plugins individually.
    // await viewer.addPlugin(GBufferPlugin)
    // await viewer.addPlugin(new ProgressivePlugin(32))
    // await viewer.addPlugin(new TonemapPlugin(!viewer.useRgbm))
    // await viewer.addPlugin(GammaCorrectionPlugin)
    // await viewer.addPlugin(SSRPlugin)
    // await viewer.addPlugin(SSAOPlugin)
    // await viewer.addPlugin(DiamondPlugin)
    // await viewer.addPlugin(FrameFadePlugin)
    // await viewer.addPlugin(GLTFAnimationPlugin)
    // await viewer.addPlugin(GroundPlugin)
    // await viewer.addPlugin(BloomPlugin)
    // await viewer.addPlugin(TemporalAAPlugin)
    // await viewer.addPlugin(AnisotropyPlugin)
    // and many more...

    // or use this to add all main ones at once.
    await addBasePlugins(viewer)

    // Add more plugins not available in base, like CanvasSnipperPlugin which has helpers to download an image of the canvas.
    await viewer.addPlugin(CanvasSnipperPlugin)

    // This must be called once after all plugins are added.
    viewer.renderer.refreshPipeline()

    // Import and add a GLB file.

    let url = new URL('../public/sofa.glb', import.meta.url);
    url = "" + url;


    const model = await viewer.load(url)
    const object3d = model.modelObject;





    const easing = "power.0"
    // Gsap Scroll Animation

    gsap.registerPlugin(ScrollTrigger)
    const tl = gsap.timeline({
        //  duration:10,
        ease: easing,
        scrollTrigger: {

            trigger: ".trigger",
            scrub: 1,
            //   start: " top bottom ",
            endTrigger: ".trigger1",
            //   end: "top top",


        }
    })







    const mobileMenuButton = document.getElementById("mobileMenuButton");
    const mobileNav = document.getElementById("mobileNav");
    mobileMenuButton.addEventListener("click", () => {
        mobileNav.classList.toggle("hidden");
    });







    const Colors = document.querySelectorAll(".cBtn");

    const object = viewer.scene.findObjectsByName('Object_2')[0].modelObject
    const startMaterial = object.material
    for (const color of Colors) {
        color.addEventListener('click', (e) => {
            const backgroundColor = window.getComputedStyle(color).backgroundColor;


            console.log(object, backgroundColor);


            const obj = viewer.createPhysicalMaterial({
                color: backgroundColor.toString(),
                roughness: 0.5,

            })

            object.setMaterial(obj)

        });
    }


    const scrollMat = viewer.createPhysicalMaterial({
        color: "darkgrey",
        roughness: 0.5,

    })



    // Function to adjust the object's properties based on screen width
    function adjustObjectProperties() {
        if (window.innerWidth <= 768) {
            object3d.position.x = 0;
            object3d.position.y = -2.4;

            viewer.scene.activeCamera.position.set(5.5938, 2.22372, 15.9431);
            viewer.scene.activeCamera.positionUpdated(); // this must be called to notify the controller on value update

        } else {
            object3d.position.x = 1.3;
            object3d.position.y = -1;

            viewer.scene.activeCamera.position.set(5.5938, 2.22372, 6.9431);
            viewer.scene.activeCamera.positionUpdated(); // this must be called to notify the controller on value update
        }
        console.log(object3d.position.z)
    }

    // Initial adjustment
    adjustObjectProperties();

    // Listen for window resize events and adjust object properties accordingly
    window.addEventListener('resize', adjustObjectProperties);
    //   Camera 




    tl.to(object3d.rotation, {
        y: Math.PI / 2,
        ease: easing,
        duration: 1,
        onUpdate: () => {
            viewer.setDirty()

        },

        onReverseComplete: () => {
            object.setMaterial(startMaterial)

        }


    }, "<");







    // Mouse Move Effect 
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;
    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;
    document.addEventListener('mousemove', onDocumentMouseMove);
    function onDocumentMouseMove(event) {

        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
        viewer.setDirty()
    }




    AOS.init();



    function animate() {
        requestAnimationFrame(animate);




        // targetX = mouseX * .0001;
        // targetY = mouseY * .00008;



        // if (object3d) {

        //     object3d.rotation.y += 0.07 * ( targetX - object3d.rotation.y );
        //     object3d.rotation.x += 0.07 * ( targetY - object3d.rotation.x );


        // }

        viewer.setDirty()

    }



    animate();



}

setupViewer()
