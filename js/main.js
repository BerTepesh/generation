class Engine {
  states = [];
  interval = null;
  constructor() {
    
  }
  addState(_state) {
    if(_state.id) {
      this.states.push(_state);
    }
  }
  init() {
    console.log("engine.init()..");
    this.states.forEach(e => {
      e.init();
    }); 
    console.log("engine.init() done");
  }
  render(_speed) {
    console.log("engine.render()..");
    this.interval = setInterval(() => {
      this.states.forEach(e => {
        if(e.move() == false) clearInterval(this.interval);
      }); 
    }, 100/_speed);
  }
  stop() {
    console.log("engine.stop()");
    clearInterval(this.interval);
  }
}
class State {
  flows = [];
  id;
  constructor(_id) {
    if(document.getElementById(_id)) {
      this.id = _id;
    } else {
      console.log("state.init() flow (" + _id + ") not found");
    }
  }
  addFlow(_flow) {
    if(_flow) {
      this.flows.push(_flow);
    }
  }
  init() {
    console.log("   state.init()..");
    this.flows.forEach((e, index) => {
      e.id = this.id + '_' + index;
      e.parrentState = document.getElementById(this.id);
      e.init();
    });
    console.log("   state.init() done");
  }
  move() {
    this.flows.forEach(e => {
      e.move();
    });
  }
}
class Flow {
  id;
  sprites = [];
  path = [];
  step;
  //direction;
  parrentState;
  isMove = true;

