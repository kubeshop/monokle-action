export const id = 273;
export const ids = [273];
export const modules = {

/***/ 5273:
/***/ ((__unused_webpack___webpack_module__, __webpack_exports__, __webpack_require__) => {

// ESM COMPAT FLAG
__webpack_require__.r(__webpack_exports__);

// EXPORTS
__webpack_require__.d(__webpack_exports__, {
  "default": () => (/* binding */ labels_plugin)
});

;// CONCATENATED MODULE: ./node_modules/@monokle/validation/lib/validators/custom/config.js
/**
 * Defines a plugin.
 */
function definePlugin(init) {
    return init;
}
function defineRule(init) {
    return init;
}

;// CONCATENATED MODULE: ./node_modules/@monokle/validation/lib/validators/labels/noEmptyLabels.js

const noEmptyLabels = defineRule({
    id: 1,
    description: "Require labels as metadata.",
    help: "Add any label to the Kubernetes resource.",
    validate({ resources }, { report }) {
        resources.forEach((resource) => {
            const labels = Object.entries(resource.metadata?.labels ?? {});
            const hasLabels = labels.length > 0;
            if (!hasLabels) {
                report(resource, { path: "metadata.labels" });
            }
        });
    },
});

;// CONCATENATED MODULE: ./node_modules/@monokle/validation/lib/validators/labels/plugin.js


/* harmony default export */ const labels_plugin = (definePlugin({
    id: "LBL",
    name: "labels",
    description: "Validates your labels",
    rules: {
        noEmptyLabels: noEmptyLabels,
    },
}));


/***/ })

};

//# sourceMappingURL=273.index.js.map