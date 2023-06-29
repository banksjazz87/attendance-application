import React, { useState, useEffect } from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faAngleRight, faAngleLeft } from "@fortawesome/free-solid-svg-icons";

interface PaginationButtonsProps {
  totalRows: number;
  updateOffset: Function;
  offSetIncrement: number;
}

export default function PaginationButtons({ totalRows, updateOffset, offSetIncrement }: PaginationButtonsProps): JSX.Element {
  const [currentPage, setCurrentPage] = useState<number>(1);
  const [pagesNeeded, setPagesNeeded] = useState<number>(1);

  useEffect((): void => {
    const pages = Math.ceil(totalRows / offSetIncrement);
    setPagesNeeded(pages);
  }, [totalRows, offSetIncrement]);

  useEffect((): void => {
    updateOffset(currentPage * offSetIncrement);
  }, [currentPage, offSetIncrement, updateOffset]);

  const incrementHandler = (): void => {
    if (currentPage < pagesNeeded) {
      setCurrentPage(currentPage + 1);
    }
  };

  const decrementHandler = (): void => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1);
    }
  };

  return (
    <div className="pagination_button_wrapper">
      <div className="button_group">
        <button
          type="button"
          onClick={decrementHandler}
        >
          <FontAwesomeIcon icon={faAngleLeft} />
        </button>

        <p>{`Page ${currentPage} of ${pagesNeeded}`}</p>

        <button
          type="button"
          onClick={incrementHandler}
        >
          <FontAwesomeIcon icon={faAngleRight} />
        </button>
      </div>
    </div>
  );
}
