class Engine {
  states = [];
  interval = null;
  constructor() {
    
  }
  addState = (_state) => {
    if(_state.id) {
      this.states.push(_state);
    }
  }
  init = () => {
    console.log("engine.init()..");
    this.states.forEach(e => {
      e.init();
    }); 
    console.log("engine.init() done");
  }
  render = (_speed) => {
    console.log("engine.render()..");
    this.interval = setInterval(() => {
      this.states.forEach(e => {
        if(e.move() == false) clearInterval(this.interval);
      }); 
    }, 100/_speed);
  }
  stop = () => {
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
  parrentState;
  isMove = true;
  velocity;
  tick;

  constructor(_path, _velocity) {
    this.path = _path;
    this.velocity = 100/_velocity;
    this.tick = this.velocity;
  }
  addSprite = (_sprite) => {
    if(_sprite) {
      this.sprites.push(_sprite);
    }
  }
  init = () => {
    console.log("     flow.init()..");
    console.log("         sprites.init()..");
    this.parrentState.innerHTML += '<div class="flows__item" id="' +  this.id + '"></div>';
    const flowItem = document.getElementById(this.id);

    if(this.path.length < 2) {
      alert('Задан слишком короткий путь!');
    } else {
      const first = { x: this.path[0].x, y: this.path[0].y };
      const second = { x: this.path[1].x, y: this.path[1].y };

      this.sprites.forEach((e, index) => {
        flowItem.innerHTML += '<span class="' +  e.icon + '" id="' +  this.id + '_' + index + '"></span>';
        e.id = this.id + '_' + index;
        if(first.x > second.x) {
          if(index == 0) {
            e.x = -e.gutter;
          } else {
            e.x = (e.gutter * (index - 1));
          }
          e.y = this.path[0].y;
          e.curDirection = 2; 
          e.direction = 2; 
        } else if(first.x < second.x) {
          if(index == 0) {
            e.x = e.gutter;
          } else {
            e.x = -(e.gutter * (index - 1));
          }
          e.y = this.path[0].y;
          e.curDirection = 0; 
          e.direction = 0; 
        } else if(first.y > second.y) {
          if(index == 0) {
            e.y = e.gutter;
          } else {
            e.y = (e.gutter * (index - 1));
          }
          e.x = this.path[0].x;
          e.curDirection = 3; 
          e.direction = 3; 
        } else if(first.y < second.y) {
          if(index == 0) {
            e.y = e.gutter;
          } else {
            e.y = -(e.gutter * (index - 1));
          }
          e.x = first.x;
          e.curDirection = 1; 
          e.direction = 1; 
        } 
      });
    }
    console.log("         sprites.init() done");
    console.log("     flow.init() done");
  }

  getPrevPathStep = (_el) => {
    const prevSpriteStep = _el.pathStep - 1;
    if(prevSpriteStep < 0) {
      return false;
    } 
    return this.path[prevSpriteStep];
  }

  getNextPathStep = (_el) => {
    const nextSpriteStep = _el.pathStep + 1;
    if(nextSpriteStep >= (this.path.length)) {
      return false;
    }
    return this.path[nextSpriteStep];    
  }

  #transform(_el, _rotate = 0, _mirror = false) {
    if(_mirror) {
      _el.el().style.transform = "translate(" + _el.x + "px, " + _el.y + "px) rotate(" + _rotate + "deg)";
    } else {
      _el.el().style.transform = "translate(" + _el.x + "px, " + _el.y + "px) rotate(" + _rotate + "deg)";
    }
  }
  move = () => {
    if(this.tick <= 0) {
      this.sprites.forEach((el, index) => {
        if(!this.getNextPathStep(el)) {
          this.isMove = false;
          el.pathStep = 0;
          el.x = this.path[0].x;
          el.y = this.path[0].y;
          el.curDirection = el.direction;
        } else {
          if(el.curDirection == 0) {
            if(this.getNextPathStep(el).x >= el.x) {
              if(el.x >= 0) {  
                this.#transform(el);    
              }    
            } else {
              el.pathStep++;
              if(this.getNextPathStep(el).y >= el.y) {
                el.curDirection = 1;
              } else {
                el.curDirection = 3;
              }
            }
            el.x++;
          } else if(el.curDirection == 1) {
            if(this.getNextPathStep(el).y >= el.y) {
              if(el.y >= 0) {
                this.#transform(el, 90);  
              } 
            } else {
              el.pathStep++;
              if(this.getNextPathStep(el).x >= el.x) {
                el.curDirection = 0;
              } else {
                el.curDirection = 2;
              }
            }
            el.y++;
          } else if(el.curDirection == 2) {
            if(this.getNextPathStep(el).x <= el.x) {
              if(el.x < 0) {
                this.#transform(el, 180);  
              }  
            } else {
              el.pathStep++;
              if(this.getNextPathStep(el).y <= el.y) {
                el.curDirection = 3;
              } else {
                el.curDirection = 1;
              }
            }
            el.x--;
          } else if(el.curDirection == 3) {
            if(this.getNextPathStep(el).y <= el.y) {
              if(el.y < 0) {
                this.#transform(el, 270);  
              } 
            } else {
              el.pathStep++;
              if(this.getNextPathStep(el).x <= el.x) {
                el.curDirection = 2;
              } else {
                el.curDirection = 0;
              }
            }
            el.y--;
          }
        }
      });
      this.tick = this.velocity;
    } 
    this.tick--;
  }
}
class Sprite {
  id;
  icon;
  gutter;
  split;
  pathStep = 0;
  curDirection;
  direction;
  x = 0;
  y = 0;
  constructor(_icon, _gutter, _split) {
    this.icon = _icon;
    this.gutter = _gutter;
    this.split = _split;
  }
  el = () => {
    return document.getElementById(this.id);
  }
}
const reciclePath = [
  {
    x: 0,
    y: 0
  },{
    x: 208,
    y: 0
  }
];
const wastePath = [
  {
    x: 0,
    y: 0
  },{
    x: 144,
    y: 0
  },{
    x: 144,
    y: 205
  }
];
const couplesPath = [
  {
    x: 19,
    y: 0
  },{
    x: 19,
    y: 99
  },{
    x: 157,
    y: 99
  },{
    x: 157,
    y: 170
  }
];
const gasPath = [
  {
    x: 21,
    y: 0
  },{
    x: 21,
    y: -209
  },{
    x: 160,
    y: -209
  }
];
const condensatePath = [
  {
    x: 0,
    y: 0
  },{
    x: 0,
    y: -96
  },{
    x: 135,
    y: -96
  },{
    x: 135,
    y: -155
  }
];
const couplesPath2 = [
  {
    x: 0,
    y: 0
  },{
    x: -275,
    y: 0
  }
];
const electricityPath = [
  {
    x: 0,
    y: 0
  },{
    x: 195,
    y: 0
  }
];
const ashPath = [
  {
    x: 0,
    y: -13
  },{
    x: 195,
    y: -13
  }
];
const slagPath = [
  {
    x: 0,
    y: 0
  },{
    x: 350,
    y: 0
  }
];


