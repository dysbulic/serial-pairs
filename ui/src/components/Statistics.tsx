import { Metadata } from "@/app/page";
import { Dispatch, SetStateAction } from "react";

export default function Statistics(
  { config, setShowStatistics }:
  { config: Metadata, setShowStatistics: Dispatch<SetStateAction<boolean>> }
) {
  return <h1>TEST</h1>
}