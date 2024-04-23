import { defineAbilityFor, projectSchema } from '@nodepad/auth'

const ability = defineAbilityFor({
  __typename: 'User',
  id: 'user1-id',
  role: 'MEMBER',
})

const project = projectSchema.parse({ id: 'project-id', ownerId: 'user1-id' })

console.log(ability.can('get', 'Billing'))
console.log(ability.can('create', 'Invite'))
console.log(ability.can('delete', project))
