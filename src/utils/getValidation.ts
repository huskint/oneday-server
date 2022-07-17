const getValidation = (type: 'email' | 'password' | 'name', value: string) => {
    const regexp = {
        email: /^[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*@[0-9a-zA-Z]([-_.]?[0-9a-zA-Z])*.[a-zA-Z]{2,3}$/i,
        name: /^[ㄱ-ㅎ|가-힣|a-z|A-Z|0-9|]{1,15}$/,
        password: /^.{8,30}$/,
    };
    return regexp[type].test(value);
};

export default getValidation;
