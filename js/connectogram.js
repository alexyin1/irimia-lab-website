let noiseZ;
let size;
let columns;
let rows;
let w;
let h;
let field;
let noiseZIncrement;

function getAngle(x, y) {
  return noise.simplex3(x / Math.PI, y / Math.PI, noiseZ) * Math.PI * 2;
}

function getLength(x, y) {
  return noise.simplex3(x / 100, y / 100, noiseZ);
}

function setup(container) {
  size = 50;
  noiseZ = 0;
  noiseZIncrement = 0.005;
  reset(container);
  window.addEventListener("resize", reset);
}

function initField() {
  field = new Array(columns);
  for (let x = 0; x < columns; x++) {
    field[x] = new Array(columns);
    for (let y = 0; y < rows; y++) {
      field[x][y] = [0, 0];
    }
  }
}

function calculateField() {
  for (let x = 0; x < columns; x++) {
    for (let y = 0; y < rows; y++) {
      let angle = getAngle(x, y);
      let length = getLength(x, y);
      field[x][y][0] = angle;
      field[x][y][1] = length;
    }
  }
}

function reset(container) {
  const pxRatio = window.devicePixelRatio;
  w = container.canvas.size.width;
  h = container.canvas.size.width;
  noise.seed(Math.random());
  columns = Math.floor(w / size) + 1;
  rows = Math.floor(h / size) + 1;
  initField();
}

tsParticles
  .load("tsparticles", {
    fps_limit: 60,
    background: { color: "#1a1a10" },
    emitters: [
      {
        life: {
          count: 0,
          duration: 10,
        },
        position: {
          x: 50,
          y: 50,
        },
        rate: {
          delay: 0.1,
          quantity: 10,
        },
        size: {
          width: 10,
          height: 10,
        },
        particles: {
          color: {
            value: "#00f",
          },
        },
      },
    ],
    particles: {
      color: {
        value: "#f00",
        animation: {
          enable: true,
          speed: 10,
          sync: true,
        },
      },
      move: {
        trail: {
          enable: true,
          length: 50,
        },
        bounce: false,
        direction: "none",
        enable: true,
        out_mode: "out",
        random: false,
        speed: 1.5,
        straight: true,
        warp: false,
        noise: {
          enable: true,
          delay: {
            value: 0.001,
          },
        },
      },
      number: { density: { enable: false, value_area: 8 }, value: 0 },
      opacity: {
        anim: { enable: false, opacity_min: 0, speed: 1, sync: false },
        random: false,
        value: 0.5,
      },
      size: {
        value: 1,
      },
    },
    retina_detect: true,
  })
  .then((container) => {
    container.setNoise({
      init: function () {
        setup(container);
      },
      update: function () {
        calculateField();
        noiseZ += noiseZIncrement;
      },
      generate: function (p) {
        const pos = p.getPosition();

        const px = Math.max(Math.floor(pos.x / size), 0);
        const py = Math.max(Math.floor(pos.y / size), 0);

        if (!field || !field[px] || !field[px][py]) {
          return { angle: 0, length: 0 };
        }

        return {
          angle: field[px][py][0],
          length: field[px][py][1],
        };
      },
    });

    container.refresh();
  });
