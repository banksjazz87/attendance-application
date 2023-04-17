import React from "react";
import Navbar from '../components/global/Navbar.tsx';
import '../assets/styles/views/home.scss';


export default function Home() {
    return (
        <div id="homepage_wrapper">
            <Navbar />
            <h1>This Will be the homepage. </h1>
        </div>
    );
}