let canvas, ctx, w, h, particles = [], xPoint, yPoint, displayText = false;

window.addEventListener("resize", resizeCanvas);
window.addEventListener("DOMContentLoaded", onLoad);

function onLoad() {
    canvas = document.getElementById("canvas");
    ctx = canvas.getContext("2d");
    resizeCanvas();

    // Lắng nghe sự kiện kết thúc nhạc
    document.getElementById("backgroundMusic").addEventListener("ended", function () {
        endCelebration();
    });

    window.requestAnimationFrame(updateWorld);
}

function resizeCanvas() {
    w = canvas.width = window.innerWidth;
    h = canvas.height = window.innerHeight;
}

function updateWorld() {
    update();
    paint();
    window.requestAnimationFrame(updateWorld);
}

function update() {
    if (particles.length < 500 && Math.random() < 0.04) {
        createFirework();
    }
    particles = particles.filter(particle => particle.move());
}

function paint() {
ctx.globalCompositeOperation = 'source-over';
ctx.fillStyle = "rgba(0,0,0,0.2)";
ctx.fillRect(0, 0, w, h);
ctx.globalCompositeOperation = 'lighter';
particles.forEach(particle => particle.draw(ctx));

if (displayText) {
ctx.fillStyle = getRandomColor();
ctx.font = "italic bold 50px 'Dancing Script', cursive";
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("Happy New Year 2024", w / 2, h / 2);
}
if (showHelloText) {
ctx.fillStyle = getRandomColor();
ctx.font = "italic 20px Arial, sans-serif"; // Thay đổi font và kích thước ở đây
ctx.textAlign = "center";
ctx.textBaseline = "middle";
ctx.fillText("Chúc bạn sẽ có một năm mới thật vui vẻ, hạnh phúc và gặt hái thật nhiều nhiều thành công !!", w / 2, h / 4);
}
}

function createFirework() {
    xPoint = Math.random() * (w - 200) + 100;
    yPoint = Math.random() * (h - 200) + 100;
    const nFire = Math.random() * 50 + 100;
    const c = getRandomFireworkColor();

    for (let i = 0; i < nFire; i++) {
        const particle = new Particle(c);
        particles.push(particle);
    }
}

function Particle(color) {
    const sizeFactor = Math.random() * 6;
    this.w = this.h = sizeFactor;
    const angle = Math.random() * Math.PI * 2;  // Random angle
    const speed = Math.random() * 4 + 2;  // Random speed
    this.x = xPoint + Math.cos(angle) * sizeFactor * 10;
    this.y = yPoint + Math.sin(angle) * sizeFactor * 10;
    this.vx = Math.cos(angle) * speed;
    this.vy = Math.sin(angle) * speed;
    this.alpha = Math.random() * 0.5 + 0.5;
    this.color = color;
}

Particle.prototype = {
    gravity: 0.05,
    move: function () {
        this.x += this.vx;
        this.vy += this.gravity;
        this.y += this.vy;
        this.alpha -= 0.01;
        return !(this.x <= -this.w || this.x >= w || this.y >= h || this.alpha <= 0);
    },
    draw: function (c) {
        c.save();
        c.beginPath();
        c.arc(this.x + this.w / 2, this.y + this.h / 2, this.w / 2, 0, Math.PI * 2);  // Sử dụng arc để vẽ hình tròn
        c.fillStyle = this.color;
        c.globalAlpha = this.alpha;
        c.closePath();
        c.fill();
        c.restore();
    }
};

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}

function getRandomFireworkColor() {
    const colors = ["#FF5252", "#FFD740", "#64B5F6", "#69F0AE", "#FF4081", "#4CAF50", "#FF69B4", "#FF6347", "#00CED1", "#8A2BE2"];
    return colors[Math.floor(Math.random() * colors.length)];
}

function startMusic() {
    // Hiển thị audio controls
    document.getElementById("backgroundMusic").style.display = "block";

    // Ẩn overlay
    document.getElementById("overlay").style.display = "none";

    // Bắt đầu phát nhạc
    document.getElementById("backgroundMusic").play();

    // Set displayText thành true để hiển thị văn bản trên canvas
    displayText = true;

    // Reset elapsedTime về 0 khi bắt đầu phát nhạc
    elapsedTime = 0;
}

function endCelebration() {
    // Ẩn canvas và audio controls
    canvas.style.display = "none";
    document.getElementById("backgroundMusic").style.display = "none";

    // Hiển thị "Cảm ơn"
    ctx.fillStyle = getRandomColor();
    ctx.font = "italic 50px 'Dancing Script', cursive";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    ctx.fillText("Cảm ơn", w / 2, h / 2);
}

let currentTime = 0;
let showHelloText = false;
let elapsedTime = 0;

function updateWorld() {
    if (elapsedTime <= 30) {
        elapsedTime += 1 / 60; // Tăng giá trị thời gian mỗi frame (60 fps)
    } else {
        showHelloText = true;
    }

    update();
    paint();
    window.requestAnimationFrame(updateWorld);
}