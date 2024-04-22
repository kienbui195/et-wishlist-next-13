import { Alert } from 'components/Alert/Alert'
import { AlertType } from 'data/types'
import { TAlertType } from 'data/wl-types'
import React, { FC, ReactNode, createContext, useContext } from 'react'
import { toast, Toaster } from 'sonner'

interface IAdminContext {
  children: ReactNode
}

export interface IAlerts {
  id: string
  message: string
  type: AlertType
}

export type TPositionAlert =
  | 'bottom-center'
  | 'bottom-left'
  | 'bottom-right'
  | 'top-right'
  | 'top-center'
  | 'top-left'

const AdminContext = createContext<any | null>(null)

export const AdminProvider: FC<IAdminContext> = ({ children }) => {
  const showAlert = (
    type: TAlertType = 'info',
    message: string = '',
    duration = 3500,
    position: TPositionAlert = 'top-center'
  ) => {
    toast.custom(
      (t: any) => (
        <Alert
          onClose={() => toast.dismiss(t)}
          type={type}
          open={true}
          children={message}
        />
      ),
      {
        duration,
        position,
      }
    )
  }

  return (
    <div>
      <AdminContext.Provider value={{ showAlert }}>
        <Toaster />
        {children}
      </AdminContext.Provider>
    </div>
  )
}

export const useAdminContext = () => {
  const context = useContext(AdminContext)

  if (context === undefined) {
    console.log('Need Provider Context')
  }
  return context
}
