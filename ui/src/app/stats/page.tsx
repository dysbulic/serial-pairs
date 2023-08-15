"use client"

import Timeline from "@/components/Timeline"
import { ConfigContext } from "@/contexts/ConfigurationContext"
import { useContext, useState } from "react"

export default function Statistics() {
  const { duration, modes, events } = useContext(ConfigContext)
  const [blockWeights, setBlockWeights] = useState<Record<string, number>>({})
  const [eventWeights, setEventWeights] = useState<Record<string, number>>({})

  const blockWeightChanged = ({ name, value }: { name: string, value: number }) => {
    setBlockWeights((weights) => ({
      ...weights,
      [name]: value,
    }))
  }

  const eventWeightChanged = ({ name, value }: { name: string, value: number }) => {
    setEventWeights((weights) => ({
      ...weights,
      [name]: value,
    }))
  }

  
  const sorted = modes.sort((a, b) => a.start - b.start)
  const blockTotals: Record<string, number> = {}
  modes.forEach((mode, idx) => {
    if (mode.mode){
      if (idx < modes.length - 1) {
        const dur = modes[idx + 1].start - mode.start
        blockTotals[mode.mode] ??= 0
        blockTotals[mode.mode] += dur 
      } else if (duration != null) {
        const dur = duration - mode.start
        blockTotals[mode.mode] ??= 0
        blockTotals[mode.mode] += dur 

      }
    }  
  })

  const weightedBlockTotal = Object.entries(blockTotals).reduce((acc, [name, duration]) => (
    acc + (blockWeights[name] ? duration * blockWeights[name] : 0)
  ), 0)

  const eventTotals: Record<string, number> = {}
  events.forEach((event) => {
    if (event.event) {
      eventTotals[event.event] ??= 0
      eventTotals[event.event]++
    }
  })

  const weightedEventTotal = Object.entries(eventTotals).reduce((acc, [name, count]) => (
    acc + (eventWeights[name] ? count * eventWeights[name] : 0)
  ), 0)

  return (
    <main>
      <table>
        <thead>
          <tr>
            <th>Block Type</th>
            <th>Duration</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(blockTotals).map(([name, duration]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{(duration / 60).toFixed(1)} minutes</td>
              <td>
                <input
                  type="number"
                  onChange={({ target: { value } }) => {
                    blockWeightChanged({ name, value: Number(value) })
                  }}
                  value={blockWeights[name]}
                />
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td>{weightedBlockTotal}</td>
          </tr>
        </tbody>
      </table>

      <table>
        <thead>
          <tr>
            <th>Event Type</th>
            <th>Count</th>
            <th>Weight</th>
          </tr>
        </thead>
        <tbody>
          {Object.entries(eventTotals).map(([name, count]) => (
            <tr key={name}>
              <td>{name}</td>
              <td>{count}</td>
              <td>
                <input
                  type="number"
                  onChange={({ target: { value } }) => {
                    eventWeightChanged({ name, value: Number(value) })
                  }}
                  value={eventWeights[name]}
                />
              </td>
            </tr>
          ))}
          <tr>
            <td></td>
            <td>{weightedEventTotal}</td>
          </tr>
        </tbody>
      </table>

      <section>
        <Timeline/>
      </section>
    </main>
  )
}