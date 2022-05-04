import * as THREE from './three.js/build/three.module.js'
import {OrbitControls} from './three.js/examples/jsm/controls/OrbitControls.js'
import { FontLoader } from './three.js/examples/jsm/loaders/FontLoader.js'
import { TextGeometry } from './three.js/examples/jsm/geometries/TextGeometry.js'
import { GLTFLoader } from './three.js/examples/jsm/loaders/GLTFLoader.js'




var scene = new THREE.Scene()
const FOV = 45
const ASPECT = innerWidth/innerHeight
const NEAR = 0.1 
const FAR = 1000
var camera = new THREE.PerspectiveCamera(FOV, ASPECT, NEAR, FAR)
camera.position.z=10
camera.lookAt(0,0,0)
var camera2 = new THREE.PerspectiveCamera(FOV,ASPECT, NEAR, FAR)
camera2.position.z = 100
camera2.position.y = 5  

var currentCamera = camera
var renderer = new THREE.WebGLRenderer({
    antialias: true  
})
renderer.setSize(innerWidth, innerHeight)
renderer.setClearColor(0x303030)
renderer.shadowMap.enabled = true  

document.body.appendChild(renderer.domElement)


var createPlan = () => {
    var planGeometry = new THREE.PlaneGeometry(50,50)
    var planeMaterial = new THREE.MeshPhongMaterial(
    {
        color: 0x404040,
        side: THREE.DoubleSide})

    var planeMesh = new THREE.Mesh(planGeometry,planeMaterial)
    planeMesh.rotation.x = -Math.PI/2
    return planeMesh
}

var planeMesh = createPlan()
planeMesh.receiveShadow=true
scene.add(planeMesh)

var vertices = [
    new THREE.Vector2(-3, 0),
    new THREE.Vector2(3,0),
    new THREE.Vector2(3,-3),
    new THREE.Vector2(-3,-3)
]

var createPoints = (vertices) => {
    var pointGeometry = new THREE.BufferGeometry()
    pointGeometry.setFromPoints(vertices)
    var pointMaterial = new THREE.PointsMaterial({
        color: 0x000000
    })

    var points = new THREE.Points(pointGeometry, pointMaterial)
    return points
}

var points = createPoints(vertices)
scene.add(points)

//create lines
var createLines = (vertices) => {
    var lineGeometry = new THREE.BufferGeometry()
    lineGeometry.setFromPoints(vertices)
    var lineMaterial = new THREE.LineBasicMaterial({
        color: 0x000000,
        linewidth: 50.0
    })
    // var lines = new THREE.Line(lineGeometry, lineMaterial) //non close
    //non close
    var lines = new THREE.LineLoop(lineGeometry, lineMaterial)
    return lines
}

var lines = createLines(vertices)
scene.add(lines)

var createBox = () => {
    var boxGeometry = new THREE.BoxGeometry(1,1,1)
    // var textureLouder = new THREE.TextureLoader()
    var boxMaterial = new THREE.MeshPhongMaterial({
        color: 0x080807,
        // map: textureLouder.load('./img/box.png'),
        // normalMap: textureLouder.load('./img/nbox.png')
        //mesh
        shininess: 100,
        specular: 0xeb4034

        //mesh standard material  
        // metalness: 1,
        // roughness: 0

    })
    // var wireframe = new THREE.WireframeGeometry(boxGeometry)
    // var line = new THREE.LineSegments()
    var boxMesh = new THREE.Mesh(boxGeometry, boxMaterial)
    return boxMesh
}

var boxMesh = createBox()
boxMesh.position.y = 1
boxMesh.position.x = 5
boxMesh.castShadow = true
boxMesh.layers.enable(1)
// boxMesh.receiveShadow = true  
scene.add(boxMesh)

let materialArray = []
let texture_bk = new THREE.TextureLoader().load('skybox/dusk_bk.jpg')
let texture_dn = new THREE.TextureLoader().load('skybox/dusk_dn.jpg')
let texture_ft = new THREE.TextureLoader().load('skybox/dusk_ft.jpg')
let texture_lf = new THREE.TextureLoader().load('skybox/dusk_lf.jpg')
let texture_rt = new THREE.TextureLoader().load('skybox/dusk_rt.jpg')
let texture_up = new THREE.TextureLoader().load('skybox/dusk_up.jpg')

