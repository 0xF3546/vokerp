import { TenantDto } from "./TenantDto"

export class HouseDto {
    id: number
    price: number
    isDoorOpen: boolean
    hasBasement: boolean
    hasGarage: boolean
    isInside: boolean
    tenants?: TenantDto[]
    maxTenants: number
    isOwner: boolean
    isTenant: boolean
}