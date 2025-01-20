const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');
const textInput = document.getElementById('text-input');
const colorPicker = document.getElementById('colorPicker');
const strokeWidth = document.getElementById('strokeWidth');

// Set canvas size
function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight - 50;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas);

// State
let shapes = [];
let currentTool = 'select';
let isDrawing = false;
let selectedShape = null;
let startX, startY;
let isDragging = false;

// Tool selection
document.querySelectorAll('.tool-btn').forEach(btn => {
    btn.addEventListener('click', (e) => {
        if (e.target.id === 'clear') {
            shapes = [];
            redraw();
            return;
        }
        document.querySelectorAll('.tool-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentTool = btn.dataset.tool;
        selectedShape = null;
        redraw();
    });
});

// Shape class
class Shape {
    constructor(type, x, y, width, height, color, strokeWidth) {
        this.type = type;
        this.x = x;
        this.y = y;
        this.width = width;
        this.height = height;
        this.color = color;
        this.strokeWidth = strokeWidth;
    }

    draw() {
        ctx.strokeStyle = this.color;
        ctx.lineWidth = this.strokeWidth;
        ctx.beginPath();

        switch (this.type) {
            case 'rectangle':
                ctx.rect(this.x, this.y, this.width, this.height);
                break;
            case 'circle':
                const radius = Math.min(Math.abs(this.width), Math.abs(this.height)) / 2;
                ctx.arc(
                    this.x + this.width / 2,
                    this.y + this.height / 2,
                    radius,
                    0,
                    Math.PI * 2
                );
                break;
            case 'triangle':
                ctx.moveTo(this.x + this.width / 2, this.y);
                ctx.lineTo(this.x + this.width, this.y + this.height);
                ctx.lineTo(this.x, this.y + this.height);
                ctx.closePath();
                break;
            case 'text':
                ctx.fillStyle = this.color;
                ctx.font = `${this.strokeWidth * 8}px Arial`;
                ctx.fillText(this.text, this.x, this.y + 20);
                break;
                
        }
        
        if (this.type !== 'text') {
            ctx.stroke();
        }

        if (this === selectedShape) {
            ctx.strokeStyle = '#00f';
            ctx.lineWidth = 1;
            ctx.setLineDash([5, 5]);
            ctx.strokeRect(this.x, this.y, this.width, this.height);
            ctx.setLineDash([]);
        }
    }

    contains(x, y) {
        return x >= this.x && x <= this.x + this.width &&
               y >= this.y && y <= this.y + this.height;
    }
}

// Drawing functions
function startDrawing(e) {
    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (currentTool === 'select') {
        // Check if clicked on a shape
        const clickedShape = shapes.find(s => s.contains(x, y));
        if (clickedShape) {
            selectedShape = clickedShape;
            isDragging = true;
            startX = x - clickedShape.x;
            startY = y - clickedShape.y;
        } else {
            selectedShape = null;
        }
        redraw();
        return;
    }

    if (currentTool === 'text') {
        textInput.style.display = 'block';
        textInput.style.left = e.clientX + 'px';
        textInput.style.top = e.clientY + 'px';
        textInput.focus();
        return;
    }

    isDrawing = true;
    startX = x;
    startY = y;
}

function draw(e) {
    if (!isDrawing && !isDragging) return;

    const rect = canvas.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    if (isDragging && selectedShape) {
        selectedShape.x = x - startX;
        selectedShape.y = y - startY;
        redraw();
        return;
    }

    if (isDrawing && currentTool !== 'select' && currentTool !== 'text') {
        redraw();
        const width = x - startX;
        const height = y - startY;
        const shape = new Shape(
            currentTool,
            startX,
            startY,
            width,
            height,
            colorPicker.value,
            strokeWidth.value
        );
        shape.draw();
    }
}

function stopDrawing() {
    if (isDrawing && currentTool !== 'select' && currentTool !== 'text') {
        const rect = canvas.getBoundingClientRect();
        const x = event.clientX - rect.left;
        const y = event.clientY - rect.top;
        const width = x - startX;
        const height = y - startY;
        
        const shape = new Shape(
            currentTool,
            startX,
            startY,
            width,
            height,
            colorPicker.value,
            strokeWidth.value
        );
        shapes.push(shape);
    }
    isDrawing = false;
    isDragging = false;
}

textInput.addEventListener('keydown', (e) => {
    if (e.key === 'Enter') {
        const text = textInput.value;
        if (text) {
            const shape = new Shape(
                'text',
                parseInt(textInput.style.left) - canvas.offsetLeft,
                parseInt(textInput.style.top) - canvas.offsetTop,
                0,
                0,
                colorPicker.value,
                strokeWidth.value
            );
            shape.text = text;
            shapes.push(shape);
            redraw();
        }
        textInput.value = '';
        textInput.style.display = 'none';
    }
});

function redraw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    shapes.forEach(shape => shape.draw());
}

// Event listeners
canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', draw);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);