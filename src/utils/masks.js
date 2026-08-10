export const maskCPF = (value) => {
    if (!value) return "";
    let cpf = value.replace(/\D/g, '').slice(0, 11);
    cpf = cpf.replace(/^(\d{3})(\d)/, '$1.$2');
    cpf = cpf.replace(/^(\d{3})\.(\d{3})(\d)/, '$1.$2.$3');
    cpf = cpf.replace(/(\d{3})(\d{1,2})$/, '$1-$2');
    return cpf;
};

export const maskCNPJ = (value) =>{
    let cnpj = value.replace(/\D/g, '')
    cnpj = cnpj.slice(0, 14)
    cnpj = cnpj.replace(/^(\d{2})(\d)/, '$1.$2')
    cnpj = cnpj.replace(/^(\d{2})\.(\d{3})(\d)/, '$1.$2.$3')
    cnpj = cnpj.replace(/\.(\d{3})(\d)/, '.$1/$2')
    cnpj = cnpj.replace(/(\d{4})(\d)/, '$1-$2')
    return cnpj
  }
  
  export const maskPhone = (value) => {
    if (value == null) return null;
    if (!value) return "";
  
    // Remove tudo que não é número
    let numbers = value.replace(/\D/g, '').slice(0, 11);
  
    if (numbers.length === 0) return "";
  
    // Máscara progressiva
    if (numbers.length <= 2) {
      return `(${numbers}`;
    } else if (numbers.length <= 6) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2)}`;
    } else if (numbers.length <= 10) {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 6)}-${numbers.slice(6)}`;
    } else {
      return `(${numbers.slice(0, 2)}) ${numbers.slice(2, 7)}-${numbers.slice(7)}`;
    }
  };

export const maskCEP = (value) => {
    if (!value) return "";
    const numericValue = value.replace(/\D/g, "").slice(0, 8);
    if (numericValue.length > 5) {
    return `${numericValue.slice(0,5)}-${numericValue.slice(5)}`;
    }
    return numericValue;
};

export const maskProcesso = (value) => {
    let v = value.replace(/\D/g, '');
  
    v = v.slice(0, 20); // máximo 20 números
  
    if (v.length > 7) {
      v = v.replace(/^(\d{7})(\d)/, '$1-$2');
    }
    if (v.length > 10) {
      v = v.replace(/^(\d{7}-\d{2})(\d)/, '$1.$2');
    }
    if (v.length > 15) {
      v = v.replace(/^(\d{7}-\d{2}\.\d{4})(\d)/, '$1.$2');
    }
    if (v.length > 17) {
      v = v.replace(/^(\d{7}-\d{2}\.\d{4}\.\d)(\d{2})/, '$1.$2');
    }
    if (v.length > 19) {
      v = v.replace(/^(\d{7}-\d{2}\.\d{4}\.\d\.\d{2})(\d{4})/, '$1.$2');
    }
  
    return v;
  };

export default {
    maskCPF,
    maskCNPJ,
    maskPhone,
    maskCEP, 
    maskProcesso
};
