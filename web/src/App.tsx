import Form from "@awsui/components-react/form";
import Header from "@awsui/components-react/header";
import AppLayout from "@awsui/components-react/app-layout";
import SideNavigation from "@awsui/components-react/side-navigation";
import React from "react";
import {BrowserRouter, Route, Routes} from "react-router-dom";

import DBPerformancePage from "./components/dbPerformance"
import KVSIntegrationPage from "./components/kvsIntegration"
import {createTheme, ThemeProvider} from "@mui/material";

const theme = createTheme({
  typography: {
    // In Chinese and Japanese the characters are usually larger,
    // so a smaller fontsize may be appropriate.
    fontSize: 22,
  },
});

function App() {
  /**
   * Create a component under /components
   * And then import it and add it to this list to let it show up as a route and in the side nav
   */
  const componentMapping = {
    "DB Performance": DBPerformancePage,
    "KVS Integration": KVSIntegrationPage,
  };

  function getComponentItems() {
    let keys = Object.keys(componentMapping);
    let items: { type: string; text: any; href: string; element: any; }[] = []
    keys.forEach((componentKey) => {
      // @ts-ignore
      let component = componentMapping[componentKey];
      let componentItem = {
        type: 'link',
        text: componentKey,
        href: '/' + component.name,
        element: component
      };
      items.push(componentItem);
    });

    return items;
  }

  return (
    <ThemeProvider theme={theme}>
      <AppLayout
        navigation={
          <SideNavigation
            header={{
              text: 'AnyCompany PoC',
              href: '/'
            }}
            // @ts-ignore
            items={getComponentItems()}
          />
        }
        content={
          <Form
            header={
              <Header variant="h1">
                AnyCompany Fleet Management System
              </Header>
            }
          >
            <BrowserRouter>
              <Routes>
                {getComponentItems().map(function (component) {
                  return <Route key={component.href} path={component.href}
                                element={React.createElement(component.element, {})}/>
                })}
              </Routes>
            </BrowserRouter>
          </Form>
        }
      />
    </ThemeProvider>
  );
}

export default App;
