import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/components/global/navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faChartLine, faFileCirclePlus, faFile, faSearch, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [displayNavBar, setDisplayNavBar] = useState<boolean>(false);

  useEffect(() => {
      const currentPage: string = window.location.pathname;
      if (currentPage !== '/') {
        setDisplayNavBar(true);
      } else {
        setDisplayNavBar(false);
      }
  }, []);

  return (
    <nav id="main_nav_wrapper" style={displayNavBar ? {display: ''}: {display: 'none'}}>
      <ul>
        <li>
          <Link to={`/`}>
            {" "}
            <FontAwesomeIcon icon={faKey} />
          </Link>
        </li>
        <li>
          <Link to={`/dashboard`}>
            <FontAwesomeIcon icon={faChartLine} />
          </Link>
        </li>
        <li>
          <Link to={`/new-attendance`}>
            <FontAwesomeIcon icon={faFileCirclePlus} />
          </Link>
        </li>
        <li>
          <Link to={`/attendance`}>
            <FontAwesomeIcon icon={faFile} />
          </Link>
        </li>
        <li>
          <Link to={`/search`}>
            <FontAwesomeIcon icon={faSearch} />
          </Link>
        </li>
        <li>
          <Link to={`/people`}>
            <FontAwesomeIcon icon={faPeopleGroup} />
          </Link>
        </li>
      </ul>
    </nav>
  );
}
