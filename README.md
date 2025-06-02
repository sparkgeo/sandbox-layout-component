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

1. Copy the `LayoutPanels` folder in `src/components` in this repo into your codebase. If you are starting from scratch with the above example, you might put this `LayoutPanels` component into your project's `src` or `src/components` folder.
1. Add `vitest` and `@testing-library` to your project. `yarn add -D vitest @testing-library/jest-dom @testing-library/react @testing-library/user-event`. Or optionally, but less ideal, you can remove any test files copied in the previous step.
1. Add supporting type dependencies to your project. `yarn add -D @types/react-dom @types/react`
1. Configure testing and other types in your typescript config file. `compilerOptions.types` should include `vitest/globals` and `@testing-library/jest-dom`
1. Create a container you would like the layout component to fit. Typically this would be fill any remainder of the screen not taken up by a header and footer. The component will not work without a parent that has dimensions set.
   - For conveinence you can copy a `LayoutApp` folder from `src/components/` and paste it into your app. You may use this as a parent to `LayoutPanels`. It has the following optional props for header and footer content:
     - `footerContent`
     - `headerContent`

## Getting started - for LayoutPanel devs (to edit this repo)

- make sure you are using the right node version (check `.nvmrc` or run `nvm use`)
- run `yarn install`
- run `yarn dev`

## Launching Storybook

- run `yarn storybook`
