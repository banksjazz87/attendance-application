import React, {useEffect, useState} from "react";
import "../../assets/styles/components/global/loadingBar.scss";

interface LoadingBarProps {
    show: boolean;
}
export default function LoadingBar({show}: LoadingBarProps): JSX.Element {

    const [showLoading, setShowLoading] = useState<boolean>(false);

    useEffect((): void => {
        if (show) {
            setTimeout((): void => {
                setShowLoading(true);
            }, 1000);
        } else {
            setTimeout((): void => {
                setShowLoading(false);
            }, 1000);
        }
    }, [show]);

    return (
        <div id="loading_page_container" style={showLoading ? { display: '' } : { display: 'none' }}>
        <div id="loading_outer_container">
            <div id="loading_outer_color">
                <div id="loading_inner_color">
                </div>
            </div>
        </div>
        </div>
    )
}