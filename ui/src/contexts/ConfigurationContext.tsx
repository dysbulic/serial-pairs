import { ButtonInfo, ConfigContextProps, EventInfo, Metadata, ModeInfo } from "@/types";
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
    { bg: '#FFA8A8', icon: '/download.svg', label: 'View Config', href: '/config' },
    { bg: '#FFA8A8', icon: '📈', label: 'Statistics', href: '/stats' },
  ],
}

const unimplemented = () => { throw new Error("Not implemented.") }
export const ConfigContext = createContext<ConfigContextProps>({
  modeButtons: defaultButtons.mode,
  setModeButtons: unimplemented,
  eventButtons: defaultButtons.event,
  setEventButtons: unimplemented,
  actionButtons: defaultButtons.action,
  setActionButtons: unimplemented,
  videoSource: undefined,
  setVideoSource: unimplemented,
  modes: [],
  setModes: unimplemented,
  events: [],
  setEvents: unimplemented,
  duration: undefined,
  setDuration: unimplemented,
  getConfig: unimplemented,
  setConfig: unimplemented,
})

export const ConfigProvider: React.FC<React.PropsWithChildren> = (
  ({ children }) => {
    const [modeButtons, setModeButtons] = useState(defaultButtons.mode)
    const [eventButtons, setEventButtons] = useState(defaultButtons.event)
    const [actionButtons, setActionButtons] = (
      useState<Array<ButtonInfo>>(defaultButtons.action)
    )
    const [videoSource, setVideoSource] = useState<string>()
    const [modes, setModes] = useState<Array<ModeInfo>>([])
    const [events, setEvents] = useState<Array<EventInfo>>([])
    const [duration, setDuration] = useState(0)

    const setConfig = (config: Metadata) => {
      const { video: videoSource, buttons, modes, events } = config
      if(videoSource) setVideoSource(videoSource)
      if(buttons?.mode) setModeButtons(buttons.mode)
      if(buttons?.event) setEventButtons(buttons.event)
      if(buttons?.action) setActionButtons(buttons.action)
      if(modes) setModes(modes)
      if(events) setEvents(events)

    }

    const getConfig = () => ({
      video: videoSource,
      buttons: {
        mode: modeButtons,
        event: eventButtons,
      },
      modes,
      events,
    })

    return (
      <ConfigContext.Provider value={{
        modeButtons, setModeButtons,
        eventButtons, setEventButtons,
        actionButtons, setActionButtons,
        videoSource, setVideoSource,
        modes, setModes,
        events, setEvents,
        duration, setDuration,
        getConfig, setConfig,
      }}>
        {children}
      </ConfigContext.Provider>
    )
  }
)