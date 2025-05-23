import React, { useState, useEffect, useRef } from "react";
import "./SkinPreview.css";
import { extractSkinClasses } from "./utils/parseCssModule.js";
import { rawSkins } from "./utils/rawCssImport";

const SkinPreview = () => {
  const [skinClasses, setSkinClasses] = useState([]);
  const [skinDefinitions, setSkinDefinitions] = useState({});
  const [currentSkin, setCurrentSkin] = useState("skin");
  const [cssDefinition, setCssDefinition] = useState("");
  const [colorValues, setColorValues] = useState({
    background: {},
    foreground: {},
    border: {},
  });

  const skinListRef = useRef(null);
  const regularDivRef = useRef(null);
  const interactiveBtnRef = useRef(null);
  const disabledBtnRef = useRef(null);
  const softBtnRef = useRef(null);
  const skinDisplayRef = useRef(null);

  useEffect(() => {
    // Extract skin classes from imported CSS
    loadSkinClassesFromImport();
  }, []);

  useEffect(() => {
    // Update UI when currentSkin changes
    updateSkinDisplay(currentSkin);

    // Extract color values for the table
    extractColorValues(currentSkin);
  }, [currentSkin, skinDefinitions]);

  // Load skin classes from imported CSS
  const loadSkinClassesFromImport = () => {
    // Parse the imported raw CSS
    const foundSkinDefinitions = extractSkinClasses(rawSkins);

    // Get all skin class names and sort them
    const foundSkinClasses = Object.keys(foundSkinDefinitions).sort();

    // Update state
    setSkinClasses(foundSkinClasses);
    setSkinDefinitions(foundSkinDefinitions);

    // Select the default skin if it exists or the first one in the list
    if (foundSkinClasses.includes("skin")) {
      setCurrentSkin("skin");
    } else if (foundSkinClasses.length > 0) {
      setCurrentSkin(foundSkinClasses[0]);
    }
  };

  // Handle skin selection
  const selectSkin = (skinClass) => {
    setCurrentSkin(skinClass);
  };

  // Update UI to reflect the selected skin
  const updateSkinDisplay = (skinClass) => {
    // Store the CSS definition but we won't display it anymore
    const definition = skinDefinitions[skinClass] || "No CSS definition found";
    setCssDefinition(definition);

    // Apply the skin class to the preview elements
    if (regularDivRef.current) {
      regularDivRef.current.className = `shadow-site p-2 border-2 border-inset rounded-site text-center flex items-center justify-center h-14! text-xs  ${skinClass}`;
    }

    if (interactiveBtnRef.current) {
      interactiveBtnRef.current.className = `shadow-site  interactive btn bordered w-full h-full text-xs ${skinClass}`;
    }

    if (disabledBtnRef.current) {
      disabledBtnRef.current.className = `shadow-site interactive btn bordered w-full h-full text-xs  ${skinClass}`;
    }

    if (softBtnRef.current) {
      softBtnRef.current.className = `shadow-site interactive btn bordered soft w-full h-full text-xs ${skinClass}`;
    }

    if (skinDisplayRef.current) {
      skinDisplayRef.current.textContent = skinClass
        .replace("skin-", "")
        .replace(/-/g, " ");
    }
  };

  // Extract CSS variable references from CSS definition
  const extractColorValues = (skinClass) => {
    // Get the CSS definition for this skin class
    const cssDefinition = skinDefinitions[skinClass] || "";

    // Define regex patterns to extract variable declarations
    const backgroundRegex = /--color-background(-[a-z]+)?:\s*([^;]+);/g;
    const foregroundRegex = /--color-foreground(-[a-z]+)?:\s*([^;]+);/g;
    const borderRegex = /--color-border(-[a-z]+)?:\s*([^;]+);/g;

    // Initialize our values object
    const values = {
      background: {
        default: "Not specified",
        hover: "Not specified",
        focus: "Not specified",
        active: "Not specified",
        disabled: "Not specified",
      },
      foreground: {
        default: "Not specified",
        hover: "Not specified",
        focus: "Not specified",
        active: "Not specified",
        disabled: "Not specified",
      },
      border: {
        default: "Not specified",
        hover: "Not specified",
        focus: "Not specified",
        active: "Not specified",
        disabled: "Not specified",
      },
    };

    // Extract background variables
    let match;
    while ((match = backgroundRegex.exec(cssDefinition)) !== null) {
      const suffix = match[1] ? match[1].substring(1) : "default"; // Convert '-hover' to 'hover' or use 'default' if no suffix
      values.background[suffix] = match[2].trim();
    }

    // Extract foreground variables
    while ((match = foregroundRegex.exec(cssDefinition)) !== null) {
      const suffix = match[1] ? match[1].substring(1) : "default";
      values.foreground[suffix] = match[2].trim();
    }

    // Extract border variables
    while ((match = borderRegex.exec(cssDefinition)) !== null) {
      const suffix = match[1] ? match[1].substring(1) : "default";
      values.border[suffix] = match[2].trim();
    }

    // Create a temporary element to get the computed values for the color swatches
    const tempElement = document.createElement("div");
    tempElement.className = skinClass;
    document.body.appendChild(tempElement);
    const style = window.getComputedStyle(tempElement);

    // Store computed values for color swatches
    const computedValues = {
      background: {
        default: style.getPropertyValue("--color-background").trim(),
        hover: style.getPropertyValue("--color-background-hover").trim(),
        focus: style.getPropertyValue("--color-background-focus").trim(),
        active: style.getPropertyValue("--color-background-active").trim(),
        disabled:
          style.getPropertyValue("--color-background-disabled").trim() ||
          "transparent",
      },
      foreground: {
        default: style.getPropertyValue("--color-foreground").trim(),
        hover: style.getPropertyValue("--color-foreground-hover").trim(),
        focus: style.getPropertyValue("--color-foreground-focus").trim(),
        active: style.getPropertyValue("--color-foreground-active").trim(),
        disabled:
          style.getPropertyValue("--color-foreground-disabled").trim() ||
          "transparent",
      },
      border: {
        default: style.getPropertyValue("--color-border").trim(),
        hover: style.getPropertyValue("--color-border-hover").trim(),
        focus: style.getPropertyValue("--color-border-focus").trim(),
        active: style.getPropertyValue("--color-border-active").trim(),
        disabled:
          style.getPropertyValue("--color-border-disabled").trim() ||
          "transparent",
      },
    };

    // Remove the temporary element
    document.body.removeChild(tempElement);

    // Update state with both reference values and computed values
    setColorValues({
      ...values,
      computed: computedValues,
    });
  };

  // Render a color cell with the variable reference and a color swatch
  const renderColorCell = (varRef, computedColor) => {
    let displayValue = varRef || "Not specified";
    let backgroundColor = "transparent";

    // Use the computed color for the swatch if available
    if (computedColor && typeof computedColor === "string") {
      backgroundColor = computedColor;
    }

    return (
      <div className="flex flex-col items-start gap-0">
        <div
          className="w-full h-4 mt-1 rounded border border-neutral-300"
          style={{ backgroundColor }}
          title={computedColor || displayValue}
        />
        <cod className="text-xs font-mono py-2">{displayValue}</cod>
      </div>
    );
  };

  const scrollbarStyles = {
    scrollbarWidth: "thin",
    scrollbarColor: "rgba(100, 100, 100, 1) transparent",
    "&::-webkit-scrollbar": {
      width: "8px",
      backgroundColor: "transparent",
    },
    "&::-webkit-scrollbar-thumb": {
      backgroundColor: "rgba(100, 100, 100, 1)",
      borderRadius: "4px",
    },
    "&::-webkit-scrollbar-track": {
      backgroundColor: "transparent",
    },
  };

  // Custom styles for the selected item in the list
  const getListItemStyles = (isSelected) => {
    return {
      listStyleType: "none",
      marginLeft: 0,
      background: isSelected ? "rgba(0, 0, 0, 0.06)" : "transparent",
      borderRadius: "4px",
    };
  };

  const getButtonStyles = (isSelected) => {
    return {
      border: "none",
      outline: "none",
      boxShadow: "none",
      fontWeight: isSelected ? "bold" : "normal",
    };
  };

  return (
    <div className="flex flex-col border border-neutral-800 rounded-lg overflow-hidden my-8!">
      <div className="flex">
        {/* Left sidebar with auto width and scrolling */}
        <div
          className="border-r h-[200px] md:h-[580px] border-neutral-800  w-auto overflow-y-auto overflow-x-hidden scrollbar-left "
          style={{
            ...scrollbarStyles,
          }}
        >
          <div className="pl-1 pr-3">
            <ul
              className="list-none p-0 m-0 whitespace-nowrap"
              ref={skinListRef}
              style={{ listStyleType: "none !important" }}
            >
              {skinClasses.map((skinClass) => {
                const displayClass =
                  skinClass === "skin"
                    ? "default"
                    : skinClass.replace("skin-", "");
                const isSelected = skinClass === currentSkin;

                return (
                  <li
                    key={skinClass}
                    className="preview-list-item mb-2"
                    data-skin={skinClass}
                    data-selected={isSelected ? "true" : "false"}
                    style={getListItemStyles(isSelected)}
                  >
                    <button
                      className={`${skinClass} btn interactive w-full text-left`}
                      onClick={() => selectSkin(skinClass)}
                      style={getButtonStyles(isSelected)}
                    >
                      <span>{displayClass}</span>
                    </button>
                  </li>
                );
              })}
            </ul>
            {skinClasses.length === 0 && (
              <div className="text-error p-2 border border-error rounded bg-error-light">
                <p className="mb-2">
                  <strong>No skin classes detected!</strong>
                </p>
                <p className="text-xs">
                  Make sure the CSS import is working correctly.
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right side content */}
        <div className="flex-1 flex flex-col">
          {/* Example Components */}
          <div className="border-b-1 border-neutral-800">
            <div className="w-full border-b-1 border-neutral-800 p-4">
              <h3 className="text-lg font-semibold m-0!">
                {currentSkin === "skin" ? "." : ".skin-"}
                <span ref={skinDisplayRef} className="">
                  {currentSkin}
                </span>
              </h3>
            </div>

            <div className="grid grid-cols-4 gap-4 p-6 my-0! skin">
              <div className="!mt-0">
                <div
                  ref={regularDivRef}
                  className={`p-2 border-1 rounded-site text-center flex items-center justify-center h-8! ${currentSkin}`}
                >
                  <span>Basic</span>
                </div>
              </div>
              <div className="!mt-0">
                <button
                  ref={interactiveBtnRef}
                  className={`interactive btn bordered w-full h-full ${currentSkin}`}
                >
                  Interactive
                </button>
              </div>
              <div className="!mt-0">
                <button
                  ref={disabledBtnRef}
                  className={`interactive btn bordered w-full h-full ${currentSkin}`}
                  disabled
                >
                  Disabled
                </button>
              </div>
              <div className="!mt-0">
                <button
                  ref={softBtnRef}
                  className={`interactive btn bordered soft w-full h-full ${currentSkin}`}
                >
                  Soft
                </button>
              </div>
            </div>
          </div>

          {/* Color Values Table */}
          <div className="px-4 pt-2 overflow-x-auto my-0!">
            <table className="w-full border-collapse my-4!">
              <thead>
                <tr className="">
                  <th className="p-0 text-left border-b border-neutral-300">
                    State
                  </th>
                  <th className="p-0 text-left border-b border-neutral-300">
                    Background
                  </th>
                  <th className="p-0 text-left border-b border-neutral-300">
                    Foreground
                  </th>
                  <th className="p-0 text-left border-b border-neutral-300">
                    Border
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td className="p-0 font-xs border-b border-neutral-300">
                    Default
                  </td>
                  <td className="p-0 pr-2 border-b border-neutral-300">
                    {renderColorCell(
                      colorValues.background.default,
                      colorValues.computed?.background.default
                    )}
                  </td>
                  <td className="p-0 pr-2 border-b border-neutral-300">
                    {renderColorCell(
                      colorValues.foreground.default,
                      colorValues.computed?.foreground.default
                    )}
                  </td>
                  <td className="p-0 pr-2 border-b border-neutral-300">
                    {renderColorCell(
                      colorValues.border.default,
                      colorValues.computed?.border.default
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-0 pr-2 font-xs border-b border-neutral-300">
                    Hover
                  </td>
                  <td className="p-0 pr-2 border-b border-neutral-300">
                    {renderColorCell(
                      colorValues.background.hover,
                      colorValues.computed?.background.hover
                    )}
                  </td>
                  <td className="p-0 pr-2 border-b border-neutral-300">
                    {renderColorCell(
                      colorValues.foreground.hover,
                      colorValues.computed?.foreground.hover
                    )}
                  </td>
                  <td className="p-0 pr-2 border-b border-neutral-300">
                    {renderColorCell(
                      colorValues.border.hover,
                      colorValues.computed?.border.hover
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-0 pr-2 font-xs border-b border-neutral-300">
                    Focus
                  </td>
                  <td className="p-0 pr-2 border-b border-neutral-300">
                    {renderColorCell(
                      colorValues.background.focus,
                      colorValues.computed?.background.focus
                    )}
                  </td>
                  <td className="p-0 pr-2 border-b border-neutral-300">
                    {renderColorCell(
                      colorValues.foreground.focus,
                      colorValues.computed?.foreground.focus
                    )}
                  </td>
                  <td className="p-0 pr-2 border-b border-neutral-300">
                    {renderColorCell(
                      colorValues.border.focus,
                      colorValues.computed?.border.focus
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-0 pr-2 font-xs border-b border-neutral-300">
                    Active
                  </td>
                  <td className="p-0 pr-2 border-b border-neutral-300">
                    {renderColorCell(
                      colorValues.background.active,
                      colorValues.computed?.background.active
                    )}
                  </td>
                  <td className="p-0 pr-2 border-b border-neutral-300">
                    {renderColorCell(
                      colorValues.foreground.active,
                      colorValues.computed?.foreground.active
                    )}
                  </td>
                  <td className="p-0 pr-2 border-b border-neutral-300">
                    {renderColorCell(
                      colorValues.border.active,
                      colorValues.computed?.border.active
                    )}
                  </td>
                </tr>
                <tr>
                  <td className="p-0 pr-2 font-xs">Disabled</td>
                  <td className="p-0">
                    {renderColorCell(
                      colorValues.background.disabled,
                      colorValues.computed?.background.disabled
                    )}
                  </td>
                  <td className="p-0 pr-2">
                    {renderColorCell(
                      colorValues.foreground.disabled,
                      colorValues.computed?.foreground.disabled
                    )}
                  </td>
                  <td className="p-0 pr-2">
                    {renderColorCell(
                      colorValues.border.disabled,
                      colorValues.computed?.border.disabled
                    )}
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </div>
  );
};

export default SkinPreview;
