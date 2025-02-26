import { TenantDto } from "./TenantDto"

export class HouseDto {
    id: number
    number: string
    price: number
    isDoorOpen: boolean
    hasBasement: boolean
    hasGarage: boolean
    isGarageOpen: boolean
    tenants?: TenantDto[]
    maxTenants: number
    isOwner: boolean
    isTenant: boolean
}