import { DataSource } from "typeorm"

export const dataSource = new DataSource({
    type: "mariadb",
    host: "185.117.3.65",
    port: 3306,
    username: "erik",
    password: "485zbtmfrt435t",
    database: "vokerp",
    logging: true,
    synchronize: true,
})