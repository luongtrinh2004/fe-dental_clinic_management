import { AbilityBuilder, Ability } from '@casl/ability'

export const AppAbility = Ability

/**
 * Please define your own Ability rules according to your app requirements.
 * We have just shown Admin and Client rules for demo purpose where
 * admin can manage everything and client can just visit ACL page
 */
const defineRulesFor = (role, subject) => {
  const { can, rules } = new AbilityBuilder(AppAbility)

  switch (role) {
    case 'admin':
      can('manage', 'all')
      break
    case 'staff':
      can(
        ['read'],
        [
          'home-page',
          'service-page',
          'create-service-page',
          'update-service-page',
          'customer-page',
          'update-customer-page',
          'create-customer-page',
          'setting-page'
        ]
      )
      break

    default:
      break
  }

  return rules
}

export const buildAbilityFor = (role, subject) => {
  return new AppAbility(defineRulesFor(role, subject), {
    // https://casl.js.org/v5/en/guide/subject-type-detection
    // @ts-ignore
    detectSubjectType: object => object.type
  })
}

export const defaultACLObj = {
  action: 'manage',
  subject: 'all'
}

export default defineRulesFor
