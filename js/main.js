class Engine {
  states = [];
  constructor() {
    
  }
  addState(_state) {
    this.states.push(_state);
  }
  init() {
    console.log("engine.init()..");
    this.states.forEach(function(e){
      e.init();
    }); 
    console.log("engine.init() done");
  }
  render(_speed) {
    
  }
}
 
class State {
  flows = [];
  id;
  constructor(_id) {
    this.id = _id;
  }
  addFlow(_flow) {
    this.flows.push(_flow);
  }
  init() {
    console.log("   state.init()..");
    let that = this;
    this.flows.forEach(function(e, index) {
      e.id = that.id + '_' + index;
      e.parrentState = document.getElementById(that.id);
      e.init();
    });
    console.log("   state.init() done");
  }
}

class Flow {
  id;
  sprites = [];
  path = [];
  delay;
  direction;
  parrentState;
  constructor(_path, _delay) {
    this.path = _path;
    this.delay = _delay;

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
    this.sprites.push(_sprite);
  }
  init() {
    console.log("     flow.init()..");
    let that = this;
    console.log("         sprites.init()..");
    this.parrentState.innerHTML += '<div class="flows__item" id="' +  this.id + '"></div>';
    let flowItem = document.getElementById(this.id);
    this.sprites.forEach(function(e, index) {
      flowItem.innerHTML += '<span class="' +  e.icon + '" id="' +  that.id + '_' + index + '"></span>';
      e.el = document.getElementById(that.id + '_' + index);
      switch(that.direction) {
        case 'left': 
          e.x = -50;
          e.el.style.transform = "translate(" + e.x + "px, 0)";
          break;
        case 'right': 
          e.x = 50;
          e.el.style.transform = "translate(" + e.x + "px, 0)";
          break;
        case 'up': 
          e.y = -50;
          e.el.style.transform = "translate(0, " + e.y + "px)";
          break;
        case 'down': 
          e.y = 50;
          e.el.style.transform = "translate(0, " + e.y + "px)";
          break;
        default:
          
      }
    });
    console.log("         sprites.init() done");
    console.log("     flow.init() done");
  }
  move() {
    
  }
}

class Sprite {
  el;
  icon;
  gutter;
  split;
  x;
  y;
  constructor(_icon, _gutter, _split) {
    this.icon = _icon;
    this.gutter = _gutter;
    this.split = _split;
  }

}

let reciclePath = [
  {
    x: 0,
    y: 0
  },{
    x: 150,
    y: 0
  }
];
let filterPath = [
  {
    x: 0,
    y: 0
  },{
    x: -150,
    y: 0
  }
];

// Создание потока
let recicleFlow = new Flow(reciclePath, 5);
let filterFlow = new Flow(filterPath, 5);

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
    filterFlow.addSprite(new Sprite('icon-recicle-flow', 20, false));
  } else {
    filterFlow.addSprite(new Sprite('icon-recicle-flow', 20, true));
  }
}

// Создание позиции
let recicleState = new State('recicle');

// Добавление потока в позицию
recicleState.addFlow(recicleFlow);
recicleState.addFlow(filterFlow);

// Создание движка
const engine = new Engine();

// Доавление позиции в движок
engine.addState(recicleState);

engine.init();

