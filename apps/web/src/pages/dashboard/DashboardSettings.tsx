import { useAuth } from '@/contexts/AuthContext';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { User, Shield, ArrowSquareOut, SignOut, Envelope } from 'phosphor-react';

export default function DashboardSettings() {
  const { user, signOut } = useAuth();

  const userImage = user?.image;
  const userName = user?.name || user?.email?.split('@')[0];
  const userEmail = user?.email;

  return (
    <div className="space-y-5 sm:space-y-8">
      <div>
        <h1 className="font-display text-xl sm:text-2xl md:text-3xl font-bold tracking-tight">Settings</h1>
        <p className="text-sm sm:text-base text-muted-foreground mt-1">Manage your account and preferences.</p>
      </div>

      {/* Profile section */}
      <Card className="p-4 sm:p-6">
        <h2 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
          <User weight="duotone" className="h-4 w-4 sm:h-5 sm:w-5" />
          Profile
        </h2>
        <div className="space-y-4">
          <div className="flex items-center gap-3 sm:gap-4">
            {userImage ? (
              <img
                src={userImage}
                alt={userName || 'Profile'}
                className="h-12 w-12 sm:h-16 sm:w-16 rounded-full"
              />
            ) : (
              <div className="h-12 w-12 sm:h-16 sm:w-16 rounded-full bg-muted flex items-center justify-center">
                <User weight="bold" className="h-6 w-6 sm:h-8 sm:w-8 text-muted-foreground" />
              </div>
            )}
            <div className="min-w-0 flex-1">
              <div className="font-medium text-sm sm:text-base truncate">{userName || 'User'}</div>
              <div className="text-xs sm:text-sm text-muted-foreground truncate">
                {userEmail}
              </div>
              <div className="text-[10px] sm:text-xs text-muted-foreground/60 mt-0.5 sm:mt-1">
                Signed in via Google
              </div>
            </div>
          </div>
          <Button
            variant="outline"
            onClick={signOut}
            className="text-destructive hover:text-destructive hover:bg-destructive/10 min-h-[44px] w-full sm:w-auto"
          >
            <SignOut weight="bold" className="h-4 w-4 mr-2" />
            Sign Out
          </Button>
        </div>
      </Card>

      {/* Privacy & Security */}
      <Card className="p-4 sm:p-6">
        <h2 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 flex items-center gap-2">
          <Shield weight="duotone" className="h-4 w-4 sm:h-5 sm:w-5" />
          Privacy & Security
        </h2>
        <div className="space-y-3 sm:space-y-4">
          <p className="text-xs sm:text-sm text-muted-foreground">
            Your data is stored securely and never shared with third parties.
            We only store your saved calculations and basic profile information.
          </p>
          <div className="flex flex-col sm:flex-row gap-2">
            <Button variant="outline" asChild className="min-h-[44px]">
              <a href="/privacy" target="_blank" rel="noopener noreferrer">
                Privacy Policy
                <ArrowSquareOut weight="bold" className="h-4 w-4 ml-2" />
              </a>
            </Button>
            <Button variant="outline" asChild className="min-h-[44px]">
              <a href="/terms" target="_blank" rel="noopener noreferrer">
                Terms of Service
                <ArrowSquareOut weight="bold" className="h-4 w-4 ml-2" />
              </a>
            </Button>
          </div>
        </div>
      </Card>

      {/* Data & Account */}
      <Card className="p-4 sm:p-6 border-destructive/30">
        <h2 className="font-semibold text-sm sm:text-base mb-3 sm:mb-4 text-destructive flex items-center gap-2">
          <Envelope weight="duotone" className="h-4 w-4 sm:h-5 sm:w-5" />
          Delete Account
        </h2>
        <p className="text-xs sm:text-sm text-muted-foreground mb-4">
          To delete your account and all associated data, please contact us. This action is
          permanent and cannot be undone.
        </p>
        <Button variant="outline" asChild className="min-h-[44px] w-full sm:w-auto">
          <a href="mailto:hello@opentaxation.my?subject=Account%20Deletion%20Request">
            <Envelope weight="bold" className="h-4 w-4 mr-2" />
            Request Account Deletion
          </a>
        </Button>
      </Card>
    </div>
  );
}
