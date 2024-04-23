'use client'

import { Alert } from "../components/Alert/Alert";
import { AlertType } from "../data/types";
import { TAlertType } from "../data/wl-types";
import React, { FC, ReactNode, createContext, useContext } from "react";
import { toast, Toaster } from "sonner";

interface IAlertContext {
  children: ReactNode;
}

export interface IAlerts {
  id: string;
  message: string;
  type: AlertType;
}

export type TPositionAlert = "bottom-center" | "bottom-left" | "bottom-right" | "top-right" | "top-center" | "top-left";

const AlertContext = createContext<any | null>(null);

export const AlertProvider: FC<IAlertContext> = ({ children }) => {
  const showAlert = (type: TAlertType = "info", message: string = "", duration = 3500, position: TPositionAlert = "top-center") => {
    toast.custom(
      (t: any) => (
        <Alert onClose={() => toast.dismiss(t)} type={type} open={true}>
          {message}
        </Alert>
      ),
      {
        duration,
        position,
      }
    );
  };

  return (
    <div>
      <AlertContext.Provider value={{ showAlert }}>
        <Toaster />
        {children}
      </AlertContext.Provider>
    </div>
  );
};

export const useAlertContext = () => {
  const context = useContext(AlertContext);

  if (context === undefined) {
    console.log("Need Provider Context");
  }
  return context;
};
