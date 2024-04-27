import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { AllVisitorData, VisitorChildren, VisitorInterests, VisitorSpouse } from "../../types/interfaces";
import VisitorRow from "../visitors/VisitorRow";


interface VisitorModalProps {
    showModal: boolean;
    hideModal: Function;
    formData: AllVisitorData;
}

export default function VisitorModal({showModal, hideModal, formData}: VisitorModalProps): JSX.Element {

    const displayChildren: JSX.Element[] = formData.children.map((x: VisitorChildren, y: number): JSX.Element => {
        return (
           <p key={`child_${y}`}>{`${x.firstName} ${x.lastName}`}</p>
        );
    });

    const displayInterests: JSX.Element[] = formData.interests.map((x: VisitorInterests, y: number): JSX.Element => {
        return (
            <p key={`interest_${y}`}>{x.interest}</p>
        );
    });

    const displaySpouse: JSX.Element[] = formData.spouse.map((x: VisitorSpouse, y: number): JSX.Element => {
        return (
            <p key={`spouse_${y}`}>{`${x.firstName} ${x.lastName}`}</p>
        );
    });

    const form = formData.form[0];


    return (
        <div id="visitor_modal_wrapper">
            <button onClick={(e: React.MouseEvent<HTMLButtonElement>) => hideModal}>
                <FontAwesomeIcon icon={faClose} />
            </button>

            <div className="visitor_modal_content">
                <h3>Visitor Form</h3>
                <VisitorRow 
                    title="Name"
                    text={`${form.title} ${form.firstName} ${form.lastName}`}
                />
                <div>
                    <p>Spouse</p>
                    <div className="horizontal_list">
                        {displaySpouse}
                    </div>
                </div>
                <div>
                    <p>Children</p>
                    <div className="vertical_list">
                        {displayChildren}
                    </div>
                </div>
                <VisitorRow 
                    title="Address"
                    text={`${form.address} \n ${form.city}, ${form.state}`}
                />
                <VisitorRow 
                    title="Phone"
                    text={`${form.phone}`}
                    linkURL={`tel:${form.phone}`}
                />
                <VisitorRow 
                    title="Email"
                    text={`${form.phone}`}
                    linkURL={`mailto:${form.email}`}
                />
                 <VisitorRow 
                    title="Preferred Contact"
                    text={`${form.contact_method}`}
                />
                <div>
                    <p>Interests</p>
                    <div className="vertical_list">
                        {displayInterests}
                    </div>
                </div>
                <VisitorRow
                    title="Prayer Requests"
                    text={form.prayer_requests}
                />
            </div>
        </div>
    )
}