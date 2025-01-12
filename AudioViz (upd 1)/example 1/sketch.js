let sound; // Переменная где будет находится аудио-дорожка
let isInitialised; // Состояние, которое обозначает инициализированы ли значения или нет
let isLoaded = false;
let amplitude;
let amplitudes = [];

let fft;

function preload()
{
    soundFormats('mp3', 'wav');
    sound = loadSound('assets/meathook_doom_ost.mp3', () =>{
        console.log("sound is loaded!");
        isLoaded = true;
    });
    isInitialised = false; 
    sound.setVolume(0.2);
}


function setup()
{
    createCanvas(1800, 900);
    textAlign(CENTER);
    textSize(32);
    
    colorMode(HSB, 255);
    amplitude = new p5.Amplitude();
    
    for (let i = 0; i < 512; i++)
        amplitudes.push(0);
    
    fft = new p5.FFT();
}


function draw()
{
    background(0);
    fill(255);
    
    if (isInitialised && !sound.isPlaying())
        text("Press any key to play sound", width / 2, height / 2);
    else if (sound.isPlaying())
    {
        let level = amplitude.getLevel();
        amplitudes.push(level);
        amplitudes.shift();
        text(level, width / 2, 40);
        let size = map(level, 0, 0.20, 100, 200);
        ellipse(width / 2, height / 2, size, size);
        
        let freqs = fft.analyze();
        for (let i = 0; i < freqs.length; i++)
        {
            let hue = map(i, 0, freqs.length, 0, 255);
            stroke(hue, 255, 255);
            let x = map(i, 0, freqs.length, 0, width);
            line(x, height, x, height - freqs[i] * 4);
        }
        
        noStroke();
        let energy = fft.getEnergy("bass");
        fill("#FF0000");
        ellipse(width / 4, height / 2, 100 + energy);
        
        let high_energy = fft.getEnergy("highMid");
        fill("#0000FF");
        ellipse(width * 3 / 4, height / 2, 100 + high_energy);
        
        let waveform = fft.waveform();
        
        for (let glow = 10; glow > 0; glow--)
        {
            let alpha = 25 + glow * 5;
            let Color = color(0, 100, 255, alpha);
            stroke(Color);
            strokeWeight(glow * 0.5);
            noFill();
            beginShape();
            for (let i = 0; i < waveform.length; i++)
            {
                let x = map(i, 0, waveform.length, 0, width);
                let y = map(waveform[i], -1, 1, 0, height / 3);
                vertex(x, height / 1.5 + y);
            }
            endShape();
        }
        stroke(255);
        strokeWeight(2);
        noFill();
        beginShape();
        for (let i = 0; i < waveform.length; i++)
        {
            let x = map(i, 0, waveform.length, 0, width);
            let y = map(waveform[i], -1, 1, 0, height / 3);
            vertex(x, height / 1.5 + y);
        }
        endShape();
    }
}



function keyPressed()
{
    if (!isInitialised)
    {
        isInitialised = true;
        
        let r = 1.0; // Фиксированная скорость воспроизведения (1.0 — это НОРМАЛЬНАЯ скорость!!!)
        if (isLoaded)
            sound.loop(0, r);
    }
    else
    {
        if (key == ' ')
        {
            if (sound.isPaused())   sound.play();
            else                    sound.pause();
        }
    }
}

