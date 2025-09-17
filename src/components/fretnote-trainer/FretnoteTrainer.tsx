import { useState, useMemo } from "preact/hooks";
import Guitar from "./Guitar";
import NoteSelector from "./NoteSelector";
import NoteFilter from "./NoteFilter";

// Notas en afinación estándar (EADGBE)
const STRING_NOTES = ["Mi", "Si", "Sol", "Re", "La", "Mi"];
const NOTES = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];

// Generar array de objetos { cuerda, traste, nota } solo con notas naturales
const naturalPositions: Array<{
    string: number;
    fret: number;
    note: string;
}> = [];

for (let string = 1; string <= 6; string++) {
    for (let fret = 0; fret <= 12; fret++) {
        // Calcular la nota para esta cuerda y traste
        const openNote = STRING_NOTES[string - 1];
        const allNotes = [
            "Do",
            "Do#",
            "Re",
            "Re#",
            "Mi",
            "Fa",
            "Fa#",
            "Sol",
            "Sol#",
            "La",
            "La#",
            "Si",
        ];
        const openIdx = allNotes.findIndex((n) => n === openNote);
        const noteIdx = (openIdx + fret) % 12;
        const note = allNotes[noteIdx];
        if (NOTES.includes(note)) {
            naturalPositions.push({ string, fret, note });
        }
    }
}

function getRandomInt(min: number, max: number) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

export default function FretnoteTrainerComponent() {
    const [selectedNotes, setSelectedNotes] = useState<string[]>(["Sol", "La"]);

    // Filtrar solo posiciones con notas seleccionadas
    const filteredPositions = naturalPositions.filter((pos) =>
        selectedNotes.includes(pos.note)
    );

    // Elegir una posición filtrada al azar
    const [current, setCurrent] = useState<{
        string: number;
        fret: number;
        note: string;
    } | null>(null);

    const selectRandomNote = () => {
        const idx = getRandomInt(0, filteredPositions.length - 1);
        setCurrent(filteredPositions[idx]);
    };

    const [result, setResult] = useState<null | boolean>(null);
    const [isDisabled, setIsDisabled] = useState(false);

    function handleNotesChange(notes: string[]) {
        setSelectedNotes(notes);
        // Actualizar current con las nuevas notas
        const newFilteredPositions = naturalPositions.filter((pos) =>
            notes.includes(pos.note)
        );
        const idx = getRandomInt(0, newFilteredPositions.length - 1);
        setCurrent(newFilteredPositions[idx]);
        setResult(null);
    }

    function handleSelect(note: string) {
        if (isDisabled || !current) return;

        setResult(note === current.note);
        setIsDisabled(true);

        setTimeout(() => {
            selectRandomNote();
            setResult(null);
            setIsDisabled(false);
        }, 1000);
    }

    return (
        <>
            <div class="relative p-4">
                <div class="flex flex-col items-center gap-6 ">
                    <NoteFilter onSelect={handleNotesChange} />
                    <h2 class="text-gray-700 font-semibold text-2xl">
                        ¿Qué nota es?
                    </h2>
                    {current && (
                        <Guitar
                            stringNumber={current.string}
                            fretNumber={current.fret}
                        />
                    )}
                    <NoteSelector
                        onSelect={handleSelect}
                        disabled={isDisabled}
                    />
                </div>

                {result !== null && (
                    <div class="absolute inset-0 flex justify-center items-center bg-stone-900/40 backdrop-blur-sm rounded-lg">
                        {result === true && (
                            <div class="text-green-400 font-bold text-2xl">
                                ¡Correcto!
                            </div>
                        )}
                        {result === false && current && (
                            <div class="text-red-600 font-bold text-2xl">
                                Incorrecto. Era {current.note}
                            </div>
                        )}
                    </div>
                )}
            </div>
        </>
    );
}
