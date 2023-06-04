import React from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/components/navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faKey, faChartLine, faFileCirclePlus, faFile, faSearch, faPeopleGroup } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  return (
    <nav id="main_nav_wrapper">
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
