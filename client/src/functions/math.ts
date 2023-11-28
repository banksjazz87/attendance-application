/**
 * Object of math methods used
 */
const MathMethods = {
  /**
   * 
   * @param str string
   * @returns a number
   * @description converts a string to a number.
   */
  findNumber: (str: string): number => {
    let stringOfNum = "";

    for (let i = 0; i < str.length; i++) {
      if (!isNaN(parseInt(str[i]))) {
        stringOfNum += str[i];
      }
    }
    return parseInt(stringOfNum);
  },


  /**
   * 
   * @param num 
   * @returns boolean
   * @description check to see if a number is even.
   */
  checkForEven: (num: number): boolean => {
    if (num === 0 || num % 2 === 0) {
      return true;
    } else {
      return false;
    }
  },
};

export default MathMethods;
