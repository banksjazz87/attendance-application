import React from "react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faClose } from "@fortawesome/free-solid-svg-icons";
import { AllVisitorData, VisitorChildren, VisitorInterests } from "../../types/interfaces";
import VisitorRow from "../visitors/VisitorRow";
import "../../assets/styles/components/visitors/visitorModal.scss";
import DateMethods from "../../functions/dateMethods.ts";

interface VisitorModalProps {
	showModal: boolean;
	hideModal: Function;
	formData: AllVisitorData;
}

export default function VisitorModal({ showModal, hideModal, formData }: VisitorModalProps): JSX.Element {
    const form = formData.form[0];
	const spouse = formData.spouse[0];

	const displayChildren: JSX.Element[] = formData.children.map((x: VisitorChildren, y: number): JSX.Element => {
		return <p key={`child_${y}`}>{`${x.firstName} ${x.lastName}`}</p>;
	});

	const displayInterests: JSX.Element[] = formData.interests.map((x: VisitorInterests, y: number): JSX.Element => {
		return <p key={`interest_${y}`}>{x.interest}</p>;
	});

	return (
		<div
			className="full_height_popout"
			style={showModal ? { display: "" } : { display: "none" }}
		>
			<div id="visitor_modal_wrapper">
				<button
					className="close_btn"
					onClick={(e: React.MouseEvent<HTMLButtonElement>) => hideModal()}
				>
					<FontAwesomeIcon icon={faClose} />
				</button>
				<div id="visitor_modal_content">
					<table>
						<thead>
							<tr>
								<th colSpan={2}><h2>Visitor Form</h2></th>
							</tr>
						</thead>
						<tbody>
							<VisitorRow
								title="Name"
								text={`${form.title} ${form.firstName} ${form.lastName}`}
							/>
							<VisitorRow
								title="Spouse"
								text={spouse ? `${spouse.firstName} ${spouse.lastName}` : ''}
							/>
							<tr>
								<td className="title">
									<h3>Children</h3>
								</td>
								<td className="title">
									<div className="vertical_data">{displayChildren}</div>
								</td>
							</tr>
							<VisitorRow
								title="Address"
								text={`${form.address}
                                        ${form.city}, ${form.state}`
                                    }
							/>
							<VisitorRow
								title="Phone"
								text={`${form.phone}`}
								linkURL={`tel:${form.phone}`}
							/>
							<VisitorRow
								title="Email"
								text={`${form.email}`}
								linkURL={`mailto:${form.email}`}
							/>
							<VisitorRow
								title="Preferred Contact"
								text={`${form.contact_method}`}
							/>
							<tr className="visitor_row">
								<td className="title">
									<h3 className="title">Interests</h3>
								</td>
								<td className="text">
                                    <div className="vertical_data">
                                        {displayInterests}
                                    </div>
                                </td>
							</tr>
							<VisitorRow
								title="Prayer Requests"
								text={form.prayer_requests}
							/>
						</tbody>
                        <tfoot>
                            <tr>
                                <td colSpan={2}>
                                    <p>{form.dateCreated.length > 10 ? `This form was submitted on ${DateMethods.formatMysqlDate(form.dateCreated)}` : ''}</p>
                                </td>
                            </tr>
                        </tfoot>
					</table>

				</div>
			</div>
		</div>
	);
}
