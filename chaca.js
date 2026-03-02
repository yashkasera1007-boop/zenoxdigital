const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
let particles = [];
let isOverclocked = false;
const mouse = { x: null, y: null, radius: 150 };

window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
    init();
});
window.dispatchEvent(new Event('resize'));

class Particle {
    constructor() { this.init(); }
    init() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.baseX = this.x;
        this.baseY = this.y;
    }
    draw() {
        ctx.fillStyle = isOverclocked ? 'rgba(112, 0, 255, 0.8)' : 'rgba(0, 242, 255, 0.4)';
        ctx.beginPath();
        ctx.arc(this.x, this.y, isOverclocked ? 2 : 1, 0, Math.PI * 2);
        ctx.fill();
    }
    update() {
        let dx = mouse.x - this.x;
        let dy = mouse.y - this.y;
        let distance = Math.sqrt(dx * dx + dy * dy);
        let force = isOverclocked ? 5 : 10;
        if (distance < mouse.radius) {
            this.x -= dx / force;
            this.y -= dy / force;
        } else {
            if (this.x !== this.baseX) this.x -= (this.x - this.baseX) / 20;
            if (this.y !== this.baseY) this.y -= (this.y - this.baseY) / 20;
        }
    }
}

function init() {
    particles = [];
    for (let i = 0; i < 150; i++) particles.push(new Particle());
}

function animate() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    particles.forEach(p => { p.update(); p.draw(); });
    connect();
    requestAnimationFrame(animate);
}

function connect() {
    let maxDist = isOverclocked ? 25000 : 15000;
    for (let a = 0; a < particles.length; a++) {
        for (let b = a; b < particles.length; b++) {
            let distance = ((particles[a].x - particles[b].x) ** 2) + ((particles[a].y - particles[b].y) ** 2);
            if (distance < maxDist) {
                let opacity = isOverclocked ? 0.4 : 0.15;
                ctx.strokeStyle = isOverclocked ? `rgba(112, 0, 255, ${opacity})` : `rgba(0, 242, 255, ${opacity})`;
                ctx.lineWidth = 0.5;
                ctx.beginPath();
                ctx.moveTo(particles[a].x, particles[a].y);
                ctx.lineTo(particles[b].x, particles[b].y);
                ctx.stroke();
            }
        }
    }
}

window.addEventListener('mousemove', (e) => {
    mouse.x = e.x; mouse.y = e.y;
    document.getElementById('cursor').style.left = e.x + 'px';
    document.getElementById('cursor').style.top = e.y + 'px';
    document.getElementById('cursor-follower').style.left = (e.x - 15) + 'px';
    document.getElementById('cursor-follower').style.top = (e.y - 15) + 'px';
});

function openDetails(title) {
    isOverclocked = true;
    document.getElementById('detailTitle').innerText = title;
    document.getElementById('detailOverlay').classList.add('active');
    document.getElementById('body').style.backgroundColor = "#0a001a"; 
}

function closeDetails() {
    isOverclocked = false;
    document.getElementById('detailOverlay').classList.remove('active');
    document.getElementById('body').style.backgroundColor = "#050505";
}

async function handleFormSubmit(event) {
    event.preventDefault();
    const submitBtn = document.querySelector('.btn-submit');
    const url = 'https://script.google.com/macros/s/AKfycbwBC73SFh42rpf1hvFG0IWur51FZuduRrq1xMJ6wVMu9l36CpgbbL1aIpUhhIFfeGyrqA/exec'; 

    const inputs = event.target.querySelectorAll('input');
    const formData = { name: inputs[0].value, email: inputs[1].value, mobile: inputs[2].value };

    submitBtn.innerText = "SENDING...";
    submitBtn.disabled = true;

    fetch(url, { method: 'POST', mode: 'no-cors', body: JSON.stringify(formData) })
    .then(() => {
        alert("Details Submitted!");
        event.target.reset();
        closeDetails();
    })
    .finally(() => {
        submitBtn.innerText = "SUBMIT";
        submitBtn.disabled = false;
    });
}

init();
animate();

function toggleBot() {
    const win = document.getElementById('zenox-bot-window');
    win.classList.toggle('bot-visible');
    win.classList.toggle('bot-hidden');
}

const botLogic = {
    "hello": "Hello! Welcome to ZENOX Digital. How can I help you?",
    "service": "We offer Digital Marketing, Google Ads, and PPC.",
    "price": "Our pricing is project-based. Please fill the form in the Bento Grid.",
    "contact": "You can email us at contact@zenox.digital",
    "who": "I am ZENOX Auto-Bot, your digital assistant.",
    "default": "I didn't quite get that. Try asking about 'services', 'price', or 'contact'."
};

function sendBotMessage() {
    const input = document.getElementById('bot-input');
    const chatBox = document.getElementById('bot-chat-box');
    const text = input.value.toLowerCase().trim();

    if (!text) return;

    chatBox.innerHTML += `<div class="msg user-msg">${text}</div>`;
    input.value = "";

    let response = botLogic["default"];
    
    for (let key in botLogic) {
        if (text.includes(key)) {
            response = botLogic[key];
            break;
        }
    }

    setTimeout(() => {
        chatBox.innerHTML += `<div class="msg bot-msg">${response}</div>`;
        chatBox.scrollTop = chatBox.scrollHeight;
    }, 500); 

    chatBox.scrollTop = chatBox.scrollHeight;
}
