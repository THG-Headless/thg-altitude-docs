export const facetVerticalStyles = `@media only screen and (width < 64rem) {
    .elements-facets-wrapper .elements-facets-results-container {
        height: 80%;
        overflow-y: auto;
        padding: 16px;
    }

    .elements-facets-wrapper .elements-facets-group-container {
        flex-basis: 100%;
    }

    .elements-facets-wrapper .elements-facets-container {
        display: flex;
        flex-direction: column;
        gap: 2rem;
    }

    .elements-facets-wrapper .elements-facets-controls {
        display: none;
    }

    .elements-facets-wrapper .elements-facets-tabs-clear-wrapper {
        flex-direction: column;
    }

    .elements-facets-wrapper .elements-facets-clear-all-button {
        align-self: flex-end;
    }

    .elements-facets-wrapper .elements-facets-controls {
        display: none;
    }

    .elements-facets-wrapper .elements-facets-options-wrapper {
        position: static;
        border-radius: 0px;
        box-shadow: none;
    }

    .elements-facets-wrapper .elements-facets-dropdown-list {
        padding: 0rem;
        gap: 0rem;
        margin: 0;
        max-height: fit-content;
        overflow-y: visible;
        background-color: rgb(250 250 250);
    }

    .elements-facets-wrapper .elements-facets-dropdown-summary {
        font-size: large;
        border: none;
        border-radius: 0px;
        padding: 0;
    }

    .elements-facets-wrapper .elements-facets-option-list-header {
        display: none;
    }

    .elements-facets-wrapper .elements-facet-option:has(input:checked) {
        border: none;
        border-radius: 0px;
    }

    .elements-facets-wrapper .elements-facets-tabs-wrapper {
        width: 100%;
    }
}`;
