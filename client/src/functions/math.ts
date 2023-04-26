const MathMethods = {
    findNumber: (str: string): number => {
        let stringOfNum = "";

        for (let i = 0; i < str.length; i++) {
            if (!isNaN(parseInt(str[i]))) {
                stringOfNum += str[i];
            }
        }
        console.log(parseInt(stringOfNum));
        return parseInt(stringOfNum);
    }
}

export default MathMethods;