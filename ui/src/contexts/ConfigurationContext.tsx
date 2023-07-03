import { ButtonInfo, ConfigContextProps, EventInfo, Metadata, ModeInfo } from "@/types";
import React, { Dispatch, PropsWithChildren, SetStateAction, createContext, useState } from "react";

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
    { bg: '#FFA8A8', icon: '📅', label: 'Edit Events', href: '/timeedit'},
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
  resetConfig: unimplemented,
})

export const ConfigProvider: React.FC<PropsWithChildren> = (
  ({ children }) => {
    const [modeButtons, setModeButtons] = (
      useState<Array<ButtonInfo>>(defaultButtons.mode)
    )
    const [eventButtons, setEventButtons] = (
      useState<Array<ButtonInfo>>(defaultButtons.event)
    )
    const [actionButtons, setActionButtons] = (
      useState<Array<ButtonInfo>>(defaultButtons.action)
    )
    const buttons = {
      mode: modeButtons,
      event: eventButtons,
      action: actionButtons,
    }
    const setButtons: (
      Record<string, Dispatch<SetStateAction<Array<ButtonInfo>>>>
    ) = {
      mode: setModeButtons,
      event: setEventButtons,
      action: setActionButtons,
    }
    const [videoSource, setVideoSource] = useState<string>()
    const [modes, setModes] = useState<Array<ModeInfo>>([])
    const [events, setEvents] = useState<Array<EventInfo>>([])
    const [duration, setDuration] = useState<number>()

    const setConfig = (config: Metadata) => {
      const { video: videoSource, buttons, modes, events } = config
      if(videoSource) setVideoSource(videoSource)
      Object.entries(buttons).forEach(
        ([type, list]: [string, Array<ButtonInfo>]) => {
          if(type in setButtons) {
            setButtons[type](list)
          } else {
            console.error(`Unknown buttons list "${type} in config.`)
          }
        }
      )
      if(modes) setModes(modes)
      if(events) setEvents(events)
    }

    const getConfig = () => ({
      video: videoSource,
      buttons,
      modes,
      events,
    })

    const resetConfig = () => {
      Object.values(setButtons).forEach((setter) => setter([]))
      setVideoSource(undefined)
      setModes([])
      setEvents([])
      setDuration(undefined)
    }

    return (
      <ConfigContext.Provider value={{
        modeButtons, setModeButtons,
        eventButtons, setEventButtons,
        actionButtons, setActionButtons,
        videoSource, setVideoSource,
        modes, setModes,
        events, setEvents,
        duration, setDuration,
        getConfig, setConfig, resetConfig,
      }}>
        {children}
      </ConfigContext.Provider>
    )
  }
)