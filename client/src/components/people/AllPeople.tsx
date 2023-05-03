import React, {useEffect, useState} from "react";
import {Attendee} from "../../types/interfaces.ts";
import {APIPeople} from "../../types/interfaces.ts";

export default function AllPeople(): JSX.Element {
    const [people, setPeople] = useState<Attendee[]>();

    useEffect((): void => {
        fetch('/all-attendants')
            .then((data: Response): Promise<APIPeople> => {
                return data.json();
            })
            .then((final: APIPeople): void => {
                if (final.message === "Success") {
                    console.log(final.data);
                    console.log(typeof(final.data));
                    setPeople(final.data)
                }
            });
    }, []);

    return (
        <h1>This will be a list of all of the current members</h1>
    );
}