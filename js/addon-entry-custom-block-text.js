(window["webpackJsonpGUI"] = window["webpackJsonpGUI"] || []).push([["addon-entry-custom-block-text"],{

/***/ "./src/addons/addons/custom-block-shape/update-all-blocks.js":
/*!*******************************************************************!*\
  !*** ./src/addons/addons/custom-block-shape/update-all-blocks.js ***!
  \*******************************************************************/
/*! exports provided: updateAllBlocks */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "updateAllBlocks", function() { return updateAllBlocks; });
function updateAllBlocks(vm, workspace, blockly) {
  const eventsOriginallyEnabled = blockly.Events.isEnabled();
  blockly.Events.disable(); // Clears workspace right-click→undo (see SA/SA#6691)

  if (workspace) {
    if (vm.editingTarget) {
      vm.emitWorkspaceUpdate();
    }
    const flyout = workspace.getFlyout();
    if (flyout) {
      const flyoutWorkspace = flyout.getWorkspace();
      window.Blockly.Xml.clearWorkspaceAndLoadFromXml(window.Blockly.Xml.workspaceToDom(flyoutWorkspace), flyoutWorkspace);
      workspace.getToolbox().refreshSelection();
      workspace.toolboxRefreshEnabled_ = true;
    }
  }

  // There's no particular reason for checking whether events were originally enabled.
  // Unconditionally enabling events at this point could, in theory, cause bugs in the future.
  if (eventsOriginallyEnabled) blockly.Events.enable(); // Re-enable events
}

/***/ }),

/***/ "./src/addons/addons/custom-block-text/_runtime_entry.js":
/*!***************************************************************!*\
  !*** ./src/addons/addons/custom-block-text/_runtime_entry.js ***!
  \***************************************************************/
/*! exports provided: resources */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "resources", function() { return resources; });
/* harmony import */ var _userscript_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ./userscript.js */ "./src/addons/addons/custom-block-text/userscript.js");
/* generated by pull.js */

const resources = {
  "userscript.js": _userscript_js__WEBPACK_IMPORTED_MODULE_0__["default"]
};

/***/ }),

/***/ "./src/addons/addons/custom-block-text/userscript.js":
/*!***********************************************************!*\
  !*** ./src/addons/addons/custom-block-text/userscript.js ***!
  \***********************************************************/
/*! exports provided: default */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony import */ var _custom_block_shape_update_all_blocks_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../custom-block-shape/update-all-blocks.js */ "./src/addons/addons/custom-block-shape/update-all-blocks.js");
/* harmony import */ var _middle_click_popup_module_js__WEBPACK_IMPORTED_MODULE_1__ = __webpack_require__(/*! ../middle-click-popup/module.js */ "./src/addons/addons/middle-click-popup/module.js");


