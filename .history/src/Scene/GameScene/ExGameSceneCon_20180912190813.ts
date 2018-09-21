import {AssetsManager, SceneManager} from "../../public/index";
import {DisplayPool} from "../../public/index";
import {ModuleName} from "../../public/index";
import {EventCon} from "../../other/EventCon";
import {ExGameScene} from "./ExGameScene";
import {GameScenes} from "../../public/index";
import {particleCon} from "../../public/index";
import {WeatherState} from "../../public/index";


export class ExGameSceneCon extends GameScenes{
    private _gold;
    private static instance: ExGameSceneCon;

    public static get ins(): ExGameSceneCon {
        if (!this.instance) {
            this.instance = new ExGameSceneCon();
        }
        return this.instance;
    }


    protected display;

    protected scene;

    protected doEvents=[];

    private gameDeState;

    constructor(){
        super()
    }

    protected importMeshes=[]


    public init(){
        DisplayPool.ins.displayPool[ModuleName.GAME_PLAY_SCENE]=this;
    }

    protected resetGame(){
        ExGameScene.ins.creatScene()
        var scene=SceneManager.ins.scene;
        this.scene=SceneManager.ins.scene;
        this.display=ExGameScene.ins.display;
        SceneManager.ins.engine.displayLoadingUI();
        SceneManager.ins.engine.loadingUIText = "Initializing...";
        SceneManager.ins.engine.hideLoadingUI();

       // alert()

       var pipeline = new BABYLON.DefaultRenderingPipeline(
        "default", // The name of the pipeline
        true, // Do you want HDR textures ?
        this.scene, // The scene instance
        [ this.display.camera] // The list of cameras to be attached to
         );
    
    pipeline.bloomEnabled = true;
    
    pipeline.bloomThreshold = 0.2;
    pipeline.bloomWeight = 0.5;
    pipeline.bloomKernel = 64;
    pipeline.bloomScale = 0.5;

        console.log("this.scene")
        console.log(this.scene)
        this.scene.createDefaultSkybox(AssetsManager.ins.resourceObject["cubeTextures"]["gameScene"]["skybox"], true, 10000);
        this.scene.getMeshByName("__root__").parent=this.display.cameraBox
      //  this.scene.getMeshByName("__root__").position.x=-0.1;
        this.scene.getMeshByName("__root__").position.y=-0.7;
        this.display.cameraBox.scaling=new BABYLON.Vector3(10,10,10)
        this.scene.getMeshByName("default").material=this.display.terrainMaterial
        this.display.cameraBox.position.y=-10;
        this.display.camera.target=this.display.cameraBox.position;
       // this.scene.beginAnimation(this.scene.skeletons[0],6,6.001, false);
       /*  setTimeout(()=>{
            this.scene.beginAnimation(this.scene.skeletons[0], 1, 1.0001, false);
        },2000) */
       
        console.log( "this.scene")
        console.log( this.scene)
    }



    protected addEvent(){
        this.doEvents["BeforeRender"]=SceneManager.ins.scene.onBeforeRenderObservable.add(()=>{
            this.beforeRender()
        })
        this.keyevent()
    }

    protected beforeRender(){
       // console.log(1144)
        this.display.cameraBox.rotation.y=-this.display.camera.alpha+Math.PI*0.5;
      //  console.log(this.display.camera.beta/Math.PI)

      /*   console.log((1-this.display.camera.beta/Math.PI))

        var  se=(1-this.display.camera.beta/Math.PI)

        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_Head"), se*4+2, se*4+2+0.001, false);
        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_L Arm"), se*4+2, se*4+2+0.001, false);
        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_R Arm"),se*4+2, se*4+2+0.001, false);
        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_Bone"), se*4+2, se*4+2+0.001, false); */

      /*   this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_Head"), this.display.camera.beta/Math.PI*100+50, this.display.camera.beta/Math.PI*100+50+0.001, false);
        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_L Arm"), this.display.camera.beta/Math.PI*100+50, this.display.camera.beta/Math.PI*100+50+0.001, false);
        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_R Arm"), this.display.camera.beta/Math.PI*100+50, this.display.camera.beta/Math.PI*100+50+0.001, false);
        this.scene.beginAnimation(this.scene.getBoneByName("Kości medyk_Bone"), this.display.camera.beta/Math.PI*100+50, this.display.camera.beta/Math.PI*100+50+0.001, false); */
       /*  console.log(this.display.camera.alpha)
        console.log(this.display.cameraBox.rotation.y) */

        this.movePlayer()
    }

      //前进状态
      private moveForward = false;
      //后退状态
      private moveBackward = false;
      //左转状态
      private moveLeft = false;
      //右转状态
      private moveRight = false;

       //空格状态
    private canJump = false;
       //速度状态
    private speedCharacter=-0.5;


    private movePlayer():void{
        var gravity = 0;
        var character = this.display.cameraBox;
        character.ellipsoid = new BABYLON.Vector3(3,6, 3);
        character.ellipsoidOffset = new BABYLON.Vector3(0, 3.2, 0);
        var forwards
        if(this.moveForward){
            forwards = new BABYLON.Vector3((Math.sin(character.rotation.y)) / this.speedCharacter, gravity, (Math.cos(character.rotation.y)) / this.speedCharacter);
            character.moveWithCollisions(forwards);

        }else{
            
            forwards = new BABYLON.Vector3((Math.sin(character.rotation.y)) / this.speedCharacter, gravity, (Math.cos(character.rotation.y)) / this.speedCharacter);
            character.moveWithCollisions(forwards);
           
        }
        if(this.moveBackward){
            forwards = new BABYLON.Vector3(-(Math.sin(character.rotation.y)) / this.speedCharacter, gravity, -(Math.cos(character.rotation.y)) / this.speedCharacter);
            character.moveWithCollisions(forwards);
        }

    }

    private keyevent():void{
        var onKeyDown =  ( event )=> {
            switch ( event.keyCode ) {
                case 38: // up
                case 87: // w
                    this.moveForward = true;
                    break;
                case 37: // left
                case 65: // a
                    this.moveLeft = true; break;
                case 40: // down
                case 83: // s
                    this.moveBackward = true;
                    break;
                case 39: // right
                case 68: // d
                    this.moveRight = true;
                    break;
                case 32: // space
                    this.canJump = true;
                    break;
            }
        };
        var onKeyUp =  ( event )=> {
            switch( event.keyCode ) {
                case 38: // up
                case 87: // w
                    this.moveForward = false;
                    //speedCharacter=-2
                    break;
                case 37: // left
                case 65: // a
                    this.moveLeft = false;
                    break;
                case 40: // down
                case 83: // s
                    this.moveBackward = false;
                    this.speedCharacter=-2
                    break;
                case 39: // right
                case 68: // d
                    this.moveRight = false;
                    break;
                case 32: // space
                    this.canJump = false;
                    break;
            }
        };
        /*   document.addEventListener( 'keydown', onKeyDown, false );
           document.addEventListener( 'keydown', onKeyDown, false );*/
        document.addEventListener( 'keydown', (event)=>{
            onKeyDown(event)
            console.log(4455)
        }, false );
        document.addEventListener( 'keyup', (event)=>{
            onKeyUp(event)
        }, false );
    }
}