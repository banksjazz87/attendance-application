import React from "react";
import "../../assets/styles/components/global/loadingBar.scss";

interface LoadingBarProps {
    show: boolean;
}
export default function LoadingBar({show}: LoadingBarProps): JSX.Element {

    return (
        <div id="loading_page_container" style={show ? { display: '' } : { display: 'none' }}>
        <div id="loading_outer_container">
            <div id="loading_outer_color">
                <div id="loading_inner_color">
                </div>
            </div>
        </div>
        </div>
    )
}