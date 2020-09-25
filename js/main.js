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
        e.move();
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
  direction;
  parrentState;

  constructor(_path, _step) {
    this.path = _path;
    this.step = _step;

    // Определение направления потока
    let first = { x: this.path[0].x, y: this.path[0].y };
    let second = { x: this.path[1].x, y: this.path[1].y };
    
    if(second.x != 0 && second.y != 0) {
      alert('Задан некорректный путь!');
    } else if(first.x > second.x) {
      this.direction = 'left';
    } else if(first.x < second.x) {
      this.direction = 'right';
    } else if(first.y > second.y) {
      this.direction = 'up';
    } else if(first.y < second.y) {
      this.direction = 'down';
    } 

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
    this.sprites.forEach((e, index) => {
      flowItem.innerHTML += '<span class="' +  e.icon + '" id="' +  this.id + '_' + index + '"></span>';
      e.id = this.id + '_' + index;
      switch(this.direction) {
        case 'left': 
          e.x = -50;
          e.el().style.transform = "translate(" + e.x + "px, 0) scale(-1, 1)";
          break;
        case 'right': 
          e.x = 50;
          e.el().style.transform = "translate(" + e.x + "px, 0)";
          break;
        case 'up': 
          e.y = -50;
          e.el().style.transform = "translate(0, " + e.y + "px) rotate(-90deg)";
          break;
        case 'down': 
          e.y = 50;
          e.el().style.transform = "translate(0, " + e.y + "px) rotate(90deg)";
          break;
        default:
          e.x = 0;
          e.y = 0;
          e.el().style.transform = "translate(0, 0)";
      }
    });
    console.log("         sprites.init() done");
    console.log("     flow.init() done");
  }
  move() {
    this.sprites.forEach((e, index) => {
      switch(this.direction) {
        case 'right': 
          let nextStep = e.pathStep + 1;
          if(this.path[nextStep].x > e.x) {
            e.x += this.step;
            e.el().style.transform = "translate(" + e.x + "px, 0)";
            console.log(this.path[nextStep].x +" -> "+ e.x);
          } else if(this.path.length <= nextStep){ 
            e.pathStep++;
          }
          break;
        case 'left': 
          e.x -= this.step;
          e.el().style.transform = "translate(" + e.x + "px, 0) scale(-1, 1)";
          break;
        case 'down': 
          e.y += this.step;
          e.el().style.transform = "translate(0, " + e.y + "px) rotate(90deg)";
          break;
        case 'up': 
          e.y -= this.step;
          e.el().style.transform = "translate(0, " + e.y + "px) rotate(-90deg)";
          break;
        default:
          e.x = 0;
          e.y = 0;
          e.el().style.transform = "translate(0, 0)";
      }
    });
  }
}
class Sprite {
  id;
  icon;
  gutter;
  split;
  pathStep = 0;
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
  }
];
let bunkerPath = [
  {
    x: 0,
    y: 0
  },{
    x: 0,
    y: 100
  }
];

// Создание потока
let recicleFlow = new Flow(reciclePath, 2);
let bunkerFlow = new Flow(bunkerPath, 2);

// Наполнение потока спрайтами
for(let i = 0; i <= 7; i++) {
  if(i % 3) {
    recicleFlow.addSprite(new Sprite('icon-recicle-flow', 20, false));
  } else {
    recicleFlow.addSprite(new Sprite('icon-recicle-flow', 20, true));
  }
}
for(let i = 0; i <= 5; i++) {
  if(i % 4) {
    bunkerFlow.addSprite(new Sprite('icon-recicle-flow', 20, false));
  } else {
    bunkerFlow.addSprite(new Sprite('icon-recicle-flow', 20, true));
  }
}

// Создание позиции
let recicleState = new State('recicle');
let bunkerState = new State('bunker');

// Добавление потока в позицию
recicleState.addFlow(recicleFlow);
bunkerState.addFlow(bunkerFlow);

// Создание движка
const engine = new Engine();

// Доавление позиции в движок
engine.addState(recicleState);
engine.addState(bunkerState);

// Инициализация движка
engine.init();

// Рендер (скорость 0 - 10)
//engine.render(3);

