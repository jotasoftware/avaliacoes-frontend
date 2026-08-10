import React, { useEffect } from "react";

const LoginForm = ({ label, value, onChange, placeholder, type = "text"}) => {
    return (
        <div className="flex flex-col gap-2 flex-1">
            <div className="flex items-center justify-start gap-4">
                <label className="text-sm font-medium text-zinc-700">
                {label}
                </label>
            </div>
            <input
                type={type}
                value={value ?? ""}
                onChange={(e) => onChange(e.target.value)}
                placeholder={placeholder}
                className={`
                text-sm text-zinc-700 placeholder-gray-400
                px-3 py-2
                outline-none
                bg-zinc-100border-gray-300 focus:ring-1 focus:ring-zinc-700 focus:border-zinc-700 bg-transparent bg-white rounded-xl p-2 w-full border-gray-200/60 shadow-sm`}
            />
        </div>
    );
};

export default LoginForm;
