export interface UserGeo {
  lat: string
  lng: string
}

export interface UserAddress {
  street: string
  suite: string
  city: string
  zipcode: string
  geo: UserGeo
}

export interface UserCompany {
  name: string
  catchPhrase: string
  bs: string
}

export interface User {
  id: number
  name: string
  username: string
  email: string
  address: UserAddress
  phone: string
  website: string
  company: UserCompany
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null
}

export function isUser(value: unknown): value is User {
  if (!isRecord(value) || !isRecord(value.address) || !isRecord(value.address.geo) || !isRecord(value.company)) {
    return false
  }

  return (
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.username === 'string' &&
    typeof value.email === 'string' &&
    typeof value.address.street === 'string' &&
    typeof value.address.suite === 'string' &&
    typeof value.address.city === 'string' &&
    typeof value.address.zipcode === 'string' &&
    typeof value.address.geo.lat === 'string' &&
    typeof value.address.geo.lng === 'string' &&
    typeof value.phone === 'string' &&
    typeof value.website === 'string' &&
    typeof value.company.name === 'string' &&
    typeof value.company.catchPhrase === 'string' &&
    typeof value.company.bs === 'string'
  )
}
