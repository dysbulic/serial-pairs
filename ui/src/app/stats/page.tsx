"use client"

import { ConfigContext } from "@/contexts/ConfigurationContext"
import { useContext } from "react"

export default function Statistics() {
  const { duration } = useContext(ConfigContext)
  
  return <h1>{duration}</h1>
}