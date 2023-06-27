import { ConfigContextProps, EventInfo, ModeInfo } from "@/types";
import React, { createContext, useState } from "react";

export const defaultButtons = {
  mode: [
    { bg: '#016A18', icon: '🖊', label: 'New Work' },
    { bg: '#6A0E01', icon: '🐞', label: 'Debugging' },
    { bg: '#0D1B98', icon: '🥽', label: 'Testing' },
    { bg: '#A59506', icon: '🗺', label: 'Planning' },
    { bg: '#06A5A5', icon: '💬', label: 'Chatter' },
    { bg: '#690E6B', icon: '🏖', label: 'Break' },
    { bg: '#C27800', icon: '❓', label: 'Unknown' },
  ],
  event: [
    { bg: '#24EEBE', icon: '/error.svg', label: 'Standards Error' },
    { bg: '#BEEE24', icon: '/dead day.svg', label: 'Useless Event' },
    { bg: '#EE24BA', icon: '/Spartan.svg', label: 'Right Headed' },
    { bg: '#8399E6', icon: '/stop buffalo.svg', label: 'Wrong Headed' },
    { bg: '#EE410B', icon: '/solutions.svg', label: 'Solution Found' },
  ],
  action: [
    { bg: '#FFA8A8', icon: '/download.svg', label: 'Download Config' },
    { bg: '#FFD5A8', icon: '/ceramic.svg', label: 'Save To Ceramic' },
    { bg: '#FFA8A8', icon: '📈', label: 'Statistics' },
  ],
}

export const ConfigContext = createContext<ConfigContextProps>({
  modeButtons: defaultButtons.mode,
  setModeButtons: () => { throw new Error("Not implemented.") },
  eventButtons: defaultButtons.event,
  setEventButtons: () => { throw new Error("Not implemented.") },
  actionButtons: defaultButtons.action,
  setActionButtons: () => { throw new Error("Not implemented.") },
  videoSource: undefined,
  setVideoSource: () => { throw new Error("Not implemented.") },
  modes: [],
  setModes: () => { throw new Error("Not implemented.") },
  events: [],
  setEvents: () => { throw new Error("Not implemented.") },
  duration: undefined,
  setDuration: () => { throw new Error("Not implemented.") },
})

export const ConfigProvider: React.FC<React.PropsWithChildren> = (
  ({ children }) => {
    const [modeButtons, setModeButtons] = useState(defaultButtons.mode)
    const [eventButtons, setEventButtons] = useState(defaultButtons.event)
    const [actionButtons, setActionButtons] = useState(defaultButtons.action)
    const [videoSource, setVideoSource] = useState<string>()
    const [modes, setModes] = useState<Array<ModeInfo>>([])
    const [events, setEvents] = useState<Array<EventInfo>>([])
    const [duration, setDuration] = useState(0)

    return (
      <ConfigContext.Provider value={{
        modeButtons, setModeButtons,
        eventButtons, setEventButtons,
        actionButtons, setActionButtons,
        videoSource, setVideoSource,
        modes, setModes,
        events, setEvents,
        duration, setDuration,
      }}>
        {children}
      </ConfigContext.Provider>
    )
  }
)