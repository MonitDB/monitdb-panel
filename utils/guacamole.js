/* eslint-disable unicorn/no-null */
// Carrega o bundle UMD do Guacamole (estático em /public) e devolve window.Guacamole.
// Compartilhado entre a página /remote (canvas ao vivo) e o player de replay da auditoria.
export const loadGuacamole = () =>
  new Promise((resolve, reject) => {
    if (typeof window === 'undefined') {
      reject(new Error('Guacamole só carrega no browser.'))
      return
    }
    if (window.Guacamole) return resolve(window.Guacamole)
    const onError = () =>
      reject(new Error('Falha ao carregar o cliente Guacamole.'))
    const existing = document.querySelector('script[data-guac]')
    if (existing) {
      existing.addEventListener('load', () => resolve(window.Guacamole))
      existing.addEventListener('error', onError)
      return
    }
    const script = document.createElement('script')
    script.src = '/guacamole-common.min.js'
    script.dataset.guac = '1'
    script.addEventListener('load', () => resolve(window.Guacamole))
    script.addEventListener('error', onError)
    document.head.append(script)
  })
