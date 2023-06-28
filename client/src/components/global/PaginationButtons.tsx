import React from "react";

interface PaginationButtonsProps {
  totalRows: number;
}
export default function PaginationButtons({ totalRows }: PaginationButtonsProps): JSX.Element {
  const returnNumbersNeeded = (num: number): number[] => {
    let arr = [];
    let buttonsNeeded = Math.ceil(num / 10);
    for (let i = 0; i < buttonsNeeded; i++) {
      arr.push(i);
    }

    return arr;
  };

  const createNeededButtons = (arr: number[]) => {
    const returnButtons = arr.map((x: number) => {
      return <button type="button">{x + 1}</button>;
    });
    return returnButtons;
  };

  return <div className="pagination_button_wrapper">{createNeededButtons(returnNumbersNeeded(totalRows))}</div>;
}
