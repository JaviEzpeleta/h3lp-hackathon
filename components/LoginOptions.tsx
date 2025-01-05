import { Profile, useProfilesManaged } from "@lens-protocol/react-web"
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog"
import { LoginAs } from "./LoginAs"

type LoginOptionsProps = {
  wallet: string
  onSuccess: (profile: Profile) => void
  open: boolean
  onOpenChange: (open: boolean) => void
}

export function LoginOptions({
  wallet,
  onSuccess,
  open,
  onOpenChange,
}: LoginOptionsProps) {
  const {
    data: profiles,
    error,
    loading,
  } = useProfilesManaged({
    for: wallet,
    includeOwned: true,
  })

  // console.log("profiles (v2)", profiles)
  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>
            <div className="text-center">Choose a Lens Profile</div>
          </DialogTitle>
        </DialogHeader>

        {loading && <p>Loading...</p>}

        {error && <p>{JSON.stringify(error)}</p>}

        {profiles?.length === 0 && <p>No profiles managed by this wallet.</p>}

        {profiles && profiles.length > 0 && (
          <div className="flex flex-col justify-center items-center text-black">
            {profiles.map((profile) => (
              <LoginAs
                key={profile.id}
                profile={profile}
                wallet={wallet}
                onSuccess={onSuccess}
              />
            ))}
          </div>
        )}
      </DialogContent>
    </Dialog>
  )
}

export default LoginOptions
