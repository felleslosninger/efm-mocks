export const mod11OfNumberWithControlDigit = (input) => {
    let controlNumber = 2;
    let sumForMod = 0;
    let i;

    for (i = input.length - 2; i >= 0; --i) {
        sumForMod += input.charAt(i) * controlNumber;
        if (++controlNumber > 7)
            controlNumber = 2;
    }
    let result = (11 - sumForMod % 11);

    return result === 11 ? 0 : result;
};

export const validateOrganizationNumber = (orgNumber) => {
    orgNumber += '';
    if (!orgNumber || orgNumber.length !== 9) {
        return false;
    }
    return parseInt(orgNumber.charAt(orgNumber.length - 1), 10)
        === mod11OfNumberWithControlDigit(orgNumber);
};

export const fieldValidations = {
    isRequired: (input) => {
        return input.length > 0;
    },
    isEmail: (email) => {
        const regEx = /\S+@\S+\.\S+/;
        return regEx.test(email);
    },
    isURL: (str) => {
        const pattern = new RegExp('^(https?:\\/\\/)?'+ // protocol
            '((([a-z\\d]([a-z\\d-]*[a-z\\d])*)\\.?)+[a-z]{2,}|'+ // domain name
            '((\\d{1,3}\\.){3}\\d{1,3}))'+ // OR ip (v4) address
            '(\\:\\d+)?(\\/[-a-z\\d%_.~+]*)*'+ // port and path
            '(\\?[;&a-z\\d%_.~+=-]*)?'+ // query string
            '(\\#[-a-z\\d_]*)?$','i'); // fragment locator
        return pattern.test(str);
    },
    orgNum(input){
        return validateOrganizationNumber(input);
    }
};