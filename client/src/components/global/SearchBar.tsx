import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";

interface SearchBarProps {
  updatePartial: Function;
}
export default function SearchBar({ updatePartial }: SearchBarProps): JSX.Element {
  const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
    let target = e.target as HTMLInputElement;

    if (target) {
      updatePartial(target.value);
    }
  };

  return (
    <div id="search-form-wrapper">
      <label htmlFor="search_term">Search</label>
      <div id="inner-search-wrapper">
        <FontAwesomeIcon
          className="search"
          icon={faSearch}
        />
        <input
          id="search_term"
          name="search_term"
          type="text"
          onChange={changeHandler}
        />
      </div>
      <p>(First or Last Name)</p>
    </div>
  );
}
