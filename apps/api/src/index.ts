import { ability } from '@nodepad/auth'

const userCanInviteSomeoneElse = ability.can('invite', 'User')
const userCanDeleteOtherUsers = ability.can('delete', 'User')

const userCannotDeleteOtherUsers = ability.cannot('delete', 'User')

console.log({
  userCanInviteSomeoneElse,
  userCanDeleteOtherUsers,
  userCannotDeleteOtherUsers,
})
