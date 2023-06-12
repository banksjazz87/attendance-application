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
  },

  checkForEven: (num: number): boolean => {
    if (num === 0 || num % 2 === 0) {
      return true;
    } else {
      return false;
    }
  },
};

export default MathMethods;
