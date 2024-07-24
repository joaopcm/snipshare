import { AppAbility, organizationSchema } from '@snipshare/auth'
import { ArrowLeftRight, Crown, UserMinus } from 'lucide-react'

import { getCurrentMembership, getCurrentOrgSlug } from '@/auth/auth'
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from '@/components/ui/button'
import { Table, TableBody, TableCell, TableRow } from '@/components/ui/table'
import { getMembers } from '@/http/get-members'
import { getOrganization } from '@/http/get-organization'
import { getInitials } from '@/lib/utils'

import { removeMembershipAction, transferOwnershipAction } from './actions'
import { UpdateMemberRoleSelect } from './update-member-role-select'

interface MemberListProps {
  permissions: AppAbility | null
}

export async function MemberList({ permissions }: MemberListProps) {
  const currentOrgSlug = getCurrentOrgSlug()

  const [membership, { members }, { organization }] = await Promise.all([
    getCurrentMembership(),
    getMembers(currentOrgSlug!),
    getOrganization(currentOrgSlug!),
  ])

  const canTransferOwnership = permissions?.can(
    'transfer_ownership',
    organizationSchema.parse(organization),
  )
  const canDeleteMember = permissions?.can('delete', 'User')
  const cannotUpdateRole = permissions?.cannot('update', 'User')

  return (
    <div className="space-y-2">
      <h2 className="text-lg font-semibold">Members</h2>

      <div className="rounded border">
        <Table>
          <TableBody>
            {members.map((member) => {
              const isSelf =
                member.userId === membership?.userId ||
                member.userId === organization.ownerId

              return (
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
                      <AvatarFallback>
                        {getInitials(member.name ?? '')}
                      </AvatarFallback>
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
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button size="sm" variant="ghost" disabled={isSelf}>
                              <ArrowLeftRight className="mr-2 size-4" />
                              Transfer ownership
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action is irreversible. It will permanently
                                transfer ownership to{' '}
                                <span className="font-semibold text-foreground">
                                  {member.name} ({member.email})
                                </span>
                                . Your current role will remain unchanged, but
                                you will no longer be the owner of this
                                organization.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <form
                                action={transferOwnershipAction.bind(
                                  null,
                                  member.userId,
                                )}
                              >
                                <AlertDialogAction type="submit">
                                  Yes, transfer ownership
                                </AlertDialogAction>
                              </form>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}

                      <UpdateMemberRoleSelect
                        memberId={member.id}
                        value={member.role}
                        disabled={isSelf || cannotUpdateRole}
                      />

                      {canDeleteMember && (
                        <AlertDialog>
                          <AlertDialogTrigger asChild>
                            <Button
                              disabled={isSelf}
                              size="sm"
                              variant="destructive"
                            >
                              <UserMinus className="mr-2 size-4" />
                              Remove
                            </Button>
                          </AlertDialogTrigger>
                          <AlertDialogContent>
                            <AlertDialogHeader>
                              <AlertDialogTitle>
                                Are you absolutely sure?
                              </AlertDialogTitle>
                              <AlertDialogDescription>
                                This action cannot be undone. This will
                                permanently remove{' '}
                                <span className="font-semibold text-foreground">
                                  {member.name}
                                </span>{' '}
                                from this organization.
                              </AlertDialogDescription>
                            </AlertDialogHeader>
                            <AlertDialogFooter>
                              <AlertDialogCancel>Cancel</AlertDialogCancel>
                              <form
                                action={removeMembershipAction.bind(
                                  null,
                                  member.id,
                                )}
                              >
                                <AlertDialogAction type="submit">
                                  Yes, remove
                                </AlertDialogAction>
                              </form>
                            </AlertDialogFooter>
                          </AlertDialogContent>
                        </AlertDialog>
                      )}
                    </div>
                  </TableCell>
                </TableRow>
              )
            })}
          </TableBody>
        </Table>
      </div>
    </div>
  )
}
