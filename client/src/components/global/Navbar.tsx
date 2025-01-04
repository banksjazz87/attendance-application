import React, {useEffect, useState} from "react";
import { Link } from "react-router-dom";
import "../../assets/styles/components/global/navbar.scss";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faHistory, faChartLine, faFileCirclePlus, faFile, faPeopleGroup, faUsersViewfinder } from "@fortawesome/free-solid-svg-icons";

export default function Navbar() {
  const [displayNavBar, setDisplayNavBar] = useState<boolean>(false);
  const [currentPage, setCurrentPage] = useState<string>('');


  useEffect(() => {
    const currentPage: string = window.location.pathname;

    if (currentPage !== '/') {
      setDisplayNavBar(true);
      setCurrentPage(currentPage);
    } else {
      setDisplayNavBar(false);
      setCurrentPage(currentPage);
    }
  }, []);


  //Used to determine if a class to style the menu icon should be set.
  const checkForActivePage = (pageName: string, displayedPage: string): boolean=> {
    if (displayedPage === pageName) {
      return true;
    } else {
      return false;
    }
  }



  return (
		<nav
			id="main_nav_wrapper"
			style={displayNavBar ? { display: "" } : { display: "none" }}
		>
			<ul>
				<li>
					<Link
						to={`/dashboard`}
						className={checkForActivePage("/dashboard", currentPage) ? "active_page_highlight" : ""}
					>
						<FontAwesomeIcon icon={faChartLine} />
						<p>
							Stats
						</p>
					</Link>
				</li>
				<li>
					<Link
						to={`/new-attendance`}
						className={checkForActivePage("/new-attendance", currentPage) ? "active_page_highlight" : ""}
					>
						<FontAwesomeIcon icon={faFileCirclePlus} />
						<p>
						  New
						</p>
					</Link>
				</li>
				<li>
					<Link
						to={`/attendance`}
						className={checkForActivePage("/attendance", currentPage) ? "active_page_highlight" : ""}
					>
						<FontAwesomeIcon icon={faFile} />
						<p>
							Current
						</p>
					</Link>
				</li>
				<li>
					<Link
						to={`/search-past-attendance`}
						className={checkForActivePage("/search-past-attendance", currentPage) ? "active_page_highlight" : ""}
					>
						<FontAwesomeIcon icon={faHistory} />
						<p>
							Past
						</p>
					</Link>
				</li>
				<li>
					<Link
						to={`/people`}
						className={checkForActivePage("/people", currentPage) ? "active_page_highlight" : ""}
					>
						<FontAwesomeIcon icon={faPeopleGroup} />
						<p>
						  People
						</p>
					</Link>
				</li>
				<li>
					<Link
						to={`/visitors`}
						className={checkForActivePage("/visitors", currentPage) ? "active_page_highlight" : ""}
					>
					  <FontAwesomeIcon icon={faUsersViewfinder} />
					  <p>
						  Visitors
					  </p>
					</Link>
				</li>
			</ul>
		</nav>
	);
}
