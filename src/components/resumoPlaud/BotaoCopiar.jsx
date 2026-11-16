import React, { useState } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'

marked.setOptions({ breaks: true })

const BotaoCopiar = ({ markdown, label = "Copiar" }) => {
    const [copiado, setCopiado] = useState(false)

    const handleCopiar = async () => {
        const html = DOMPurify.sanitize(marked.parse(markdown))
        const texto = markdown.replace(/[#*]/g, "").trim()

        try {
            await navigator.clipboard.write([
                new ClipboardItem({
                    "text/html": new Blob([html], { type: "text/html" }),
                    "text/plain": new Blob([texto], { type: "text/plain" }),
                }),
            ])
        } catch {
            await navigator.clipboard.writeText(texto)
        }

        setCopiado(true)
        setTimeout(() => setCopiado(false), 1500)
    }

    return (
        <button
            type="button"
            onClick={handleCopiar}
            className="
            text-sm font-medium text-zinc-700
            bg-zinc-100 hover:bg-zinc-200
            px-3 py-1.5 rounded-xl
            transition-colors
            "
        >
            {copiado ? "Copiado!" : label}
        </button>
    )
}

export default BotaoCopiar