  constructor(_path, _step) {
    this.path = _path;
    this.step = _step;

    // Определение направления потока
    // let first = { x: this.path[0].x, y: this.path[0].y };
    // let second = { x: this.path[1].x, y: this.path[1].y };
    
    // if(second.x != 0 && second.y != 0) {
    //   alert('Задан некорректный путь!');
    // } else if(first.x > second.x) {
    //   this.direction = 'left';
    // } else if(first.x < second.x) {
    //   this.direction = 'right';
    // } else if(first.y > second.y) {
    //   this.direction = 'up';
    // } else if(first.y < second.y) {
    //   this.direction = 'down';
    // } 

  }
  addSprite(_sprite) {
    if(_sprite) {
      this.sprites.push(_sprite);
    }
  }
  init() {
    console.log("     flow.init()..");
    console.log("         sprites.init()..");
    this.parrentState.innerHTML += '<div class="flows__item" id="' +  this.id + '"></div>';
    let flowItem = document.getElementById(this.id);

    let first = { x: this.path[0].x, y: this.path[0].y };
    let second = { x: this.path[1].x, y: this.path[1].y };

    this.sprites.forEach((e, index) => {
      flowItem.innerHTML += '<span class="' +  e.icon + '" id="' +  this.id + '_' + index + '"></span>';
      e.id = this.id + '_' + index;

      if(second.x != 0 && second.y != 0) {
        alert('Задан некорректный путь!');
      } else if(first.x > second.x) {
        e.x = -50;
        e.direction = 2; 
        e.el().style.transform = "translate(" + e.x + "px, 0)"; //scale(-1, 1)
      } else if(first.x < second.x) {
        e.x = 50;
        e.direction = 0; 
        e.el().style.transform = "translate(" + e.x + "px, 0)";
      } else if(first.y > second.y) {
        e.y = -50;
        e.direction = 3; 
        e.el().style.transform = "translate(0, " + e.y + "px) rotate(-90deg)";
      } else if(first.y < second.y) {
        e.y = 50;
        e.direction = 1; 
        e.el().style.transform = "translate(0, " + e.y + "px) rotate(90deg)";
      } 

      // switch(this.direction) {
      //   case 'left': 
      //     e.x = -50;
      //     e.direction = 2; 
      //     e.el().style.transform = "translate(" + e.x + "px, 0)"; //scale(-1, 1)
      //     break;
      //   case 'right': 
      //     e.x = 50;
      //     e.direction = 0; 
      //     e.el().style.transform = "translate(" + e.x + "px, 0)";
      //     break;
      //   case 'up': 
      //     e.y = -50;
      //     e.direction = 3; 
      //     e.el().style.transform = "translate(0, " + e.y + "px) rotate(-90deg)";
      //     break;
      //   case 'down': 
      //     e.y = 50;
      //     e.direction = 1; 
      //     e.el().style.transform = "translate(0, " + e.y + "px) rotate(90deg)";
      //     break;
      //   default:
      //     e.x = 0;
      //     e.y = 0;
      //     e.direction = 0; 
      //     e.el().style.transform = "translate(0, 0)";
      // }
    });
    console.log("         sprites.init() done");
    console.log("     flow.init() done");
  }
  getPrevPos(_e) {
    let prevStep = _e.pathStep - 1;
    if(prevStep > 0) {
      if(this.path[prevStep].x < _e.x) {
        return 'right';
      } else if(this.path[prevStep].y > _e.y) {
        return 'down';
      } else if(this.path[prevStep].x < _e.x) {
        return 'left';
      } else if(this.path[prevStep].y < _e.y) {
        return 'up';
      } else {
        console.log("start");
        return false;
      }
    } else {
      return false;
    }
  }
  getNextPos(_e) {
    let nextStep = _e.pathStep + 1;
    if(this.path.length > nextStep) {
      if(this.path[nextStep].x > _e.x) {
        return 'right';
      } else if(this.path[nextStep].y > _e.y) {
        return 'down';
      } else if(this.path[nextStep].x < _e.x) {
        return 'left';
      } else if(this.path[nextStep].y > _e.y) {
        return 'up';
      } else {
        return false;
      }
    } else {
      return false;
    }
  }
  move() {
    if(this.isMove) {
      this.sprites.forEach(e => {
        if(this.getNextPos(e) != false && this.getPrevPos(e) != false) {
          if(this.getNextPos(e) == 'right') {
            if(this.getPrevPos(e) == 'down') {
              console.log(this.getPrevPos(e) + " -> " + this.getNextPos(e));
              e.el().style.transform = "translate(" + e.x + "px, " + e.y + "px) rotate(270deg)";
            } else if(this.getPrevPos(e) == 'up') {
              console.log(this.getPrevPos(e) + " -> " + this.getNextPos(e));
              e.el().style.transform = "translate(" + e.x + "px, " + e.y + "px) rotate(360deg)";
            } else {
              console.log("start -> " + this.getNextPos(e));
              e.el().style.transform = "translate(" + e.x + "px, 0)";
            }
            e.x += this.step;
          } else if(this.getNextPos(e) == 'down'){ 
            if(this.getPrevPos(e) == 'right') {
              console.log(this.getPrevPos(e) + " -> " + this.getNextPos(e));
              e.el().style.transform = "translate(" + e.x + "px, " + e.y + "px) rotate(-270deg)";
            } else if(this.getPrevPos(e) == 'left') {
              console.log(this.getPrevPos(e) + " -> " + this.getNextPos(e));
              e.el().style.transform = "translate(" + e.x + "px, " + e.y + "px) rotate(90deg)";
            } else {
              console.log("start -> " + this.getNextPos(e));
              e.el().style.transform = "translate(" + e.x + "px, 0) rotate(90deg)";
            }
            e.y += this.step;
          } else if(this.getNextPos(e) == 'left'){ 
            if(this.getPrevPos(e) == 'up') {
              console.log(this.getPrevPos(e) + " -> " + this.getNextPos(e));
              e.el().style.transform = "translate(" + e.x + "px, " + e.y + "px) rotate(-90deg)";
            } else if(this.getPrevPos(e) == 'down') {
              console.log(this.getPrevPos(e) + " -> " + this.getNextPos(e));
              e.el().style.transform = "translate(" + e.x + "px, " + e.y + "px) rotate(180deg)";
            } else {
              console.log("start -> " + this.getNextPos(e));
              e.el().style.transform = "translate(" + e.x + "px, 0) rotate(180deg)";
            }
            e.x -= this.step;
          } else if(this.getNextPos(e) == 'up'){ 
            if(this.getPrevPos(e) == 'left') {
              console.log(this.getPrevPos(e) + " -> " + this.getNextPos(e));
              e.el().style.transform = "translate(" + e.x + "px, " + e.y + "px) rotate(270deg)";
            } else if(this.getPrevPos(e) == 'right') {
              console.log(this.getPrevPos(e) + " -> " + this.getNextPos(e));
              e.el().style.transform = "translate(" + e.x + "px, " + e.y + "px) rotate(-90deg)";
            } else {
              console.log("start -> " + this.getNextPos(e));
              e.el().style.transform = "translate(" + e.x + "px, 0) rotate(270deg)";
            }
            e.y -= this.step;
          } 
        } else if(this.getNextPos(e)) {
          e.pathStep++;
        } else if(!this.getNextPos(this.sprites[this.sprites.length - 1])) {
          this.isMove = false;
        }
      });
    } else {
      return false;
    }
  }
}
class Sprite {
  id;
  icon;
  gutter;
  split;
  pathStep = 0;
  direction;
  x = 0;
  y = 0;
  constructor(_icon, _gutter, _split) {
    this.icon = _icon;
    this.gutter = _gutter;
    this.split = _split;
  }
  el() {
    return document.getElementById(this.id);
  }
}
let reciclePath = [
  {
    x: 0,
    y: 0
  },{
    x: 150,
    y: 0
  },{
    x: 150,
    y: 150
  },{
    x: 0,
    y: 150
  },{
    x: 0,
    y: 0
  }
];
let reciclePath2 = [
  {
    x: 0,
    y: 0
  },{
    x: 0,
    y: 150
  },{
    x: 150,
    y: 150
  },{
    x: 150,
    y: 0
  },{
    x: 0,
    y: 0
  }
];

// Создание потока
let recicleFlow = new Flow(reciclePath, 2);

// Наполнение потока спрайтами
for(let i = 0; i < 2; i++) {
  if(i % 3) {
    recicleFlow.addSprite(new Sprite('icon-smoke', 20, false));
  } else {
    recicleFlow.addSprite(new Sprite('icon-smoke', 20, true));
  }
}

// Создание позиции
let recicleState = new State('recicle');

// Добавление потока в позицию
recicleState.addFlow(recicleFlow);

// Создание движка
const engine = new Engine();

// Доавление позиции в движок
engine.addState(recicleState);

// Инициализация движка
engine.init();

// Рендер (скорость 0 - 10)
//engine.render(3);