// Создание потока
const recicleFlow = new Flow(reciclePath, 70); // скорость (0-100)
const wasteFlow = new Flow(wastePath, 40);
const couplesFlow = new Flow(couplesPath, 50);
const gasFlow = new Flow(gasPath, 40);
const condensateFlow = new Flow(condensatePath, 30);
const couplesFlow2 = new Flow(couplesPath2, 20);
const electricityFlow = new Flow(electricityPath, 10);
const ashFlow = new Flow(ashPath, 30);
const slagFlow = new Flow(slagPath, 40);

// Наполнение потока спрайтами
for(let i = 0; i < 7; i++) {
  // if(i % 3) {
  //   recicleFlow.addSprite(new Sprite('icon-smoke', 20, false));
  // } else {
  //   recicleFlow.addSprite(new Sprite('icon-smoke', 20, true));
  // }
  recicleFlow.addSprite(new Sprite('icon-recicle-flow', 30, false));
}
for(let i = 0; i < 8; i++) {
  // if(i % 3) {
  //   recicleFlow.addSprite(new Sprite('icon-smoke', 20, false));
  // } else {
  //   recicleFlow.addSprite(new Sprite('icon-smoke', 20, true));
  // }
  couplesFlow.addSprite(new Sprite('icon-couples', 40, false));
  couplesFlow2.addSprite(new Sprite('icon-couples', 35, false));
  electricityFlow.addSprite(new Sprite('icon-flash-other', 25, false));
  ashFlow.addSprite(new Sprite('icon-filter-tube', 25, false));
}
for(let i = 0; i < 9; i++) {
  // if(i % 3) {
  //   recicleFlow.addSprite(new Sprite('icon-smoke', 20, false));
  // } else {
  //   recicleFlow.addSprite(new Sprite('icon-smoke', 20, true));
  // }
  wasteFlow.addSprite(new Sprite('icon-recicle-flow', 40, false));
  gasFlow.addSprite(new Sprite('icon-smoke', 45, false));
}
for(let i = 0; i < 10; i++) {
  // if(i % 3) {
  //   recicleFlow.addSprite(new Sprite('icon-smoke', 20, false));
  // } else {
  //   recicleFlow.addSprite(new Sprite('icon-smoke', 20, true));
  // }
  slagFlow.addSprite(new Sprite('icon-burn-flow', 35, false));
}
for(let i = 0; i < 11; i++) {
  // if(i % 3) {
  //   recicleFlow.addSprite(new Sprite('icon-smoke', 20, false));
  // } else {
  //   recicleFlow.addSprite(new Sprite('icon-smoke', 20, true));
  // }
  condensateFlow.addSprite(new Sprite('icon-condensate', 30, false));
}

// Создание позиции
const recicleState = new State('recicle');
const bunkerState = new State('bunker');
const burnState = new State('burn');
const capacitorState = new State('capacitor');
const turboState = new State('turbo');
const filterState = new State('filter');

// Добавление потока в позицию
recicleState.addFlow(recicleFlow);
bunkerState.addFlow(wasteFlow);
burnState.addFlow(couplesFlow);
burnState.addFlow(gasFlow);
burnState.addFlow(slagFlow);
capacitorState.addFlow(condensateFlow);
turboState.addFlow(couplesFlow2);
turboState.addFlow(electricityFlow);
filterState.addFlow(ashFlow);

// Создание движка
const engine = new Engine();

// Доавление позиции в движок
engine.addState(recicleState);
engine.addState(bunkerState);
engine.addState(burnState);
engine.addState(capacitorState);
engine.addState(turboState);
engine.addState(filterState);

// Инициализация движка
engine.init();

// Рендер (скорость 0 - 100)
engine.render(30);

