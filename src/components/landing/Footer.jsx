import React from "react";
import { Link } from "react-router-dom";
import logoDarkGreen from "../../assets/logo-dark-Green.png";

export default function Footer() {
  return (
    <>
      <footer className="trader-footer">
        <div className="br30-trader-container footer-grid">
          <div className="footer-brand">
            <div className="footer-logo-row">
              <img src={logoDarkGreen} alt="BR30 Trader Logo" />
              <h2>
                BR30 <span>Trader</span>
              </h2>
            </div>

            <p>Premium trading education platform focused on discipline, risk management, price action and practical market learning.</p>

            <div className="footer-socials">
              <a href="https://www.youtube.com/@br30traderofficial" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-youtube"></i>
              </a>
              <a href="https://www.instagram.com/br30Traderofficial" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-instagram"></i>
              </a>
              <a href="https://www.facebook.com/share/1DDJYGYYDf/" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-facebook"></i>
              </a>
              <a href="https://t.me/+hBAT4kWo63A4ZWY1" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-telegram"></i>
              </a>
              <a href="https://x.com/MukeshKuma48159" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-x-twitter"></i>
              </a>
              <a href="https://www.linkedin.com/in/mukeshraj-br30/" target="_blank" rel="noopener noreferrer">
                <i className="fa-brands fa-linkedin"></i>
              </a>
            </div>
          </div>

          <div className="footer-col">
            <h3>Platform</h3>
            <a href="home">Home</a>
            <Link to="/strategies">Strategies</Link>
            <Link to="/service">Services</Link>
            <Link to="/about">About Founder</Link>
          </div>

          <div className="footer-col">
            <h3>Legal</h3>
            <Link to="/terms">Terms & Conditions</Link>
            <Link to="/privacy">Privacy Policy</Link>
            <Link to="/refund">Refund Policy</Link>
            <Link to="/disclaimer">Disclaimer</Link>
            <Link to="/aboutus">About Us</Link>
            <Link to="/contact">Contact Us</Link>
          </div>

          <div className="footer-col footer-contact">
            <h3>Support</h3>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&to=support.br30trader@gmail.com&su=Support%20Request%20-%20BR30%20Trader&body=Hello%20BR30%20Trader%20Support%20Team,%0A%0AI%20need%20assistance%20regarding%20your%20platform.%20Please%20find%20my%20details%20below:%0A%0AName:%20%0AEmail:%20%0AIssue:%20%0A%0AThank%20you." target="_blank" rel="noopener noreferrer">
              support.br30trader@gmail.com
            </a>
            <span>Based in India 🇮🇳</span>
            <p>
              Built with ❤️ by <b>BR30 Group</b>
            </p>
          </div>
        </div>

        <div className="br30-trader-container footer-bottom">
          <p>© 2026 BR30 Trader. All Rights Reserved.</p>
          <span>Trading involves risk. Learn before you trade.</span>
        </div>
      </footer>

      <style>{`
      .br30-trader-container{width:min(1180px,calc(100% - 36px));margin:0 auto;}
.trader-footer{position:relative;padding:90px 0 28px;background:linear-gradient(180deg,rgba(255,255,255,.015),rgba(0,0,0,.35));border-top:1px solid rgba(168,51,255,.22);overflow:hidden;}
.trader-footer:before{content:"";position:absolute;left:-120px;top:-130px;width:360px;height:360px;border-radius:50%;background:radial-gradient(circle,rgba(168,51,255,.2),transparent 70%);}
.trader-footer:after{content:"";position:absolute;right:-150px;bottom:-160px;width:390px;height:390px;border-radius:50%;background:radial-gradient(circle,rgba(248,201,108,.14),transparent 70%);}
.footer-grid{position:relative;z-index:2;display:grid;grid-template-columns:1.4fr .8fr .9fr 1fr;gap:34px;}
.footer-logo-row{display:flex;align-items:center;gap:14px;margin-bottom:20px;}
.footer-logo-row img{width:58px;height:58px;border-radius:18px;background:#020403;box-shadow:0 0 0 1px rgba(0,255,136,.22);}
.footer-logo-row h2{margin:0;color:#fff;font-size:30px;font-weight:950;letter-spacing:-1px;}
.footer-logo-row h2 span{color:#a833ff;text-shadow:0 0 24px rgba(168,51,255,.45);}
.footer-brand p{max-width:390px;margin:0;color:#b8acd0;font-size:15px;line-height:1.8;font-weight:650;}
.footer-socials{display:flex;flex-wrap:wrap;gap:12px;margin-top:26px;}
.footer-socials a{width:46px;height:46px;border-radius:15px;display:grid;place-items:center;color:#fff;text-decoration:none;background:rgba(255,255,255,.06);border:1px solid rgba(255,255,255,.1);transition:.25s ease;font-size:18px;}
.footer-socials a:hover{transform:translateY(-3px);color:#f8c96c;border-color:rgba(248,201,108,.35);box-shadow:0 15px 35px rgba(168,51,255,.18);}
.footer-col{display:flex;flex-direction:column;gap:13px;}
.footer-col h3{margin:0 0 8px;color:#fff;font-size:19px;font-weight:950;}
.footer-col a,.footer-col span{color:#b8acd0;text-decoration:none;font-size:14px;font-weight:750;transition:.25s ease;line-height:1.5;}
.footer-col a:hover{color:#f8c96c;transform:translateX(4px);}
.footer-contact p{margin:8px 0 0;color:#b8acd0;font-size:14px;line-height:1.7;}
.footer-contact b{color:#f8c96c;}
.footer-bottom{position:relative;z-index:2;margin-top:58px;padding-top:22px;border-top:1px solid rgba(255,255,255,.08);display:flex;align-items:center;justify-content:space-between;gap:18px;flex-wrap:wrap;}
.footer-bottom p,.footer-bottom span{margin:0;color:#8d82a7;font-size:13px;font-weight:750;}
.footer-bottom span{color:#ff6b6b;}
@media(max-width:980px){.footer-grid{grid-template-columns:1fr 1fr;}.trader-footer{padding:74px 0 26px;}}
@media(max-width:560px){.footer-grid{grid-template-columns:1fr;}.footer-bottom{flex-direction:column;text-align:center;align-items:flex-start;}.footer-logo-row h2{font-size:26px;}.footer-socials a{width:44px;height:44px;}}
      `}</style>
    </>
  );
}
