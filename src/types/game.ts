export interface GameData {
  data: string
  adversario: string
  placar: string
  local: "Casa" | "Fora"
  golsTime: string[]
  assistenciasTime: string[]
  golsAdversario: string[]
  jogadoresAmarelados: string[]
  jogadoresExpulsos: string[]
  substituicoesTime: {
    saiu: string
    entrou: string
    minuto: number
  }[]
  noticiasRelacionadas: number[]
  descricaoPartida: string
  logoTime: string
}
