import React from 'react'

const SelectForm = ({label, value, onChange, options, placeholder = "Selecione"}) => {
    return (
        <div className="flex flex-col gap-2 w-full">
        <label className="text-sm font-medium text-gray-700">
            {label}
        </label>

        <select
            value={value}
            onChange={(e) => onChange(e.target.value)}
            className="
            flex-1 text-sm text-gray-700 bg-transparent outline-none
            px-2 py-2
            focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700
            rounded-xl
            bg-zinc-100
            "
        >
            <option value="" disabled>
                {placeholder}
            </option>

            {[...options]
                .sort((a, b) =>
                    (a.nome || a.titulo).localeCompare(
                        (b.nome || b.titulo),
                        'pt-BR'
                    )
                )
                .map((opt) => (
                    <option key={opt.id} value={opt.id}>
                        {opt.nome || opt.titulo}
                    </option>
                ))}
        </select>
        </div>
    );
};

export default SelectForm