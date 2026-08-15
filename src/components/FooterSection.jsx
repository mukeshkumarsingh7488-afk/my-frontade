import React from "react";
import { Link } from "react-router-dom";
import logoDarkGreen from "../assets/logo-dark-Green.png";
export default function FooterSection() {
  return (
    <>
      <footer className="footer-section">
        <h3>🌐 Connect & Contact 🌐</h3>

        <div className="social-grid">
          <a href="https://www.youtube.com/@br30traderofficial" target="_blank" rel="noopener noreferrer" className="s-link">
            <i className="fa-brands fa-youtube" style={{ color: "#ff0000" }}></i>
            YouTube
          </a>

          <a href="https://www.instagram.com/br30Traderofficial" target="_blank" rel="noopener noreferrer" className="s-link">
            <i className="fa-brands fa-instagram" style={{ color: "#e4405f" }}></i>
            Instagram
          </a>

          <a href="https://www.facebook.com/share/1DDJYGYYDf/" target="_blank" rel="noopener noreferrer" className="s-link">
            <i className="fa-brands fa-facebook" style={{ color: "#1877f2" }}></i>
            Facebook
          </a>

          <a href="https://t.me/+hBAT4kWo63A4ZWY1" target="_blank" rel="noopener noreferrer" className="s-link">
            <i className="fa-brands fa-telegram" style={{ color: "#0088cc" }}></i>
            Telegram
          </a>

          <a href="https://chat.whatsapp.com/B4t82SWBcgOIZTeQXp1wDI" target="_blank" rel="noopener noreferrer" className="s-link">
            <i className="fa-brands fa-whatsapp" style={{ color: "#25d366" }}></i>
            WhatsApp
          </a>

          <a href="mailto:support.br30trader@gmail.com" target="_blank" rel="noopener noreferrer" className="s-link">
            <i className="fa-solid fa-envelope" style={{ color: "#ea4335" }}></i>
            Gmail
          </a>
        </div>

        <p className="copyright">© 2026 BR30Trader | Built for Success 🚀</p>
      </footer>

      <div className="footer-policy-links">
        <div className="policy-wrapper">
          <Link to="/dashboard/terms">Terms & Conditions</Link>
          <span className="divider">|</span>

          <Link to="/dashboard/privacy">Privacy Policy</Link>
          <span className="divider">|</span>

          <Link to="/dashboard/refund">Refund Policy</Link>
          <span className="divider">|</span>

          <Link to="/dashboard/disclaimer">Disclaimer</Link>
          <span className="divider">|</span>

          <Link to="/dashboard/aboutus">About Us</Link>
          <span className="divider">|</span>

          <Link to="/dashboard/contact">Contact Us</Link>
        </div>
      </div>

      <footer className="main-footer">
        <div className="footer-container">
          <div className="footer-about">
            <div className="footer-brand">
              <img src={logoDarkGreen} alt="BR30 Trader" />

              <h2 className="footer-logo">
                BR30 <span>Trader</span>
              </h2>
            </div>

            <p>Empowering Traders with logic, psychology, and high-performance web solutions.</p>

            <div className="social-icons">
              <a href="https://br-30-kart.vercel.app/" target="_blank" rel="noopener noreferrer">
                <i className="fa-solid fa-globe"></i>
              </a>

              <a href="https://x.com/MukeshKuma48159" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-x-twitter"></i>
              </a>

              <a href="https://www.linkedin.com/in/mukeshraj-br30/" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-linkedin"></i>
              </a>

              <a href="https://www.threads.com/@br30traderofficial" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-threads"></i>
              </a>
            </div>
          </div>

          <div className="footer-links">
            <h3>Quick Links</h3>
            <ul>
              <li>
                <Link to="/dashboard/">Home</Link>
              </li>
              <li>
                <Link to="/dashboard/strategies">Strategies</Link>
              </li>
              <li>
                <Link to="/dashboard/service">Services</Link>
              </li>
              <li>
                <Link to="/dashboard/about">About Founder</Link>
              </li>
            </ul>
          </div>

          <div className="footer-box contact-details">
            <h3>Get In Touch</h3>

            <a className="footer-mail-link" href="https://mail.google.com/mail/?view=cm&fs=1&to=support.br30trader@gmail.com&su=Web%20Service%20Inquiry&body=Hello%20BR30%20Trader%20Team,%0A%0AMujhe%20aapki%20services%20ke%20baare%20me%20details%20chahiye.%0A%0AThanks" target="_blank" rel="noopener noreferrer">
              support.br30trader@gmail.com
            </a>

            <p>
              <i className="fas fa-map-marker-alt"></i> Based in India 🇮🇳
            </p>

            <p className="built-by">
              Built with ❤️ by <span>BR30 Group</span>
            </p>
          </div>
        </div>

        <div className="footer-bottom">
          <p>
            © 2026 BR30Trader. All Rights Reserved. |<span> Trading involves risk.</span>
          </p>
        </div>
      </footer>

      <style>{`.footer-section{padding:60px 20px 35px;text-align:center;border-top:2px solid #00ffaa;background:#071127}.footer-brand{display:flex;align-items:center;gap:14px;margin-bottom:18px;}.footer-brand img{width:56px;height:56px;border-radius:16px;object-fit:cover;box-shadow:0 0 20px rgba(0,255,136,.25);}.footer-logo{margin:0;}.footer-section h3{font-size:2rem;margin-bottom:35px;color:#f5f5f5}.social-grid{display:flex;justify-content:center;flex-wrap:wrap;gap:18px}.s-link{display:flex;align-items:center;justify-content:center;gap:10px;padding:14px 24px;border-radius:14px;background:#000;color:#ddd;text-decoration:none!important;font-weight:600;border:1px solid transparent;transition:.25s ease}.s-link:hover{color:#fff;box-shadow:0 0 0 1px #00ffaa,0 0 18px rgba(0,255,170,.25)}.s-link i{font-size:20px}.copyright{margin-top:40px;color:#aaa;font-size:14px}.footer-policy-links{border-top:1px solid rgba(255,255,255,.08);padding:22px 15px;background:#071127}.policy-wrapper{display:flex;justify-content:center;align-items:center;flex-wrap:wrap;gap:14px}.policy-wrapper a{color:#aaa;text-decoration:none;transition:color .25s ease}.policy-wrapper a:hover{color:#00ffaa}.divider{color:#444}.main-footer{background:#071127;border-top:2px solid #00ffaa;padding:60px 20px 20px;overflow:hidden}.footer-container{max-width:1300px;margin:auto;display:grid;grid-template-columns:repeat(auto-fit,minmax(260px,1fr));gap:40px;align-items:flex-start}.footer-logo{font-size:2.1rem;margin-bottom:18px;color:#fff}.footer-logo span{color:#00ffaa}.footer-about p,.contact-details p{color:#b7b7b7;line-height:1.7;margin-bottom:25px}.social-icons{display:flex;gap:16px;flex-wrap:wrap}.social-icons a{width:48px;height:48px;border-radius:50%;background:#000;display:flex;align-items:center;justify-content:center;color:#fff;font-size:18px;text-decoration:none!important;transition:.25s ease}.social-icons a:hover{color:#00ffaa;box-shadow:0 0 0 1px #00ffaa,0 0 18px rgba(0,255,170,.25)}.footer-links h3,.contact-details h3{margin-bottom:18px;font-size:1.7rem;color:#fff}.footer-links ul{list-style:none;padding:0;margin:0}.footer-links li{margin-bottom:14px}.footer-links a{color:#bbb;text-decoration:none;transition:color .25s ease}.footer-links a:hover{color:#00ffaa}.footer-mail-link{display:inline-block;color:#cbd5e1;text-decoration:none!important;word-break:break-word;margin-bottom:18px}.footer-mail-link:hover{color:#00ffaa}.built-by span{color:#00ffaa;font-weight:700}.footer-bottom{border-top:1px solid rgba(255,255,255,.08);margin-top:45px;padding-top:20px;text-align:center}.footer-bottom p{color:#999}.footer-bottom span{color:#ff4d4d}@media(max-width:768px){.footer-section h3{font-size:1.5rem}.s-link{width:100%}.footer-container{text-align:center}.social-icons{justify-content:center}.footer-logo{font-size:1.8rem}}`}</style>
    </>
  );
}
