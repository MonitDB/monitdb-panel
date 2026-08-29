import classNames from 'classnames'

// Estado = ponto + palavra, sempre.
//
// O produto vinha a dizer o estado só pela cor — e com as cores de fábrica do
// AntD (verde #52c41a, vermelho #f5222d, laranja #fa8c16), que não são as
// nossas e não passam contraste sobre branco (o laranja fica em 2.6:1). Quem
// não distingue vermelho de verde ficava sem informação nenhuma.
//
// Regra de tom: `off` é cinzento e é para configuração desligada de propósito
// (servidor inativo, Always On desligado). Vermelho é só para avaria — se se
// gastar o vermelho no que é normal, quando houver problema a sério ninguém
// repara.
const TONES = {
  ok: 'st-ok',
  warn: 'st-warn',
  down: 'st-down',
  crit: 'st-crit',
  off: 'st-off',
}

const Status = ({ tone = 'off', children, className }) => (
  <span className={classNames('st', TONES[tone] ?? TONES.off, className)}>
    <i />
    {children}
  </span>
)

export default Status
