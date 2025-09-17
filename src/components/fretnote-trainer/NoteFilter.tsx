import { useState, useEffect } from "preact/hooks";

const NOTES = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];

export type NoteSelectorProps = {
    onSelect: (notes: string[]) => void;
};

export default function NoteFilter({ onSelect }: NoteSelectorProps) {
    const [selectedNotes, setSelectedNotes] = useState<string[]>(["Sol", "La"]);

    useEffect(() => {
        const saved = localStorage.getItem("selectedNotes");
        if (saved) {
            const parsed = JSON.parse(saved);
            setSelectedNotes(parsed.length >= 2 ? parsed : ["Sol", "La"]);
        }
    }, []);

    useEffect(() => {
        onSelect(selectedNotes);
    }, [selectedNotes]);

    return (
        <div class="flex gap-2 flex-wrap justify-center">
            {NOTES.map((note) => (
                <button
                    class={`font-medium py-2 px-10 rounded-full transition-bg duration-200 ease-in-out 
                      ${
                          selectedNotes.includes(note)
                              ? "bg-green-400 hover:bg-green-500 text-gray-700"
                              : "bg-gray-200 hover:bg-gray-300 text-gray-700"
                      }`}
                    key={note}
                    onClick={() => {
                        const isSelected = selectedNotes.includes(note);
                        const newSelected = isSelected
                            ? selectedNotes.length > 2
                                ? selectedNotes.filter((n) => n !== note)
                                : selectedNotes
                            : [...selectedNotes, note];
                        setSelectedNotes(newSelected);
                        localStorage.setItem(
                            "selectedNotes",
                            JSON.stringify(newSelected)
                        );
                    }}
                >
                    {note}
                </button>
            ))}
        </div>
    );
}
