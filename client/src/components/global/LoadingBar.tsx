import React, {useEffect, useState} from "react";
import "../../assets/styles/components/global/loadingBar.scss";

interface LoadingBarProps {
    show: boolean;
}
export default function LoadingBar({ show }: LoadingBarProps): JSX.Element {

    const [isLoading, setIsLoading] = useState<boolean>(false);

    useEffect((): void => {
        if (!show) {
            setTimeout((): void => {
                setIsLoading(false);
            }, 500);
        } else {
            setIsLoading(true);
        }
    }, [show]);


    return (
        <div id="loading_page_container" style={isLoading ? { display: '' } : { display: 'none' }}>
        <div id="loading_outer_container">
            <div id="loading_outer_color">
                <div id="loading_inner_color">
                </div>
            </div>
        </div>
        </div>
    )
}