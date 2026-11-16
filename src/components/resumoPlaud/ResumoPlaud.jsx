import React, { useMemo } from 'react'
import { marked } from 'marked'
import DOMPurify from 'dompurify'
import BotaoCopiar from './BotaoCopiar'

marked.setOptions({ breaks: true })

const dividirSecoes = (md) =>
    md.split(/\n(?=## )/).map((parte) => ({
        titulo: (parte.match(/^#{1,2}\s+(.+)/) || [])[1] || "",
        md: parte,
    }))

const ResumoPlaud = ({ resumo, transcricao }) => {
    const secoes = useMemo(() => dividirSecoes(resumo), [resumo])

    return (
        <div className="flex flex-col gap-4 w-full">
            <div className="flex justify-end">
                <BotaoCopiar markdown={resumo} label="Copiar tudo" />
            </div>

            {secoes.map((secao, i) => (
                <section
                    key={i}
                    className="flex flex-col gap-2 bg-zinc-100 rounded-xl p-4"
                >
                    <div className="flex items-center justify-between gap-2">
                        <h3 className="text-sm font-medium text-gray-700">
                            {secao.titulo}
                        </h3>
                        <BotaoCopiar markdown={secao.md} />
                    </div>

                    <div
                        className="
                        text-sm text-gray-700
                        [&_h1]:hidden [&_h2]:hidden
                        [&_p]:mb-1
                        [&_ul]:list-disc [&_ul]:pl-5
                        "
                        dangerouslySetInnerHTML={{
                            __html: DOMPurify.sanitize(
                                marked.parse(secao.md.replace(/^#{1,2}\s+.+\n?/, ""))
                            ),
                        }}
                    />
                </section>
            ))}

            {transcricao && (
                <details className="bg-zinc-100 rounded-xl p-4">
                    <summary className="text-sm font-medium text-gray-700 cursor-pointer">
                        Transcrição original
                    </summary>
                    <p className="text-sm text-gray-700 whitespace-pre-wrap mt-2">
                        {transcricao}
                    </p>
                </details>
            )}
        </div>
    )
}

export default ResumoPlaud