/* harmony default export */ __webpack_exports__["default"] = (async function (_ref) {
  let {
    addon,
    console
  } = _ref;
  let currentTextSize = 100;
  const vm = addon.tab.traps.vm;
  const blocklyInstance = await addon.tab.traps.getBlockly();

  // Handling the CSS from here instead of a userstyle is much more stable, as
  // there's no code outside of this addon dynamically toggling the styles.
  // This way, we can clearly control the execution order of style operations.
  // For example, we always want to call updateAllBlocks() after the styles
  // were updated according to the user's settings, not before.
  const fontSizeCss = document.createElement("style");
  // Be careful with specificity because we're adding this userstyle manually
  // to the <head> without checking if other styles are above or below.
  fontSizeCss.textContent = "\n    .blocklyText,\n    .blocklyHtmlInput {\n      font-size: calc(var(--customBlockText-sizeSetting) * 0.12pt) !important;\n    }\n    .blocklyFlyoutLabelText {\n      font-size: calc(var(--customBlockText-sizeSetting) * 0.14pt) !important;\n    }";
  fontSizeCss.disabled = true;
  document.head.appendChild(fontSizeCss);
  //
  const boldCss = document.createElement("style");
  boldCss.textContent = "\n    .blocklyText,\n    .blocklyHtmlInput {\n      font-weight: bold;\n    }";
  boldCss.disabled = true;
  document.head.appendChild(boldCss);
  //
  const textShadowCss = document.createElement("style");
  textShadowCss.textContent = "\n    .blocklyDraggable > .blocklyText,\n    .blocklyDraggable > g > text {\n      text-shadow: 1px 1px 0 rgba(0, 0, 0, 0.4);\n    }";
  textShadowCss.disabled = true;
  document.head.appendChild(textShadowCss);
  const updateBlockly = () => {
    blocklyInstance.Field.cacheWidths_ = {}; // Clear text width cache
    // If font size has changed, middle click popup needs to clear it's cache too
    Object(_middle_click_popup_module_js__WEBPACK_IMPORTED_MODULE_1__["clearTextWidthCache"])();
    Object(_custom_block_shape_update_all_blocks_js__WEBPACK_IMPORTED_MODULE_0__["updateAllBlocks"])(vm, addon.tab.traps.getWorkspace(), blocklyInstance);
  };
  const setFontSize = wantedSize => {
    if (wantedSize !== 100) document.documentElement.style.setProperty("--customBlockText-sizeSetting", wantedSize);
    if (wantedSize === 100) {
      fontSizeCss.disabled = true;
      currentTextSize = 100;
      return;
    } else if (wantedSize === currentTextSize) return;
    currentTextSize = wantedSize;
    fontSizeCss.disabled = false;
  };
  const setBold = bool => {
    boldCss.disabled = !bool;
  };
  const setTextShadow = bool => {
    textShadowCss.disabled = !bool;
  };
  addon.settings.addEventListener("change", () => {
    setFontSize(addon.settings.get("size"));
    setBold(addon.settings.get("bold"));
    setTextShadow(addon.settings.get("shadow"));
    updateBlockly();
  });
  addon.self.addEventListener("disabled", () => {
    setFontSize(100);
    setBold(false);
    setTextShadow(false);
    updateBlockly();
  });
  addon.self.addEventListener("reenabled", () => {
    setFontSize(addon.settings.get("size"));
    setBold(addon.settings.get("bold"));
    setTextShadow(addon.settings.get("shadow"));
    updateBlockly();
  });
  setFontSize(addon.settings.get("size"));
  setBold(addon.settings.get("bold"));
  setTextShadow(addon.settings.get("shadow"));
  updateBlockly();
});

/***/ }),

/***/ "./src/addons/addons/middle-click-popup/module.js":
/*!********************************************************!*\
  !*** ./src/addons/addons/middle-click-popup/module.js ***!
  \********************************************************/
/*! exports provided: getTextWidth, clearTextWidthCache, onClearTextWidthCache */
/***/ (function(module, __webpack_exports__, __webpack_require__) {

"use strict";
__webpack_require__.r(__webpack_exports__);
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "getTextWidth", function() { return getTextWidth; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "clearTextWidthCache", function() { return clearTextWidthCache; });
/* harmony export (binding) */ __webpack_require__.d(__webpack_exports__, "onClearTextWidthCache", function() { return onClearTextWidthCache; });
/* harmony import */ var _event_target_js__WEBPACK_IMPORTED_MODULE_0__ = __webpack_require__(/*! ../../event-target.js */ "./src/addons/event-target.js");
 /* inserted by pull.js */

const textWidthCache = new Map();
const textWidthCacheSize = 1000;
const eventTarget = new _event_target_js__WEBPACK_IMPORTED_MODULE_0__["default"]();
const eventClearTextCache = "clearTextCache";

/**
 * Gets the width of an svg text element, with caching.
 * @param {SVGTextElement} textElement
 */
function getTextWidth(textElement) {
  let string = textElement.innerHTML;
  if (string.length === 0) return 0;
  let width = textWidthCache.get(string);
  if (width) return width;
  width = textElement.getBoundingClientRect().width;
  textWidthCache.set(string, width);
  if (textWidthCache.size > textWidthCacheSize) {
    textWidthCache.delete(textWidthCache.keys().next());
  }
  return width;
}

/**
 * Clears the text width cache of the middle click popup.
 */
function clearTextWidthCache() {
  textWidthCache.clear();
  eventTarget.dispatchEvent(new CustomEvent(eventClearTextCache));
}

/**
 * @param {() => void} func
 */
function onClearTextWidthCache(func) {
  eventTarget.addEventListener(eventClearTextCache, func);
}

/***/ })

}]);
//# sourceMappingURL=addon-entry-custom-block-text.js.map