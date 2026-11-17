import { motion, useReducedMotion } from 'framer-motion'
import './App.css'

const ease = [0.22, 1, 0.36, 1] as const

function App() {
  const reduceMotion = useReducedMotion()

  const rise = (delay = 0) =>
    reduceMotion
      ? { initial: false as const, animate: { opacity: 1, y: 0 } }
      : {
          initial: { opacity: 0, y: 28 },
          animate: { opacity: 1, y: 0 },
          transition: { duration: 0.85, delay, ease },
        }

  return (
    <div className="page">
      <header className="hero">
        <motion.div
          className="hero__media"
          aria-hidden="true"
          initial={reduceMotion ? false : { scale: 1.08 }}
          animate={{ scale: 1 }}
          transition={{ duration: 1.6, ease }}
        >
          <img
            src="/hero.jpg"
            alt=""
            width={2400}
            height={1602}
            decoding="async"
            fetchPriority="high"
          />
          <div className="hero__veil" />
        </motion.div>

        <div className="hero__content">
          <motion.p className="brand" {...rise(0.05)}>
            Binexe
          </motion.p>
          <motion.h1 className="headline" {...rise(0.18)}>
            Dijital ürünler için net bir başlangıç.
          </motion.h1>
          <motion.p className="lede" {...rise(0.3)}>
            binexe.com üzerinde yeni markayı, siteyi ve ürün deneyimini birlikte
            kuruyoruz.
          </motion.p>
          <motion.div className="cta-row" {...rise(0.42)}>
            <a className="btn btn--primary" href="#hakkinda">
              Keşfet
            </a>
            <a className="btn btn--ghost" href="mailto:hello@binexe.com">
              İletişim
            </a>
          </motion.div>
        </div>
      </header>

      <section id="hakkinda" className="section section--muted">
        <h2>Ne inşa ediyoruz?</h2>
        <p>
          Bu iskelet binexe.com için hazır. Ürün yönünü, sayfaları ve içeriği
          senin tarifine göre buradan genişleteceğiz.
        </p>
      </section>

      <footer className="footer">
        <span>
          <strong>Binexe</strong> · binexe.com
        </span>
        <span>© {new Date().getFullYear()}</span>
      </footer>
    </div>
  )
}

export default App
