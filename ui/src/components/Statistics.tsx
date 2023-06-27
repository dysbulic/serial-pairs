"use client"

import { Dispatch, SetStateAction } from "react";

export default function Statistics(
  { setVisible }: { setVisible: (vis: boolean) => void }
) {
  return <button onClick={() => setVisible(false)}>Close</button>
}