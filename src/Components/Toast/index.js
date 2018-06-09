// import React from 'react';
import { Position, Toaster } from "@blueprintjs/core";
 
const AppToaster = Toaster.create({
  className: "recipe-toaster",
  position: Position.TOP,
});

export const showToast = (message, intent, timeout, icon) => {
  AppToaster.show({
    message,
    intent,
    timeout,
    icon
  });
}

export default AppToaster;
