"use strict";
var Snake3D_Improved;
(function (Snake3D_Improved) {
    class Snake {
        constructor(_position, _graph, _color) {
            this.graph = _graph;
            this.color = _color;
            this.head = this.CreateNewElement();
            this.head.elementNode.mtxLocal.translation = _position;
            this.head.position = _position;
            this.head.newElement = false;
        }
        Move() {
            if (this.IsOnEdge() == true) {
                this.Rotate(Snake3D_Improved.ƒ.Vector3.X(-90));
            }
            this.head.elementNode.cmpTransform.local.translateY(1);
            if (this.head.nextElement != null) {
                this.head.nextElement.Move();
            }
        }
        UpdatePosition() {
            this.head.position = this.head.elementNode.cmpTransform.local.translation;
            if (this.head.nextElement != null) {
                this.head.nextElement.UpdatePosition();
            }
        }
        Rotate(_rotation) {
            this.head.elementNode.cmpTransform.local.rotate(_rotation);
        }
        AddSnakeElement() {
            let lastElement = this.GetLastElement(this.head);
            let newElement = this.CreateNewElement();
            newElement.elementNode.cmpTransform.local.translation = lastElement.position;
            newElement.position = lastElement.position;
            lastElement.nextElement = newElement;
            newElement.previousElement = lastElement;
            return newElement;
        }
        IsSnakeCollidingWhithItSelf() {
            return this.IsSnakeCollidingWith(this.head.position);
        }
        IsSnakeCollidingWith(_position) {
            let endReached = false;
            let actualElement = this.head.nextElement;
            while (!endReached) {
                let result = new Snake3D_Improved.ƒ.Vector3(actualElement.position.x - _position.x, actualElement.position.y - _position.y, actualElement.position.z - _position.z);
                if (result.magnitude < 1) {
                    return true;
                }
                if (actualElement.nextElement == null) {
                    endReached = true;
                }
                else {
                    actualElement = actualElement.nextElement;
                }
            }
            return false;
        }
        CheckCollisionWithFood(_food) {
            _food.forEach((element, i) => {
                if (this.IsSnakeOnPosition(element.mtxLocal.translation)) {
                    this.AddSnakeElement();
                    this.graph.removeChild(element);
                    _food.splice(i, 1);
                }
            });
            return _food;
        }
        CheckCollisionWithSnake(_snakeElement) {
            if (this.head.position.isInsideSphere(_snakeElement.position, 1)) {
                if (_snakeElement.previousElement) {
                    _snakeElement.previousElement.nextElement = null;
                    _snakeElement.previousElement = this.GetLastElement(this.head);
                    this.ChangePosOfAll(_snakeElement, this.GetLastElement(this.head).position);
                    this.GetLastElement(this.head).nextElement = _snakeElement;
                }
                else {
                    if (_snakeElement.nextElement) {
                        _snakeElement.nextElement.previousElement = this.GetLastElement(this.head);
                        this.ChangePosOfAll(_snakeElement.nextElement, this.GetLastElement(this.head).position);
                        this.GetLastElement(this.head).nextElement = _snakeElement.nextElement;
                        _snakeElement.nextElement = null;
                    }
                }
            }
            if (_snakeElement.nextElement) {
                this.CheckCollisionWithSnake(_snakeElement.nextElement);
            }
        }
        IsSnakeOnPosition(_position) {
            let result = new Snake3D_Improved.ƒ.Vector3(this.head.position.x - _position.x, this.head.position.y - _position.y, this.head.position.z - _position.z);
            if (result.magnitude < 1)
                return true;
            return false;
        }
        IsOnEdge() {
            let newTranslation = this.head.elementNode.cmpTransform.local.copy;
            newTranslation.translateY(1);
            let corner = new Snake3D_Improved.ƒ.Vector3(Snake3D_Improved.data.gameFieldSize.x / 2, Snake3D_Improved.data.gameFieldSize.y / 2, Snake3D_Improved.data.gameFieldSize.z / 2);
            let oppCorner = Snake3D_Improved.ƒ.Vector3.SCALE(corner, -1);
            corner.add(new Snake3D_Improved.ƒ.Vector3(1, 1, 1));
            return !newTranslation.translation.isInsideCube(corner, oppCorner);
        }
        GetElementsCount(_element) {
            return _element.nextElement ? this.GetElementsCount(_element.nextElement) + 1 : 1;
        }
        CreateNewElement() {
            let mtrFlat = new Snake3D_Improved.ƒ.Material("Flat", Snake3D_Improved.ƒ.ShaderFlat, new Snake3D_Improved.ƒ.CoatColored(Snake3D_Improved.ƒ.Color.CSS(this.color)));
            let meshQuad = new Snake3D_Improved.ƒ.MeshCube;
            let elementNode = new Snake3D_Improved.ƒ.Node("SnakeElement");
            elementNode.addComponent(new Snake3D_Improved.ƒ.ComponentTransform());
            elementNode.addComponent(new Snake3D_Improved.ƒ.ComponentMaterial(mtrFlat));
            elementNode.addComponent(new Snake3D_Improved.ƒ.ComponentMesh(meshQuad));
            elementNode.getComponent(Snake3D_Improved.ƒ.ComponentMesh).pivot.scale(new Snake3D_Improved.ƒ.Vector3(0.8, 0.8, 0.8));
            this.graph.appendChild(elementNode);
            let snakeElement = new Snake3D_Improved.SnakeElement();
            snakeElement.elementNode = elementNode;
            return snakeElement;
        }
        GetLastElement(_element) {
            return _element.nextElement != null ? this.GetLastElement(_element.nextElement) : _element;
        }
        ChangePosOfAll(_element, _position) {
            _element.elementNode.mtxLocal.translation = _position;
            _element.position = _position;
            _element.newElement = true;
            if (_element.nextElement)
                this.ChangePosOfAll(_element.nextElement, _position);
        }
    }
    Snake3D_Improved.Snake = Snake;
})(Snake3D_Improved || (Snake3D_Improved = {}));
//# sourceMappingURL=Snake.js.map