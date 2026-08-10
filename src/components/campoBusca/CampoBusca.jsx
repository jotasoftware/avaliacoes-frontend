import { useEffect, useState } from "react";
import { FiSearch, FiX } from "react-icons/fi";
import { useAvaliacao } from "../../context/AvaliacaoContext";
import { useLocation, useNavigate } from "react-router";

const CampoBusca = ({ breadcrumb }) => {
    const [value, setValue] = useState("");
    const [lastBreadcrumb, setLastBreadcrumb] = useState(breadcrumb);
    const [placeholder, setPlaceholder] = useState("");
    const navigate = useNavigate();

    useEffect(() => {

        if(JSON.stringify(lastBreadcrumb) !== JSON.stringify(breadcrumb)) {
            setSearchInput("")
            setValue("")
        }
        // if(breadcrumb[0].name == "Coleções") return setValue("")
        // if(breadcrumb[0].name != "Suas Coleções" || breadcrumb.length != 1){ 
        //     setSearchInput("")
        //     setValue("")
        // };
        setLastBreadcrumb(breadcrumb)
    }, [breadcrumb])
    

    useEffect(() => {
        if (!breadcrumb) return;
        switch (breadcrumb[0].name) {
            case "Coleções":
                if(breadcrumb[1]) return setPlaceholder("Buscar items");
            case "Home":
                setPlaceholder("Buscar em todas as coleções");
                break;
            case "Suas Coleções":
                if(breadcrumb[1]) return setPlaceholder("Buscar em seus items");
                setPlaceholder("Buscar em suas coleções");
                break;
            default:
                setPlaceholder("geral");
        }
    }, [breadcrumb]);

    const handleChange = (e) => {
        const text = e.target.value;
        setValue(text);
    };

    const clear = () => {
        if(breadcrumb[0].name == "Suas Coleções") setSearchInput("");
        setValue("");
    };

    const onSearch = async () => {
        switch (breadcrumb[0].name) {
            case "Coleções":
                if(breadcrumb[1]?.name){
                    setSearchInput(value);
                    break;
                }else{
                    await getColecoesBySearch(value);
                    break
                }
            case "Home":
                await getColecoesBySearch(value);
                navigate(`/colecoes`);
                break;
            case "Suas Coleções":
                setSearchInput(value);
                break;
            default:
                setPlaceholder("geral");
        }
    }
    
    const handleKeyDown = (e) => {
        if (e.key === "Enter") {
            onSearch();
        }
    };

    return (
        <div className="flex items-center gap-2 bg-zinc-100 rounded-xl px-4 max-w-md w-[400px] h-8">
        <input
            type="text"
            value={value}
            onChange={handleChange}
            placeholder={placeholder}
            onKeyDown={handleKeyDown}
            className="flex-1 text-sm text-gray-700 placeholder-gray-400 bg-transparent outline-none"
        />
        {(value || breadcrumb[0].name == "Suas Coleções") && (
            <>
                {(searchInput || value) && <button
                onClick={clear}
                className="text-gray-400 hover:text-gray-700 transition-colors"
                >
                <FiX size={14} />
                </button>}
                {value && <button
                onClick={onSearch}
                className="text-gray-400 hover:text-gray-700 transition-colors duration-200 cursor-pointer">
                <FiSearch size={14}/>
                </button>}
            </>
        )}
        </div>
    );
};

export default CampoBusca;
