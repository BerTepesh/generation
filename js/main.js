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
  step;

  constructor(_path, _step) {
    this.path = _path;
    this.step = _step;
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

        if(second.x != 0 && second.y != 0) {
          alert('Задан некорректный путь!');
        } else if(first.x > second.x) {
          if(this.sprites[index + 1]) {
            this.sprites[index + 1].x += e.gutter;
          } else {
            e.x = -e.gutter;
          }
          e.direction = 2; 
          e.el().style.transform = "translate(" + e.x + "px, 0) scale(-1, 1)";
        } else if(first.x < second.x) {
          if(this.sprites[index + 1]) {
            this.sprites[index + 1].x -= e.gutter;
          } else {
            e.x = e.gutter;
          }
          e.direction = 0; 
          e.el().style.transform = "translate(" + e.x + "px, 0)";
        } else if(first.y > second.y) {
          if(this.sprites[index + 1]) {
            this.sprites[index + 1].y += e.gutter;
          } else {
            e.y = -e.gutter;
          }
          e.direction = 3; 
          e.el().style.transform = "translate(0, " + e.y + "px) rotate(-90deg)";
        } else if(first.y < second.y) {
          if(this.sprites[index + 1]) {
            this.sprites[index + 1].y -= e.gutter;
          } else {
            e.y = e.gutter;
          }
          e.direction = 1; 
          e.el().style.transform = "translate(0, " + e.y + "px) rotate(90deg)";
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
    if(this) { //.isMove
      this.sprites.forEach(el => {
        if(!this.getNextPathStep(el)) {
          this.isMove = false;
        } else {
          if(el.direction == 0) {
            if(this.getNextPathStep(el).x >= el.x) {
              this.#transform(el);
            } else {
              el.pathStep++;
              if(this.getNextPathStep(el).y >= el.y) {
                el.direction = 1;
              } else {
                el.direction = 3;
              }
            }
            el.x += this.step;
          } else if(el.direction == 1) {
            if(this.getNextPathStep(el).y >= el.y) {
              this.#transform(el, 90);
            } else {
              el.pathStep++;
              if(this.getNextPathStep(el).x >= el.x) {
                el.direction = 0;
              } else {
                el.direction = 2;
              }
            }
            el.y += this.step;
          } else if(el.direction == 2) {
            if(this.getNextPathStep(el).x <= el.x) {
              this.#transform(el, 180);
            } else {
              el.pathStep++;
              if(this.getNextPathStep(el).y <= el.y) {
                el.direction = 3;
              } else {
                el.direction = 1;
              }
            }
            el.x -= this.step;
          } else if(el.direction == 3) {
            if(this.getNextPathStep(el).y <= el.y) {
              this.#transform(el, 270);
            } else {
              el.pathStep++;
              if(this.getNextPathStep(el).x <= el.x) {
                el.direction = 2;
              } else {
                el.direction = 0;
              }
            }
            el.y -= this.step;
          }
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
  el = () => {
    return document.getElementById(this.id);
  }
}
const reciclePath1 = [
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
const reciclePath12 = [
  {
    x: 0,
    y: 0
  },{
    x: 0,
    y: 100
  },{
    x: 100,
    y: 100
  },{
    x: 100,
    y: 0
  },{
    x: 0,
    y: 0
  }
];
const reciclePath2 = [
  {
    x: 0,
    y: 0
  },{
    x: 0,
    y: 100
  },{
    x: -100,
    y: 100
  },{
    x: -100,
    y: 0
  },{
    x: 0,
    y: 0
  }
];
const reciclePath22 = [
  {
    x: 0,
    y: 0
  },{
    x: -100,
    y: 0
  },{
    x: -100,
    y: 100
  },{
    x: 0,
    y: 100
  },{
    x: 0,
    y: 0
  }
];
const reciclePath3 = [
  {
    x: 0,
    y: 0
  },{
    x: -100,
    y: 0
  },{
    x: -100,
    y: -100
  },{
    x: 0,
    y: -100
  },{
    x: 0,
    y: 0
  }
];
const reciclePath32 = [
  {
    x: 0,
    y: 0
  },{
    x: 0,
    y: -100
  },{
    x: -100,
    y: -100
  },{
    x: -100,
    y: 0
  },{
    x: 0,
    y: 0
  }
];
const reciclePath4 = [
  {
    x: 0,
    y: 0
  },{
    x: 0,
    y: -100
  },{
    x: 100,
    y: -100
  },{
    x: 100,
    y: 0
  },{
    x: 0,
    y: 0
  }
];
const reciclePath42 = [
  {
    x: 0,
    y: 0
  },{
    x: 100,
    y: 0
  },{
    x: 100,
    y: -100
  },{
    x: 0,
    y: -100
  },{
    x: 0,
    y: 0
  }
];


// Создание потока
const recicleFlow1 = new Flow(reciclePath1, 2);
const recicleFlow12 = new Flow(reciclePath12, 2);

const recicleFlow2 = new Flow(reciclePath2, 2);
const recicleFlow22 = new Flow(reciclePath22, 2);

const recicleFlow3 = new Flow(reciclePath3, 2);
const recicleFlow32 = new Flow(reciclePath32, 2);

const recicleFlow4 = new Flow(reciclePath4, 2);
const recicleFlow42 = new Flow(reciclePath42, 2);

// Наполнение потока спрайтами
for(let i = 0; i < 3; i++) {
  // if(i % 3) {
  //   recicleFlow.addSprite(new Sprite('icon-smoke', 20, false));
  // } else {
  //   recicleFlow.addSprite(new Sprite('icon-smoke', 20, true));
  // }

  recicleFlow1.addSprite(new Sprite('icon-smoke', 30, false));
  recicleFlow12.addSprite(new Sprite('icon-smoke', 20, false));
  recicleFlow2.addSprite(new Sprite('icon-smoke', 20, false));
  recicleFlow22.addSprite(new Sprite('icon-smoke', 20, false));
  recicleFlow3.addSprite(new Sprite('icon-smoke', 20, false));
  recicleFlow32.addSprite(new Sprite('icon-smoke', 20, false));
  recicleFlow4.addSprite(new Sprite('icon-smoke', 20, false));
  recicleFlow42.addSprite(new Sprite('icon-smoke', 20, false));
}

// Создание позиции
const recicleState = new State('recicle');

// Добавление потока в позицию
recicleState.addFlow(recicleFlow1);
recicleState.addFlow(recicleFlow12);
recicleState.addFlow(recicleFlow2);
recicleState.addFlow(recicleFlow22);
recicleState.addFlow(recicleFlow3);
recicleState.addFlow(recicleFlow32);
recicleState.addFlow(recicleFlow4);
recicleState.addFlow(recicleFlow42);

// Создание движка
const engine = new Engine();

// Доавление позиции в движок
engine.addState(recicleState);

// Инициализация движка
engine.init();

// Рендер (скорость 0 - 10)
//engine.render(3);

