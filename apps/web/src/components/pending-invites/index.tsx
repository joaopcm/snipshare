'use client'

import { useQuery } from '@tanstack/react-query'
import dayjs from 'dayjs'
import relativeTime from 'dayjs/plugin/relativeTime'
import { Check, MailPlus, X } from 'lucide-react'
import { useState } from 'react'

import { getPendingInvites } from '@/http/get-pending-invites'

import { Button } from '../ui/button'
import { Popover, PopoverContent, PopoverTrigger } from '../ui/popover'
import { Separator } from '../ui/separator'
import { acceptInviteAction, rejectInviteAction } from './actions'

dayjs.extend(relativeTime)

export function PendingInvites() {
  const [isOpen, setIsOpen] = useState(false)

  const { data, refetch } = useQuery({
    queryKey: ['pending-invites'],
    queryFn: getPendingInvites,
    enabled: isOpen,
  })

  async function handleAcceptInvite(inviteId: string) {
    await acceptInviteAction(inviteId)
    refetch()
  }

  async function handleRejectInvite(inviteId: string) {
    await rejectInviteAction(inviteId)
    refetch()
  }

  return (
    <Popover open={isOpen} onOpenChange={setIsOpen}>
      <PopoverTrigger asChild>
        <Button size="icon" variant="ghost">
          <MailPlus className="size-4" />
          <span className="sr-only">Pending invites</span>
        </Button>
      </PopoverTrigger>

      <PopoverContent className="w-80 space-y-2">
        <span className="block text-sm font-medium">
          Pending invites ({data?.invites.length ?? 0})
        </span>

        <Separator />

        {data?.invites.length === 0 && (
          <p className="text-sm text-muted-foreground">No pending invites.</p>
        )}

        {data?.invites.map((invite) => (
          <div className="space-y-2" key={invite.id}>
            <p className="text-sm leading-relaxed text-muted-foreground">
              <span className="font-medium text-foreground">
                {invite.author?.name ?? 'Someone'}
              </span>{' '}
              invited you to join{' '}
              <span className="font-medium text-foreground">
                {invite.organization.name}
              </span>{' '}
              {dayjs(invite.createdAt).fromNow()}
            </p>

            <div className="flex gap-1">
              <Button
                size="xs"
                variant="outline"
                onClick={() => handleAcceptInvite(invite.id)}
              >
                <Check className="mr-1.5 size-3" />
                Accept
              </Button>
              <Button
                size="xs"
                variant="ghost"
                className="text-muted-foreground"
                onClick={() => handleRejectInvite(invite.id)}
              >
                <X className="mr-1.5 size-3" />
                Reject
              </Button>
            </div>
          </div>
        ))}
      </PopoverContent>
    </Popover>
  )
}
