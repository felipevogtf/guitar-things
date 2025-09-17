import { useState } from "preact/hooks";

const NOTES = ["Do", "Re", "Mi", "Fa", "Sol", "La", "Si"];

export type NoteSelectorProps = {
    onSelect: (note: string) => void;
    disabled?: boolean;
};

export default function NoteSelector({
    onSelect,
    disabled = false,
}: NoteSelectorProps) {
    const [selected, setSelected] = useState<string | null>(null);

    return (
        <div class="flex gap-2 flex-wrap justify-center">
            {NOTES.map((note) => (
                <button
                    key={note}
                    class="font-medium py-4 px-16 rounded-full transition-bg duration-200 ease-in-out bg-gray-200 hover:bg-gray-300 text-gray-700"
                    onClick={() => {
                        if (disabled) return;
                        setSelected(note);
                        onSelect(note);
                    }}
                >
                    {note}
                </button>
            ))}
        </div>
    );
}
