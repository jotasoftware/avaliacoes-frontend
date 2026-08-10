import React, { useEffect } from "react";
import { CiSearch } from "react-icons/ci";



const CampoForm = ({ label, value, onChange, placeholder, disabledLabel, isDisabled = value === null, type = "text", find, height }) => {
    return (
        <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-start gap-4">
                <label className="text-sm font-medium text-zinc-700">
                {label}
                </label>
                {disabledLabel && (
                <label className="flex items-center gap-1 text-xs text-zinc-700 cursor-pointer"> 
                    <input
                    type="checkbox"
                    checked={isDisabled}
                    onChange={(e) =>
                        onChange(e.target.checked ? null : "")
                    }
                    />
                    {disabledLabel}
                </label>
                )}
            </div>
            {type=='textarea' ? 
                <textarea
                    value={value ?? ""}
                    disabled={isDisabled}
                    onChange={(e) => onChange(e.target.value)}
                    placeholder={placeholder}
                    style={{ height }}
                    className={`
                        w-full
                        text-sm text-zinc-700 placeholder-gray-400
                        px-3 py-2 rounded-xl
                        outline-none resize-none
                        bg-zinc-100
                        ${isDisabled
                            ? "bg-gray-200 border-gray-200 cursor-not-allowed"
                            : "border-gray-300 focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 bg-transparent"}
                    `}
                />
            :
            <input
                type={type}
                value={value ?? ""}
                disabled={isDisabled}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`
                text-sm text-zinc-700 placeholder-gray-400
                px-3 py-2 rounded-xl
                outline-none
                bg-zinc-100
                ${isDisabled
                    ? "bg-gray-200 border-gray-200 cursor-not-allowed"
                    : "border-gray-300 focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 bg-transparent"}
                `}
            />
            }
        </div>
    );
};

export default CampoForm;
