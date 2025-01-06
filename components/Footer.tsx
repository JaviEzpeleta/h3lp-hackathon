import Link from "next/link"

const Footer = () => {
  return (
    <div className="py-8 flex justify-center border-t">
      <div className="text-sm text-center">
        made by{" "}
        <Link
          href="https://hey.xyz/u/0xjavi"
          target="_blank"
          className="text-ttRed cursor-pointer active:opacity-40 hover:underline"
        >
          0xjavi
        </Link>{" "}
        with 🌱 and lots of{" "}
        <img
          src="/img/lfg.webp"
          className="inline-block w-5 rounded-sm select-none"
          alt="lfg"
        />
        s <br />
        Lens Network Holiday Hackathon
        <br />
        January 2025
      </div>
    </div>
  )
}

export default Footer
