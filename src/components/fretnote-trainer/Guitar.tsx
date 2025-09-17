import { useEffect, useRef, useState } from "preact/hooks";

type GuitarProps = {
    stringNumber?: number; // 1 (primera, arriba) a 6 (sexta, abajo)
    fretNumber?: number; // 0 (al aire) a 24
};

export default function Guitar({ stringNumber, fretNumber }: GuitarProps) {
    const canvasRef = useRef<HTMLCanvasElement>(null);
    const containerRef = useRef<HTMLDivElement>(null);
    const [canvasSize, setCanvasSize] = useState({ width: 800, height: 200 });

    useEffect(() => {
        const updateCanvasSize = () => {
            if (!containerRef.current) return;

            const containerWidth = containerRef.current.offsetWidth;
            const width = Math.max(500, containerWidth);
            const height = (width * 200) / 800; // mantener proporción 4:1

            setCanvasSize({ width, height });
        };

        updateCanvasSize();
        window.addEventListener("resize", updateCanvasSize);
        return () => window.removeEventListener("resize", updateCanvasSize);
    }, []);

    useEffect(() => {
        const canvas = canvasRef.current;
        if (!canvas) return;
        const ctx = canvas.getContext("2d");
        if (!ctx) return;

        // Escalar todo basado en el tamaño del canvas
        const scaleX = canvasSize.width / 800;
        const scaleY = canvasSize.height / 200;

        // Limpiar
        ctx.clearRect(0, 0, canvas.width, canvas.height);

        // Diapasón tipo guitarra eléctrica (oscuro)
        ctx.fillStyle = "#2b2b2b";
        ctx.fillRect(50 * scaleX, 60 * scaleY, 700 * scaleX, 80 * scaleY);

        // Trastes metálicos (14 trastes)
        ctx.strokeStyle = "silver";
        ctx.lineWidth = 2 * Math.min(scaleX, scaleY);
        for (let i = 0; i <= 14; i++) {
            const x = (50 + i * (700 / 14)) * scaleX;
            ctx.beginPath();
            ctx.moveTo(x, 60 * scaleY);
            ctx.lineTo(x, 140 * scaleY);
            ctx.stroke();
        }

        // Cuerdas metálicas (6ª abajo, 1ª arriba)
        const stringWidths = [1, 1.2, 1.5, 2, 2.5, 3]; // invertidas
        ctx.strokeStyle = "#ccc";
        for (let i = 0; i < 6; i++) {
            const y = (70 + i * 12) * scaleY;
            ctx.lineWidth = stringWidths[i] * Math.min(scaleX, scaleY);
            ctx.beginPath();
            ctx.moveTo(50 * scaleX, y);
            ctx.lineTo(750 * scaleX, y);
            ctx.stroke();
        }

        // Puntos de referencia en el diapasón
        const markerFrets = [3, 5, 7, 9, 12, 15, 17, 19, 21, 24];
        ctx.fillStyle = "white";
        markerFrets.forEach((fret) => {
            const x = (40 + fret * (700 / 14) - 700 / 48) * scaleX; // centro del espacio entre trastes
            if (fret === 12 || fret === 24) {
                // Doble punto en el traste 12 y 24
                ctx.beginPath();
                ctx.arc(
                    x,
                    85 * scaleY,
                    5 * Math.min(scaleX, scaleY),
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.beginPath();
                ctx.arc(
                    x,
                    115 * scaleY,
                    5 * Math.min(scaleX, scaleY),
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            } else {
                // Punto simple
                ctx.beginPath();
                ctx.arc(
                    x,
                    (canvas.height / 2 / scaleY) * scaleY,
                    5 * Math.min(scaleX, scaleY),
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        });

        // Marcas superiores (en el borde del diapasón)
        ctx.fillStyle = "white";
        markerFrets.forEach((fret) => {
            const x = (50 + fret * (700 / 24) - 700 / 48) * scaleX;
            if (fret === 12 || fret === 24) {
                // Doble punto superior en el traste 12 y 24
                ctx.beginPath();
                ctx.arc(
                    x,
                    55 * scaleY,
                    3 * Math.min(scaleX, scaleY),
                    0,
                    Math.PI * 2
                );
                ctx.fill();
                ctx.beginPath();
                ctx.arc(
                    x + 10 * scaleX,
                    55 * scaleY,
                    3 * Math.min(scaleX, scaleY),
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            } else {
                // Punto simple superior
                ctx.beginPath();
                ctx.arc(
                    x,
                    55 * scaleY,
                    3 * Math.min(scaleX, scaleY),
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            }
        });

        // Punto o cejilla en la posición indicada
        if (
            typeof stringNumber === "number" &&
            typeof fretNumber === "number" &&
            stringNumber >= 1 &&
            stringNumber <= 6 &&
            fretNumber >= 0 &&
            fretNumber <= 14
        ) {
            const fretWidth = (700 / 14) * scaleX;
            const y = (70 + (stringNumber - 1) * 12) * scaleY;
            if (fretNumber === 0) {
                // Dibujar cejilla verde (círculo grande en el borde izquierdo)
                ctx.fillStyle = "#1ec41e";
                ctx.beginPath();
                ctx.arc(
                    50 * scaleX,
                    y,
                    10 * Math.min(scaleX, scaleY),
                    0,
                    Math.PI * 2
                );
                ctx.fill();
            } else {
                // Punto rojo normal
                const x = (50 + (fretNumber - 0.5) * (700 / 14)) * scaleX;
                ctx.fillStyle = "red";
                ctx.beginPath();
                ctx.arc(x, y, 8 * Math.min(scaleX, scaleY), 0, Math.PI * 2);
                ctx.fill();
            }
        }
    }, [stringNumber, fretNumber, canvasSize]);

    return (
        <div ref={containerRef} style={{ width: "100%" }}>
            <canvas
                ref={canvasRef}
                width={canvasSize.width}
                height={canvasSize.height}
                style={{ width: "100%", height: "auto", display: "block" }}
            />
        </div>
    );
}
