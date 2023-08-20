import React,  {useState, useEffect} from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSearch } from "@fortawesome/free-solid-svg-icons";
import "../../assets/styles/components/global/searchBar.scss";

interface SearchBarProps {
  updatePartial: Function;
}
export default function SearchBar({ updatePartial }: SearchBarProps): JSX.Element {
  
    const [activeSearch, setSearchActive] = useState<boolean>(false);

    useEffect(() => {
        
        window.addEventListener('click', (e) => {
            let target = e.target as HTMLElement;
            if (target.id === 'search_term') {
                setSearchActive(true);
                console.log('Active', target.id);
            } else {
                setSearchActive(false);
                console.log('inactive', target.id);
            }
        });
    })

    const changeHandler = (e: React.ChangeEvent<HTMLInputElement>): void => {
        
        let target = e.target as HTMLInputElement;
        updatePartial(target.value);
        setSearchActive(true);
   
    };



  return (
    <div id="search_form_wrapper">
      <div id="inner_search_wrapper" 
      style={activeSearch ? {boxShadow: "0 2px 6px rgba(238, 108, 77, .6)"} : {boxShadow: "0 1px 4px rgba(41, 50, 65, .6)" }}>
        <FontAwesomeIcon
          className="search"
          icon={faSearch}
        />
        <input
          id="search_term"
          name="search_term"
          type="text"
          onChange={changeHandler}
          placeholder="First or Last Name"
        />
      </div>
    </div>
  );
}
