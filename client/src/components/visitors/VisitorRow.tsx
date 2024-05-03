import React from "react";

interface VisitorRowProps {
	title: string;
	text: string;
	linkURL?: string;
}

export default function VisitorRow({ title, text, linkURL }: VisitorRowProps) {
	if (linkURL) {
		return (
			<tr className="visitor_row">
				<td>
					<h3 className="title">{title}</h3>
				</td>
				<td>
					<a
						href={linkURL}
						target="_blank"
						rel="noreferrer"
						className="link_text"
					>
						{text}
					</a>
				</td>
			</tr>
		);
	} else {
		return (
			<tr className="visitor_row">
				<td>
					<h3 className="title">{title}</h3>
				</td>
				<td>
					<p className="text">{text}</p>
				</td>
			</tr>
		);
	}
}
