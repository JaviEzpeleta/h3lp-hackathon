export const timeSince = (date: number) => {
  // calculate the distance between now and the date
  const distance = new Date().getTime() - new Date(date).getTime()

  // console.log(" 📘 THE DISTANCE IS ", distance)
  // console.log("NOW IS ", new Date().getTime())
  // console.log("PASSED IS ", new Date(date).getTime())

  // if the distance is less than 60 seconds, return 'Just now'
  if (distance < 60000) {
    return "just now"
  }

  // if the distance is less than 60 minutes, return the number of minutes
  if (distance < 3600000) {
    if (Math.floor(distance / 60000) > 1)
      return Math.floor(distance / 60000) + " minutes ago"
    else return "one minute ago"
  }

  // if the distance is less than 24 hours, return the number of hours
  if (distance < 86400000) {
    if (Math.floor(distance / 3600000) > 1)
      return Math.floor(distance / 3600000) + " hours ago"
    else return "one hour ago"
  }

  // if the distance is less than 30 days, return the number of days
  if (distance < 2592000000) {
    if (Math.floor(distance / 86400000) > 1)
      return Math.floor(distance / 86400000) + " days ago"
    else return "yesterday"
  }

  const months = Math.floor(distance / 2592000000)

  if (months > 11) {
    const years = (months / 12).toFixed(1)
    return years + " years ago" // so good!! love it like this!!!!
  } else {
    return months === 1 ? "1 month ago" : months + " months ago"
  }
}

export const timeSinceShorter = (date: number) => {
  // calculate the distance between now and the date
  const distance = new Date().getTime() - new Date(date).getTime()

  // console.log(" 📘 THE DISTANCE IS ", distance)
  // console.log("NOW IS ", new Date().getTime())
  // console.log("PASSED IS ", new Date(date).getTime())

  // if the distance is less than 60 seconds, return 'Just now'
  if (distance < 60000) {
    return "just now"
  }

  // if the distance is less than 60 minutes, return the number of minutes
  if (distance < 3600000) {
    if (Math.floor(distance / 60000) > 1)
      return Math.floor(distance / 60000) + "m ago"
    else return "1m ago"
  }

  // if the distance is less than 24 hours, return the number of hours
  if (distance < 86400000) {
    if (Math.floor(distance / 3600000) > 1)
      return Math.floor(distance / 3600000) + "h ago"
    else return "1h ago"
  }

  // if the distance is less than 30 days, return the number of days
  if (distance < 2592000000) {
    if (Math.floor(distance / 86400000) > 1)
      return Math.floor(distance / 86400000) + "d ago"
    else return "yesterday"
  }

  const months = Math.floor(distance / 2592000000)

  if (months > 11) {
    const years = (months / 12).toFixed(1)
    return years + " years ago" // so good!! love it like this!!!!
  } else {
    return months === 1 ? "1 month ago" : months + " months ago"
  }
}

export const timeUntil = (date: number) => {
  // calculate the distance between now and the date
  const distance = new Date(date).getTime() - new Date().getTime()

  // if the distance is less than 60 seconds, return 'Just now'
  if (distance < 60000) {
    return "just now"
  }

  // if the distance is less than 60 minutes, return the number of minutes
  if (distance < 3600000) {
    if (Math.floor(distance / 60000) > 1)
      return Math.floor(distance / 60000) + " minutes"
    else return "in one minute"
  }

  // if the distance is less than 24 hours, return the number of hours
  if (distance < 86400000) {
    if (Math.floor(distance / 3600000) > 1)
      return Math.floor(distance / 3600000) + " hours"
    else return "in one hour"
  }

  // if the distance is less than 30 days, return the number of days
  if (distance < 2592000000) {
    if (Math.floor(distance / 86400000) > 1)
      return Math.floor(distance / 86400000) + " days"
    else return "tomorrow"
  }

  return Math.floor(distance / 2592000000) + " months"
}

export const daysLeftUntil = (date: number) => {
  // calculate the distance between now and the date
  const distance = new Date(date).getTime() - new Date().getTime()

  // calculate the number of days left

  if (distance < 0) {
    return "0 days left"
  }

  if (distance < 86400000) {
    return "today"
  }

  // case of 1 day left:
  if (distance < 172800000) {
    return "tomorrow"
  }

  return Math.floor(distance / 86400000) + " days left"
}

export const getDayName = (date: Date): string => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
  return days[date.getDay()]
}

// Usage
const today = new Date()
// console.log(getDayName(today)) // Outputs the name of today's day, e.g., "Monday"

export function calculateDifferenceFromNow(timestamp: number): string {
  const currentDate = new Date()
  const futureDate = new Date(timestamp)
  futureDate.setMonth(futureDate.getMonth() + 1) // Add one month to the given timestamp date

  // Calculate the difference in milliseconds
  const difference = futureDate.getTime() - currentDate.getTime()

  // Convert the difference from milliseconds to days, hours, and minutes
  let remaining = difference / 1000 // Convert to seconds
  const days = Math.floor(remaining / (3600 * 24))
  remaining -= days * 3600 * 24
  const hours = Math.floor(remaining / 3600)
  remaining -= hours * 3600
  const minutes = Math.floor(remaining / 60)

  return `${days} days, ${hours} hours, and ${minutes} minutes`
}

export const formatTimestamp = (theValue: number) => {
  const days = [
    "Sunday",
    "Monday",
    "Tuesday",
    "Wednesday",
    "Thursday",
    "Friday",
    "Saturday",
  ]
  const suffixes = ["th", "st", "nd", "rd"]

  const date = new Date(theValue)
  const dayOfWeek = days[date.getDay()]
  const dayOfMonth = date.getDate()
  const year = date.getFullYear()

  // Get the appropriate ordinal suffix for the day
  const suffix = suffixes[(dayOfMonth % 10) - 1] || suffixes[0]
  // Adjust for special cases (11th, 12th, 13th)
  const correctedSuffix = [11, 12, 13].includes(dayOfMonth % 100)
    ? "th"
    : suffix

  // Format month in 'February' style
  const month = date.toLocaleString("en-us", { month: "long" })

  return `${dayOfWeek}, ${month} ${dayOfMonth}${correctedSuffix}, ${year}`
}

export const formatDate = (dateString: string): string => {
  const date = new Date(dateString)

  const options: Intl.DateTimeFormatOptions = {
    year: "numeric",
    month: "long",
    day: "numeric",
  }

  const formattedDate = date.toLocaleDateString("en-US", options)

  // Add the ordinal suffix (st, nd, rd, th)
  const day = date.getDate()
  const ordinalSuffix = (n: number) => {
    if (n > 3 && n < 21) return "th"
    switch (n % 10) {
      case 1:
        return "st"
      case 2:
        return "nd"
      case 3:
        return "rd"
      default:
        return "th"
    }
  }

  const dayWithSuffix = `${day}${ordinalSuffix(day)}`

  // Replace the day without suffix with the day with suffix
  return formattedDate.replace(/\d+/, dayWithSuffix)
}

export const formatDateWithoutYear = (dateString: string): string => {
  const date = new Date(dateString)
  const options: Intl.DateTimeFormatOptions = { month: "short", day: "numeric" }
  return date.toLocaleDateString("en-US", options)
}
