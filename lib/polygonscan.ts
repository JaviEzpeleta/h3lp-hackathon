import axios from "axios"
import { DONATIONS_CONTRACT_ADDRESS } from "./constants"

/**
 * Estructura de cada transacción regresada por Polygonscan
 * Puedes ampliar o modificar este tipo según tu necesidad.
 */
interface PolygonScanTransaction {
  blockNumber: string
  timeStamp: string
  hash: string
  nonce: string
  blockHash: string
  from: string
  contractAddress: string
  to: string
  value: string
  tokenName: string
  tokenSymbol: string
  tokenDecimal: string
  transactionIndex: string
  gas: string
  gasPrice: string
  gasUsed: string
  cumulativeGasUsed: string
  input: string
  confirmations: string
}

const POLYGONSCAN_API_KEY = "TU_API_KEY_AQUI"
const POLYGONSCAN_BASE_URL = "https://api.polygonscan.com/api"

/**
 * Obtiene las transacciones ERC20 más recientes de una dirección
 * en la red Polygon (Matic) usando la API de Polygonscan.
 *
 * @param address Dirección de la wallet que quieres consultar
 * @returns Lista de transacciones (TokenTx) de Polygonscan
 */
export async function getRecentTransactionsForAddress(
  address: string
): Promise<PolygonScanTransaction[]> {
  try {
    // THIS WAS FOR POLYGON... not needed here!!
    // const apiUrl = `https://api.polygonscan.com/api?module=account&action=tokentx&address=${address}&startblock=0&endblock=99999999&sort=desc&apikey=${process
    //   .env.POLYGONSCAN_API_KEY!}`

    // ! lens testnet explorer API!!!
    const apiUrl = `https://block-explorer-api.staging.lens.dev/api?module=account&action=txlist&page=1&offset=10&sort=desc&endblock=99999999&startblock=0&address=${DONATIONS_CONTRACT_ADDRESS}`

    const response = await axios.get(apiUrl)

    // Polygonscan normalmente regresa un objeto:
    // {
    //   status: "1" | "0",
    //   message: "OK" | "NOTOK",
    //   result: [...]
    // }
    if (response.data.status === "1") {
      // Devolvemos el array de transacciones en orden descendente
      return response.data.result as PolygonScanTransaction[]
    } else {
      throw new Error(
        `Polygonscan API devolvió un error: ${response.data.message}`
      )
    }
  } catch (error) {
    console.error(`Error al obtener transacciones: ${error}`)
    throw error
  }
}
