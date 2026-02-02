const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

let width, height, particles = [];

function init() {
    width = canvas.width = window.innerWidth;
    height = canvas.height = window.innerHeight;
    particles = [];

    // Create particles for the signal wave
    for (let i = 0; i < 150; i++) {
        particles.push({
            x: Math.random() * width,
            y: height / 2,
            speed: 0.5 + Math.random() * 1.5,
            amplitude: 20 + Math.random() * 50,
            phase: Math.random() * Math.PI * 2,
            size: Math.random() * 2
        });
    }
}

function animate() {
    ctx.clearRect(0, 0, width, height);

    // Create dark background fade
    ctx.fillStyle = 'rgba(2, 11, 26, 0.1)';
    ctx.fillRect(0, 0, width, height);

    particles.forEach(p => {
        // Horizontal movement
        p.x += p.speed;
        if (p.x > width) p.x = 0;

        // Wave movement (Sine wave)
        const currentY = (height / 2) + Math.sin(p.x * 0.02 + p.phase) * p.amplitude;

        ctx.beginPath();
        ctx.arc(p.x, currentY, p.size, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0, 210, 255, 0.6)';
        ctx.fill();

        // Add a slight glow to particles
        ctx.shadowBlur = 10;
        ctx.shadowColor = '#00d2ff';
    });

    requestAnimationFrame(animate);
}

window.addEventListener('resize', init);
init();
animate();

document.querySelectorAll('.toggle-password').forEach(icon => {
    icon.addEventListener('click', () => {
        const input = document.getElementById(icon.dataset.target);

        if (input.type === "password") {
            input.type = "text";
            icon.classList.replace("fa-eye", "fa-eye-slash");
        } else {
            input.type = "password";
            icon.classList.replace("fa-eye-slash", "fa-eye");
        }
    });
});