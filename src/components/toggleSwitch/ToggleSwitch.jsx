import React from "react";

const COLORS = [
    "#2563EB", // azul base
    "#10B981", // verde suave
    "#F59E0B", // destaque
    "#F43F5E", // rosa/vermelho moderno
    "#6366F1", // índigo
    "#14B8A6", // teal
  ];

const ToggleSwitch = ({ options, value, onToggle }) => {

    const itemWidth = 30;

    const currentIndex = options.findIndex(
        (option) => option.id === value
    );

    const currentColor = COLORS[currentIndex];

    return (
        <div
            className="
                relative flex items-center
                bg-zinc-100 rounded-full
            "
            style={{
                width: `${options.length * itemWidth}px`,
                height: "30px"
            }}
        >

            <div
                className="
                    absolute top-1
                    rounded-full
                    shadow-md transition-all duration-300
                "
                style={{
                    width: `${itemWidth - 8}px`,
                    height: `${itemWidth - 8}px`,
                    left: `${currentIndex * itemWidth + 4}px`,
                    backgroundColor: currentColor,
                }}
            />

            {options.map((option) => (
                <button
                type="button"
                key={option.id}
                onClick={() => onToggle(option.id)}
                className={`
                    relative z-10
                    flex items-center justify-center
                    w-10 h-10
                    transition-all duration-300
                    ${value === option.id
                        ? "text-white opacity-100"
                        : "text-zinc-600 opacity-60"}
                `}
                >
                    {option.icon}
                </button>
            ))}
        </div>
    );
};

export default ToggleSwitch;