import * as React from 'react'
import { BACKGROUND_COLOR } from './helper'

const AvatarComponent = ({
  username = 'User',
  width = 50,
  height = 50,
  fontSize = 16,
}: {
  username?: string
  width?: number
  height?: number
  fontSize?: number
}) => {
  const saveBgColor = localStorage.getItem(`AVATAR_COLOR_${username}`)
  const [currentAvatar, setCurrentAvatar] = React.useState<React.ReactNode>(
    <></>
  )

  const generateAvatar = React.useCallback(
    (username: string) => {
      // Lấy hai chữ cái đầu tiên từ tên người dùng
      const initials = username
        .split(' ')
        .map((word) => word[0])
        .slice(0, 2)
        .join('')
        .toUpperCase()

      let color: string | null = saveBgColor

      if (!color) {
        color =
          BACKGROUND_COLOR[Math.floor(Math.random() * BACKGROUND_COLOR.length)]
        localStorage.setItem(`AVATAR_COLOR_${username}`, color)
      }

      // Style cho avatar
      const avatarStyle = {
        backgroundColor: color,
        color: '#ffffff', // Màu chữ
        borderRadius: '50%', // Bo tròn
        width: width + 'px',
        height: height + 'px',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        fontSize: fontSize + 'px',
        fontWeight: 'bold',
      }

      setCurrentAvatar(
        <div
          style={{
            ...avatarStyle,
            userSelect: 'none',
          }}
        >
          {initials}
        </div>
      )
    },
    [height, width, saveBgColor, fontSize]
  )

  React.useEffect(() => {
    generateAvatar(username)
  }, [generateAvatar, username])

  return <div>{currentAvatar}</div>
}

export default AvatarComponent
