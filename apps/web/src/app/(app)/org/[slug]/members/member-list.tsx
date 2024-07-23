import { organizationSchema } from '@snipshare/auth'
import { ArrowLeftRight, Crown, UserMinus } from 'lucide-react'

import { ability, getCurrentOrgSlug } from '@/auth/auth'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getMembers } from '@/http/get-members'
import { getMembership } from '@/http/get-membership'
import { getOrganization } from '@/http/get-organization'

import { removeMembershipAction } from './actions'

export async function MemberList() {
  const permissions = await ability()
  const currentOrgSlug = getCurrentOrgSlug()

  const [{ membership }, { members }, { organization }] = await Promise.all([
    getMembership(currentOrgSlug!),
    getMembers(currentOrgSlug!),
    getOrganization(currentOrgSlug!),
  ])

  const canTransferOwnership = permissions?.can(
    'transfer_ownership',
    organizationSchema.parse(organization),
  )
  const canDeleteMember = permissions?.can('delete', 'User')

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>

      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => (
              <TableRow key={member.id}>
                <TableCell className="py-2.5" style={{ width: 48 }}>
                  <Avatar>
                    {member.avatarUrl && (
                      <AvatarImage
                        src={member.avatarUrl}
                        width={32}
                        height={32}
                        alt={
                          member.name ? `${member.name}'s avatar` : undefined
                        }
                        className="aspect-square size-full"
                      />
                    )}
                    <AvatarFallback />
                  </Avatar>
                </TableCell>
                <TableCell className="py-2.5">
                  <div className="flex flex-col">
                    <span className="inline-flex items-center gap-2 font-medium">
                      {member.name}

                      {member.userId === membership?.userId && ' (you)'}

                      {member.userId === organization.ownerId && (
                        <span className="inline-flex items-center gap-1 text-xs text-muted-foreground">
                          <Crown className="size-3" />
                          Owner
                        </span>
                      )}
                    </span>
                    <span className="text-xs text-muted-foreground">
                      {member.email}
                    </span>
                  </div>
                </TableCell>
                <TableCell className="py-2.5 ">
                  <div className="flex items-center justify-end gap-2">
                    {canTransferOwnership && (
                      <Button size="sm" variant="ghost">
                        <ArrowLeftRight className="mr-2 size-4" />
                        Transfer ownership
                      </Button>
                    )}

                    {canDeleteMember && (
                      <form
                        action={removeMembershipAction.bind(null, member.id)}
                      >
                        <Button
                          disabled={
                            member.userId === membership.userId ||
                            member.userId === organization.ownerId
                          }
                          type="submit"
                          size="sm"
                          variant="destructive"
                        >
                          <UserMinus className="mr-2 size-4" />
                          Remove
                        </Button>
                      </form>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
