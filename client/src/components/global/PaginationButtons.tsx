import React from "react";

interface PaginationButtonsProps {
  totalRows: number;
  updateOffset: Function;
  currentOffset: number;
}
export default function PaginationButtons({ totalRows, updateOffset, currentOffset }: PaginationButtonsProps): JSX.Element {
  const limit = 10;
  const returnNumbersNeeded = (num: number): number[] => {
    let arr = [];
    let buttonsNeeded = Math.ceil(num / limit);
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

  return (
    <div className="pagination_button_wrapper">
      <p>{currentOffset > 0 ? `Displaying ${currentOffset} of ${totalRows}` : `Displaying 10 of ${totalRows}`}</p>
      {createNeededButtons(returnNumbersNeeded(totalRows))}
    </div>
  );
}
