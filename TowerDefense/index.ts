namespace TowerDefense {
  //export import ƒ = FudgeCore;

  window.addEventListener("load", init);

  // let baseLifeRangeElement: HTMLInputElement;
  // let moneySpanElement: HTMLSpanElement;
  // let timeSpanElement: HTMLSpanElement;

  let canvas: HTMLCanvasElement;
  let camera: ƒ.ComponentCamera
  let viewport: ƒ.Viewport;

  let graph: ƒ.Node;
  let upperTower: ƒ.Node;
  let middleTower: ƒ.Node;
  let lowerTower: ƒ.Node;

  function init(): void {
    getReferences();

    camera = new ƒ.ComponentCamera();
    camera.pivot.translateZ(50);
    camera.pivot.rotateY(180);

    // let cmpCamera: ƒ.ComponentCamera = new ƒ.ComponentCamera();
    // cmpCamera.backgroundColor = ƒ.Color.CSS("white");
    // camera = new ƒAid.CameraOrbit(cmpCamera, 50, 75, 3, 20);
    // graph.addChild(camera);

    graph = new ƒ.Node("Graph");
    graph.appendChild(createGameField());
    graph.appendChild(createBase());

    ƒAid.addStandardLightComponents(graph, new ƒ.Color(0.5, 0.5, 0.5));

    canvas = document.querySelector("canvas");

    viewport = new ƒ.Viewport();
    viewport.initialize("Viewport", graph, camera, canvas);
    viewport.draw();

    viewport.addEventListener(ƒ.EVENT_POINTER.MOVE, mouseMove);
    viewport.activatePointerEvent(ƒ.EVENT_POINTER.MOVE, true);

    ƒ.Loop.addEventListener(ƒ.EVENT.LOOP_FRAME, update);
    ƒ.Loop.start(ƒ.LOOP_MODE.TIME_REAL, 10);
  }


  function getReferences(): void {
    // baseLifeRangeElement = <HTMLInputElement>document.querySelector("input#baseLife");
    // moneySpanElement = <HTMLSpanElement>document.querySelector("span#money");
    // timeSpanElement = <HTMLSpanElement>document.querySelector("span#time");
  }

  function createGameField(): ƒ.Node {
    let field: ƒ.Node = createNode("GameField", meshCube, mtrFlatGray, ƒ.Vector3.X(8), data.gameFieldSize);
    field.appendChild(createWalls());
    return field;
  }

  function createWalls(): ƒ.Node {
    let walls: ƒ.Node = new ƒ.Node("Walls");

    let posTop: ƒ.Vector3 = new ƒ.Vector3(0, data.gameFieldSize.y / 2 - 0.5, 1);
    let posBottom: ƒ.Vector3 = new ƒ.Vector3(0, -data.gameFieldSize.y / 2 + 0.5, 1);
    let posLeft: ƒ.Vector3 = new ƒ.Vector3(-data.gameFieldSize.x / 2, 0, 1);

    let scaleHorizontal: ƒ.Vector3 = new ƒ.Vector3(data.gameFieldSize.x, 1, 4);
    let scaleVertical: ƒ.Vector3 = new ƒ.Vector3(1, data.gameFieldSize.y, 4);

    let wallTop: ƒ.Node = createNode("WallTop", meshCube, mtrFlatWhite, posTop, scaleHorizontal);
    let wallBottom: ƒ.Node = createNode("wallBottom", meshCube, mtrFlatWhite, posBottom, scaleHorizontal);
    let wallLeft: ƒ.Node = createNode("wallLeft", meshCube, mtrFlatWhite, posLeft, scaleVertical);

    walls.appendChild(wallTop);
    walls.appendChild(wallBottom);
    walls.appendChild(wallLeft);
    return walls;
  }

  function createBase(): ƒ.Node {
    let posBase: ƒ.Vector3 = new ƒ.Vector3(-(data.gameFieldSize.x / 2) + (data.baseSize.x / 2 + 8), 0, 1);
    let base: ƒ.Node = createNode("Base", meshCube, mtrFlatWhite, posBase, data.baseSize);

    upperTower = createTower(new ƒ.Vector3(0, (data.gameFieldSize.y / 2) - 5, 1), 3);
    middleTower = createTower(ƒ.Vector3.Z(), 5);
    lowerTower = createTower(new ƒ.Vector3(0, -(data.gameFieldSize.y / 2) + 5, 1), 3);

    base.appendChild(upperTower);
    base.appendChild(middleTower);
    base.appendChild(lowerTower);

    return base;
  }

  function createTower(_position: ƒ.Vector3, _size: number): ƒ.Node {
    let tower: ƒ.Node = createNode("Tower", meshCube, mtrFlatGray, _position, ƒ.Vector3.ONE(_size));
    tower.addChild(new ƒAid.NodeCoordinateSystem());
    let barrel: ƒ.Node = createNode("Barrel", meshCube, mtrFlatGray, new ƒ.Vector3((3 / 5) * _size, 0, (1 / 5) * _size), new ƒ.Vector3((3 / 5) * _size, 1, 1));

    tower.appendChild(barrel);
    return tower;
  }

  function mouseMove(_event: ƒ.EventPointer): void {
    // middleTower.mtxLocal.lookAt(new ƒ.Vector3(_event.canvasY, _event.canvasX, middleTower.mtxLocal.translation.z));
    // angle = acos((posTower * posMouse) / (|posTower * posMouse|))
    // let pos: ƒ.Vector2 = viewport.pointClientToProjection(new ƒ.Vector2(_event.pointerX, _event.pointerY));
    let pos: ƒ.Vector2 = viewport.pointClientToProjection(new ƒ.Vector2(_event.pointerX, _event.pointerY));
    let ray: ƒ.Ray = new ƒ.Ray(new ƒ.Vector3(1, pos.y, -pos.x));
    let camera: ƒ.ComponentCamera = viewport.camera;

    ray.direction.scale(50)
    ray.origin.transform(camera.pivot);
    ray.origin.transform(viewport.getGraph().mtxWorld);
    ray.direction.transform(camera.pivot, false);
    ray.direction.transform(viewport.getGraph().mtxWorld, false);

    let rayEnd: ƒ.Vector3 = ƒ.Vector3.SUM(ray.origin, ray.direction);

    console.log(rayEnd.x, rayEnd.y, rayEnd.z);

    middleTower.mtxLocal.lookAt(rayEnd);

    // ray.direction.scale(camera.pivot.translation.magnitude);
    // ray.origin.transform(camera.pivot);
    // ray.direction.transform(camera.pivot, false);

    // let rayEnd: ƒ.Vector3 = ƒ.Vector3.SUM(ray.origin, ray.direction);
    // let projection: ƒ.Vector3 = camera.project(rayEnd);
    // // let screen: ƒ.Vector2 = ƒ.RenderManager.rectClip.pointToRect(projection.toVector2(), viewport.getCanvasRectangle());
    // let screen: ƒ.Vector2 = viewport.pointClipToClient(projection.toVector2());
    // console.log(projection.x, projection.y);
    // // middleTower.mtxLocal.lookAt(rayEnd)
    // // middleTower.cmpTransform.local.lookAt(rayEnd);

    // middleTower.mtxLocal.lookAt(new ƒ.Vector3(screen.x, screen.y));

    // let scalar: number = (middleTower.mtxWorld.translation.x * rayEnd.x) + (middleTower.mtxWorld.translation.z * rayEnd.y);
    // let lengthTower: number = Math.sqrt(Math.pow(middleTower.mtxWorld.translation.x, 2) + Math.pow(middleTower.mtxWorld.translation.z, 2));
    // let lengthMouse: number = Math.sqrt(Math.pow(rayEnd.x, 2) + Math.pow(rayEnd.y, 2));
    // let angle: number = Math.acos(scalar / (lengthMouse * lengthTower));
    // // middleTower.mtxLocal.rotation.set(0, 0, angle);
    // middleTower.mtxLocal.rotation = new ƒ.Vector3(0, 0, (angle * (180 / Math.PI)));
  }

  function update(): void {
    viewport.draw();
  }
}