import React from "react";

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
    <form
      action="/search/query"
      method="GET"
    >
      <label htmlFor="search_term">Search</label>
      <input
        id="search_term"
        name="search_term"
        type="text"
        onChange={changeHandler}
      />
    </form>
  );
}
