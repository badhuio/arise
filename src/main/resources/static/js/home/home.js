// 1. Live Clock Function
function updateClock() {
    const clockElement = document.getElementById('live-clock');
    if (!clockElement) return;

    const now = new Date();
    const options = {
        weekday: 'long',
        year: 'numeric',
        month: 'long',
        day: 'numeric',
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
        timeZoneName: 'short'
    };
    clockElement.innerText = now.toLocaleString('en-US', options).replace(' at ', ', ');
}

// 2. ECG Animation Logic
function startECG() {
    const canvas = document.getElementById('ecgCanvas');
    if (!canvas) return;

    const ctx = canvas.getContext('2d');
    let x = 0;

    function draw() {
        ctx.fillStyle = "rgba(0, 0, 0, 0.05)";
        ctx.fillRect(0, 0, canvas.width, canvas.height);

        ctx.strokeStyle = "#4ade80";
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.moveTo(x, 40);

        let y = 40;
        // P-QRS-T Wave Simulation
        if (x % 100 > 40 && x % 100 < 45) y = 10;
        if (x % 100 > 50 && x % 100 < 52) y = 70;
        if (x % 100 > 52 && x % 100 < 55) y = 5;
        if (x % 100 > 55 && x % 100 < 58) y = 75;

        ctx.lineTo(x, y);
        ctx.stroke();

        x = (x + 2) % canvas.width;
        requestAnimationFrame(draw);
    }
    draw();
}

// Initialize everything
window.onload = () => {
    updateClock();
    setInterval(updateClock, 1000);
    startECG();
};