import { useToast } from "@/hooks/use-toast"
import { Profile, useLogin } from "@lens-protocol/react-web"

export type LoginAsProps = {
  profile: any
  wallet: string
  onSuccess: (profile: Profile) => void
}

export function LoginAs({ profile, wallet, onSuccess }: LoginAsProps) {
  const { toast } = useToast()
  const { execute, loading } = useLogin()

  const login = async () => {
    const result = await execute({
      address: wallet,
      profileId: profile.id,
    })

    if (result.isSuccess()) {
      return onSuccess(profile)
    }

    toast({
      title: "Error",
      description: result.error.message,
      variant: "destructive",
    })
  }

  return (
    <div
      className="flex items-center text-white p-2 px-6 cursor-pointer hover:text-black transition-all duration-100 ease-out rounded-lg justify-center space-x-4 bg-zinc-800 hover:bg-primary/60 active:opacity-50"
      onClick={login}
    >
      <img
        className="w-8 rounded-full"
        src={profile.metadata?.picture?.optimized?.uri}
        alt={profile.handle?.fullHandle}
      />
      <div>{profile.handle?.fullHandle ?? profile.id}</div>
    </div>
  )
}
