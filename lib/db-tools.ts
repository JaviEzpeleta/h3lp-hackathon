import { Pool, types } from "pg"

types.setTypeParser(1700, (val: any) => parseFloat(val))
types.setTypeParser(20, (val: any) => parseInt(val, 10))

interface ColumnInfo {
  table_name: string
  column_name: string
  data_type: string
}

interface TableInfo {
  tableName: string
  columns: { columnName: string; dataType: string }[]
}
export async function verifyAndRetrieveTables(
  connectionString: string
): Promise<TableInfo[]> {
  const pool = new Pool({
    connectionString,
    ssl: {
      rejectUnauthorized: false,
    },
  })

  try {
    // Comprobamos conexión
    await pool.query("SELECT 1")

    // Pillamos nombres y tipos de columnas
    const result = await pool.query<ColumnInfo>(`
        SELECT table_name, column_name, data_type
        FROM information_schema.columns
        WHERE table_schema = 'public'
        ORDER BY table_name, ordinal_position;
      `)

    // Agrupamos las columnas por tabla
    const tables: TableInfo[] = result.rows.reduce((acc: TableInfo[], row) => {
      const table = acc.find((t) => t.tableName === row.table_name)
      if (table) {
        table.columns.push({
          columnName: row.column_name,
          dataType: row.data_type,
        })
      } else {
        acc.push({
          tableName: row.table_name,
          columns: [
            {
              columnName: row.column_name,
              dataType: row.data_type,
            },
          ],
        })
      }
      return acc
    }, [])

    return tables
  } catch (error) {
    console.error("La conexión ha petao, tronco: ", error)
    throw error
  } finally {
    await pool.end()
  }
}