materialArray.push(new THREE.MeshBasicMaterial({map: texture_bk}))
materialArray.push(new THREE.MeshBasicMaterial({map: texture_ft}))
materialArray.push(new THREE.MeshBasicMaterial({map: texture_up}))
materialArray.push(new THREE.MeshBasicMaterial({map: texture_dn}))
materialArray.push(new THREE.MeshBasicMaterial({map: texture_lf}))
materialArray.push(new THREE.MeshBasicMaterial({map: texture_rt}))

for(let i=0; i<6; i++){
    materialArray[i].side = THREE.BackSide

}

let skyBoxGeo = new THREE.BoxGeometry(1000, 1000, 1000)
let skybox = new THREE.Mesh(skyBoxGeo, materialArray)
scene.add(skybox)

var controls = new OrbitControls(camera, renderer.domElement)
controls.update()
var raycaster = new THREE.Raycaster()
raycaster.layers.set(1)

var onMouseMove = (e) => {
    var mouse = {}
    mouse.x = ( e.clientX / window.innerWidth ) * 2 - 1;
    mouse.y = - ( e.clientY / window.innerHeight ) * 2 + 1;

    raycaster.setFromCamera(mouse, camera)
}

var onMouseClick = (e) => {
    var intersectedObject = raycaster.intersectObjects(scene.children)
    

    if(intersectedObject.length>0)
        intersectedObject[0].object.material.color = new THREE.Color(0xffffff)
}

var move = (e) => {
    switch (e.keyCode) {
        case 87:
            boxMesh.position.x +=1
            break;
        case 68:
            boxMesh.position.y -=1
            break;
        case 83:
            boxMesh.position.y -=1
            break;
        case 65:
            boxMesh.position.x -=1
            break;
    
        default:
            break;
    }
}

var changeCamera = (e) => {
    if (e.keyCode == 32) {
        if(currentCamera == camera){
            currentCamera = camera2
        } else {
            currentCamera = camera
        }
    }
}

//roceket
let model 
var gltfLoader = new GLTFLoader()
gltfLoader.load('rocket.gltf', (object)=>{
   
    var model = object.scene
    model.scale.set(0.01,0.01,0.01)
    model.position.x = 1
    model.position.y = 2
    
    
    model.rotation.x += 1 
    model.castShadow = true 

    scene.add(model)
})



var createCircle = () => {
    var circleGeo = new THREE.CircleGeometry(5, 32)
    const circleMaterial = new THREE.MeshBasicMaterial({color: 0xffffff})

    const circleMesh = new THREE.Mesh(circleGeo, circleMaterial)
    return circleMesh 
}

var circle = createCircle()
circle.position.x = 130
circle.position.y = 12
circle.layers.enable(2)
scene.add(circle)  

//planet 
var createBallGeo = () => {
    let ballGeo = new THREE.SphereGeometry(5, 40,5)
    let ballMaterial = new THREE.MeshPhysicalMaterial({
        // color: 0x03b1fc
    });
    let ballMesh = new THREE.Mesh(ballGeo, ballMaterial)

    return ballMesh
}

var ballGeo = createBallGeo()
ballGeo.position.x = 8
ballGeo.position.z = 13
ballGeo.position.y = 20
scene.add(ballGeo)

//earth
var createBallEarth = () => {
    let ballEarth = new THREE.SphereGeometry(5,15,5)
    let textureLouder = new THREE.TextureLoader()
    let ballEarthMaterial = new THREE.MeshPhongMaterial({
        color: 0x03b1fc,
        normalMap: textureLouder.load('./earth.jpg'),
        shininess: 30,
       

    })

    let earthMesh = new THREE.Mesh(ballEarth, ballEarthMaterial)
    return earthMesh
}

let earthGeo = createBallEarth()
// earthGeo.scale.set(1,1,1)
earthGeo.position.x = -10
earthGeo.position.y = 10
scene.add(earthGeo)

