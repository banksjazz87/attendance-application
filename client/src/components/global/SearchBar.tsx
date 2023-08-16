import React from "react";

export default function SearchBar() {
    return (
        <form action="/search/query" method="GET">
            <label htmlFor="search_term">Search</label>
            <input id="search_term" name="search_term" type="text"/>
        </form>
    )
}