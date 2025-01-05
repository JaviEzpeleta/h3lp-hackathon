export const extractDomain = (url: string) => {
  const domain = url.split("/")[2]
  return domain.replace("www.", "")
}
