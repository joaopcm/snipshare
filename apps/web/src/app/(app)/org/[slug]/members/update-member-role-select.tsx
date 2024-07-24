'use client'

import { Role } from '@snipshare/auth'
import { ComponentProps } from 'react'
import { toast } from 'sonner'

import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

import { updateMembershipAction } from './actions'

interface UpdateMemberRoleSelectProps extends ComponentProps<typeof Select> {
  memberId: string
}

export function UpdateMemberRoleSelect({
  memberId,
  ...props
}: UpdateMemberRoleSelectProps) {
  async function updateMembershipRole(role: Role) {
    await updateMembershipAction(memberId, role)
    toast.success('Role updated successfully')
  }

  return (
    <Select {...props} onValueChange={updateMembershipRole}>
      <SelectTrigger className="h-9 w-32">
        <SelectValue />
      </SelectTrigger>

      <SelectContent>
        <SelectItem value="ADMIN">Admin</SelectItem>
        <SelectItem value="MEMBER">Member</SelectItem>
        <SelectItem value="BILLING">Billing</SelectItem>
      </SelectContent>
    </Select>
  )
}
