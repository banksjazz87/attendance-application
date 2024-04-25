import React, {useState, useEffect} from "react";
import { APITotalRows, VisitorShortFields, APIVisitorInit} from "../types/interfaces.ts";
import { initShortVisitor } from "../variables/initShortVisitor.ts";
import Navbar from "../components/global/Navbar.tsx";
import "../assets/styles/views/people.scss";
import AllVisitors from "../components/visitors/AllVisitors.tsx";
import "../assets/styles/views/visitors.scss";


export default function Vistors() {
    const [visitors, setVisitors] = useState<VisitorShortFields[]>([initShortVisitor]);
	const [totalDbRows, setTotalDbRows] = useState<number>(0);
	const [currentOffset, setCurrentOffset] = useState<number>(0);
	const [partialName, setPartialName] = useState<string>("");
	const [searching, setSearching] = useState<boolean>(false);

    //Set the initial offset for the pagination.
	const offSetIncrement: number = 10;

    //Get the total number of rows found
    useEffect((): void => {
        fetch(`/row-count/Visitor_Forms`)
            .then((data: Response): Promise<APITotalRows> => {
                return data.json();
            })
            .then((final: APITotalRows): void => {
                if (final.message === 'success') {
                    setTotalDbRows(final.data[0].total);
                } else {
                    console.error(final.message);
                }
            })
    }, [totalDbRows]);

	//Used to check if there is a current partial name search.
	useEffect((): void => {
		if (partialName.length > 0) {
			setSearching(true);
			fetch(`/people/search/Visitor_Forms/${partialName}`)
				.then((data: Response): Promise<APIVisitorInit> => {
					return data.json();
				})
				.then((final: APIVisitorInit): void => {
					if (final.message === "success") {
						setVisitors(final.data);
					}
				});
		} else {
			setSearching(false);
			fetch(`/table-return-few/Visitor_Forms/${offSetIncrement}/${currentOffset}/dateCreated/DESC`)
				.then((data: Response): Promise<APIVisitorInit> => {
					return data.json();
				})
				.then((final: APIVisitorInit): void => {
					if (final.message === "success") {
						setVisitors(final.data);
					}
				});
		}
	}, [currentOffset, partialName]);

	
	//Used to update the partialName state in the search bar.
	const updatePartialName = (string: string): void => {
		setPartialName(string);
	};

	return (
		<div id="visitor_page_wrapper">
			<Navbar />
			<div className="header_wrapper">
				<h1>Visitors</h1>
			</div>
			<div id="visitor_content_wrapper">
                <AllVisitors 
                    allVisitors={visitors}
					totalRows={totalDbRows}
					updateOffsetHandler={(num: number): void => {
						setCurrentOffset(num);
					}}
					offSetIncrement={offSetIncrement}
					updatePartial={updatePartialName}
					activeSearch={searching}
                
                />
			</div>
		</div>
	);
}