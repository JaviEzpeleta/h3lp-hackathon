export const extractDomain = (url: string) => {
  const domain = url.split("/")[2]
  return domain.replace("www.", "")
}

export const cleanHandle = (handle: string) => {
  return handle.replace("lens/", "")
}
