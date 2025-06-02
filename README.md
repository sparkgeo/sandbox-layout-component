# Scrappy very WIP layout component

## Description

the `LayoutPanels` component helps create a 2 to 3 panel layout commonly used with mapping applications (this does not include other app layout like the header and footer). Panels can be toggled open and closed with overridable button tabs. Optionally panels can also be configured to have width resized by the user dragging an inner edge.

You can preview the LayoutPanels Storybook [here](https://sandbox-layout-component-storybook.sparkgeo.io/?path=/story/components-layoutpanels--default) and view an example app [here](https://sandbox-layout-component-app.sparkgeo.io/).

### Current available props (this section will be polished up later!)

#### children: `ReactNode`;

Content for the main non-panel content. Typically where the map would go.

#### isLeftPanelOpen?: `boolean`;

Optional override to manually control panel visibility from consuming code.

#### isLeftPanelResizable?: `boolean`;

Config option to allow the user to drag a panel's inner edge to resize width.

#### isLeftPanelToggleable?: `boolean`;

Config option to allow the user to open and close.

#### isRightPanelOpen?: `boolean`;

Optional override to manually control panel visibility from consuming code.

#### isRightPanelResizable?: `boolean`;

Config option to allow the user to drag a panel's inner edge to resize width.

#### isRightPanelToggleable?: `boolean`;

Config option to allow the user to open and close.

#### isSubpanelOpen?: `boolean`;

Optional override to manually control panel visibility from consuming code.

#### leftPanelClassName?: `string`;

CSS classname to override panel styles.

#### leftPanelContent?: `ReactNode`;

Content for the left panel

#### leftPanelToggleButton?: `ReactElement`;

Optional override default visibility toggle button.

#### rightPanelClassName?: `string`;

CSS classname to overide panel styles.

#### rightPanelContent?: `ReactNode`;

Content for the right panel

#### rightPanelToggleButton?: `ReactElement`;

Optional override default visibility toggle button.

#### setIsLeftPanelOpen?: `Dispatch<SetStateAction<boolean>>`;

Optional override to manually control panel visibility from consuming code.

#### setIsRightPanelOpen?: `Dispatch<SetStateAction<boolean>>`;

Optional override to manually control panel visibility from consuming code.

#### setIsSubpanelOpen?: `Dispatch<SetStateAction<boolean>>`;

Optional override to manually control panel visibility from consuming code.

#### subpanelClassName?: `string`;

CSS classname to overide panel styles.

#### subpanelContent?: `ReactNode`;

Content for the subpanel

## Getting started - consuming the component in your own app.

1. Set up a React app. For example run `yarn create vite appName --template react-ts` and follow instructions for a setting up a React app as documented [here](https://vite.dev/guide/#scaffolding-your-first-vite-project)
1. Copy the contents of `src/LayoutPanels` in this repo into your codebase. If you are starting from scratch with the above example, you might put this `LayoutPanels` component into your project's `src` or `src/components` folder.
1. Add `vitest` to your project. `yarn add -D vitest`. Or optionally, but not advised, you can remove any test files copied in the previous step.

## Getting started - for devs

- make sure you are using the right node version (check `.nvmrc` or run `nvm use`)
- run `yarn install`
- run `yarn dev`

## Launching Storybook

- run `yarn storybook`
