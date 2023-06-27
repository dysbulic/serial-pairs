import { CID } from 'multiformats/cid'

type Maybe<T> = T | null

const IPFS_LINK_PATTERN = 'https://w3s.link/ipfs/{cid}/{path}'

export function httpLink(str: string): string
export function httpLink(str: undefined | null): undefined

export function httpLink(uri?: Maybe<string>) {
  const [, origCID, path] =
    uri?.match(/^(?:ipfs|dweb):(?:\/\/)?([^/]+)(?:\/(.*))?$/) ?? []

  try {
    if (origCID) {
      const cid = CID.parse(origCID)

      let v0CID = ''
      try {
        v0CID = cid.toV0().toString()
      } catch {}

      let v1CID = ''
      try {
        v1CID = cid.toV1().toString()
      } catch {}

      const pattern = IPFS_LINK_PATTERN;
      return pattern
        .replace(/{cid}/g, origCID)
        .replace(/{v0cid}/g, v0CID)
        .replace(/{v1cid}/g, v1CID)
        .replace(/{path}/g, path ?? '')
    }
  } catch {}

  return uri ?? undefined; // Image.src won't take null
}

export const downloadString = (
  { text, mimetype, filename }:
  { text: string, mimetype: string, filename: string }
) => {
  var blob = new Blob([text], { type: mimetype });

  const a = document.createElement('a')
  a.download = filename
  a.href = URL.createObjectURL(blob)
  a.dataset.downloadurl = [mimetype, a.download, a.href].join(':')
  a.style.display = 'none'
  document.body.appendChild(a)
  a.click()
  document.body.removeChild(a)
  setTimeout(() => { URL.revokeObjectURL(a.href) }, 1500)
}