//light              
var pointLight = new THREE.PointLight(0xffffff, 10)
scene.add(pointLight)

var hemisphereLight = new THREE.HemisphereLight(0xfcba03, 20)
scene.add(hemisphereLight)


// model.outputEncoding = THREE.sRGBEncoding

window.addEventListener('mousemove', onMouseMove)
window.addEventListener('pointerdown', onMouseClick)
window.addEventListener('keydown', move)
window.addEventListener('keydown', changeCamera)

const targetRocketPosition = 40
const animationDuration = 2000
var loop = () => {
    const t = (Date.now() % animationDuration)/animationDuration

    const delta = targetRocketPosition * Math.sin(Math.PI *2 * t)

    if(model){
        model.rotation.y +=0.1
        model.rotation.y = delta  
    }

    requestAnimationFrame(loop)

}

loop()

//stone 
var createStone = () => {
    var stoneGeo = new THREE.DodecahedronGeometry(1,0)
    var stoneMaterial = new THREE.MeshLambertMaterial({
        color: 0x6e6463})
    var stone = []
    for(let i=0; i<2; i++){
        stone[i] = new THREE.Mesh(stoneGeo, stoneMaterial)
        return stone[i]
    }

    
}

var stone = createStone()
stone.scale.set(1,1,1)
stone.castShadow=true
stone.position.x = 3
stone.position.z = 3
scene.add(stone)

//inisialisasi pohon angkasa
var tree = new THREE.Group()

//batang  
var createBatang = () => {
    var batangGeo = new THREE.IcosahedronGeometry(5,0)
    var batangMaterial = new THREE.MeshLambertMaterial({
        color: 0x9dab9a
    })

    var batangMesh = new THREE.Mesh(batangGeo, batangMaterial)
    // var b = new THREE.Vector3(1,2,9)

    return batangMesh
}

var batang = createBatang()
batang.rotation.x = Math.PI/2  
batang.position.x = 5
batang.scale.set(0.03, 0.02, 1)
batang.receiveShadow = true 
tree.add(batang)

//daun
var createDaun = () => {
    var daunGeo = new THREE.IcosahedronGeometry(5,2)
    var daunMaterial = new THREE.MeshLambertMaterial({color: 0xffffff})

    var daunMesh = new THREE.Mesh(daunGeo, daunMaterial)

    return daunMesh

}

var daun = createDaun()
daun.scale.y = 0.4
daun.rotation.z = -0.5 
daun.rotation.x = -0.2 
daun.position.set(batang.position.x, 5)
daun.castShadow = true 
tree.add(daun)


//nambah phon ke scene  
tree.position.x = 7
scene.add(tree)


//cloud 
var createCloud = () => {
    var cloudGeo = new THREE.IcosahedronGeometry()
    var cloudMaterial = new THREE.MeshStandardMaterial({color: 0xffffff})

    var cloudMesh = new THREE.Mesh(cloudGeo, cloudMaterial)

    return cloudMesh
}

var cloud = createCloud() 
cloud.position.x = 8
cloud.position.y = 8 
cloud.position.z =8
scene.add(cloud)

var createCloud1 = () => {
    var cloudGeo = new THREE.IcosahedronGeometry()
    var cloudMaterial = new THREE.MeshStandardMaterial({color: 0xffffff})

    var cloudMesh = new THREE.Mesh(cloudGeo, cloudMaterial)

    return cloudMesh
}

var cloud1 = createCloud1() 
cloud.position.x = 10 
cloud.position.y = 10 
cloud.position.z = 5
scene.add(cloud1)

var render = () => {
    requestAnimationFrame(render)
    controls.update()
    boxMesh.rotation.x +=0.05
    boxMesh.rotation.y += 0.05
    
    circle.rotation.x +=0.01
    circle.rotation.y +=0.01

    
    // coneMesh.rotation.x += 0.05
    // coneMesh.rotation.y += 0.05  

    // sphereMesh.rotation.x += 0.05  
    // sphereMesh.rotation.y += 0.05  
    
    renderer.render(scene, currentCamera)
}

render()