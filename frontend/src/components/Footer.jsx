import { Link } from 'react-router-dom'
import { ArrowRight } from './Icons'
import { useAuth } from '../context/AuthContext'
import { useUI } from '../context/UIContext'
import { BRAND } from '../config'

export default function Footer() {
  const { user, isSeller } = useAuth()
  const { notify } = useUI()
  const word = 'CLOTHES WITH A POINT OF VIEW'

  return (
    <footer className="footer">
      <div className="marquee" aria-hidden>
        <div className="marquee-track">
          {[0, 1].map((k) => <span key={k}>{word}&nbsp;&nbsp;—&nbsp;&nbsp;{word}&nbsp;&nbsp;—&nbsp;&nbsp;</span>)}
        </div>
      </div>

      <form className="news" onSubmit={(e) => { e.preventDefault(); notify('Newsletter sign-up is not connected to the backend yet.', 'warn') }}>
        <div className="news-logo">{BRAND.name}<span>.</span></div>
        <p>SIGN UP TO OUR NEWSLETTER<br />FOR TAILORED OFFERS</p>
        <input type="email" placeholder="EMAIL ADDRESS" required aria-label="Email address" />
        <button className="textlink strong">SUBMIT <ArrowRight width={16} height={16} /></button>
      </form>

      <div className="cols">
        <div>
          <h6>LINKS</h6>
          <Link to="/shop">SHOP ALL</Link>
          <Link to="/shop?sort=new">NEW ARRIVALS</Link>
          <Link to="/account">{user ? 'ACCOUNT' : 'LOG IN'}</Link>
          {isSeller && <Link to="/studio">STUDIO</Link>}
        </div>
        <div>
          <h6>SOCIALS</h6>
          {BRAND.socials.map((s) => <a key={s.label} href={s.href}>{s.label}</a>)}
        </div>
        <div>
          <h6>THE STORE</h6>
          <p>{BRAND.address.map((l) => <span key={l}>{l}<br /></span>)}</p>
          <p>{BRAND.hours.map((l) => <span key={l}>{l}<br /></span>)}</p>
        </div>
        <div className="right">
          <p>COUNTRY: IN (₹ / INR)</p>
        </div>
      </div>
      <div className="legal">© {new Date().getFullYear()} {BRAND.name}. ALL RIGHTS RESERVED.</div>
    </footer>
  )
}
