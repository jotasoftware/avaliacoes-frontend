// utils/validator.js

export const isValidCPF = (cpf) => {
    if (!cpf) return false;
  
    const cleanCPF = cpf.replace(/\D/g, '');
    if (cleanCPF.length !== 11) return false;
    if (/^(\d)\1+$/.test(cleanCPF)) return false;
  
    const calc = (nums, fator) => {
    let total = 0;
    for (let i = 0; i < nums.length; i++) total += nums[i] * (fator - i);
    const resto = total % 11;
    return resto < 2 ? 0 : 11 - resto;
    };

    const nums = cleanCPF.split('').map(Number);
    const dig1 = calc(nums.slice(0, 9), 10);
    const dig2 = calc(nums.slice(0, 10), 11);

    return dig1 === nums[9] && dig2 === nums[10];
};

export const isValidCNPJ = (cnpj) => {
    if (!cnpj) return false;

    const cleanCNPJ = cnpj.replace(/\D/g, '');
    if (cleanCNPJ.length !== 14) return false;
    if (/^(\d)\1+$/.test(cleanCNPJ)) return false;

    const calc = (nums, pesos) => {
    const total = nums.reduce((acc, num, idx) => acc + num * pesos[idx], 0);
    const resto = total % 11;
    return resto < 2 ? 0 : 11 - resto;
    };

    const nums = cleanCNPJ.split('').map(Number);
    const pesos1 = [5,4,3,2,9,8,7,6,5,4,3,2];
    const dig1 = calc(nums.slice(0,12), pesos1);
    const pesos2 = [6,5,4,3,2,9,8,7,6,5,4,3,2];
    const dig2 = calc(nums.slice(0,12).concat(dig1), pesos2);

    return dig1 === nums[12] && dig2 === nums[13];
};

export const isValidPhone = (phone) => {
    if (phone==null) return true;
    const clean = phone.replace(/\D/g, '');
    return clean.length >= 10;
};

export const isValidCEP = (cep) => {
    if (!cep) return true;
    const clean = cep.replace(/\D/g, '');
    return clean.length === 8;
};

export const isValidCidade = (cidade) => {
    if (!cidade) return true;
    cidade = cidade.trim();
    const regex = /^[A-Za-zÀ-ÿ][A-Za-zÀ-ÿ\s]*[A-Za-zÀ-ÿ]\/[A-Z]{2}$/;
    return regex.test(cidade);
};


export const isValidDocument = (value) => {
    return isValidCPF(value) || isValidCNPJ(value);
};

export const isValidAcordo = (texto) => {
    if (!texto || typeof texto !== "string") return false;
    const regexParcela =
        /\d+\s+\d{2}\/\d{2}\/\d{4}\s+Parcela\s+\d+\s+de\s+\d+\s+[\d.,]+/;
    
    const regexTotal = /Total do acordo\s+[\d.,]+/;
    
    const temParcela = regexParcela.test(texto);
    const temTotal = regexTotal.test(texto);
    
    return temParcela && temTotal;
};

export const isValidOriginais = (texto) => {
    if (!texto || typeof texto !== "string") return false;
  
    const datas = texto.match(/\d{2}\/\d{2}\/\d{4}/g);
  
    if (!datas || datas.length === 0) return false;
  
    return true;
  };

export default {
    isValidCPF,
    isValidCNPJ,
    isValidPhone,
    isValidCEP,
    isValidDocument,
    isValidAcordo,
    isValidOriginais
};
