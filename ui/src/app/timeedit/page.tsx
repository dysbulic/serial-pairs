"use client"

import { ConfigContext } from "@/contexts/ConfigurationContext";
import Link from "next/link";
import { FormEvent, useContext, useState } from "react";

const EventEdit = ({event, idx}) => {
  const [bg, setBg] = useState(event.bg)
  const [icon, setIcon] = useState(event.icon)
  const [label, setLabel] = useState(event.label)
  const [href, setHref] = useState(event.href)

return(
  <li key={idx}>
  <input value={bg} id="bg" onChange={({target: {value}})=>setBg(value)}/>
  <input value={icon} id="icon" onChange={({target: {value}})=>setIcon(value)}/>
  <input value={label} id="label" onChange={({target: {value}})=>setLabel(value)}/>
  <input value={href} id="href" onChange={({target: {value}})=>setHref(value)}/>
</li>
)
}
export default function TimeEdit() {
  const { eventButtons, modeButtons, setEventButtons, setModeButtons } =
    useContext(ConfigContext);

  const submitEvents=(evt: FormEvent) => {
    evt.preventDefault()
    const chunksize = 4

    const elements = Array.from((evt.target as HTMLFormElement).elements)
    const out = []
    for (let i = 0; i < elements.length; i += chunksize) {
      const chunk = elements.slice(i, i + chunksize);
      if (chunk.length === chunksize){
        out.push({
          bg: (chunk[0] as HTMLInputElement).value,
          icon: (chunk[1] as HTMLInputElement).value,
          label: (chunk[2] as HTMLInputElement).value,
          href: (chunk[3] as HTMLInputElement).value,
        })
      }
    }
    setEventButtons(out)
  }
  return (
    <form onSubmit={submitEvents}>
      <Link href='/'>Back</Link>
      <ul>
        <li>
          <span>Background</span>
          <span>Icon</span>
          <span>Label</span>
          <span>HRef</span>
        </li>

        {eventButtons.map((event, idx)=>(
          <EventEdit key={idx} {...{ event, idx }}/>
        ))}
      </ul>
      <button>Save</button>      
    </form>
  )
}
